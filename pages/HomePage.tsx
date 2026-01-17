
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, useParams, Link } from "react-router-dom";
import Hero from "../components/Hero";
import NewsCard from "../components/NewsCard";
import Sidebar from "../components/Sidebar";
import TrendingSection from "../components/TrendingSection";
import { TRANSLATIONS } from "../constants";
import { NewsItem } from "../types";
import { getLocalized } from "../utils/localization";
import { getArticleLink, getSectionLink } from "../utils/navigation";
import { 
  ChevronDown, 
  Search, 
  Check, 
  Bookmark, 
  Eye, 
  Play, 
  Menu, X, Globe, Sun, Moon,
  ArrowRight,
  TrendingUp,
  FileX,
  LayoutGrid, // Restored
  List,       // Restored
  ArrowDown   // Restored
} from 'lucide-react';

interface HomePageProps {
  language: "id" | "en";
  theme: "light" | "dark";
  activeNav?: string; 
  section?: "news" | "opinion" | "reviews";
  subCategory?: string;
  history: any[];
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  viewCounts: {[key: string]: number};
  onSaveSearch?: (query: string) => void;
  articles: NewsItem[];
  isLoadingContent?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  language, 
  theme,
  section,
  subCategory,
  history, 
  bookmarks, 
  toggleBookmark,
  viewCounts,
  onSaveSearch,
  articles,
  isLoadingContent
}) => {
  const navigate = useNavigate();
  const { category: urlCategoryFromParams, tag: urlTagFromParams } = useParams(); // /category/:category (Legacy) & /topic/:tag
  const [searchParams, setSearchParams] = useSearchParams();
  
  // The user's provided diff redefines urlCategory and urlTag from searchParams,
  // effectively ignoring useParams for these.
  // It also redefines searchQuery.
  // I'm applying the diff faithfully as provided, which means these variables
  // will now primarily come from search parameters if present.
  const urlCategory = searchParams.get("category") || urlCategoryFromParams;
  const urlTag = searchParams.get("tag") || urlTagFromParams;
  const searchQuery = searchParams.get("q") || "";
  const selectedTag = searchParams.get("tag"); // This seems redundant if urlTag is also from searchParams.get("tag")
  const showBookmarks = searchParams.get("filter") === "bookmarks"; 

  useEffect(() => {
    console.log("📍 HomePage Mounted/Remounted", { section, subCategory });
    return () => console.log("🗑️ HomePage Unmounted");
  }, [section, subCategory]);

  const [activeFilter, setActiveFilter] = useState("latest");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const ITEMS_PER_PAGE = 4;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language];

  // Reset pagination on change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [section, subCategory, urlCategory, searchQuery, selectedTag, activeFilter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Data Source
  const allFilteredNews = useMemo(() => {
    let news = articles.map(item => ({
      ...item,
      views: item.views + (viewCounts[item.id] || 0)
    }));

    // 1. Tag Filter (Highest Priority) - from search params
    if (selectedTag) {
      news = news.filter((item) =>
        item.tags?.some((tag) => {
          const tagId = typeof tag === 'string' ? tag : tag.id;
          const tagEn = typeof tag === 'string' ? tag : tag.en;
          return tagId.toLowerCase() === selectedTag.toLowerCase() || 
                 tagEn.toLowerCase() === selectedTag.toLowerCase();
        })
      );
    }

    // 2. Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      news = news.filter((item) => {
        const titleId = getLocalized(item.title, 'id').toLowerCase();
        const titleEn = getLocalized(item.title, 'en').toLowerCase();
        const excerptId = getLocalized(item.excerpt, 'id').toLowerCase();
        const excerptEn = getLocalized(item.excerpt, 'en').toLowerCase();
        return titleId.includes(query) || titleEn.includes(query) || 
               excerptId.includes(query) || excerptEn.includes(query);
      });
      // Allow passing through to other filters for "Search in Category" functionality
    }

    // 3. URL Topic/Tag Filter (from URL path)
    if (urlTag) {
        const target = urlTag.toLowerCase();
        news = news.filter(item => {
            // Check Tags array
            const hasTag = item.tags?.some(
                t => t.id.toLowerCase() === target || t.en.toLowerCase() === target
            );
            // Also check categories just in case
            const catMatch = getLocalized(item.category, 'en').toLowerCase() === target ||
                             getLocalized(item.subCategory, 'en').toLowerCase() === target;
            
            return hasTag || catMatch;
        });
    }

    // 4. Strict Section/Category Filtering
    news = news.filter(item => {
      const itemCatEn = getLocalized(item.category, 'en').toUpperCase();
      const itemSubCatEn = getLocalized(item.subCategory, 'en').toUpperCase();

      // Top-level Sections (STRICT RULES)
      if (section === "opinion") {
        // Must be Opini. Can have other tags, but category field is primary.
        return itemCatEn === "OPINION" || itemCatEn === "OPINI";
      }
      
      if (section === "reviews") {
        // Must be Reviews.
        return itemCatEn === "REVIEWS" || itemCatEn === "REVIEW" || itemCatEn === "ULASAN";
      }

      // News Section (Strictly non-opinion, non-review)
      if (section === "news") {
        // 1. MUST NOT be Opinion or Reviews
        const isOpinionOrReview = itemCatEn === "OPINION" || itemCatEn === "OPINI" || 
                                  itemCatEn === "REVIEWS" || itemCatEn === "REVIEW" || itemCatEn === "ULASAN";
        if (isOpinionOrReview) return false;

        // 2. For subcategories (e.g. /news/anime), it MUST be labeled BERITA/NEWS
        if (subCategory) {
            const isLabeledBerita = itemCatEn === "NEWS" || itemCatEn === "BERITA";
            if (!isLabeledBerita) return false;

            const target = subCategory.toUpperCase();
            // Robust match: Exact, Plural, or Category field fallback
            const subMatch = itemSubCatEn === target || 
                            itemSubCatEn === target + 'S' || 
                            itemSubCatEn === target.replace(/S$/, '') ||
                            (target === 'COMICS' && itemSubCatEn === 'COMIC') ||
                            (target === 'GAME' && itemSubCatEn === 'GAMES');

            return subMatch || itemCatEn === target; 
        }

        // Just /news -> Show all News items (already excluded Opinion/Review)
        return true; 
      }

      // Legacy Route /category/:category
      if (urlCategory) {
        const target = urlCategory.toUpperCase();
        if (target === "OPINION") return itemCatEn === "OPINION";
        if (target === "REVIEWS") return itemCatEn === "REVIEWS";
        
        // Generic match
         const itemCatId = getLocalized(item.category, 'id').toUpperCase();
         const itemSubCatId = getLocalized(item.subCategory, 'id').toUpperCase();
         return itemCatEn === target || itemCatId === target || itemSubCatEn === target || itemSubCatId === target;
      }

      return true;
    });

    // 5. Bookmark Filter
    if (activeFilter === "bookmarks" || showBookmarks) {
      news = news.filter((item) => bookmarks.includes(item.id));
    }

    // 6. Sorting
    if (activeFilter === "oldest") {
      news.sort((a, b) => a.id.localeCompare(b.id));
    } else if (activeFilter === "popular") {
      news.sort((a, b) => b.views - a.views);
    } else {
      news.sort((a, b) => b.id.localeCompare(a.id));
    }

    return news;
  }, [articles, section, subCategory, urlCategory, urlTag, searchQuery, selectedTag, activeFilter, showBookmarks, bookmarks, viewCounts]);

  const visibleNews = useMemo(() => {
    return allFilteredNews.slice(0, visibleCount);
  }, [allFilteredNews, visibleCount]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 400);
  };

  const handleArticleClick = (id: string) => {
    const article = articles.find(n => n.id === id);
    if (!article) {
        navigate(`/news/${id}`); // Fallback
        return;
    }
    if (searchQuery.trim() && onSaveSearch) {
        onSaveSearch(searchQuery);
    }
    navigate(getArticleLink(article));
  };

  // Is it strictly the home page?
  const isHome = !section && !urlCategory && !selectedTag && !searchQuery && !showBookmarks && !urlTag;

  // Determine Page Title
  const getPageTitle = () => {
    // Helper to localize common slugs
    const localizeSlug = (slug: string) => {
      const upper = slug.replace(/-/g, ' ').toUpperCase(); // Handle hyphens
      if (language === 'id') {
        if (upper === 'COMICS' || upper === 'COMIC') return 'KOMIK';
        if (upper === 'MOVIES' || upper === 'MOVIE' || upper === 'FILMS' || upper === 'FILM') return 'FILM';
        if (upper === 'GAMES' || upper === 'GAME') return 'GAME';
        if (upper === 'ANIME') return 'ANIME';
      }
      return upper;
    };

    if (searchQuery) return searchQuery.toUpperCase(); 
    
    // Tag Handling
    const currentTag = urlTag || selectedTag;
    if (currentTag) {
        return (language === 'id' ? 'TOPIK: #' : 'TOPIC: #') + localizeSlug(currentTag);
    }
    
    // Sections
    if (section === "opinion") return language === "id" ? "OPINI" : "OPINION";
    if (section === "reviews") return language === "id" ? "ULASAN" : "REVIEWS";
    
    // News Section with Subcategory
    if (section === "news") {
      if (subCategory) return localizeSlug(subCategory);
      return language === "id" ? "BERITA" : "NEWS";
    }
    
    // Broad Category Route
    if (urlCategory) return localizeSlug(urlCategory);
    
    if (activeFilter === "bookmarks" || showBookmarks) {
        return language === "id" ? "KOLEKSI TERSIMPAN" : "SAVED COLLECTION";
    }

    return language === "id" ? "BERITA TERBARU" : "LATEST NEWS";
  };

  // Sync Document Title
  useEffect(() => {
    const title = getPageTitle();
    // For Home, maybe just "CoNime.id"? Or "Berita Terbaru | CoNime.id"
    if (isHome) {
        document.title = `CoNime.id | ${language === 'id' ? 'Portal Budaya Pop Visual' : 'Visual Pop Culture Portal'}`;
    } else {
        document.title = `${title} | CoNime.id`;
    }
  }, [language, section, subCategory, urlCategory, urlTag, selectedTag, searchQuery, isHome]);
    const handleCategoryNavigation = (cat: string) => {
      if (searchQuery.trim() && onSaveSearch) {
          onSaveSearch(searchQuery);
      }
      navigate(getSectionLink(cat));
    };

  const currentFilterLabel = useMemo(() => {
      const options = [
        {id: "latest", label: language === "id" ? "TERBARU" : "LATEST"},
        {id: "oldest", label: language === "id" ? "TERLAMA" : "OLDEST"},
        {id: "popular", label: language === "id" ? "POPULER" : "POPULAR"},
        {id: "bookmarks", label: language === "id" ? "TERSIMPAN" : "SAVED"},
      ];
    return options.find((opt) => opt.id === activeFilter)?.label || "";
  }, [activeFilter, language]);
  
  return (
    <>
      {isHome && (
        <Hero
          language={language}
          articles={articles}
          onArticleClick={handleArticleClick}
          onCategoryClick={handleCategoryNavigation}
        />
      )}
      <div className={`mt-12 flex flex-col lg:flex-row gap-12 text-left`}>
        <div className="lg:w-3/4">
             {/* Header Section */}
            {isHome ? (
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-black text-cogray-900 dark:text-white tracking-tighter uppercase flex items-center gap-3">
                    {t.latestNews}
                  </h2>
                  {allFilteredNews.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-conime-600 font-black text-sm">
                        {allFilteredNews.length}
                      </span>
                      <span className="text-[10px] font-bold text-cogray-400 dark:text-cogray-600 uppercase tracking-widest">
                        {t.articlesFound}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* New Category Page Header Design */
              <div className="mb-12 animate-in slide-in-from-bottom-4 duration-700">
                <div className="text-left space-y-4">
                  <nav className="flex items-center gap-2 mb-6 text-[10px] font-black text-cogray-400 uppercase tracking-[0.2em] relative z-20 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
                    <Link to="/" className="text-cogray-300 dark:text-cogray-600 hover:text-conime-600 transition-colors flex-shrink-0">CONIME.ID</Link>
                    <span className="text-cogray-200 dark:text-cogray-800 flex-shrink-0">/</span>
                    
                    {selectedTag && (
                        <>
                            <span className="text-cogray-300 dark:text-cogray-500 whitespace-nowrap">
                                {language === "id" ? "TOPIK" : "TOPIC"}
                            </span>
                            <span className="text-cogray-200 dark:text-cogray-800 flex-shrink-0">/</span>
                        </>
                    )}

                    {(urlCategory || section) && (
                        <>
                            <Link 
                                to={getSectionLink(section || urlCategory || 'news')}
                                className="text-cogray-300 dark:text-cogray-500 hover:text-conime-600 transition-colors whitespace-nowrap"
                            >
                                {section 
                                    ? (language === 'id' ? (section === 'opinion' ? 'OPINI' : section === 'reviews' ? 'ULASAN' : 'BERITA') : section.toUpperCase())
                                    : (language === 'id' ? 'KATEGORI' : 'CATEGORY')
                                }
                            </Link>
                            <span className="text-cogray-200 dark:text-cogray-800 flex-shrink-0">/</span>
                        </>
                    )}

                    <span className="text-cogray-400 uppercase flex-shrink-0">{getPageTitle()}</span>
                  </nav>
                  
                  <div className="flex items-center gap-5">
                    <div className="w-2 h-10 md:h-16 bg-conime-600 rounded-full shadow-lg shadow-conime-600/20"></div>
                    <h1 className="text-4xl md:text-7xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter leading-none">
                      {getPageTitle()}
                    </h1>
                  </div>
                </div>
                
                <div className="h-[1px] w-full bg-cogray-100 dark:bg-cogray-900 mt-8"></div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-12 mb-8 gap-4">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black text-cogray-900 dark:text-white tracking-tighter uppercase flex items-center gap-3">
                      {t.latestNews}
                    </h2>
                    {allFilteredNews.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-conime-600 font-black text-sm">{allFilteredNews.length}</span>
                        <span className="text-[10px] font-bold text-cogray-400 dark:text-cogray-600 uppercase tracking-widest">
                          {t.articlesFound}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

             {/* Filter & View Toggle Bar */}
            <div className="bg-cogray-50/50 dark:bg-cogray-900/40 border border-cogray-100 dark:border-cogray-800 rounded-[32px] p-3 mb-10 flex flex-col md:flex-row items-center gap-4 relative z-20 shadow-sm">
              <div className="flex relative flex-grow w-full items-center md:w-auto">
                <Search className="w-5 h-5 absolute left-3 transition-colors text-cogray-400" />
                <input
                  placeholder={
                    isHome
                      ? t.searchPlaceholder
                      : `${t.searchPlaceholder} (${
                          selectedTag || subCategory || section || urlCategory || "News"
                        })`
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchParams({ q: e.target.value })}
                  className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-sm font-bold text-cogray-700 dark:text-cogray-100 placeholder:text-cogray-400 dark:placeholder:text-cogray-700 outline-none uppercase tracking-tight"
                  type="text"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-grow" ref={filterRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`w-full flex items-center justify-between gap-4 bg-white dark:bg-cogray-950/50 border rounded-2xl px-6 py-4 transition-all shadow-sm ${
                      isFilterOpen
                        ? "border-conime-600 ring-2 ring-conime-600/10"
                        : "border-cogray-200 dark:border-cogray-800 hover:border-conime-600"
                    }`}
                  >
                    <span className="text-[11px] font-black text-cogray-800 dark:text-white uppercase tracking-widest">
                      {currentFilterLabel}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-cogray-400 transition-transform duration-300 ${
                        isFilterOpen ? "rotate-180 text-conime-600" : ""
                      }`}
                    />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-3 w-full min-w-[200px] bg-white dark:bg-cogray-950 border border-cogray-200 dark:border-cogray-800 rounded-[24px] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-2">
                        {[
                            {id: "latest", label: language === "id" ? "TERBARU" : "LATEST"},
                            {id: "oldest", label: language === "id" ? "TERLAMA" : "OLDEST"},
                            {id: "popular", label: language === "id" ? "POPULER" : "POPULAR"},
                            {id: "bookmarks", label: language === "id" ? "TERSIMPAN" : "SAVED"},
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setActiveFilter(opt.id);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-5 py-3.5 text-[11px] font-black uppercase transition-all rounded-xl mb-1 last:mb-0 ${
                              activeFilter === opt.id
                                ? "bg-conime-50 dark:bg-conime-900 dark:bg-opacity-30 text-conime-600"
                                : "text-cogray-500 hover:bg-cogray-50 dark:hover:bg-cogray-900 hover:text-cogray-900 dark:hover:text-white"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {activeFilter === opt.id && (
                                <Check className="w-4 h-4" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex bg-white dark:bg-cogray-950/50 border border-cogray-200 dark:border-cogray-800 p-1.5 rounded-2xl shadow-sm">
                  <button
                    onClick={() => setViewType("grid")}
                    className={`p-3 rounded-xl transition-all ${
                      viewType === "grid"
                        ? "bg-conime-600 text-white shadow-xl shadow-conime-600/30 scale-105"
                        : "text-cogray-400 hover:text-cogray-600 dark:hover:text-cogray-200"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewType("list")}
                    className={`p-3 rounded-xl transition-all ${
                      viewType === "list"
                        ? "bg-conime-600 text-white shadow-xl shadow-conime-600/30 scale-105"
                        : "text-cogray-400 hover:text-cogray-600 dark:hover:text-cogray-200"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* News List */}
            {visibleNews.length > 0 ? (
              <>
                <div
                  className={`grid gap-10 ${
                    viewType === "grid"
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1"
                  }`}
                >
                  {visibleNews.map((item) => (
                    <NewsCard
                      key={item.id}
                      item={item}
                      language={language}
                      onClick={() => handleArticleClick(item.id)}
                      onCategoryClick={(cat) => handleCategoryNavigation(cat)} 
                      isBookmarked={bookmarks.includes(item.id)}
                      onToggleBookmark={(e) => toggleBookmark(item.id, e)}
                    />
                  ))}
                </div>

                {allFilteredNews.length > visibleCount && (
                  <div className="mt-16 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="group relative flex items-center justify-center gap-3 bg-white dark:bg-cogray-900 border-2 border-conime-600 text-conime-600 font-black px-12 py-5 rounded-[24px] uppercase tracking-[0.2em] text-xs transition-all hover:bg-conime-600 hover:text-white hover:shadow-2xl hover:shadow-conime-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                      {isLoadingMore ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        </div>
                      ) : (
                        <>
                          <span>{t.loadMore}</span>
                          <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-40 flex flex-col items-center justify-center bg-cogray-50/20 dark:bg-cogray-900/10 rounded-[60px] border border-dashed border-cogray-200 dark:border-cogray-800 animate-in fade-in">
                <FileX className="w-20 h-20 text-conime-600 mb-8 opacity-10" />
                <h3 className="text-2xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter mb-3">
                  {activeFilter === "bookmarks"
                    ? (language === "id" ? "Belum Ada Bookmark" : "No Bookmarks Yet")
                    : (language === "id" ? "Konten Tidak Ditemukan" : "Content Not Found")
                  }
                </h3>
                <p className="text-sm text-cogray-500 font-bold uppercase tracking-widest text-center px-4">
                  {activeFilter === "bookmarks"
                    ? (language === "id" ? "Simpan artikel favoritmu untuk dibaca nanti." : "Save your favorite articles to read later.")
                    : (isHome 
                        ? (language === "id" ? "Tidak ada artikel yang cocok." : "No matching articles found.")
                        : (language === "id" ? "Tidak ada artikel yang cocok dengan filter saat ini." : "No articles match the current filter.")
                      )
                  }
                </p>
              </div>
            )}
        </div>

        <div className="lg:w-1/4">
          <Sidebar
            language={language}
            articles={articles}
            onArticleClick={handleArticleClick}
            onCategoryClick={handleCategoryNavigation}
            history={history}
          />
        </div>
      </div>
      
      {isHome && (
        <TrendingSection
            language={language}
            articles={articles}
            onArticleClick={handleArticleClick}
            onCategoryClick={handleCategoryNavigation}
        />
      )}
    </>
  );
};
