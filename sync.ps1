# 1. Ambil update terbaru dari server (karena CMS mungkin sudah simpan draft)
git pull --rebase origin main

# 2. Tambah perubahan lokal (jika ada)
git add .

# 3. Cek apakah ada yang perlu di-commit
if (-not (git diff --cached --quiet)) {
  git commit -m "sync: $(Get-Date -Format 'yyyy-MM-dd_HH:mm:ss')"
  git push origin main
  Write-Host "Berhasil Update: Perubahan lokal sudah dikirim ke server."
} else {
  # Jika tidak ada perubahan lokal, pastikan kalau tadi ada pull baru, kita push (jika diperlukan) atau kabari saja
  Write-Host "Selesai: Folder lokal sudah sinkron dengan server (Up-to-date)."
}
