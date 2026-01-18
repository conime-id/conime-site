import { Routes, Route, Navigate, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {Header} from "./components/Header";
import {AuthModal} from "./components/AuthModal";
import {Footer} from "./components/Footer";
import { TRANSLATIONS } from "./constants";
import { updateMetaTags, injectJSONLD, generateWebSiteSchema } from "./utils/seo";
import { getArticleLink, getSectionLink } from "./utils/navigation";

// Pages
import { HomePage } from "./pages/HomePage";
import { ArticlePage } from "./pages/ArticlePage";
import { ProfilePage } from "./pages/ProfilePage";
import { NotFound } from "./pages/NotFound";
import { getAllArticles } from "./utils/contentLoader";
import { NewsItem } from "./types";

// Static Components (Wrapped for Routes)
import AboutUs from "./components/AboutUs";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Disclaimer from "./components/Disclaimer";
import TermsOfService from "./components/TermsOfService";
import DMCA from "./components/DMCA";
import ContactUs from "./components/ContactUs";
import FAQ from "./components/FAQ";
import AdminUpload from "./components/AdminUpload";

// Wrapper to pass props to static pages that expect onBack
const StaticPageWrapper = ({ Component, language, title }: { Component: any, language: string, title: string }) => {
  useEffect(() => {
    document.title = `${title} | CoNime.id`;
    window.scrollTo(0, 0);
  }, [title]);
  
  return <Component language={language} onBack={() => window.history.back()} />;
};

const App: React.FC = () => {
  // Global State
  const [language, setLanguage] = useState<"id" | "en">((): "id" | "en" => {
    const saved = localStorage.getItem("language");
    if (saved === "id" || saved === "en") return saved;
    return "id";
  });

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "dark";
  });

  // History / Last Read State
  const [history, setHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem("conime_history");
    return saved ? JSON.parse(saved) : [];
  });

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem("conime_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  // Local View Counts State
  const [viewCounts, setViewCounts] = useState<{[key: string]: number}>(() => {
    const saved = localStorage.getItem("conime_views");
    return saved ? JSON.parse(saved) : {};
  });

  // Search History State
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem("conime_search_history");
    return saved ? JSON.parse(saved) : [];
  });

  // Authentication State
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem("conime_user");
    if (saved) {
      const user = JSON.parse(saved);
      if (!user.displayName) user.displayName = user.username;
      return user;
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // --- Dynamic Content State ---
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getAllArticles();
        setArticles(data);
      } catch (error) {
        console.error("Failed to load CMS content:", error);
      } finally {
        setIsContentLoading(false);
      }
    };
    loadContent();
  }, []);

  // Sync Effects
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("conime_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("conime_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("conime_views", JSON.stringify(viewCounts));
  }, [viewCounts]);

  useEffect(() => {
    localStorage.setItem("conime_search_history", JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Global event: Remove Splash Screen on Load
  useEffect(() => {
    // Standard professional practice: clean up the DOM once the React app is ready
    const splash = document.querySelector('.splash-screen');
    if (splash) {
      splash.classList.add('opacity-0');
      setTimeout(() => {
        splash.remove();
        // Force overflow unset on body to ensure navigation isn't locked
        document.body.style.overflow = 'unset';
      }, 500);
    }
  }, []);

  // Scroll detection

  // Scroll to top on navigation
  const location = useLocation();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    console.log("📍 [Router] Location changed:", location.pathname + location.search);
    // Use instant scroll for better UX during navigation, or keep smooth if preferred.
    // However, ensure it only runs once per location change.
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  // SEO
  const t = TRANSLATIONS[language];
  useEffect(() => {
       // Basic SEO override, individual pages should update this.
       // We can leave the "Grid/Home" SEO logic to HomePage
  }, [language]);


  // HANDLERS (Professional Memoization)
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'id' ? 'en' : 'id');
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks(prev => {
      const isAlready = prev.includes(id);
      const newBookmarks = isAlready 
        ? prev.filter(b => b !== id) 
        : [id, ...prev];
      return newBookmarks;
    });
  }, []);

  const addHistory = useCallback((article: any) => {
    setHistory(prev => {
      // Find if already exists and move to top
      const articleId = typeof article === 'string' ? article : article.id;
      const filtered = prev.filter(item => (typeof item === 'string' ? item : item.id) !== articleId);
      return [article, ...filtered].slice(0, 10);
    });
  }, []);

  const addSearchHistory = useCallback((query: string) => {
    if (!query.trim()) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase());
      return [query, ...filtered].slice(0, 10);
    });
  }, []);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const navigate = useNavigate();

  const handleNavigateWithHistory = useCallback((nav: string, isHeader: boolean = false) => {
    const query = searchParams.get('q');
    if (query && query.trim()) {
      addSearchHistory(query);
    }
    navigate(getSectionLink(nav, isHeader));
  }, [searchParams, addSearchHistory, navigate]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem("conime_user");
    navigate("/");
  }, [navigate]);

  const handleLogin = useCallback((user: any) => {
    setCurrentUser(user);
    localStorage.setItem("conime_user", JSON.stringify(user));
    setIsAuthModalOpen(false);
  }, []);

  const handleUpdateUser = useCallback((updated: any) => {
    setCurrentUser(updated);
    localStorage.setItem("conime_user", JSON.stringify(updated));
  }, []);

  const handleDeleteUser = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem("conime_user");
    navigate("/");
  }, [navigate]);

  return (
      <div className="min-h-screen font-sans bg-white dark:bg-cogray-950 transition-colors duration-300 text-left">
        {/* Header needs ActiveNav state. We can pass a dummy for now or let Header derive it using useLocation inside it (after we update Header) */}
        <Header
          onNavChange={(nav) => handleNavigateWithHistory(nav, true)}
          activeNav={location.pathname} 
          theme={theme}
          onToggleTheme={toggleTheme}
          language={language}
          onToggleLanguage={toggleLanguage}
          searchQuery={searchParams.get('q') || ""} 
          onSearchChange={(q) => {
             navigate(`/?q=${q}`, { replace: true });
          }}
          onSearchSubmit={(q) => {
             addSearchHistory(q);
          }}
          currentUser={currentUser}
          onLogout={handleLogout}
          onLoginClick={() => setIsAuthModalOpen(true)}
          onProfileClick={() => navigate("/profile?tab=profile")}
          onSettingsClick={() => navigate("/profile?tab=account")}
          onBookmarksClick={() => navigate("/?filter=bookmarks")}
          searchHistory={searchHistory}
          onClearSearchHistory={clearSearchHistory}
        />

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          language={language}
          onLoginSuccess={handleLogin}
        />

        <main className="container mx-auto px-6 md:px-12 py-8 max-w-7xl pt-24 md:pt-32">
          <Routes>
            {/* ARTICLE ROUTES (Specific first) */}
            <Route path="/news/:subCategory/:id" element={<ArticlePage 
                language={language}
                section="news"
                articles={articles}
                history={history}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                addHistory={addHistory}
                currentUser={currentUser}
                onLoginClick={() => setIsAuthModalOpen(true)}
                isLoading={isContentLoading}
            />} />

            <Route path="/news/:id" element={<ArticlePage 
                language={language}
                section="news"
                articles={articles}
                history={history}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                addHistory={addHistory}
                currentUser={currentUser}
                onLoginClick={() => setIsAuthModalOpen(true)}
                isLoading={isContentLoading}
            />} />

            <Route path="/opinion/:id" element={<ArticlePage 
                language={language}
                section="opinion"
                articles={articles}
                history={history}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                addHistory={addHistory}
                currentUser={currentUser}
                onLoginClick={() => setIsAuthModalOpen(true)}
                isLoading={isContentLoading}
            />} />

            <Route path="/reviews/:id" element={<ArticlePage 
                language={language}
                section="reviews"
                articles={articles}
                history={history}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                addHistory={addHistory}
                currentUser={currentUser}
                onLoginClick={() => setIsAuthModalOpen(true)}
                isLoading={isContentLoading}
            />} />

            {/* HOME & CATEGORY ROUTES */}
            <Route path="/" element={<HomePage 
                key="home-root"
                language={language}
                theme={theme}
                articles={articles}
                isLoadingContent={isContentLoading}
                activeNav="home"
                history={history}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                viewCounts={viewCounts}
                onSaveSearch={addSearchHistory}
            />} />
            
            <Route path="/news" element={<HomePage 
                key="home-news" 
                language={language}
                theme={theme}
                section="news"
                articles={articles}
                isLoadingContent={isContentLoading}
                history={history}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                viewCounts={viewCounts}
                onSaveSearch={addSearchHistory}
            />} />

            <Route path="/news/anime" element={<HomePage 
                key="home-news-anime"
                language={language}
                theme={theme}
                section="news"
                subCategory="anime"
                articles={articles}
                isLoadingContent={isContentLoading}
                history={history}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                viewCounts={viewCounts}
                onSaveSearch={addSearchHistory}
            />} />
            
            <Route path="/news/comics" element={<HomePage 
                key="home-news-comics"
                language={language}
                theme={theme}
                section="news"
                subCategory="comics"
                articles={articles}
                isLoadingContent={isContentLoading}
                history={history}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                viewCounts={viewCounts}
                onSaveSearch={addSearchHistory}
            />} />
            
            <Route path="/news/movies" element={<HomePage 
                key="home-news-movies"
                language={language}
                theme={theme}
                section="news"
                subCategory="movies"
                articles={articles}
                isLoadingContent={isContentLoading}
                history={history}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                viewCounts={viewCounts}
                onSaveSearch={addSearchHistory}
            />} />
            
             <Route path="/news/games" element={<HomePage 
                key="home-news-games"
                language={language}
                theme={theme}
                section="news"
                subCategory="games"
                articles={articles}
                isLoadingContent={isContentLoading}
                history={history}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                viewCounts={viewCounts}
                onSaveSearch={addSearchHistory}
            />} />

            <Route path="/opinion" element={<HomePage 
                key="home-opinion"
                language={language}
                theme={theme}
                section="opinion"
                articles={articles}
                isLoadingContent={isContentLoading}
                history={history}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                viewCounts={viewCounts}
                onSaveSearch={addSearchHistory}
            />} />
            
            <Route path="/reviews" element={<HomePage 
                key="home-reviews"
                language={language}
                theme={theme}
                section="reviews"
                articles={articles}
                isLoadingContent={isContentLoading}
                history={history}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                viewCounts={viewCounts}
                onSaveSearch={addSearchHistory}
            />} />

            {/* Static Pages - Move above parameterized routes to avoid matching conflicts */}
            <Route path="/about" element={<StaticPageWrapper Component={AboutUs} language={language} title={language === 'id' ? 'Tentang Kami' : 'About Us'} />} />
            <Route path="/privacy" element={<StaticPageWrapper Component={PrivacyPolicy} language={language} title={language === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy'} />} />
            <Route path="/disclaimer" element={<StaticPageWrapper Component={Disclaimer} language={language} title={language === 'id' ? 'Sanggahan' : 'Disclaimer'} />} />
            <Route path="/terms" element={<StaticPageWrapper Component={TermsOfService} language={language} title={language === 'id' ? 'Syarat & Ketentuan' : 'Terms & Conditions'} />} />
            <Route path="/dmca" element={<StaticPageWrapper Component={DMCA} language={language} title="DMCA Notice" />} />
            <Route path="/contact" element={<StaticPageWrapper Component={ContactUs} language={language} title={language === 'id' ? 'Hubungi Kami' : 'Contact Us'} />} />
            <Route path="/faq" element={<StaticPageWrapper Component={FAQ} language={language} title="FAQ" />} />

            <Route path="/category/:category" element={<HomePage 
                key={`home-category-${location.pathname}`}
                language={language}
                theme={theme}
                articles={articles}
                isLoadingContent={isContentLoading}
                history={history}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                viewCounts={viewCounts}
                onSaveSearch={addSearchHistory}
            />} />

            <Route path="/topic/:tag" element={<HomePage 
                key={`home-topic-${location.pathname}`}
                language={language}
                theme={theme}
                activeNav="topic" 
                articles={articles}
                isLoadingContent={isContentLoading}
                history={history}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                viewCounts={viewCounts}
                onSaveSearch={addSearchHistory}
            />} />

            <Route path="/profile" element={<ProfilePage 
                currentUser={currentUser}
                language={language}
                theme={theme}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
                onThemeToggle={toggleTheme}
                onLanguageToggle={toggleLanguage}
            />} />

            <Route path="/admin/upload" element={<AdminUpload language={language} />} />
            <Route path="/admin" element={<Navigate to="/admin/upload" replace />} />
            <Route path="/admin/import" element={<Navigate to="/admin/upload" replace />} />



            {/* Static Pages */}
            <Route path="/about-us" element={<StaticPageWrapper Component={AboutUs} language={language} title={language === 'id' ? 'Tentang Kami' : 'About Us'} />} />
            <Route path="/contact" element={<StaticPageWrapper Component={ContactUs} language={language} title={language === 'id' ? 'Hubungi Kami' : 'Contact Us'} />} />
            <Route path="/disclaimer" element={<StaticPageWrapper Component={Disclaimer} language={language} title={language === 'id' ? 'Disclaimer' : 'Disclaimer'} />} />
            <Route path="/privacy-policy" element={<StaticPageWrapper Component={PrivacyPolicy} language={language} title={language === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy'} />} />
            <Route path="/terms-of-service" element={<StaticPageWrapper Component={TermsOfService} language={language} title={language === 'id' ? 'Syarat & Ketentuan' : 'Terms of Service'} />} />
            <Route path="/dmca" element={<StaticPageWrapper Component={DMCA} language={language} title={language === 'id' ? 'DMCA' : 'DMCA'} />} />
            <Route path="/faq" element={<StaticPageWrapper Component={FAQ} language={language} title={language === 'id' ? 'Tanya Jawab' : 'FAQ'} />} />

            {/* Catch all */}
            <Route path="*" element={<NotFound language={language} />} />
          </Routes>
        </main>

        <Footer language={language} onNavChange={(nav) => handleNavigateWithHistory(nav, true)} />
      </div>
  );
};

export default App;
