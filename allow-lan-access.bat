@echo off
set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"
for /f "usebackq delims=" %%I in (`powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%\tools\get-local-ip.ps1"`) do set "LAN_IP=%%I"
if not defined LAN_IP set "LAN_IP=127.0.0.1"

net session >nul 2>nul
if not %errorlevel%==0 (
  echo Requesting administrator permission to allow LAN access...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b 1
)

echo Allowing LAN access for Medical Project...
netsh advfirewall firewall delete rule name="Medical Project Frontend 5173" >nul 2>nul
netsh advfirewall firewall delete rule name="Medical Project Backend 8080" >nul 2>nul
netsh advfirewall firewall add rule name="Medical Project Frontend 5173" dir=in action=allow protocol=TCP localport=5173 profile=any
netsh advfirewall firewall add rule name="Medical Project Backend 8080" dir=in action=allow protocol=TCP localport=8080 profile=any

echo.
echo Done.
echo Ask classmates to open:
echo http://%LAN_IP%:5173
echo.
pause
