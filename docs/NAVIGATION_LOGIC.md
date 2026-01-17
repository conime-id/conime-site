# Logic Navigasi & Active State

Dokumen ini berisi aturan mutlak untuk penentuan active state (tanda menyala) pada menu navigasi Header dan Footer.

## 1. Aturan Kategori Utama (Hierarki)

### A. Kategori "Berita" (News)
Label "Berita" bersifat **Resesif**. Active state ditentukan oleh **Sub-Kategori** (Topik).

*   **Logic**: Jika Label = `Berita` **DAN** [Sub-Kategori]
*   **Implementasi**:
    *   Berita + Anime -> Menu **ANIME** Menyala (`/news/anime/..`)
    *   Berita + Komik -> Menu **KOMIK** Menyala (`/news/comics/..`)
    *   Berita + Game -> Menu **GAME** Menyala (`/news/games/..`)
    *   Berita + Film -> Menu **FILM** Menyala (`/news/movies/..`)

### B. Kategori "Opini" (Opinion)
Label "Opini" bersifat **Dominan**.
*   **Logic**: Jika Label = `Opini`, maka menu **OPINI** menyala.
*   **Constraint**: Opini tidak boleh memiliki label "Berita" atau "Ulasan".
*   **Sub-Kategori**: Meskipun artikel Opini membahas Anime/Komik, yang menyala tetap **OPINI**.
*   **URL**: `/opinion/:id`

### C. Kategori "Ulasan" (Reviews)
Label "Ulasan" bersifat **Dominan**.
*   **Logic**: Jika Label = `Ulasan`, maka menu **ULASAN** menyala.
*   **Constraint**: Ulasan tidak boleh memiliki label "Berita" atau "Opini".
*   **Sub-Kategori**: Meskipun artikel Ulasan membahas Anime/Komik, yang menyala tetap **ULASAN**.
*   **URL**: `/reviews/:id`

## 2. Ringkasan Teknis

| Tipe Artikel | Sub-Kategori | Active Menu | URL Pattern |
| :--- | :--- | :--- | :--- |
| Berita | Anime | **Anime** | `/news/anime/:id` |
| Berita | Komik | **Komik** | `/news/comics/:id` |
| Berita | Game | **Game** | `/news/games/:id` |
| Berita | Film | **Film** | `/news/movies/:id` |
| Opini | (Any) | **Opini** | `/opinion/:id` |
| Ulasan | (Any) | **Ulasan** | `/reviews/:id` |

**Catatan:**
*   Jangan mengubah URL Opini/Ulasan menjadi nested (`/reviews/anime/...`) karena akan memicu menu "Anime" menyala, yang **MELANGGAR** aturan B dan C.
*   Pastikan data artikel selalu memiliki `subCategory` jika tipenya "Berita".
