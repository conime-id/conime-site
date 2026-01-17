Write-Host "Starting Deployment Process..." -ForegroundColor Cyan

Write-Host "Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build Failed! Aborting deployment." -ForegroundColor Red
    exit $LASTEXITCODE
}

cd dist

Write-Host "Initializing deployment repository..." -ForegroundColor Yellow
git init
git checkout -B main

if (git remote | Select-String "origin") {
    git remote remove origin
}

git remote add origin https://github.com/conime-id/conime-id.github.io.git

git add -A
git commit -m "deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

Write-Host "Pushing to GitHub Pages..." -ForegroundColor Yellow
git push -f origin main

cd ..

Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "Live URL: https://conime-id.github.io" -ForegroundColor Cyan
