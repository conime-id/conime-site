git add .
if (-not (git diff --cached --quiet)) {
  git commit -m "sync: $(Get-Date -Format 'yyyy-MM-dd_HH:mm:ss')"
  git push origin main
} else {
  Write-Host "No changes to sync"
}
