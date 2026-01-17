import React, { useMemo } from 'react';
import { ArrowRight, History, Flame, Tags, Instagram, Twitter, Facebook, Youtube, Share2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SOCIAL_LINKS, TRANSLATIONS, getCategoryColor, MOCK_NEWS, CATEGORIES, TIKTOK_ICON_SVG } from '../constants';
import { getLocalized } from '../utils/localization';
import { getArticleLink, getSectionLink } from '../utils/navigation';

interface SidebarProps {
  language: 'id' | 'en';
  onArticleClick?: (id: string) => void;
  onCategoryClick?: (category: string) => void;
  history?: any[]; // optional, can read from localstorage if needed, but passed prop is fine
}

const SidebarSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <section className="bg-white dark:bg-cogray-950/20 border border-cogray-200 dark:border-cogray-900 rounded-[32px] p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-8">
      <div className="p-2.5 bg-conime-500/10 dark:bg-conime-500/5 rounded-2xl text-conime-600 shadow-lg shadow-conime-600/5">
        {icon}
      </div>
      <h2 className="text-xl font-black uppercase tracking-tighter text-cogray-900 dark:text-white leading-none">{title}</h2>
    </div>
    {children}
  </section>
);

const Sidebar: React.FC<SidebarProps> = ({ language, onArticleClick, onCategoryClick, history }) => {
  const t = TRANSLATIONS[language];
  const navigate = useNavigate();

  const sortedTrending = useMemo(() => {
    return [...MOCK_NEWS].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);
  }, []);

  const recentlyRead = useMemo(() => {
    // Rely on passed history prop if available for reactivity, otherwise fallback to localStorage
    const historyData = history || JSON.parse(localStorage.getItem('conime_history') || '[]');
    const historyIds = historyData.map((item: any) => typeof item === 'string' ? item : item.id);
    return MOCK_NEWS.filter(item => historyIds.includes(item.id))
      .sort((a, b) => historyIds.indexOf(a.id) - historyIds.indexOf(b.id))
      .slice(0, 5);
  }, [history]);

  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const mainTopics = ['ANIME', 'COMICS', 'COMIC', 'GAME', 'GAMES', 'FILM', 'MOVIE', 'MOVIES', 'OPINION', 'OPINI', 'REVIEWS', 'ULASAN'];

    MOCK_NEWS.forEach(item => {
      const catEn = getLocalized(item.category, 'en').toUpperCase();
      const subCatEn = getLocalized(item.subCategory, 'en').toUpperCase();
      const uniqueTopicsInArticle = new Set([catEn, subCatEn]);
      
      uniqueTopicsInArticle.forEach(topic => {
        if (mainTopics.includes(topic)) {
          counts[topic] = (counts[topic] || 0) + 1;
        }
      });
    });

    return CATEGORIES.map(cat => {
      const catEn = getLocalized(cat.name, 'en').toUpperCase();
      let count = counts[catEn] || 0;
      if (catEn === 'COMICS' && counts['COMIC']) count += counts['COMIC'];
      if (catEn === 'GAMES' && counts['GAME']) count += counts['GAME'];
      if (catEn === 'MOVIES' && counts['FILM']) count += counts['FILM'];
      if (catEn === 'MOVIES' && counts['MOVIE']) count += counts['MOVIE'];
      if (catEn === 'OPINION' && counts['OPINI']) count += counts['OPINI'];
      if (catEn === 'REVIEWS' && counts['ULASAN']) count += counts['ULASAN'];
      
      return { ...cat, count };
    });
  }, []);

  // Centralized Link Mapping using getSectionLink utility
  const getCategoryLink = (catNameEn: string) => {
    return getSectionLink(catNameEn);
  };

  return (
    <aside className="space-y-6">
      {/* 1. Recently Read Widget */}
      <SidebarSection title={t.lastRead} icon={<History className="w-5 h-5" />}>
        <div className="space-y-5">
          {recentlyRead.length > 0 ? (
            recentlyRead.map((item, idx) => (
              <Link 
                to={getArticleLink(item)}
                key={item.id}
                onClick={(e) => {
                  if (onArticleClick) {
                    e.preventDefault();
                    onArticleClick(item.id);
                  }
                }}
                className="flex items-start space-x-4 group cursor-pointer border-b border-cogray-100 dark:border-cogray-900/50 pb-4 last:border-0 last:pb-0"
              >
                <span className="text-conime-500 font-black text-sm pt-0.5">{idx + 1}</span>
                <p className="text-sm font-black text-cogray-700 dark:text-cogray-200 group-hover:text-conime-500 transition-colors leading-tight line-clamp-2 uppercase tracking-tight">
                  {getLocalized(item.title, language)}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-[10px] font-black text-cogray-400 text-center uppercase tracking-widest italic opacity-50 px-4 pb-4">
              {t.noHistory}
            </p>
          )}
        </div>
      </SidebarSection>

      {/* 2. Popular Articles Widget */}
      <SidebarSection 
        title={t.popularThisWeek} 
        icon={<Flame className="w-5 h-5" />}
      >
        <div className="space-y-8">
          {sortedTrending.map((item, idx) => (
            <Link 
              to={getArticleLink(item)}
              key={item.id} 
              onClick={(e) => {
                if (onArticleClick) {
                  e.preventDefault();
                  onArticleClick(item.id);
                }
              }}
              className="flex items-start gap-4 group cursor-pointer"
            >
              <div className="relative flex-shrink-0 w-20 h-20 rounded-[20px] overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={getLocalized(item.title, language)} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-0 left-0 w-6 h-6 bg-conime-500 flex items-center justify-center text-[11px] font-black text-white rounded-br-xl shadow-lg">
                  {idx + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0 space-y-2 text-left">
                <h4 className="text-[14px] font-black text-cogray-900 dark:text-white leading-[1.3] group-hover:text-conime-600 transition-colors uppercase tracking-tight line-clamp-2">
                  {getLocalized(item.title, language)}
                </h4>
                <div className="flex items-center gap-2">
                  <span
                    onClick={(e) => {
                       e.preventDefault();
                       navigate(getCategoryLink(getLocalized(item.category, 'en')));
                    }}
                    className={`${getCategoryColor(getLocalized(item.category, 'en'))} text-[9px] font-black text-white uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm shadow-black/20 hover:brightness-110 transition-all cursor-pointer`}
                  >
                    {getLocalized(item.category, language)}
                  </span>
                  <span className="text-[10px] font-bold text-cogray-400 dark:text-cogray-600 uppercase">
                    {getLocalized(item.date, language)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </SidebarSection>

      {/* 3. Categories Widget */}
      <SidebarSection title={t.categories} icon={<Tags className="w-5 h-5" />}>
        <div className="grid grid-cols-1 gap-1">
          {categoriesWithCounts.map((cat) => {
            const catEn = getLocalized(cat.name, 'en');
            const dotColor = getCategoryColor(catEn);
            const linkPath = getCategoryLink(catEn);
            return (
              <Link 
                to={linkPath}
                key={catEn} 
                onClick={(e) => {
                  if (onCategoryClick) {
                    e.preventDefault();
                    onCategoryClick(catEn);
                  }
                }}
                className="flex items-center justify-between group cursor-pointer hover:bg-cogray-50 dark:hover:bg-white/5 p-2 px-3 rounded-xl transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${dotColor} transition-transform group-hover:scale-125 shadow-sm`}></div>
                  <span className="text-xs font-extrabold text-cogray-600 dark:text-cogray-300 group-hover:text-conime-600 dark:group-hover:text-white uppercase tracking-widest">{getLocalized(cat.name, language)}</span>
                </div>
                <span className="text-[10px] text-cogray-400 dark:text-cogray-500 font-black bg-cogray-100 dark:bg-cogray-900 px-2 py-0.5 rounded-lg group-hover:bg-conime-600 group-hover:text-white transition-all">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>
      </SidebarSection>

      {/* 4. Stay Connected Widget */}
      <SidebarSection title={t.stayConnected} icon={<Share2 className="w-5 h-5" />}>
        <div className="grid grid-cols-5 gap-3">
          {[
            { icon: <Instagram className="w-5 h-5" />, url: SOCIAL_LINKS.instagram, color: 'hover:bg-pink-500 hover:border-pink-500', name: 'Instagram' },
            { icon: <Twitter className="w-5 h-5" />, url: SOCIAL_LINKS.twitter, color: 'hover:bg-sky-500 hover:border-sky-500', name: 'Twitter' },
            { icon: <Facebook className="w-5 h-5" />, url: SOCIAL_LINKS.facebook, color: 'hover:bg-blue-600 hover:border-blue-600', name: 'Facebook' },
            { icon: <Youtube className="w-5 h-5" />, url: SOCIAL_LINKS.youtube, color: 'hover:bg-red-600 hover:border-red-600', name: 'YouTube' },
            { icon: TIKTOK_ICON_SVG("w-5 h-5"), url: SOCIAL_LINKS.tiktok, color: 'hover:bg-black hover:border-black', name: 'TikTok' },
          ].map((social, i) => (
            <a 
              key={i} 
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={`Follow us on ${social.name}`}
              className={`flex items-center justify-center aspect-square rounded-2xl bg-white dark:bg-cogray-900 text-cogray-600 dark:text-cogray-400 transition-all duration-300 border border-cogray-200 dark:border-cogray-800 ${social.color} hover:text-white hover:scale-110 active:scale-95 group shadow-sm`}
            >
              <div className="group-hover:text-white transition-colors duration-300">
                {social.icon}
              </div>
            </a>
          ))}
        </div>
        <p className="mt-6 text-[10px] font-black text-cogray-400 dark:text-cogray-600 uppercase tracking-widest leading-relaxed">
          {t.socialDesc}
        </p>
      </SidebarSection>

      {/* Newsletter Widget */}
      <section className="relative overflow-hidden group rounded-[40px] p-8 text-center border bg-white dark:bg-cogray-950 border-cogray-200 dark:border-cogray-900 shadow-xl">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-conime-500/5 blur-[50px] group-hover:scale-150 transition-transform duration-1000 pointer-events-none"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter mb-4">{t.newsletterTitle}</h3>
          <p className="text-[10px] text-cogray-500 dark:text-cogray-400 uppercase tracking-widest mb-8 leading-relaxed font-bold">
            {language === 'id' 
              ? 'Fitur newsletter kami sedang dalam tahap pengembangan.' 
              : 'Our newsletter feature is currently under development.'}
          </p>
          <div className="bg-cogray-50 dark:bg-cogray-900 border border-cogray-100 dark:border-cogray-800 rounded-2xl py-4 px-6 text-[10px] text-conime-600 dark:text-conime-400 font-black uppercase tracking-widest text-center shadow-inner">
            {language === 'id' ? 'Segera Hadir' : 'Coming Soon'}
          </div>
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;
