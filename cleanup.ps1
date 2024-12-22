Write-Host "Starting cleanup process..." -ForegroundColor Green

# Step 1: Validate package.json
Write-Host "Validating package.json..."
try {
    $json = Get-Content -Path "package.json" | ConvertFrom-Json
    Write-Host "package.json is valid."
} catch {
    Write-Host "package.json is invalid. Please fix the syntax and try again." -ForegroundColor Red
    exit 1
}

# Step 2: Clean workspace
Write-Host "Cleaning up workspace..."
rimraf node_modules .turbo package-lock.json yarn.lock pnpm-lock.yaml
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to clean workspace. Exiting..." -ForegroundColor Red
    exit 1
}

# Step 3: Install fresh dependencies
Write-Host "Installing fresh dependencies with npm..."
try {
    npm install --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Dependency installation failed. Exiting..." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "An error occurred during dependency installation. Exiting..." -ForegroundColor Red
    exit 1
}

# Step 4: Reinstall eslint if missing
Write-Host "Checking for eslint..."
if (-not (Get-Command eslint -ErrorAction SilentlyContinue)) {
    Write-Host "eslint is not installed globally. Installing..."
    npm install eslint -g
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install eslint globally. Exiting..." -ForegroundColor Red
        exit 1
    }
}

# Step 5: Run linting and format checks
Write-Host "Running linting and format checks..."
try {
    npm run lint
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Linting completed with errors." -ForegroundColor Yellow
    }
    npm run format
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Formatting completed with errors." -ForegroundColor Yellow
    }
} catch {
    Write-Host "An error occurred during linting or formatting. Continuing..." -ForegroundColor Yellow
}

# Step 6: Build project
Write-Host "Building the project..."
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed. Exiting..." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "An error occurred during the build process. Exiting..." -ForegroundColor Red
    exit 1
}

Write-Host "Cleanup and setup completed successfully!" -ForegroundColor Green
