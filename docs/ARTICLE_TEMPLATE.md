# Template Markdown untuk Artikel CoNime

Gunakan format ini jika ingin menulis artikel secara offline di Notepad/VS Code. Simpan file ini dengan ekstensi `.md` di folder `src/content/news/`.

---
layout: news ----> ini bisa opinion, reviews tergantung artikel yg saya kirim ya
title_id: "Judul Artikel Bahasa Indonesia"
title_en: "English Article Title"
excerpt_id: "Ringkasan pendek Bahasa Indonesia untuk SEO."
excerpt_en: "English summary for SEO."
author: "CoNime Editorial"
date: 2026-01-17T22:00:00Z
category: "Anime"
topics:
  - "One Piece"
  - "Action"
thumbnail: "/images/uploads/nama-file-gambar.jpg" ---> pastikan /images/uploads ya karena itu yg digunakan
image_title: "Judul Gambar / Alt Text"
image_credit: "Nama Pemilik Foto (Misal: Netflix)"
image_source_url: "https://netflix.com"
video_url: "https://www.youtube.com/watch?v=xxxx"
video_title: "Judul Video Sisipan"
video_source: "Nama Channel/Sumber Video"
video_source_url: "https://youtube.com/c/xxxx"
gallery:
  - type: "photo"
    image: "/images/uploads/foto1.jpg"
    title: "Keterangan Foto 1"
    source: "Sumber Foto 1"
    source_url: "http://link-sumber.com"
  - type: "video"
    url: "https://video-link.com"
    title: "Keterangan Video 1"
    source: "Sumber Video 1"
    source_url: "http://link-video.com"
source_name: "Teks Link Sumber Artikel (Misal: Natalie.mu)"
source_url: "https://natalie.mu/comic/news/xxxx"
---

Isi artikel (Body ID) tulis di sini. Anda bisa menggunakan:
- **Bold**
- *Italic*
- [Link](https://google.com)
- > Blockquote untuk kutipan.

---
Body Bahasa Inggris (Body EN) tulis di sini (opsional).
---

## Cara Menggunakan:
1. Copy teks di atas ke file baru, simpan sebagai `judul-artikel.md`.
2. Letakkan file di: `src/content/news/`.
3. Foto yang digunakan harus diupload manual dulu ke folder `public/images/uploads/` atau lewat CMS Media Library.
4. Jalankan `npm run sync`.
5. Buka CMS Admin -> Artikel tersebut akan otomatis ada di sana sebagai Draft!
