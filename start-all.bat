@echo off
setlocal
chcp 65001 >nul

set "ROOT=%~dp0"
if not defined SERVER_PORT set "SERVER_PORT=8080"
if not defined PORT set "PORT=5173"
for /f "usebackq tokens=* delims=" %%A in (`powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%tools\get-local-ip.ps1"`) do set "LOCAL_IP=%%A"
if not defined LOCAL_IP set "LOCAL_IP=127.0.0.1"

echo Medical project - one click startup
echo.
echo This script checks MySQL, imports the database when needed,
echo starts the backend, starts the frontend, and verifies both URLs.
echo.

set "MYSQL_ENV=%TEMP%\medical_mysql_env_%RANDOM%.bat"
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%tools\resolve-mysql.ps1" -OutputBat "%MYSQL_ENV%"
if errorlevel 1 (
  echo.
  echo MySQL check failed. Fix the message above and run this file again.
  pause
  exit /b 1
)
call "%MYSQL_ENV%"
del "%MYSQL_ENV%" >nul 2>nul

set "JAVA_ENV=%TEMP%\medical_java_env_%RANDOM%.bat"
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%tools\resolve-java.ps1" -OutputBat "%JAVA_ENV%"
if errorlevel 1 (
  echo.
  echo Java check failed. Fix the message above and run this file again.
  pause
  exit /b 1
)
call "%JAVA_ENV%"
del "%JAVA_ENV%" >nul 2>nul

echo.
echo Checking database bin_text...
set "DB_READY="
powershell -NoProfile -ExecutionPolicy Bypass -Command "$mysql=$env:MYSQL_CMD; $user=$env:MYSQL_USERNAME; $pwd=$env:MYSQL_PASSWORD; $old=$env:MYSQL_PWD; if($pwd -ne ''){$env:MYSQL_PWD=$pwd}else{Remove-Item Env:\MYSQL_PWD -ErrorAction SilentlyContinue}; $result=& $mysql ('-u'+$user) '-N' '-B' '-e' \"SELECT COUNT(*) FROM bin_text.account WHERE uname='admin_1';\" 2>$null; if($null -ne $old){$env:MYSQL_PWD=$old}else{Remove-Item Env:\MYSQL_PWD -ErrorAction SilentlyContinue}; if($LASTEXITCODE -eq 0){$result}" > "%TEMP%\medical_db_ready.txt"
for /f "usebackq tokens=* delims=" %%A in ("%TEMP%\medical_db_ready.txt") do set "DB_READY=%%A"
del "%TEMP%\medical_db_ready.txt" >nul 2>nul

if not "%DB_READY%"=="1" (
  echo Database is not ready. Importing automatically...
  set "AUTO_IMPORT=1"
  call "%ROOT%import-database.bat"
  if errorlevel 1 (
    echo.
    echo Database auto import failed. Check MySQL service, password, and SQL files.
    pause
    exit /b 1
  )
) else (
  echo Database is ready.
)

call :CheckBackend
if not defined BACKEND_READY (
  start "medical-backend-%SERVER_PORT%" cmd /k ""%ROOT%start-backend.bat""
  echo Waiting for backend health http://localhost:%SERVER_PORT%/api/health ...
  for /l %%I in (1,1,70) do (
    call :CheckBackend
    if defined BACKEND_READY goto backend_ok
    timeout /t 1 /nobreak >nul
  )
)

:backend_ok
if not defined BACKEND_READY (
  echo.
  echo Backend did not become healthy on http://localhost:%SERVER_PORT%/api/health.
  echo Check the medical-backend-%SERVER_PORT% window for the real error.
  pause
  exit /b 1
)

call :CheckFrontend
if not defined FRONTEND_READY (
  start "medical-frontend-%PORT%" cmd /k ""%ROOT%start-frontend.bat""
  echo Waiting for frontend http://localhost:%PORT% ...
  for /l %%I in (1,1,20) do (
    call :CheckFrontend
    if defined FRONTEND_READY goto frontend_ok
    timeout /t 1 /nobreak >nul
  )
)

:frontend_ok
if not defined FRONTEND_READY (
  echo.
  echo Frontend did not become reachable on http://localhost:%PORT%.
  echo Check the medical-frontend-%PORT% window for the real error.
  pause
  exit /b 1
)

start http://localhost:%PORT%

echo.
echo Startup verified.
echo Frontend URL: http://localhost:%PORT%
echo Same-network URL: http://%LOCAL_IP%:%PORT%
echo Backend health: http://localhost:%SERVER_PORT%/api/health
echo Swagger URL: http://localhost:%SERVER_PORT%/swagger-ui.html
echo Public temporary URL: run start-public-url.bat
echo Login with the account assigned by the administrator.
echo.
pause
exit /b 0

:CheckBackend
set "BACKEND_READY="
powershell -NoProfile -ExecutionPolicy Bypass -Command "$old=$env:NO_PROXY; $env:NO_PROXY='localhost,127.0.0.1,*'; try { $r=Invoke-RestMethod -Uri 'http://127.0.0.1:%SERVER_PORT%/api/health' -Proxy $null -TimeoutSec 2; if($r.code -eq 20000){exit 0} } catch {}; $env:NO_PROXY=$old; exit 1" >nul 2>nul
if not errorlevel 1 set "BACKEND_READY=1"
exit /b 0

:CheckFrontend
set "FRONTEND_READY="
powershell -NoProfile -ExecutionPolicy Bypass -Command "$old=$env:NO_PROXY; $env:NO_PROXY='localhost,127.0.0.1,*'; try { $r=Invoke-WebRequest -Uri 'http://127.0.0.1:%PORT%/' -UseBasicParsing -Proxy $null -TimeoutSec 2; if($r.StatusCode -ge 200 -and $r.StatusCode -lt 500){exit 0} } catch {}; $env:NO_PROXY=$old; exit 1" >nul 2>nul
if not errorlevel 1 set "FRONTEND_READY=1"
exit /b 0
