# After adding or changing files under public/images/, run from repo root:
#   powershell -ExecutionPolicy Bypass -File scripts/sync-public-images.ps1
$root = Split-Path $PSScriptRoot -Parent
if (-not (Test-Path "$root/public/images")) { exit 1 }
New-Item -ItemType Directory -Force -Path "$root/images" | Out-Null
Copy-Item -Path "$root/public/images/*" -Destination "$root/images/" -Force
Write-Host "Synced public/images -> images/ ($((Get-ChildItem $root/images).Count) files)."
