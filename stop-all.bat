@echo off
setlocal
chcp 65001 >nul
set "ROOT=%~dp0"

echo Stopping medical project processes...
echo.

for %%P in (8080 5173) do (
  for /f "tokens=5" %%A in ('netstat -ano ^| findstr /r /c:":%%P .*LISTENING"') do (
    echo Port %%P is used by PID %%A. Stopping it...
    taskkill /pid %%A /f >nul 2>nul
  )
)

for /f "usebackq tokens=* delims=" %%A in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "$root=(Resolve-Path '%ROOT%').Path.TrimEnd('\'); Get-Process cloudflared -ErrorAction SilentlyContinue | Where-Object { $_.Path -and $_.Path.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) } | ForEach-Object { $_.Id }"`) do (
  echo Cloudflare tunnel is used by PID %%A. Stopping it...
  taskkill /pid %%A /f >nul 2>nul
)

echo.
echo Done. If File Explorer still says the folder is in use, close all open
echo command windows and File Explorer windows that are inside this project,
echo then retry.
echo.
pause
