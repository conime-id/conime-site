
import React from 'react';
import { TRANSLATIONS, getCategoryColor, DEFAULT_THUMBNAIL } from '../constants';
import { getLocalized } from '../utils/localization';
import { NewsItem } from '../types';

interface TrendingSectionProps {
  language: 'id' | 'en';
  onArticleClick: (id: string) => void;
  onCategoryClick: (category: string) => void;
  articles: NewsItem[];
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ language, onArticleClick, onCategoryClick, articles }) => {
  const t = TRANSLATIONS[language];
  
  // Sort by views using local state if available (for real-time updates), otherwise fallback to article property
  const getViews = (id: string) => {
     // If parent passes viewCounts (which it doesn't yet, but will), use it.
     // For now, let's rely on the passed articles which should eventually be sorted by parent or we accept they are static here until full refactor.
     // To make this truly dynamic, we need to pass viewCounts here or fetch from firestore directly.
     // Given the setup, let's stick to using the `articles` prop but re-sort it if the parent updates it.
     return 0; 
  };

  const popularArticles = [...articles]
    .sort((a,b) => (b.views||0) - (a.views||0))
    .slice(0, 4)
    .map(item => ({
      id: item.id,
      title: getLocalized(item.title, language),
      image: item.imageUrl,
      categoryName: getLocalized(item.category, language),
      categoryEn: typeof item.category === 'string' ? item.category : (item.category?.en || '')
    }));

  return (
    <section className="relative overflow-hidden group my-12 transition-all duration-300 rounded-[40px] p-8 md:p-12 border bg-gradient-to-br from-white to-cogray-50 dark:from-cogray-900 dark:to-cogray-950 border-cogray-200 dark:border-conime-500/10 shadow-xl dark:shadow-2xl">
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-conime-500/5 blur-[50px] group-hover:scale-150 transition-transform duration-1000 pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-conime-500 rounded-2xl flex items-center justify-center shadow-lg shadow-conime-500/40 group-hover:rotate-6 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
          <h2 className="text-3xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter">{t.trending}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {popularArticles.map((article, idx) => (
          <div 
            key={article.id} 
            onClick={() => onArticleClick(article.id)}
            className="group/card cursor-pointer relative aspect-[3/4.2] rounded-[32px] overflow-hidden border border-cogray-200 dark:border-cogray-800 hover:border-conime-500/30 transition-all shadow-lg dark:shadow-xl bg-white dark:bg-cogray-950"
          >
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-1000 opacity-80 dark:opacity-60 group-hover/card:opacity-100 dark:group-hover/card:opacity-90" 
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_THUMBNAIL;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 dark:from-[#0b0b16] dark:via-[#0b0b16]/40 to-transparent"></div>
            
            <div className="absolute top-5 left-5 w-10 h-10 bg-conime-500 text-white font-black flex items-center justify-center rounded-full shadow-2xl shadow-conime-500/50 border-4 border-white dark:border-cogray-950 text-sm z-20">
              {idx + 1}
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-left z-20">
              <button 
                onClick={(e) => { e.stopPropagation(); onCategoryClick(article.categoryName); }}
                className={`${getCategoryColor(article.categoryEn)} text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest mb-3 inline-block shadow-lg hover:brightness-110`}
              >
                {article.categoryName.replace('#', '').split(' ')[0]}
              </button>
              <h3 className="text-sm font-black text-cogray-900 dark:text-white uppercase tracking-tight line-clamp-2 leading-tight group-hover/card:text-conime-500 dark:group-hover/card:text-conime-400 transition-colors">
                {article.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;
