@echo off
setlocal
chcp 65001 >nul

set "ROOT=%~dp0"
set "FRONTEND_DIR=%ROOT%medical-frontend"
if not defined PORT set "PORT=5173"
if not defined SERVER_PORT set "SERVER_PORT=8080"
for /f "usebackq tokens=* delims=" %%A in (`powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%tools\get-local-ip.ps1"`) do set "LOCAL_IP=%%A"
if not defined LOCAL_IP set "LOCAL_IP=127.0.0.1"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$old=$env:NO_PROXY; $env:NO_PROXY='localhost,127.0.0.1,*'; try { $r=Invoke-WebRequest -Uri 'http://127.0.0.1:%PORT%/' -UseBasicParsing -Proxy $null -TimeoutSec 2; if($r.StatusCode -ge 200 -and $r.StatusCode -lt 500){exit 0} } catch {}; $env:NO_PROXY=$old; exit 1" >nul 2>nul
if not errorlevel 1 (
  echo Frontend is already reachable.
  echo Frontend URL: http://localhost:%PORT%
  echo Same-network URL: http://%LOCAL_IP%:%PORT%
  start http://localhost:%PORT%
  pause
  exit /b 0
)

powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }" >nul 2>nul
if not errorlevel 1 (
  echo Frontend port %PORT% is already in use.
  echo Trying to open it anyway:
  echo Frontend URL: http://localhost:%PORT%
  echo Same-network URL: http://%LOCAL_IP%:%PORT%
  start http://localhost:%PORT%
  pause
  exit /b 0
)

cd /d "%FRONTEND_DIR%"

where node >nul 2>nul
if not errorlevel 1 (
  echo.
  echo Starting medical frontend with Node.js...
  echo Working directory: %CD%
  echo Frontend URL: http://localhost:%PORT%
  echo Same-network URL: http://%LOCAL_IP%:%PORT%
  echo.
  node server.js
  pause
  exit /b %errorlevel%
)

echo.
echo Node.js was not found. Falling back to PowerShell static server.
echo Frontend URL: http://localhost:%PORT%
echo Same-network URL requires Node.js mode.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%tools\static-server.ps1" -Root "%FRONTEND_DIR%" -Port %PORT% -BackendPort %SERVER_PORT%
pause
