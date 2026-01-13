
# manage.ps1 - Project Management Script for Windows

param (
    [string]$Command
)

function Install-Backend {
    Write-Host "Installing Backend Dependencies..." -ForegroundColor Cyan
    if (-not (Test-Path "backend\venv")) {
        python -m venv backend\venv
    }
    .\backend\venv\Scripts\python -m pip install -r backend\requirements.txt
    
    if (-not (Get-Command "tectonic" -ErrorAction SilentlyContinue)) {
        Write-Host "WARNING: 'tectonic' is not found in PATH." -ForegroundColor Yellow
        Write-Host "Please install it: 'scoop install tectonic' or see https://tectonic-typesetting.github.io/" -ForegroundColor Yellow
    }
}

function Install-Frontend {
    Write-Host "Installing Frontend Dependencies..." -ForegroundColor Cyan
    Set-Location frontend
    npm install
    Set-Location ..
}

function Dev-Backend {
    Write-Host "Starting Backend..." -ForegroundColor Green
    .\backend\venv\Scripts\python -m uvicorn main:app --app-dir backend --reload --host 0.0.0.0 --port 8000
}

function Dev-Frontend {
    Write-Host "Starting Frontend..." -ForegroundColor Green
    Set-Location frontend
    npm run dev
    Set-Location ..
}

if ($Command -eq "install") {
    Install-Backend
    Install-Frontend
}
elseif ($Command -eq "dev-backend") {
    Dev-Backend
}
elseif ($Command -eq "dev-frontend") {
    Dev-Frontend
}
else {
    Write-Host "Usage: .\manage.ps1 [install | dev-backend | dev-frontend]" -ForegroundColor Yellow
    Write-Host "Example: .\manage.ps1 install"
}
