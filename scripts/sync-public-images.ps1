# After adding or changing files under public/images/, run from repo root:
#   node scripts/sync-public-images.js
#   — or —
#   powershell -ExecutionPolicy Bypass -File scripts/sync-public-images.ps1
$root = Split-Path $PSScriptRoot -Parent
$src = Join-Path $root "public/images"
$dst = Join-Path $root "images"
if (-not (Test-Path $src)) { exit 1 }
New-Item -ItemType Directory -Force -Path $dst | Out-Null
$n = 0
Get-ChildItem -Path $src -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring((Resolve-Path $src).Path.Length).TrimStart("\", "/")
  $destPath = Join-Path $dst $rel
  $dir = Split-Path $destPath -Parent
  if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }
  Copy-Item $_.FullName -Destination $destPath -Force
  $n++
}
Write-Host "sync-public-images: copied $n file(s) recursively to images/"
