# 1. Simpan perubahan lokal sementara (Autostash) dan ambil update dari server
# Ini agar tidak error "unstaged changes" saat rebase
git pull --rebase --autostash origin main

# 2. Tambah perubahan lokal baru
git add .

# 3. Cek apakah ada yang perlu di-commit
if (-not (git diff --cached --quiet)) {
  git commit -m "sync: $(Get-Date -Format 'yyyy-MM-dd_HH:mm:ss')"
  git push origin main
  Write-Host "Berhasil Update: Perubahan lokal dan server sudah sinkron!"
} else {
  Write-Host "Selesai: Folder lokal sudah Up-to-date dengan server."
}
