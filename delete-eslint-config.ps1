# Script to delete ESLint configuration files

Write-Host "Deleting ESLint configuration files..." -ForegroundColor Green

# List of ESLint configuration files to delete
$eslintFiles = @(
    ".eslintrc.js",
    ".eslintrc.json",
    ".eslintrc",
    "eslint.config.js"
)

# Loop through the list and delete files if they exist
foreach ($file in $eslintFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Deleted: $file" -ForegroundColor Yellow
    } else {
        Write-Host "File not found: $file" -ForegroundColor Cyan
    }
}

Write-Host "ESLint configuration cleanup completed." -ForegroundColor Green
