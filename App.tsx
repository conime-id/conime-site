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
import { useAuth } from "./hooks/useAuth";
import { auth, db } from "./lib/firebase";
import { signOut } from "firebase/auth";
import { doc, setDoc, query, collection, onSnapshot } from "firebase/firestore";

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
  // Authentication State
  // Authentication State
  const { user: currentUser } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync Cloud Data to Local State on Login
  useEffect(() => {
    if (currentUser) {
        if (currentUser.bookmarks && Array.isArray(currentUser.bookmarks)) {
            setBookmarks(prev => {
                const combined = [...new Set([...prev, ...currentUser.bookmarks])];
                return combined;
            });
        }
        if (currentUser.history && Array.isArray(currentUser.history)) {
            setHistory(prev => {
                // Merge strategies:
                // 1. Map existing by ID
                const historyMap = new Map();
                prev.forEach(p => historyMap.set(p.id, p));
                
                // 2. Add/Update with cloud items (Cloud wins if newer? Or allow duplicates? Usually we merge by ID)
                currentUser.history.forEach((h: any) => {
                     const existing = historyMap.get(h.id);
                     // If existing is newer (local interactive override), maybe keep it? 
                     // For now, let's just assume latest timestamp wins or overwrite if we want cloud sync.
                     // Simple merge:
                     if (!existing || (h.timestamp > (existing.timestamp || 0))) {
                        historyMap.set(h.id, h);
                     }
                });

                // 3. Convert back to array and sort
                const combined = Array.from(historyMap.values()).sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0));
                return combined.slice(0, 50);
            });
        }
    }
  }, [currentUser]);


  // --- Dynamic Content State ---
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getAllArticles();
        setArticles(data);
        
        // Listen to Firestore for view count updates
        const q = query(collection(db, "articles"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const viewsMap = new Map();
            snapshot.docs.forEach(doc => {
                 viewsMap.set(doc.id, doc.data().views || 0);
            });
            
            setArticles(prevArticles => prevArticles.map(article => ({
                ...article,
                views: viewsMap.get(article.id) || article.views || 0
            })));
        });
        
        return () => unsubscribe();
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

  // Actions
  const handleToggleBookmark = async (id: string, e?: React.MouseEvent) => {
      if (e) {
          e.preventDefault();
          e.stopPropagation();
      }
      
      let newBookmarks: string[];
      if (bookmarks.includes(id)) {
        newBookmarks = bookmarks.filter(b => b !== id);
      } else {
        newBookmarks = [id, ...bookmarks];
      }
      
      setBookmarks(newBookmarks);

      // Firestore sync if logged in
      if (currentUser) {
          const userRef = doc(db, 'users', currentUser.id);
          try {
             await setDoc(userRef, { bookmarks: newBookmarks }, { merge: true });
          } catch(err) {
             console.error("Error syncing bookmarks:", err);
          }
      }
  };

  const handleAddHistory = useCallback(async (article: any) => {
    // Optimistic Update
    const newItem = {
      id: article.id,
      title: article.title || { en: '', id: '' },
      category: article.category || '',
      imageUrl: article.imageUrl || '',
      date: article.date || new Date().toISOString(),
      timestamp: Date.now()
    };
    
    // Remove if exists then add to top
    setHistory(prevHistory => {
        const filtered = prevHistory.filter((h: any) => h.id !== article.id);
        return [newItem, ...filtered].slice(0, 50); // Keep last 50
    });

    // Increment Views (Local + Firestore is already handled in ArticlePage)
    setViewCounts(prev => ({
        ...prev,
        [article.id]: (prev[article.id] || 0) + 1
    }));

     // Firestore sync if logged in
     if (currentUser) {
         const userRef = doc(db, 'users', currentUser.id);
         try {
             // Note: We need the NEW history here. 
             // Ideally we calculate it first.
             // But inside setHistory updater we can't side effect easily.
             // We'll approximate:
             const currentHistory = history.filter((h: any) => h.id !== article.id);
             const newHistoryForStore = [newItem, ...currentHistory].slice(0, 50);
             
             await setDoc(userRef, { history: newHistoryForStore }, { merge: true });
         } catch(err) {
            console.error("Error syncing history:", err);
         }
     }
  }, [history, currentUser]);

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

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [navigate]);

  const handleLogin = useCallback((user: any) => {
    // User login is handled by Firebase Auth listener in useAuth
    // Just close the modal
    setIsAuthModalOpen(false);
  }, []);

  const handleUpdateUser = useCallback((updated: any) => {
    // User updates are handled by Firestore listener in useAuth
    // No local state update needed here
  }, []);

  const handleDeleteUser = useCallback(async () => {
    // Account deletion should be handled by component logic (AccountSettings)
    // Here we just sign out
    await signOut(auth);
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
                toggleBookmark={handleToggleBookmark}
                addHistory={handleAddHistory}
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
                toggleBookmark={handleToggleBookmark}
                addHistory={handleAddHistory}
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
                toggleBookmark={handleToggleBookmark}
                addHistory={handleAddHistory}
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
                toggleBookmark={handleToggleBookmark}
                addHistory={handleAddHistory}
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
                toggleBookmark={handleToggleBookmark}
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
                toggleBookmark={handleToggleBookmark}
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
                toggleBookmark={handleToggleBookmark}
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
                toggleBookmark={handleToggleBookmark}
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
                toggleBookmark={handleToggleBookmark}
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
                toggleBookmark={handleToggleBookmark}
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
                toggleBookmark={handleToggleBookmark}
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
                toggleBookmark={handleToggleBookmark}
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
                toggleBookmark={handleToggleBookmark}
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
                toggleBookmark={handleToggleBookmark}
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
