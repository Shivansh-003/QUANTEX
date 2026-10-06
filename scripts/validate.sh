#!/usr/bin/env bash
set -e

echo "=== QUANTEX Local Foundation Validation ==="

echo "1. Checking backend with Ruff..."
python -m ruff check backend

echo "2. Checking backend types with Mypy..."
python -m mypy backend/app backend/tests --config-file backend/pyproject.toml

echo "3. Running backend test suite with Pytest..."
python -m pytest backend/tests

echo "4. Checking frontend types with TypeScript..."
cd frontend
npm run typecheck

echo "5. Checking frontend linting..."
npm run lint

echo "6. Building frontend for production..."
npm run build
cd ..

echo "=== All Foundation Checks Passed Successfully ==="
