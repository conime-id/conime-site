# Panduan Setup CMS Admin (Decap CMS)

Setelah website berhasil di-deploy ke Netlify, Anda perlu mengaktifkan fitur login agar **Dashboard Admin** bisa digunakan.

## 1. Aktifkan Netlify Identity
Fitur ini digunakan untuk sistem Login/Register admin.

1. Buka Dashboard **Netlify** -> Pilih Site Anda.
2. Klik menu **"Site configuration"** (atau "Settings").
3. Cari menu **"Identity"** di sidebar kiri.
4. Klik tombol **"Enable Identity"**.

## 2. Aktifkan Git Gateway
Fitur ini mengizinkan CMS untuk menulis/edit file di GitHub Anda.

1. Masih di menu **Identity**.
2. Scroll ke bawah ke bagian **"Services"** -> **"Git Gateway"**.
3. Klik **"Enable Git Gateway"**.
   - *Jika diminta login GitHub, silakan login dan Authorize.*

## 3. Registrasi Akun Admin Pertama
1. Buka website Anda di browser: `https://conime.id` (atau URL sementara Netlify).
2. Pergi ke halaman admin: `https://conime.id/admin/`.
3. Anda akan melihat tombol "Login with Netlify Identity".
4. Karena belum punya akun, tutup dulu pop-up loginnya (jika ada).
5. Kembali ke Dashboard Netlify -> Tab **"Identity"**.
6. Klik **"Invite users"**.
7. Masukkan email Anda sendiri. Kirim.
8. Cek Email -> Klik Link verifikasi -> Anda akan diminta buat password.
9. Selesai! Sekarang login di `conime.id/admin` dengan email & password tersebut.

---

## Catatan Penting (Status Saat Ini)

Saat ini, Dashboard CMS sudah **bisa dibuka** dan Anda sudah **bisa menulis artikel**.

**NAMUN:**
Tombol "Publish" di CMS akan menyimpan file sebagai **File Baru** (format JSON/Markdown) di folder `src/content/`.
Website **belum otomatis berubah** karena kode React kita saat ini masih membaca data dari file `constants.tsx` (Manual).

**Langkah Pengembangan Selanjutnya (Future Work):**
Agar artikel CMS langsung muncul di Home:
1. Kita perlu mengubah kodingan `Home.tsx` agar tidak lagi import `constants.tsx`.
2. Melainkan membaca file JSON yang dihasilkan oleh CMS tadi.

Untuk sekarang, CMS ini berfungsi sebagai "Draft Penyimpanan" yang aman di Cloud.
