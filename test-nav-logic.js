
const MOCK_NEWS = [
  {
    id: "1",
    category: {id: "Berita", en: "News"},
    subCategory: {id: "Anime", en: "Anime"},
    title: {id: "Test News Anime", en: "Test News Anime"}
  },
  {
    id: "2",
    category: {id: "Ulasan", en: "Reviews"},
    subCategory: {id: "Komik", en: "Comics"},
    title: {id: "Test Review Comic", en: "Test Review Comic"}
  }
];

const getLocalized = (data, language) => {
    if (!data) return '';
    if (typeof data === 'string') return data;
    if (typeof data === 'object') return data[language] || data['id'] || data['en'] || '';
    return '';
};

const getArticleLink = (item) => {
  const catEn = getLocalized(item.category, 'en').toUpperCase();
  const subCatEn = getLocalized(item.subCategory, 'en').toLowerCase();
  
  if (catEn === 'OPINION' || catEn === 'OPINI') {
    return `/opinion/${item.id}`;
  }
  
  if (catEn === 'REVIEWS' || catEn === 'REVIEW' || catEn === 'ULASAN') {
    return `/reviews/${item.id}`;
  }
  
  return `/news/${subCatEn}/${item.id}`;
};

const getSectionLink = (categoryName) => {
    const lower = categoryName.toLowerCase();
    const map = {
        'anime': '/news/anime',
        'komik': '/news/comics',
        'comics': '/news/comics', // Map 'komik' -> 'news/comics'
        'film': '/news/movies',
        'movie': '/news/movies',
        'movies': '/news/movies',
        'game': '/news/games',
        'games': '/news/games'
    };
    if (map[lower]) return map[lower];
    return `/category/${lower}`;
};

const checkActive = (currentPath, navItem) => {
    const navPath = getSectionLink(navItem);
    const result = currentPath.startsWith(navPath);
    console.log(`Nav Item: ${navItem} (Expect: ${navPath}) | Current: ${currentPath} | Active? ${result}`);
}

// SIMULATION
console.log("--- Item 1: News Anime ---");
const link1 = getArticleLink(MOCK_NEWS[0]);
console.log(`Generated Link: ${link1}`);
checkActive(link1, "Anime");

console.log("\n--- Item 2: Review Comic ---");
const link2 = getArticleLink(MOCK_NEWS[1]);
console.log(`Generated Link: ${link2}`);
checkActive(link2, "Comics");
checkActive(link2, "Reviews");
