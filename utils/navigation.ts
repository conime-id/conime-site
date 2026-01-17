import { NewsItem } from '../types';
import { getLocalized } from './localization';

/**
 * Returns the correct URL path for an article based on its category.
 * - Opinion articles: /opinion/:id
 * - Review articles: /reviews/:id
 * - News articles: /news/:subCategory/:id
 */
export const getArticleLink = (item: NewsItem) => {
  const catEn = getLocalized(item.category, 'en').toUpperCase().trim();
  const subCatEn = getLocalized(item.subCategory, 'en').toLowerCase().trim();
  
  if (catEn === 'OPINION' || catEn === 'OPINI') {
    return `/opinion/${item.id}`;
  }
  
  if (catEn === 'REVIEWS' || catEn === 'REVIEW' || catEn === 'ULASAN') {
    return `/reviews/${item.id}`;
  }
  
  // Default to News with subcategory nesting
  return `/news/${subCatEn}/${item.id}`;
};

/**
 * Returns the correct URL path for a category or section link.
 * - Core Sections: /news, /opinion, /reviews
 * - Header Nav: Can map to specific /news/:subCategory
 * - Generic Labels: /category/:name
 */
export const getSectionLink = (categoryName: string, isHeaderNav: boolean = false) => {
  const lower = categoryName.toLowerCase();
  
  // Core Sections (Always top-level)
  if (['berita', 'news'].includes(lower)) return '/news';
  if (['opini', 'opinion'].includes(lower)) return '/opinion';
  if (['ulasan', 'reviews', 'review'].includes(lower)) return '/reviews';
  if (['beranda', 'home'].includes(lower)) return '/';
  
  // Header Nav (Specific Verticals)
  if (isHeaderNav) {
    const map: {[key: string]: string} = {
        'anime': '/news/anime',
        'komik': '/news/comics',
        'comics': '/news/comics',
        'film': '/news/movies',
        'movie': '/news/movies',
        'movies': '/news/movies',
        'game': '/news/games',
        'games': '/news/games'
    };
    if (map[lower]) return map[lower];
  }

  // Static Pages Mapping
  const staticMap: {[key: string]: string} = {
    'about us': '/about',
    'tentang kami': '/about',
    'contact us': '/contact',
    'kontak kami': '/contact',
    'hubungi kami': '/contact',
    'privacy policy': '/privacy',
    'kebijakan privasi': '/privacy',
    'terms & conditions': '/terms',
    'syarat & ketentuan': '/terms',
    'disclaimer': '/disclaimer',
    'sanggahan': '/disclaimer',
    'dmca notice': '/dmca',
    'pemberitahuan dmca': '/dmca',
    'dmca': '/dmca',
    'faq': '/faq'
  };
  
  // Everything else is a Broad Category or explicit mapping check
  const checkStatic = staticMap[lower];
  if (checkStatic) return checkStatic;

  // Everything else is a Broad Category
  return `/category/${lower}`;
};
