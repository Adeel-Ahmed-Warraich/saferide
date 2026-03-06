@echo off
echo Starting SafeRide...

start "PocketBase API" cmd /k "cd /d E:\AAW\MyData\Kodebits\saferide-web\apps\api && set PB_DATA_DIR=.\pb_data && set PB_MIGRATIONS_DIR=.\pb_migrations && set PB_HOOKS_DIR=.\pb_hooks && node src/main.js"

timeout /t 3

start "Frontend" cmd /k "cd /d E:\AAW\MyData\Kodebits\saferide-web\apps\web && npm run dev"

echo Done! Open http://localhost:3000