import React from "react";
import {NewsItem, CategoryCount} from "./types";

export const TRANSLATIONS = {
  id: {
    nav: ["Beranda", "Anime", "Komik", "Film", "Game", "Opini", "Ulasan"],
    searchPlaceholder: "Cari berita...",
    latestNews: "Berita Terbaru",
    popularThisWeek: "Populer Minggu Ini",
    trending: "Sedang Tren",
    categories: "Kategori",
    lastRead: "Terakhir Dibaca",
    breadcrumb: {
      topic: "Topik",
      category: "Kategori",
      search: "Pencarian"
    },
    seo: {
      // HOME
      homeTitle: "CoNime | Portal Berita Budaya Pop Visual",
      homeDesc:
        "Portal informasi terpercaya mengenai anime, manga, dan perkembangan budaya pop visual global.",

      // TOPIK / TAG
      topicTitle: (tag: string) => `Topik: #${tag.toUpperCase()} | CoNime`,
      topicDesc: (tag: string) =>
        `Kumpulan berita terbaru mengenai topik #${tag} di CoNime News Portal.`,

      // KATEGORI
      categoryTitle: (category: string) => `Kategori: ${category} | CoNime`,
      categoryDesc: (category: string) =>
        `Kumpulan berita terbaru seputar ${category} di CoNime News Portal.`
    },

    newsletterTitle: "Newsletter",
    newsletterDesc:
      "Dapatkan informasi terkini seputar industri budaya pop visual langsung melalui email Anda.",
    newsletterBtn: "Berlangganan",
    footerDesc:
      "CoNime: Jendela Budaya Pop Visual Dunia",
    writtenBy: "Penulis",
    readMore: "Baca Selengkapnya",
    loadMore: "Muat Lebih Banyak",
    login: "Masuk",
    langName: "ID",
    copy: "© 2025 CoNime.id Portal Berita Budaya Pop Visual.",
    back: "Kembali ke Beranda",
    relatedArticles: "Artikel Terkait",
    articlesFound: "Artikel Ditemukan",
    aboutUs: "Tentang Kami",
    contactUs: "Hubungi Kami",
    privacyPolicy: "Kebijakan Privasi",
    disclaimer: "Sanggahan",
    dmca: "DMCA Notice",
    visualGallery: "Galeri Visual",
    defaultVideoLabel: "Video Resmi / Trailer",
    // New translations
    searchResultPlaceholder: "Cari...",
    searchResult: "Hasil Cari",
    resultsFor: (query: string) => `Hasil: "${query}"`,
    noResults: "Tidak ada hasil ditemukan.",
    noHistory: "BELUM ADA RIWAYAT BACA. YUK MULAI BACA BERITA TERBARU!",
    noPopularData: "Tidak ada data populer",
    noCategories: "Kategori kosong",
    quickNavigation: "NAVIGASI CEPAT",
    supportLabel: "BANTUAN",
    termsLabel: "SYARAT & KETENTUAN",
    toTop: "KE ATAS",
    viewsLabel: "TAYANGAN",
    sourceLabel: "SUMBER ARTIKEL",
    imageSourceLabel: "SUMBER FOTO",
    videoSourceLabel: "SUMBER VIDEO",
    readAlso: "BACA JUGA",
    stayConnected: "TETAP TERHUBUNG",
    socialCallToAction: "Suka Artikel Seperti Ini?",
    socialDesc: "Ikuti media sosial kami untuk mendapatkan update berita anime & manga tercepat setiap hari.",
    likeLabel: "SUKA",
    commentLabel: "KOMENTAR",
    newsCollection: "Koleksi Berita",
    faq: "FAQ",
    privacy: "Kebijakan Privasi",
    changeLanguage: "Ganti Bahasa",
    switchLanguage: "GANTI KE INGGRIS (EN)",
    justNow: "Baru saja",
    ago: "yang lalu",
    hours: "jam",
    likesLabel: "SUKA",
    replyLabel: "BALAS",
    portalBudayaPop: "Portal Budaya Pop Visual",
    lightMode: "MODE TERANG",
    darkMode: "MODE GELAP",
    contentReport: "Laporkan Konten",
    contactEditorial: "HUBUNGI REDAKSI",
    footerMotto: "PORTAL BERITA INDEPENDEN • DIDIRIKAN 2025",
    loginTitle: "Selamat Datang Kembali",
    loginIdentifierLabel: "Email atau Username",
    registerTitle: "Gabung Komunitas",
    loginSubmit: "Masuk Sekarang",
    registerSubmit: "Daftar Akun",
    emailPlaceholder: "Alamat Email",
    passwordPlaceholder: "Kata Sandi",
    dontHaveAccount: "Belum punya akun?",
    alreadyHaveAccount: "Sudah punya akun?",
    orContinueWith: "Atau lanjut dengan",
    logout: "Keluar",
    profile: "Profil Saya",
    settings: "Pengaturan",
    editProfile: "Edit Profil",
    accountSettings: "Pengaturan Akun",
    saveChanges: "Simpan Perubahan",
    cancel: "Batal",
    usernameLabel: "Nama Pengguna",
    displayNameLabel: "Nama Tampilan",
    bioLabel: "Biografi",
    avatarLabel: "URL Foto Profil",
    appearance: "Tampilan",
    themeLabel: "Tema Visual",
    languageLabel: "Bahasa Antarmuka",
    dangerZone: "Zona Bahaya",
    deleteAccount: "Hapus Akun",
    confirmDelete: "Yakin ingin menghapus akun? Tindakan ini permanen.",
    bookmarks: "Bookmark",
    noBookmarks: "BELUM ADA BOOKMARK. SIMPAN ARTIKEL FAVORITMU!",
    addedToBookmarks: "Berhasil disimpan ke bookmark",
    removedFromBookmarks: "Dihapus dari bookmark",
    contactSupport: "Bantuan & Umum"
  },
  en: {
    nav: ["Home", "Anime", "Comics", "Movies", "Games", "Opinion", "Reviews"],
    searchPlaceholder: "Search news...",
    latestNews: "Latest News",
    popularThisWeek: "Popular This Week",
    trending: "Trending Now",
    categories: "Categories",
    lastRead: "Recently Read",
    breadcrumb: {
      topic: "Topic",
      category: "Category",
      search: "Search"
    },
    seo: {
      // HOME
      homeTitle: "CoNime | Visual Pop Culture News Portal",
      homeDesc:
        "Trusted news portal covering anime, manga, and global visual pop culture trends.",

      // TOPIC / TAG
      topicTitle: (tag) => `Topic: #${tag.toUpperCase()} | CoNime`,
      topicDesc: (tag: string) =>
        `Latest news collection about #${tag} on CoNime News Portal.`,

      // CATEGORY
      categoryTitle: (category: string) => `Category: ${category} | CoNime`,
      categoryDesc: (category: string) =>
        `Latest news and updates about ${category} on CoNime News Portal.`
    },
    newsletterTitle: "Newsletter",
    newsletterDesc:
      "Receive the latest updates on the visual pop culture industry directly in your inbox.",
    newsletterBtn: "Subscribe",
    footerDesc:
      "CoNime: The Window to Global Visual Pop Culture",
    writtenBy: "Written By",
    readMore: "Read More",
    loadMore: "Load More",
    login: "Login",
    langName: "EN",
    copy: "© 2025 CoNime.id Visual Pop Culture News Portal.",
    back: "Back to Home",
    relatedArticles: "Related Articles",
    articlesFound: "Articles Found",
    aboutUs: "About Us",
    contactUs: "Contact Us",
    privacyPolicy: "Privacy Policy",
    disclaimer: "Disclaimer",
    dmca: "DMCA Notice",
    visualGallery: "Visual Gallery",
    defaultVideoLabel: "Official Video / Trailer",
    // New translations
    searchResultPlaceholder: "Search...",
    searchResult: "Search Result",
    resultsFor: (query: string) => `Results for: "${query}"`,
    noResults: "No results found.",
    noHistory: "NO READING HISTORY YET. START READING THE LATEST NEWS!",
    noPopularData: "No popular data",
    noCategories: "No categories found",
    quickNavigation: "QUICK NAVIGATION",
    supportLabel: "SUPPORT",
    termsLabel: "TERMS & CONDITIONS",
    toTop: "TO TOP",
    viewsLabel: "VIEWS",
    sourceLabel: "ARTICLE SOURCE",
    imageSourceLabel: "IMAGE SOURCE",
    videoSourceLabel: "VIDEO SOURCE",
    readAlso: "READ ALSO",
    stayConnected: "STAY CONNECTED",
    socialCallToAction: "Love Content Like This?",
    socialDesc: "Follow our socials to get the fastest anime & manga news updates every single day.",
    likeLabel: "LIKE",
    commentLabel: "COMMENT",
    newsCollection: "News Collection",
    faq: "FAQ",
    privacy: "Privacy Policy",
    changeLanguage: "Change Language",
    switchLanguage: "SWITCH TO INDONESIAN (ID)",
    justNow: "Just now",
    ago: "ago",
    hours: "hours",
    likesLabel: "LIKES",
    replyLabel: "REPLY",
    portalBudayaPop: "Visual Pop Culture Portal",
    lightMode: "LIGHT MODE",
    darkMode: "DARK MODE",
    contentReport: "Content Report",
    contactEditorial: "CONTACT EDITORIAL",
    footerMotto: "INDEPENDENT NEWS PORTAL • EST. 2025",
    loginTitle: "Welcome Back",
    loginIdentifierLabel: "Email or Username",
    registerTitle: "Join Community",
    loginSubmit: "Sign In Now",
    registerSubmit: "Create Account",
    emailPlaceholder: "Email Address",
    passwordPlaceholder: "Password",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    orContinueWith: "Or continue with",
    logout: "Log Out",
    profile: "My Profile",
    settings: "Settings",
    editProfile: "Edit Profile",
    accountSettings: "Account Settings",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    usernameLabel: "Username",
    displayNameLabel: "Display Name",
    bioLabel: "Biography",
    avatarLabel: "Profile Picture URL",
    appearance: "Appearance",
    themeLabel: "Visual Theme",
    languageLabel: "Interface Language",
    dangerZone: "Danger Zone",
    deleteAccount: "Delete Account",
    confirmDelete: "Are you sure you want to delete your account? This action is permanent.",
    bookmarks: "Bookmarks",
    noBookmarks: "NO BOOKMARKS YET. SAVE YOUR FAVORITE ARTICLES!",
    addedToBookmarks: "Added to bookmarks",
    removedFromBookmarks: "Removed from bookmarks",
    contactSupport: "Support & General"
  }
};

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/conime.id/",
  twitter: "https://x.com/conime_id",
  facebook: "https://facebook.com/conime.id",
  youtube: "https://youtube.com/@conime_id",
  tiktok: "https://www.tiktok.com/@conime.id",
  whatsapp: "https://wa.me/6285179860291",
  email: "hello@conime.id",
  emailEditorial: "redaksi@conime.id"
};

