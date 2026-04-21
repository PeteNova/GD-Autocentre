@echo off
REM ────────────────────────────────────────────────────────────────────
REM  dev-server.cmd — lokalny serwer w Node + otwiera edytor w przegladarce.
REM  Dwuklik w Explorerze. Ctrl+C zatrzymuje, okno zostaje otwarte na bledzie.
REM ────────────────────────────────────────────────────────────────────

setlocal
set "HERE=%~dp0"
set "PORT=8080"
set "URL=http://localhost:%PORT%/tools/hero-editor.html"

where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo   [BLAD] Nie znalazlem node.exe w PATH.
  echo   Zainstaluj Node.js: https://nodejs.org
  echo.
  pause
  exit /b 1
)

REM Otworz przegladarke po ~1.5s — do tego czasu serwer bedzie juz slyszal.
start "" /B cmd /c "timeout /t 2 /nobreak >nul & start %URL%"

node "%HERE%dev-server.mjs"

echo.
echo   Serwer zakonczony. Nacisnij klawisz aby zamknac.
pause
