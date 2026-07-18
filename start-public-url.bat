@echo off
setlocal EnableDelayedExpansion

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"
if not defined PORT set "PORT=5173"
if not defined SERVER_PORT set "SERVER_PORT=8080"
set "CLOUDFLARED=%ROOT%\tools\cloudflared.exe"
set "CF_OUT=%ROOT%\cloudflared-public.out.log"
set "CF_ERR=%ROOT%\cloudflared-public.err.log"
set "PUBLIC_URL_FILE=%ROOT%\public-url.txt"

set HTTP_PROXY=
set HTTPS_PROXY=
set ALL_PROXY=
set NO_PROXY=*
set http_proxy=
set https_proxy=
set all_proxy=
set no_proxy=*

echo Medical Project - Public URL
echo.
echo IMPORTANT:
echo If Clash Verge / Mihomo is running, keep it running but switch it to RULE mode.
echo Do not use GLOBAL mode for this script.
echo.
echo This window must stay open while classmates use the public URL.
echo.

curl.exe --noproxy "*" -s -o NUL -w "LOCAL_CHECK=%%{http_code}" "http://127.0.0.1:%PORT%/" > "%TEMP%\medical_public_check.txt" 2>nul
set /p LOCAL_CHECK=<"%TEMP%\medical_public_check.txt"
del "%TEMP%\medical_public_check.txt" >nul 2>nul
echo %LOCAL_CHECK%
echo %LOCAL_CHECK% | find "LOCAL_CHECK=200" >nul
if errorlevel 1 (
  echo.
  echo Local frontend is not running. Starting the project first...
  start "medical-project-startup" cmd /k ""%ROOT%\start-all.bat""
  echo Waiting for http://127.0.0.1:%PORT% ...
  for /l %%I in (1,1,90) do (
    curl.exe --noproxy "*" -s -o NUL -w "%%{http_code}" "http://127.0.0.1:%PORT%/" > "%TEMP%\medical_public_wait.txt" 2>nul
    set /p WAIT_CODE=<"%TEMP%\medical_public_wait.txt"
    del "%TEMP%\medical_public_wait.txt" >nul 2>nul
    if "!WAIT_CODE!"=="200" goto local_ready
    timeout /t 1 /nobreak >nul
  )
  echo.
  echo Local frontend did not become ready. Check start-all.bat first.
  pause
  exit /b 1
)

:local_ready
echo Local frontend is ready: http://127.0.0.1:%PORT%
echo.

if not exist "%CLOUDFLARED%" (
  echo Downloading Cloudflare Tunnel helper...
  curl.exe -L --retry 2 --connect-timeout 15 --max-time 120 -o "%CLOUDFLARED%" "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
  if errorlevel 1 (
    echo.
    echo Download failed. Check network and run this file again.
    pause
    exit /b 1
  )
)

taskkill /im cloudflared.exe /f >nul 2>nul
del "%CF_OUT%" "%CF_ERR%" >nul 2>nul

echo Starting Cloudflare Tunnel...
echo.
echo If it succeeds, the script will print PUBLIC_URL=https://xxxxx.trycloudflare.com.
echo The URL will also be saved to:
echo %PUBLIC_URL_FILE%
echo If it keeps showing TLS handshake / 198.18.x.x errors:
echo   1. Open Clash Verge
echo   2. Change mode from GLOBAL to RULE
echo   3. Run this file again
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%\tools\run-cloudflared-public.ps1" -Root "%ROOT%" -Port %PORT%

echo.
echo Tunnel stopped.
echo Logs:
echo %CF_OUT%
echo %CF_ERR%
echo Public URL file:
echo %PUBLIC_URL_FILE%
pause