const DUMMY_CONTENT_ID = `Produksi animasi modern saat ini menuntut standar visual yang semakin tinggi untuk memenuhi ekspektasi audiens global. Dalam perkembangannya, banyak studio mulai mengintegrasikan teknologi CGI secara halus dengan seni tradisional hand-drawn untuk menciptakan kedalaman visual yang optimal.

Sebagai perbandingan, Anda juga bisa membaca <a href="#article/2" data-internal="true">rekomendasi manhwa isekai terbaru</a> yang memiliki kualitas visual serupa.

> "Sakamoto Days bukan sekadar aksi, ini adalah perpaduan antara koreografi sinematik dan penulisan karakter yang sangat manusiawi di tengah dunia pembunuh bayaran." - Tim Produksi

Karya-karya populer seperti yang akan kita bahas menunjukkan bahwa narasi yang kuat harus didukung oleh konsistensi teknis. Selain aspek visual, desain suara dan pemilihan pengisi suara (seiyuu) menjadi elemen kurusial yang menentukan keberhasilan sebuah adaptasi dari medium cetak ke layar kaca.`;

const DUMMY_CONTENT_EN = `Modern animation production demands increasingly higher visual standards to meet global audience expectations. In its development, many studios have begun to subtly integrate CGI technology with traditional hand-drawn art to create optimal visual depth.

You can also check our <a href="#article/2" data-internal="true">latest isekai manhwa recommendations</a> which feature similar high-quality aesthetics.

> "Sakamoto Days is not just about action, it's a blend of cinematic choreography and deeply human character writing amidst a world of assassins." - Production Team

Popular works like the one we're discussing show that strong narratives must be supported by technical consistency. In addition to visual aspects, sound design and voice actor (seiyuu) selection are crucial elements that determine the success of an adaptation from print medium to the silver screen.`;

