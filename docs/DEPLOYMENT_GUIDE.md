# Panduan Deployment & Domain CoNime.id

Dokumen ini berisi langkah-langkah untuk meng-online-kan website CoNime agar bisa diakses publik menggunakan domain pilihan Anda (misal `conime.id`).

## 1. Konsep Dasar

Website Anda saat ini adalah **Static Site** (HTML/CSS/JS) yang dibangun menggunakan **React/Vite**.
- **Hosting**: Tempat menyimpan file website agar bisa diakses internet. (Kita menggunakan **GitHub Pages** yang gratis dan cepat).
- **Domain**: Alamat website (contoh: `conime.id`). Anda harus membelinya dari penyedia domain.

---

## 2. Cara Update / Deploy Website

Setiap kali Anda selesai melakukan perubahan kode di komputer lokal, Anda perlu "mengirim" perubahan tersebut ke internet.

**Cara Deploy:**
1. Buka terminal di VS Code (`Ctrl + J`).
2. Ketik perintah berikut dan tekan Enter:
   ```powershell
   npm run deploy
   ```
3. Tunggu hingga proses selesai (muncul tulisan "Deployment Complete!").
4. Website di internet akan otomatis terupdate dalam 1-5 menit.

---

## 3. Menghubungkan Domain (Custom Domain)

Jika Anda ingin mengubah alamat dari `conime-id.github.io` menjadi `conime.id` (atau nama lain), ikuti langkah ini:

### A. Beli Domain
1. Beli domain di penyedia lokal (Niagahoster, Domainesia, IdCloudHost) atau internasional (Namecheap, GoDaddy).
2. Cari domain yang Anda inginkan (misal `conime.id`).

### B. Konfigurasi DNS (Di Tempat Beli Domain)
Masuk ke panel kontrol domain Anda, cari menu **DNS Management / DNS Zone**, dan tambahkan **4 Record A** dan **1 Record CNAME**:

**1. A Records (Mengarahkan ke GitHub):**
Tambahkan 4 baris ini satu per satu:
- **Type**: A | **Host/@**: @ | **Value**: `185.199.108.153`
- **Type**: A | **Host/@**: @ | **Value**: `185.199.109.153`
- **Type**: A | **Host/@**: @ | **Value**: `185.199.110.153`
- **Type**: A | **Host/@**: @ | **Value**: `185.199.111.153`

**2. CNAME Record (Subdomain www):**
- **Type**: CNAME | **Host**: www | **Value**: `conime-id.github.io`

*(Simpan pengaturan dan tunggu 1-24 jam untuk propagasi).*

### C. Konfigurasi di GitHub Repository
1. Buka halaman Repository GitHub Anda di browser.
2. Masuk ke **Settings** > **Pages**.
3. Di bagian **Custom domain**:
   - Ketik nama domain Anda (misal `conime.id`).
   - Klik **Save**.
   - Centang kotak **Enforce HTTPS** (agar aman/gembok hijau).

---

## 4. Opsi Alternatif: Hosting Sendiri (cPanel / Shared Hosting)

Jika Anda ingin menggunakan hosting pribadi (seperti Niagahoster, Rumahweb, dll yang pakai cPanel), Anda TIDAK PERLU setup GitHub Pages. Cukup lakukan ini:

1. **Build Project di Lokal:**
   Jalankan perintah ini di terminal VS Code:
   ```powershell
   npm run build
   ```
   *Tunggu sampai selesai. Folder baru bernama `dist` akan muncul.*

2. **Upload ke Hosting (cPanel):**
   - Buka File Manager di cPanel hosting Anda.
   - Masuk ke folder `public_html` (atau subdomain yang dituju).
   - **Upload seluruh isi folder `dist`** (bukan foldernya, tapi isinya) ke sana.
   - Pastikan ada file `index.html` di root `public_html`.

3. **Setting Routing (Wajib untuk React):**
   Agar halaman tidak 404 saat direfresh, buat file baru di `public_html` bernama `.htaccess` dan isi dengan kode ini:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

   ```

---

## 4. Opsi Alternatif: Automasi dengan Netlify (Push to Deploy)

Jika Anda ingin seperti dulu (Push ke GitHub -> Otomatis Deploy & Build), **Netlify** adalah solusi termudah.
Karena proyek ini berbasis React (Vite), cara kerjanya mirip dengan Hugo.

1. **Persiapan File:**
   Saya sudah membuatkan file `netlify.toml` di folder project Anda. File ini memberi tahu Netlify:
   - Command Build: `npm run build`
   - Folder Publish: `dist`
   - Routing Rule: Mencegah 404 Error (SPA Fallback).

2. **Langkah di Dashboard Netlify:**
   - Login ke Netlify.
   - Klik **"Add new site"** > **"Import an existing project"**.
   - Pilih **GitHub**.
   - Pilih repository `Conime-aistudio-v3` Anda.
   - Netlify akan otomatis membaca konfigurasi. Klik **Deploy**.

3. **Selesai!**
   Setiap kali Anda edit code dan melakukan `git push`, Netlify akan mendeteksi, melakukan build, dan mengupdate website secara otomatis.

---

## 5. Troubleshooting Umum

**Masalah**: Halaman 404 muncul saat refresh di halaman selain Home.
**Solusi**:
Ini wajar di Single Page Application (SPA) seperti React di hosting statis.
- Kami sudah mengatasinya dengan trik `404.html` (jika menggunakan metode copy index) atau menggunakan `HashRouter`.
- **Project ini menggunakan `BrowserRouter`**: Pastikan konfigurasi server (GitHub Pages) mengarahkan semua 404 ke index.html.
- *Catatan:* Script deploy kita saat ini kadang perlu penyesuaian untuk membuat file `404.html` duplikat dari `index.html` agar routing aman.
   - **Tips Tambahan**: Jika nanti saat refresh di halaman `/news` muncul 404 dari GitHub, kita perlu mengaktifkan trik "SPA Fallback". (Akan dibantu jika terjadi).

**Masalah**: Gambar tidak muncul.
**Solusi**: Pastikan nama file sensitif huruf besar-kecil (case-sensitive). `Logo.png` tidak sama dengan `logo.png` di server Linux/GitHub.
