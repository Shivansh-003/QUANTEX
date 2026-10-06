# QUANTEX Local Foundation Validation (PowerShell)
$ErrorActionPreference = "Stop"

Write-Host "=== QUANTEX Local Foundation Validation ===" -ForegroundColor Cyan

Write-Host "1. Checking backend with Ruff..." -ForegroundColor Yellow
python -m ruff check backend

Write-Host "2. Checking backend types with Mypy..." -ForegroundColor Yellow
python -m mypy backend/app backend/tests --config-file backend/pyproject.toml

Write-Host "3. Running backend test suite with Pytest..." -ForegroundColor Yellow
python -m pytest backend/tests

Write-Host "4. Checking frontend types with TypeScript..." -ForegroundColor Yellow
Push-Location frontend
try {
    npm run typecheck

    Write-Host "5. Checking frontend linting..." -ForegroundColor Yellow
    npm run lint

    Write-Host "6. Building frontend for production..." -ForegroundColor Yellow
    npm run build
} finally {
    Pop-Location
}

Write-Host "=== All Foundation Checks Passed Successfully ===" -ForegroundColor Green
