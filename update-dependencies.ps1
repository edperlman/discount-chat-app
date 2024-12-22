# Define the dependency to add
$dependency = @{
    "balanced-match" = "^3.0.1"
}

# Get all package.json files in the monorepo
Write-Output "Finding all package.json files in the monorepo..."
$packageFiles = Get-ChildItem -Path "C:\discount-chat-app" -Recurse -Filter "package.json"

# Loop through each package.json file and update it
foreach ($file in $packageFiles) {
    # Read the package.json file
    Write-Output "Processing $($file.FullName)..."
    $packageJson = Get-Content -Path $file.FullName -Raw | ConvertFrom-Json

    # Add or update the dependency in dependencies
    if (-not $packageJson.dependencies) {
        $packageJson.dependencies = @{}
    }
    if (-not $packageJson.dependencies["balanced-match"]) {
        $packageJson.dependencies["balanced-match"] = $dependency["balanced-match"]
        Write-Output "Added balanced-match dependency to $($file.FullName)"
    } else {
        Write-Output "balanced-match already exists in $($file.FullName)"
    }

    # Save the updated package.json file
    $packageJson | ConvertTo-Json -Depth 100 | Set-Content -Path $file.FullName -Encoding UTF8
}

# Run pnpm install to apply the changes
Write-Output "Running pnpm install to apply changes..."
pnpm install
