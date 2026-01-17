import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Bell, Menu, X, Globe, Search, LogOut, Settings, User as UserIcon, ChevronDown, Bookmark, History, Instagram, Facebook, Twitter, Youtube, Mail, Phone, ArrowUp } from 'lucide-react';
import { LOGO_SVG, LOGO_MARK_SVG, TRANSLATIONS, SOCIAL_LINKS, TIKTOK_ICON_SVG } from '../constants';
import { Link, NavLink, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { getSectionLink } from '../utils/navigation';

interface HeaderProps {
  onNavChange: (category: string) => void;
  activeNav: string; // Deprecated but kept for type compat
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  language: 'id' | 'en';
  onToggleLanguage: () => void;
  searchQuery: string; // Deprecated
  onSearchChange: (query: string) => void; // Deprecated
  currentUser: any;
  onLogout: () => void;
  onLoginClick: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onBookmarksClick: () => void;
  searchHistory: string[];
  onClearSearchHistory: () => void;
  onSearchSubmit: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  theme, 
  onToggleTheme,
  language,
  onToggleLanguage,
  currentUser,
  onLogout,
  onLoginClick,
  onProfileClick,
  onSettingsClick,
  onBookmarksClick,
  onSearchChange,
  onNavChange,
  activeNav,
  searchHistory,
  onClearSearchHistory,
  onSearchSubmit,
  searchQuery = ""
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [localSearch, setLocalSearch] = useState(searchQuery || searchParams.get('q') || '');

  useEffect(() => {
    setLocalSearch(searchQuery || searchParams.get('q') || '');
  }, [searchQuery, searchParams]);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (localSearch.trim()) {
      if (onSearchSubmit) onSearchSubmit(localSearch);
      if (onSearchChange) onSearchChange(localSearch);
      else navigate(`/?q=${localSearch}`);
      setIsSearchOpen(false);
    } else {
        if (onSearchChange) onSearchChange('');
        else navigate(location.pathname); 
    }
  };

  const getPathForNav = (item: string) => {
    if (item === t.nav[0]) return '/'; 
    if (item === t.aboutUs) return '/about';
    if (item === t.contactUs) return '/contact';
    
    // Core logic from utility - Explicit header nav for news verticals
    return getSectionLink(item, true);
  };

  const navItems = t.nav;
  const textColorClass = "text-cogray-900 dark:text-white";
  const mutedTextColorClass = "text-cogray-600 dark:text-cogray-400";

  const socialLinks = [
    { icon: <Instagram className="w-5 h-5" />, color: 'hover:bg-pink-500 hover:border-pink-500', url: SOCIAL_LINKS.instagram, name: 'Instagram' },
    { icon: <Facebook className="w-5 h-5" />, color: 'hover:bg-blue-600 hover:border-blue-600', url: SOCIAL_LINKS.facebook, name: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, color: 'hover:bg-sky-500 hover:border-sky-500', url: SOCIAL_LINKS.twitter, name: 'Twitter' },
    { icon: <Youtube className="w-5 h-5" />, color: 'hover:bg-red-600 hover:border-red-600', url: SOCIAL_LINKS.youtube, name: 'YouTube' },
    { icon: TIKTOK_ICON_SVG("w-5 h-5"), color: 'hover:bg-black hover:border-black', url: SOCIAL_LINKS.tiktok, name: 'TikTok' },
  ];
    
  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-cogray-950/95 backdrop-blur-md shadow-2xl py-2' 
          : 'bg-white/90 dark:bg-cogray-950/40 backdrop-blur-md lg:backdrop-blur-none py-4'
      }`}>
        <div 
          className="absolute bottom-0 left-0 h-[2px] bg-conime-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-6">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className={`p-2 lg:hidden transition-colors ${mutedTextColorClass} hover:text-conime-600`}
                aria-label="Menu"
              >
                <Menu className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <Link 
                to="/"
                onClick={() => setLocalSearch('')} 
                className="hover:opacity-80 transition-opacity flex-shrink-0"
              >
                <div className="hidden sm:block">
                  {LOGO_SVG(`h-9 w-auto transition-colors duration-300 ${textColorClass}`)}
                </div>
                <div className="sm:hidden">
                  {LOGO_MARK_SVG("w-8 h-8")}
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-8 ml-4">
                {navItems.map((item) => {
                    const navPath = getPathForNav(item);
                    
                    // Smart Active Check (Prefix-based)
                    const isActive = navPath === '/' 
                        ? location.pathname === '/' 
                        : location.pathname.startsWith(navPath);

                    return (
                        <NavLink 
                            key={item} 
                            to={navPath}
                            onClick={() => onNavChange?.(item)}
                            end={navPath === '/'} // Keep 'end' prop for exact match on home
                            className={`text-sm font-bold tracking-wide transition-all hover:-translate-y-0.5 ${
                                isActive && !searchParams.get('q') // Keep searchParams check for active state
                                ? 'text-conime-600 underline underline-offset-8 decoration-2 font-black' 
                                : `${mutedTextColorClass} hover:text-conime-600`
                            }`}
                        >
                            {item}
                        </NavLink>
                    );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-1 md:gap-3">
              <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative mr-2">
                <Search className={`w-4 h-4 absolute left-3 transition-colors ${localSearch || isSearchFocused ? 'text-conime-600' : 'text-cogray-400'}`} />
                <input 
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={localSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLocalSearch(val);
                    if (onSearchChange) onSearchChange(val);
                    else navigate(`/?q=${val}`, { replace: true });
                  }}
                  className="bg-cogray-100 dark:bg-cogray-900 border-none rounded-full py-2 pl-10 pr-4 text-xs font-bold text-cogray-800 dark:text-white w-48 focus:w-64 transition-all focus:ring-1 focus:ring-conime-600 outline-none uppercase tracking-tight"
                />
                
                {/* Desktop Search History Dropdown */}
                {isSearchFocused && searchHistory.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-cogray-950 border border-cogray-200 dark:border-cogray-800 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="px-4 py-2 border-b border-cogray-100 dark:border-cogray-900 flex items-center justify-between">
                      <span className="text-[9px] font-black text-cogray-400 uppercase tracking-widest">{language === 'id' ? 'RIWAYAT' : 'HISTORY'}</span>
                      <button 
                        onMouseDown={(e) => { e.preventDefault(); onClearSearchHistory(); }}
                        className="text-[9px] font-black text-conime-600 uppercase tracking-widest hover:underline"
                      >
                        {language === 'id' ? 'HAPUS' : 'CLEAR'}
                      </button>
                    </div>
                    <div className="p-1">
                      {searchHistory.map((q, i) => (
                        <button
                          key={i}
                          onMouseDown={(e) => {
                             e.preventDefault();
                             setLocalSearch(q);
                             onSearchSubmit?.(q);
                             onSearchChange?.(q);
                             setIsSearchFocused(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-cogray-50 dark:hover:bg-cogray-900 text-cogray-600 dark:text-cogray-400 text-xs font-bold uppercase tracking-tight transition-all text-left rounded-xl"
                        >
                          <History className="w-3.5 h-3.5 opacity-40 shrink-0" />
                          <span className="truncate">{q}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {localSearch && (
                  <button 
                    type="button"
                    onClick={() => { setLocalSearch(''); navigate(location.pathname); }}
                    className="absolute right-3 text-cogray-400 hover:text-conime-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </form>

              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`lg:hidden p-2 transition-all rounded-full ${isSearchOpen || localSearch ? 'text-conime-600 bg-conime-50 dark:bg-conime-950' : `${mutedTextColorClass}`}`}
                aria-label={t.search || "Search"}
              >
                <Search className="w-5 h-5" />
              </button>

              <div className="flex items-center">
                <button 
                  onClick={onToggleLanguage}
                  className={`flex items-center gap-1 p-2 rounded-full transition-all active:scale-90 ${mutedTextColorClass} hover:text-conime-600 hover:bg-cogray-100 dark:hover:bg-cogray-900`}
                  aria-label={t.changeLanguage || "Change Language"}
                  title={t.changeLanguage}
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-tighter hidden sm:inline">{t.langName}</span>
                </button>

                <button 
                  onClick={onToggleTheme}
                  className={`p-2 transition-all rounded-full active:scale-90 ${mutedTextColorClass} hover:text-conime-600 hover:bg-cogray-100 dark:hover:bg-cogray-900`} 
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
              
              {currentUser ? (
                <div className="relative ml-1" ref={profileRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-transparent group-hover:border-conime-600 transition-all overflow-hidden shadow-lg">
                      <img src={currentUser.avatar} alt={currentUser.username} className="w-full h-full object-cover" />
                    </div>
                    <ChevronDown className={`w-4 h-4 text-cogray-400 group-hover:text-conime-600 transition-all ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-cogray-950 border border-cogray-100 dark:border-cogray-800 rounded-[32px] shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-6 bg-gradient-to-br from-conime-600/10 to-transparent">
                          <p className="text-[10px] font-black text-conime-600 uppercase tracking-[0.2em] mb-1">Signed in as</p>
                          <p className="text-base font-black text-cogray-900 dark:text-white truncate uppercase tracking-tighter">{currentUser.displayName}</p>
                          <p className="text-[10px] font-bold text-cogray-400 dark:text-cogray-500 truncate">@{currentUser.username}</p>
                      </div>
                      
                      <div className="p-3">
                        <button 
                          onClick={() => { onProfileClick(); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-cogray-50 dark:hover:bg-cogray-900 text-cogray-700 dark:text-cogray-200 transition-all group"
                        >
                          <div className="p-2 bg-cogray-100 dark:bg-cogray-800 rounded-xl group-hover:bg-conime-600 group-hover:text-white transition-colors">
                            <UserIcon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">{t.profile}</span>
                        </button>
                        <button 
                          onClick={() => { onBookmarksClick(); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-cogray-50 dark:hover:bg-cogray-900 text-cogray-700 dark:text-cogray-200 transition-all group"
                        >
                          <div className="p-2 bg-cogray-100 dark:bg-cogray-800 rounded-xl group-hover:bg-conime-600 group-hover:text-white transition-colors">
                            <Bookmark className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">{t.bookmarks}</span>
                        </button>
                        <button 
                          onClick={() => { onSettingsClick(); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-cogray-50 dark:hover:bg-cogray-900 text-cogray-700 dark:text-cogray-200 transition-all group"
                        >
                          <div className="p-2 bg-cogray-100 dark:bg-cogray-800 rounded-xl group-hover:bg-conime-600 group-hover:text-white transition-colors">
                            <Settings className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">{t.settings}</span>
                        </button>
                        <div className="h-[1px] bg-cogray-100 dark:bg-cogray-800 my-2 mx-4"></div>
                        <button 
                          onClick={onLogout}
                          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition-all group"
                        >
                          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">{t.logout}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={onLoginClick}
                  aria-label={t.login}
                  className="flex items-center gap-2 bg-conime-600 hover:bg-conime-700 text-white px-4 md:px-5 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-conime-600/20 active:scale-95 ml-1"
                >
                  {t.login}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={`lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-cogray-950 border-t border-cogray-100 dark:border-cogray-900 px-4 py-3 shadow-xl transition-all duration-300 transform ${isSearchOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-4 text-conime-600" />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder={t.searchPlaceholder}
              value={localSearch}
              onChange={(e) => {
                const val = e.target.value;
                setLocalSearch(val);
                // Global Live Search for Mobile
                navigate(`/?q=${val}`, { replace: true });
              }}
              className="w-full bg-cogray-50 dark:bg-cogray-900 border-none py-3 pl-11 pr-11 rounded-2xl text-sm font-bold text-cogray-900 dark:text-white outline-none focus:ring-1 focus:ring-conime-600 uppercase tracking-tight"
            />
            <button 
              type="button"
              onClick={() => { setIsSearchOpen(false); setLocalSearch(''); }}
              className="absolute right-4 text-cogray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </form>

          {/* Mobile Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between px-2 mb-3">
                <span className="text-[10px] font-black text-cogray-400 uppercase tracking-widest">{language === 'id' ? 'RIWAYAT PENCARIAN' : 'SEARCH HISTORY'}</span>
                <button 
                  onClick={onClearSearchHistory}
                  className="text-[10px] font-black text-conime-600 uppercase tracking-widest"
                >
                  {language === 'id' ? 'HAPUS SEMUA' : 'CLEAR ALL'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                        setLocalSearch(q);
                        onSearchSubmit?.(q);
                        onSearchChange?.(q);
                        setIsSearchOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-cogray-50 dark:bg-cogray-900 border border-cogray-100 dark:border-cogray-800 rounded-xl text-xs font-bold text-cogray-700 dark:text-cogray-300 uppercase tracking-tight active:scale-95 transition-all"
                  >
                    <History className="w-3.5 h-3.5 opacity-40 shrink-0" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <div className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute top-0 left-0 bottom-0 w-80 bg-white dark:bg-cogray-950 flex flex-col transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 shrink-0">
            <div className="scale-90 origin-left">
              {LOGO_MARK_SVG("w-12 h-12")}
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-cogray-400 hover:text-conime-600 transition-colors" aria-label="Close menu">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto px-6 py-2 custom-scrollbar">
            {currentUser && (
              <div className="mb-8 p-5 bg-cogray-50 dark:bg-cogray-900 rounded-[32px] flex items-center gap-4 border border-cogray-100 dark:border-cogray-800">
                <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg border-2 border-white dark:border-cogray-800">
                  <img src={currentUser.avatar} alt={currentUser.username} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-base font-black text-cogray-900 dark:text-white uppercase tracking-tighter truncate">{currentUser.username}</p>
                  <p className="text-[10px] font-bold text-conime-600 uppercase tracking-widest italic leading-none mt-1">CoNime Member</p>
                </div>
              </div>
            )}

            <nav className="space-y-1 mb-8">
              {navItems.map((item) => {
                const path = getPathForNav(item);
                return (
                    <NavLink 
                    key={item} 
                    to={path}
                    onClick={() => {
                        setIsMobileMenuOpen(false);
                        setLocalSearch(''); 
                    }}
                    className={({ isActive }) => `block w-full text-left text-xl font-black py-4 border-b border-cogray-100 dark:border-cogray-900 transition-all uppercase tracking-tight active:pl-2 ${
                        isActive && !searchParams.get('q') ? 'text-conime-600 border-conime-600' : 'text-cogray-700 dark:text-cogray-200 hover:text-conime-600'
                    }`}
                    >
                    {item}
                    </NavLink>
                );
              })}
            </nav>
            
            <div className="space-y-3 mb-12">
              <button 
                onClick={onToggleLanguage}
                className="flex items-center justify-between w-full p-5 rounded-3xl bg-cogray-50 dark:bg-cogray-900 text-cogray-800 dark:text-cogray-200 font-black uppercase text-[10px] tracking-widest hover:bg-cogray-100 dark:hover:bg-cogray-850 transition-colors"
                aria-label={t.switchLanguage || "Switch Language"}
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-conime-600" />
                  <span>{t.switchLanguage}</span>
                </div>
                <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
              </button>
              <button 
                onClick={onToggleTheme}
                className="flex items-center justify-between w-full p-5 rounded-3xl bg-cogray-50 dark:bg-cogray-900 text-cogray-800 dark:text-cogray-200 font-black uppercase text-[10px] tracking-widest hover:bg-cogray-100 dark:hover:bg-cogray-850 transition-colors"
                aria-label={theme === 'dark' ? t.lightMode : t.darkMode}
              >
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Sun className="w-5 h-5 text-conime-600" /> : <Moon className="w-5 h-5 text-conime-600" />}
                  <span>{theme === 'dark' ? t.lightMode : t.darkMode}</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-conime-600' : 'bg-cogray-300'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${theme === 'dark' ? 'left-6' : 'left-1'}`}></div>
                </div>
              </button>
              
              {currentUser && (
                <button 
                  onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full p-5 rounded-3xl bg-red-50 dark:bg-red-950/30 text-red-600 font-black uppercase text-[10px] tracking-widest hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  {t.logout}
                </button>
              )}
            </div>
          </div>

          <div className="p-6 shrink-0 bg-cogray-50 dark:bg-cogray-900/50 border-t border-cogray-100 dark:border-cogray-900">
            <p className="text-[10px] text-cogray-400 dark:text-cogray-500 mb-6 italic font-black uppercase tracking-widest text-center">{t.portalBudayaPop}</p>
          
            <div className="flex justify-center gap-4">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${social.name}`}
                  className={`w-11 h-11 bg-white dark:bg-cogray-950 border border-cogray-200 dark:border-cogray-800 rounded-2xl flex items-center justify-center ${social.color} hover:text-white transition-all duration-300 shadow-sm group hover:scale-110 active:scale-95`}
                >
                  <span className="text-cogray-600 dark:text-cogray-400 group-hover:text-white transition-colors duration-300">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