export const getCategoryColor = (categoryEn: any) => {
  if (!categoryEn) return "bg-conime-600";
  const name = typeof categoryEn === 'string' ? categoryEn : (categoryEn.en || categoryEn.id || "");
  const upper = name.toUpperCase();
  if (upper === "NEWS" || upper === "BERITA") return "bg-conime-500";
  if (upper === "OPINION" || upper === "OPINI") return "bg-emerald-500";
  if (upper === "REVIEWS" || upper === "ULASAN") return "bg-blue-500";
  if (upper.includes("ANIME")) return "bg-blue-600";
  if (upper.includes("KOMIK") || upper.includes("COMIC"))
    return "bg-emerald-600";
  if (upper.includes("GAME")) return "bg-violet-600";
  if (upper.includes("FILM") || upper.includes("MOVIE")) return "bg-amber-600";
  return "bg-conime-600";
};

export const LOGO_SVG = (className: string = "h-8 w-auto") => (
  <svg
    className={className}
    viewBox="0 0 557 118"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M107.847 2.85718C115.954 2.85718 120.692 11.9985 116.017 18.6228L86.8191 59.9998H22.1526C14.0451 59.9998 9.30763 50.8585 13.982 44.2342L40.1914 7.09165C42.0651 4.43637 45.1122 2.85718 48.362 2.85718H107.847Z"
      fill="#CF012B"
    />
    <path
      d="M138.171 115.142C146.278 115.142 151.016 106.001 146.341 99.3767L120.729 63.081C118.481 59.8947 114.824 57.9998 110.924 57.9998H22.1529C14.0454 57.9998 9.30786 67.1411 13.9823 73.7654L40.1924 110.908C42.0661 113.563 45.1132 115.142 48.3629 115.142H138.171Z"
      fill="#FF1545"
    />
    <path
      d="M215.454 98.5997C211.861 98.5997 208.231 98.0864 204.564 97.0597C200.897 95.9597 197.377 94.3464 194.004 92.2197C190.631 90.0197 187.624 87.343 184.984 84.1897C182.417 80.963 180.364 77.2597 178.824 73.0797C177.284 68.8264 176.514 64.133 176.514 58.9997C176.514 53.9397 177.284 49.393 178.824 45.3597C180.364 41.253 182.417 37.6597 184.984 34.5797C187.624 31.4997 190.594 28.933 193.894 26.8797C197.267 24.8264 200.787 23.2864 204.454 22.2597C208.194 21.1597 211.897 20.573 215.564 20.4997C219.304 20.4997 222.531 20.903 225.244 21.7097C227.957 22.5164 230.157 23.3964 231.844 24.3497C233.531 25.2297 234.667 25.853 235.254 26.2197C236.427 26.953 237.527 27.7964 238.554 28.7497C239.654 29.6297 240.241 30.7297 240.314 32.0497C240.387 32.9297 240.277 33.7364 239.984 34.4697C239.691 35.1297 239.287 35.8264 238.774 36.5597C237.894 37.8064 237.014 38.723 236.134 39.3097C235.254 39.8964 234.374 40.1897 233.494 40.1897C232.687 40.1897 231.917 39.9697 231.184 39.5297C230.524 39.0897 229.681 38.5397 228.654 37.8797C228.214 37.5863 227.407 37.1464 226.234 36.5597C225.134 35.8997 223.631 35.313 221.724 34.7997C219.891 34.2864 217.654 34.0297 215.014 34.0297C211.861 34.0297 208.781 34.5797 205.774 35.6797C202.767 36.7797 200.054 38.4297 197.634 40.6297C195.287 42.7564 193.417 45.433 192.024 48.6597C190.631 51.813 189.934 55.443 189.934 59.5497C189.934 63.6564 190.631 67.323 192.024 70.5497C193.417 73.703 195.287 76.3797 197.634 78.5797C200.054 80.7064 202.767 82.3197 205.774 83.4197C208.781 84.5197 211.861 85.0697 215.014 85.0697C217.507 85.0697 219.634 84.8497 221.394 84.4097C223.227 83.8964 224.767 83.3097 226.014 82.6497C227.334 81.9164 228.324 81.3664 228.984 80.9997C229.791 80.4864 230.561 80.0097 231.294 79.5697C232.027 79.1297 232.797 78.9097 233.604 78.9097C234.484 78.9097 235.327 79.203 236.134 79.7897C237.014 80.3764 237.857 81.3297 238.664 82.6497C239.177 83.4564 239.581 84.2264 239.874 84.9597C240.167 85.693 240.277 86.463 240.204 87.2697C240.131 88.5897 239.544 89.7264 238.444 90.6797C237.417 91.5597 236.317 92.3297 235.144 92.9897C234.557 93.3564 233.421 94.0164 231.734 94.9697C230.121 95.8497 227.957 96.6564 225.244 97.3897C222.531 98.1964 219.267 98.5997 215.454 98.5997Z"
      fill="currentColor"
    />
    <path
      d="M275.434 98.8197C271.914 98.8197 268.468 98.1597 265.094 96.8397C261.794 95.4464 258.788 93.503 256.074 91.0097C253.434 88.5164 251.308 85.583 249.694 82.2097C248.154 78.8364 247.384 75.133 247.384 71.0997C247.384 67.213 248.118 63.583 249.584 60.2097C251.051 56.8364 253.068 53.8664 255.634 51.2997C258.201 48.733 261.134 46.753 264.434 45.3597C267.808 43.893 271.401 43.1597 275.214 43.1597C280.348 43.1597 285.004 44.4064 289.184 46.8997C293.364 49.3197 296.701 52.6197 299.194 56.7997C301.688 60.9797 302.934 65.7097 302.934 70.9897C302.934 75.1697 302.164 78.983 300.624 82.4297C299.084 85.803 296.994 88.7364 294.354 91.2297C291.714 93.6497 288.744 95.5197 285.444 96.8397C282.218 98.1597 278.881 98.8197 275.434 98.8197ZM275.214 85.8397C277.634 85.8397 279.944 85.253 282.144 84.0797C284.418 82.833 286.251 81.073 287.644 78.7997C289.111 76.5264 289.844 73.8497 289.844 70.7697C289.844 67.9097 289.184 65.3797 287.864 63.1797C286.618 60.9797 284.894 59.2564 282.694 58.0097C280.494 56.763 277.964 56.1397 275.104 56.1397C272.391 56.1397 269.934 56.7997 267.734 58.1197C265.534 59.3664 263.774 61.1264 262.454 63.3997C261.208 65.5997 260.584 68.093 260.584 70.8797C260.584 73.9597 261.281 76.6364 262.674 78.9097C264.068 81.1097 265.864 82.833 268.064 84.0797C270.338 85.253 272.721 85.8397 275.214 85.8397Z"
      fill="currentColor"
    />
    <path
      d="M318.18 98.0497C316.2 98.0497 314.733 97.7197 313.78 97.0597C312.9 96.473 312.313 95.6664 312.02 94.6397C311.8 93.613 311.69 92.513 311.69 91.3397V27.5397C311.69 26.4397 311.836 25.413 312.13 24.4597C312.423 23.5064 313.046 22.7363 314 22.1497C315.026 21.563 316.53 21.2697 318.51 21.2697C320.71 21.2697 322.213 21.5264 323.020 22.0397C323.9 22.4797 324.706 23.1397 325.440 24.0197L362.18 75.3897V27.5397C362.18 26.4397 362.326 25.413 362.620 24.4597C362.913 23.5064 363.536 22.7363 364.490 22.1497C365.443 21.563 366.910 21.2697 368.890 21.2697C370.943 21.2697 372.410 21.5997 373.290 22.2597C374.243 22.8464 374.830 23.653 375.050 24.6797C375.343 25.7063 375.490 26.843 375.490 28.0897V91.4497C375.490 92.623 375.306 93.723 374.940 94.7497C374.646 95.703 373.986 96.473 372.960 97.0597C372.006 97.7197 370.503 98.0497 368.450 98.0497C366.836 98.0497 365.553 97.903 364.600 97.6097C363.720 97.3164 362.913 96.693 362.180 95.7397L324.890 44.4797V91.4497C324.890 92.623 324.743 93.723 324.450 94.7497C324.230 95.703 323.643 96.473 322.690 97.0597C321.736 97.7197 320.233 98.0497 318.180 98.0497Z"
      fill="currentColor"
    />
    <path
      d="M395.104 98.1597C393.124 98.1597 391.657 97.8297 390.704 97.1697C389.751 96.583 389.164 95.813 388.944 94.8597C388.724 93.833 388.614 92.6964 388.614 91.4497V50.5297C388.614 49.3564 388.724 48.293 388.944 47.3397C389.237 46.313 389.824 45.5064 390.704 44.9197C391.657 44.333 393.161 44.0397 395.214 44.0397C397.267 44.0397 398.734 44.333 399.614 44.9197C400.567 45.5064 401.154 46.313 401.374 47.3397C401.594 48.3664 401.704 49.503 401.704 50.7497V91.5597C401.704 92.8064 401.594 93.943 401.374 94.9697C401.154 95.923 400.567 96.693 399.614 97.2797C398.734 97.8664 397.231 98.1597 395.104 98.1597ZM395.104 33.3697C392.977 33.3697 391.401 33.0764 390.374 32.4897C389.421 31.8297 388.797 30.9497 388.504 29.8497C388.284 28.7497 388.174 27.5397 388.174 26.2197C388.174 24.8263 388.284 23.6163 388.504 22.5897C388.797 21.563 389.457 20.7563 390.484 20.1697C391.511 19.5097 393.087 19.1797 395.214 19.1797C397.414 19.1797 398.991 19.5097 399.944 20.1697C400.897 20.8297 401.521 21.7097 401.814 22.8097C402.107 23.8364 402.254 25.0464 402.254 26.4397C402.254 27.6864 402.107 28.8597 401.814 29.9597C401.521 31.0597 400.897 31.903 399.944 32.4897C398.991 33.0764 397.377 33.3697 395.104 33.3697Z"
      fill="currentColor"
    />
    <path
      d="M420.118 98.0497C418.138 98.0497 416.671 97.7564 415.718 97.1697C414.838 96.583 414.288 95.7764 414.068 94.7497C413.848 93.723 413.738 92.623 413.738 91.4497V50.3097C413.738 49.1364 413.848 48.073 414.068 47.1197C414.288 46.1664 414.874 45.3964 415.828 44.8097C416.781 44.223 418.284 43.9297 420.338 43.9297C422.464 43.9297 424.004 44.3697 424.958 45.2497C425.984 46.1297 426.498 47.523 426.498 49.4297L425.508 52.5097C425.874 51.703 426.498 50.823 427.378 49.8697C428.258 48.9164 429.321 47.963 430.568 47.0097C431.888 46.0564 433.354 45.2864 434.968 44.6997C436.581 44.113 438.268 43.8197 440.028 43.8197C442.448 43.8197 444.648 44.223 446.628 45.0297C448.681 45.8364 450.478 47.0097 452.018 48.5497C453.631 50.0897 455.024 51.9597 456.198 54.1597C457.444 52.253 458.838 50.5297 460.378 48.9897C461.918 47.3764 463.714 46.1297 465.768 45.2497C467.821 44.2964 470.131 43.8197 472.698 43.8197C476.951 43.8197 480.508 44.883 483.368 47.0097C486.301 49.1364 488.501 52.1797 489.968 56.1397C491.508 60.0264 492.278 64.683 492.278 70.1097V91.4497C492.278 92.6964 492.131 93.833 491.838 94.8597C491.618 95.813 491.031 96.583 490.078 97.1697C489.198 97.7564 487.731 98.0497 485.678 98.0497C483.624 98.0497 482.121 97.7197 481.168 97.0597C480.214 96.473 479.628 95.703 479.408 94.7497C479.188 93.723 479.078 92.5864 479.078 91.3397V69.9997C479.078 67.2864 478.748 64.9397 478.088 62.9597C477.428 60.9797 476.438 59.4397 475.118 58.3397C473.871 57.2397 472.221 56.6897 470.168 56.6897C467.968 56.6897 466.061 57.2397 464.448 58.3397C462.908 59.3664 461.698 60.8697 460.818 62.8497C459.938 64.8297 459.498 67.2497 459.498 70.1097V91.5597C459.498 92.8064 459.314 93.9797 458.948 95.0797C458.581 96.1064 457.848 96.8764 456.748 97.3897C455.721 97.9764 454.218 98.1964 452.238 98.0497C450.404 97.9764 449.048 97.6097 448.168 96.9497C447.361 96.2897 446.848 95.483 446.628 94.5297C446.481 93.503 446.408 92.4397 446.408 91.3397V69.9997C446.408 67.2864 446.078 64.9397 445.418 62.9597C444.758 60.9064 443.768 59.3664 442.448 58.3397C441.201 57.2397 439.514 56.6897 437.388 56.6897C435.114 56.6897 433.171 57.2764 431.558 58.4497C430.018 59.623 428.844 61.1997 428.038 63.1797C427.231 65.1597 426.828 67.433 426.828 69.9997V91.5597C426.828 92.733 426.681 93.833 426.388 94.8597C426.168 95.8864 425.581 96.6564 424.628 97.1697C423.748 97.7564 422.244 98.0497 420.118 98.0497Z"
      fill="currentColor"
    />
    <path
      d="M529.508 98.8197C524.741 98.8197 520.561 98.0497 516.968 96.5097C513.448 94.9697 510.478 92.8797 508.058 90.2397C505.711 87.5264 503.914 84.5197 502.668 81.2197C501.494 77.8464 500.908 74.363 500.908 70.7697C500.908 65.4897 502.118 60.7964 504.538 56.6897C506.958 52.583 510.294 49.3564 514.548 47.0097C518.874 44.663 523.824 43.4897 529.398 43.4897C533.358 43.4897 536.841 44.113 539.848 45.3597C542.854 46.6064 545.348 48.2564 547.328 50.3097C549.381 52.2897 550.921 54.4897 551.948 56.9097C553.048 59.3297 553.598 61.6764 553.598 63.9497C553.598 67.8364 552.644 70.6597 550.738 72.4197C548.904 74.1797 546.594 75.0597 543.808 75.0597H514.768C514.841 77.553 515.611 79.7164 517.078 81.5497C518.618 83.383 520.524 84.813 522.798 85.8397C525.144 86.793 527.528 87.2697 529.948 87.2697C531.781 87.2697 533.394 87.1597 534.788 86.9397C536.254 86.7197 537.501 86.463 538.528 86.1697C539.554 85.803 540.434 85.4364 541.168 85.0697C541.974 84.703 542.708 84.373 543.368 84.0797C544.028 83.7864 544.651 83.603 545.238 83.5297C546.044 83.4564 546.851 83.6397 547.658 84.0797C548.464 84.5197 549.124 85.2897 549.638 86.3897C550.078 87.123 550.371 87.8197 550.518 88.4797C550.738 89.0664 550.848 89.653 550.848 90.2397C550.848 91.7064 549.968 93.0997 548.208 94.4197C546.448 95.6664 543.954 96.693 540.728 97.4997C537.574 98.3797 533.834 98.8197 529.508 98.8197ZM514.768 67.2497H537.318C538.564 67.2497 539.518 67.0664 540.178 66.6997C540.838 66.2597 541.168 65.3797 541.168 64.0597C541.168 62.373 540.654 60.8697 539.628 59.5497C538.601 58.1564 537.208 57.093 535.448 56.3597C533.688 55.553 531.634 55.1497 529.288 55.1497C526.574 55.1497 524.118 55.6997 521.918 56.7997C519.718 57.8264 517.958 59.2564 516.638 61.0897C515.391 62.923 514.768 64.9764 514.768 67.2497Z"
      fill="currentColor"
    />
  </svg>
);

