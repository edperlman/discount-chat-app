# Step 1: Validate package.json
Write-Host "Validating package.json..."
try {
    $json = Get-Content -Path "package.json" | ConvertFrom-Json
    Write-Host "package.json is valid." -ForegroundColor Green
} catch {
    Write-Host "package.json is invalid. Please fix the syntax and try again." -ForegroundColor Red
    exit 1
}

# Step 2: Remove unnecessary files
Write-Host "Removing unnecessary files..."
$filesToDelete = @(
    ".eslintrc.js",
    ".eslintrc.json",
    ".eslintrc",
    "eslint.config.js",
    ".eslintignore",
    "package-lock.json",
    "yarn.lock",
    ".turbo",
    "node_modules"
)

foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Remove-Item -Recurse -Force $file
        Write-Host "Deleted $file" -ForegroundColor Yellow
    }
}

# Step 3: Clean up dependencies
Write-Host "Pruning unnecessary dependencies..."
npm prune --force

# Step 4: Validate and remove deprecated dependencies
Write-Host "Checking for deprecated dependencies..."
npm outdated
Write-Host "Removing deprecated dependencies..."
# You can manually replace 'package-to-remove' below with any outdated dependency
# npm uninstall <package-to-remove>

# Step 5: Reinstall and test dependencies
Write-Host "Reinstalling dependencies..."
npm install

Write-Host "Running tests..."
npm test

# Step 6: Check for any remaining unnecessary files
Write-Host "Checking for remaining unnecessary files..."
$remainingFiles = @(".cache", "logs", "*.tmp")
foreach ($file in $remainingFiles) {
    if (Test-Path $file) {
        Remove-Item -Recurse -Force $file
        Write-Host "Deleted $file" -ForegroundColor Yellow
    }
}

Write-Host "Final Cleanup completed successfully!" -ForegroundColor Green
