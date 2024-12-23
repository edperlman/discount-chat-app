# Define the path to the TypeScript error log file
$logFilePath = "tsc-errors.log"

# Read the error log and extract missing module names
$missingModules = Get-Content $logFilePath |
    Select-String -Pattern "Cannot find module '(.+?)'" |
    ForEach-Object { ($_ -match "'(.+?)'" | Out-Null); $Matches[1] } |
    Sort-Object -Unique

# Define a regex to filter valid JavaScript/TypeScript modules
$validModuleRegex = "^[a-zA-Z0-9@/_-]+$"

# Loop through each missing module and attempt to install its type declaration
foreach ($module in $missingModules) {
    # Skip invalid or non-JavaScript/TypeScript modules
    if ($module -notmatch $validModuleRegex -or $module -like "*.svg" -or $module -like "*.scss") {
        Write-Host "Skipping invalid or unsupported module: $module" -ForegroundColor Cyan
        continue
    }

    Write-Host "Installing types for module: $module" -ForegroundColor Yellow

    # Try installing the module's type declarations
    try {
        npm install --save-dev @types/$module -ErrorAction Stop
    } catch {
        Write-Host "Failed to install types for module: $module" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}

Write-Host "Type declarations installation process complete!" -ForegroundColor Green
