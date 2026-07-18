@echo off
setlocal
chcp 65001 >nul

set "ROOT=%~dp0"
set "BACKEND_DIR=%ROOT%medical-backend"
if not defined SERVER_PORT set "SERVER_PORT=8080"

powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r=Invoke-RestMethod -Uri 'http://localhost:%SERVER_PORT%/api/health' -TimeoutSec 2; if($r.code -eq 20000){exit 0} } catch {}; exit 1" >nul 2>nul
if not errorlevel 1 (
  echo Backend is already healthy.
  echo Backend health: http://localhost:%SERVER_PORT%/api/health
  echo Swagger URL: http://localhost:%SERVER_PORT%/swagger-ui.html
  pause
  exit /b 0
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Get-NetTCPConnection -LocalPort %SERVER_PORT% -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }" >nul 2>nul
if not errorlevel 1 (
  echo Backend port %SERVER_PORT% is already in use, but /api/health did not pass.
  echo Close the program using port %SERVER_PORT% or set SERVER_PORT to another value.
  pause
  exit /b 1
)

set "MYSQL_ENV=%TEMP%\medical_mysql_env_%RANDOM%.bat"
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%tools\resolve-mysql.ps1" -OutputBat "%MYSQL_ENV%"
if errorlevel 1 (
  echo.
  echo MySQL check failed.
  pause
  exit /b 1
)
call "%MYSQL_ENV%"
del "%MYSQL_ENV%" >nul 2>nul

set "JAVA_ENV=%TEMP%\medical_java_env_%RANDOM%.bat"
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%tools\resolve-java.ps1" -OutputBat "%JAVA_ENV%"
if errorlevel 1 (
  echo.
  echo Java check failed.
  pause
  exit /b 1
)
call "%JAVA_ENV%"
del "%JAVA_ENV%" >nul 2>nul

set "DB_READY="
powershell -NoProfile -ExecutionPolicy Bypass -Command "$mysql=$env:MYSQL_CMD; $user=$env:MYSQL_USERNAME; $pwd=$env:MYSQL_PASSWORD; $old=$env:MYSQL_PWD; if($pwd -ne ''){$env:MYSQL_PWD=$pwd}else{Remove-Item Env:\MYSQL_PWD -ErrorAction SilentlyContinue}; $result=& $mysql ('-u'+$user) '-N' '-B' '-e' \"SELECT COUNT(*) FROM bin_text.account WHERE uname='admin_1';\" 2>$null; if($null -ne $old){$env:MYSQL_PWD=$old}else{Remove-Item Env:\MYSQL_PWD -ErrorAction SilentlyContinue}; if($LASTEXITCODE -eq 0){$result}" > "%TEMP%\medical_db_ready.txt"
for /f "usebackq tokens=* delims=" %%A in ("%TEMP%\medical_db_ready.txt") do set "DB_READY=%%A"
del "%TEMP%\medical_db_ready.txt" >nul 2>nul

if not "%DB_READY%"=="1" (
  echo Database is not ready. Importing automatically...
  set "AUTO_IMPORT=1"
  call "%ROOT%import-database.bat"
  if errorlevel 1 (
    echo Database auto import failed.
    pause
    exit /b 1
  )
)

cd /d "%BACKEND_DIR%"

set "APP_JAR="
for %%J in ("target\*.jar") do (
  echo %%~nxJ | findstr /i "\.original$" >nul
  if errorlevel 1 if not defined APP_JAR set "APP_JAR=%%~fJ"
)

if not defined APP_JAR (
  echo Packaged backend jar was not found under:
  echo %BACKEND_DIR%\target
  echo Rebuild the backend with Maven before giving this project to others.
  pause
  exit /b 1
)

echo.
echo Starting medical backend...
echo Working directory: %CD%
echo Backend health: http://localhost:%SERVER_PORT%/api/health
echo Swagger URL: http://localhost:%SERVER_PORT%/swagger-ui.html
echo Jar: %APP_JAR%
echo.
"%JAVA_CMD%" -jar "%APP_JAR%"
pause
