# Define the project directory
$projectDir = "C:\discount-chat-app"

# Get all package.json files
$packageFiles = Get-ChildItem -Path $projectDir -Filter "package.json" -Recurse

# Loop through each package.json file
foreach ($file in $packageFiles) {
    # Read the content of the package.json file
    $content = Get-Content -Path $file.FullName -Raw

    # Replace all occurrences of "rm -rf" with "rimraf"
    $updatedContent = $content -replace 'rm -rf', 'rimraf'

    # Save the updated content back to the file
    Set-Content -Path $file.FullName -Value $updatedContent -Encoding UTF8

    # Output the updated file name
    Write-Host "Updated: $($file.FullName)"
}

Write-Host "All package.json files have been updated!"
