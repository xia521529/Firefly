@echo off
cd /d "%~dp0"
title NightMoor dev server
if not exist "node_modules\astro\bin\astro.mjs" (
  echo node_modules not found. Run: pnpm install
  pause
  exit /b 1
)
node node_modules\astro\bin\astro.mjs dev
echo.
echo Server stopped. Press any key to close.
pause >nul
