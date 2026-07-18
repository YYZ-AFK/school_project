@echo off
setlocal
chcp 65001 >nul

set "ROOT=%~dp0"
set "SQL_FILE=%ROOT%database\bin_text.sql"
set "SEED_FILE=%ROOT%database\seed_more_demo_data.sql"

if not exist "%SQL_FILE%" (
  echo Database SQL file was not found:
  echo %SQL_FILE%
  goto fail
)

if not defined MYSQL_CMD (
  set "MYSQL_ENV=%TEMP%\medical_mysql_env_%RANDOM%.bat"
  powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%tools\resolve-mysql.ps1" -OutputBat "%MYSQL_ENV%"
  if errorlevel 1 goto fail
  call "%MYSQL_ENV%"
  del "%MYSQL_ENV%" >nul 2>nul
)

if not defined MYSQL_USERNAME set "MYSQL_USERNAME=root"
if not defined MYSQL_PASSWORD set "MYSQL_PASSWORD=12345"

echo.
echo Creating database bin_text...
if not "%MYSQL_PASSWORD%"=="" set "MYSQL_PWD=%MYSQL_PASSWORD%"
"%MYSQL_CMD%" -u%MYSQL_USERNAME% --default-character-set=utf8mb4 -e "CREATE DATABASE IF NOT EXISTS bin_text DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
set "MYSQL_PWD="
if errorlevel 1 (
  echo Database creation failed. Check MySQL service and password.
  goto fail
)

echo Importing base database...
if not "%MYSQL_PASSWORD%"=="" set "MYSQL_PWD=%MYSQL_PASSWORD%"
"%MYSQL_CMD%" -u%MYSQL_USERNAME% --default-character-set=utf8mb4 bin_text < "%SQL_FILE%"
set "MYSQL_PWD="
if errorlevel 1 (
  echo Base database import failed. Check SQL file and MySQL version.
  goto fail
)

if exist "%SEED_FILE%" (
  echo Importing extra demo data...
  if not "%MYSQL_PASSWORD%"=="" set "MYSQL_PWD=%MYSQL_PASSWORD%"
  "%MYSQL_CMD%" -u%MYSQL_USERNAME% --default-character-set=utf8mb4 bin_text < "%SEED_FILE%"
  set "MYSQL_PWD="
  if errorlevel 1 (
    echo Extra demo data import failed. Check seed_more_demo_data.sql.
    goto fail
  )
)

echo.
echo Database import completed.
if not "%AUTO_IMPORT%"=="1" pause
exit /b 0

:fail
if not "%AUTO_IMPORT%"=="1" pause
exit /b 1
