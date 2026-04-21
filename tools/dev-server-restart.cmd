@echo off
REM ────────────────────────────────────────────────────────────────────
REM  dev-server-restart.cmd — ubij stary serwer na porcie 8080
REM  i odpal nowy. Dwuklik w Explorerze.
REM ────────────────────────────────────────────────────────────────────

setlocal
set "PORT=8080"

echo.
echo   Szukam procesu na porcie %PORT%...

set "FOUND=0"
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%PORT% .*LISTENING"') do (
  echo   Ubijam PID %%P
  taskkill /PID %%P /F >nul 2>&1
  set "FOUND=1"
)

if "%FOUND%"=="0" (
  echo   Port %PORT% nic nie trzyma — startuje od razu.
) else (
  echo   Port %PORT% zwolniony.
)
echo.

call "%~dp0dev-server.cmd"