export const TIKTOK_ICON_SVG = (className: string = "w-5 h-5") => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const LOGO_MARK_SVG = (className: string = "w-10 h-10") => (
  <svg
    className={className}
    viewBox="0 0 140 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M94.6558 20C101.876 20 106.095 28.1412 101.932 34.0407L75.9289 70.8906H18.3376C11.1172 70.8906 6.89803 62.7495 11.061 56.85L34.4028 23.7712C36.0715 21.4064 38.7852 20 41.6795 20H94.6558Z"
      fill="#CF012B"
    />
    <path
      d="M121.662 120C128.883 120 133.102 111.859 128.939 105.959L106.129 73.6347C104.126 70.797 100.87 69.1094 97.3968 69.1094H18.3379C11.1174 69.1094 6.89823 77.2506 11.0613 83.1501L34.4037 116.229C36.0724 118.594 38.7861 120 41.6803 120H121.662Z"
      fill="#FF1545"
    />
  </svg>
);

export const CATEGORIES: CategoryCount[] = [
  {name: {id: "Anime", en: "Anime"}, count: 0},
  {name: {id: "Komik", en: "Comics"}, count: 0},
  {name: {id: "Game", en: "Games"}, count: 0},
  {name: {id: "Film", en: "Movies"}, count: 0},
  {name: {id: "Opini", en: "Opinion"}, count: 0},
  {name: {id: "Ulasan", en: "Reviews"}, count: 0}
];
