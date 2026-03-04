@echo off
echo Starting SafeRide...
start "PocketBase" cmd /k "cd /d E:\AAW\MyData\Kodebits\saferide-web\apps\api && pocketbase.exe serve --dir=.\pb_data --migrationsDir=.\pb_migrations"
timeout /t 2
start "Frontend" cmd /k "cd /d E:\AAW\MyData\Kodebits\saferide-web\apps\web && npm run dev"
echo Done! Open http://localhost:5173