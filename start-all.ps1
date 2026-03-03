Write-Host "Starting Grocery App Ecosystem..." -ForegroundColor Green

# Use Start-Process to run in separate windows
Start-Process powershell -ArgumentList "cd backend; npm run dev"
Start-Process powershell -ArgumentList "cd frontend; npm run dev"
Start-Process powershell -ArgumentList "cd admin; npm run dev"

Write-Host "Backend: http://localhost:5000"
Write-Host "Frontend: http://localhost:5173"
Write-Host "Admin: http://localhost:5174"
