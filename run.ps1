$nodePath = Join-Path $PSScriptRoot ".node\node-v20.11.1-win-x64"
if (-not (Test-Path (Join-Path $nodePath "node.exe"))) {
    Write-Error "Local Node.js environment not found. Please wait until the background setup completes."
    Exit
}
$env:PATH = "$nodePath;$env:PATH"
if (-not (Test-Path (Join-Path $PSScriptRoot "node_modules"))) {
    Write-Host "Installing dependencies..."
    npm install
}
Write-Host "Starting Next.js Dev Server..."
npm run dev
