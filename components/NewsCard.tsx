import React from 'react';
import { Eye, Bookmark } from 'lucide-react';
import { NewsItem } from '../types';
import { TRANSLATIONS, getCategoryColor } from '../constants';
import { getLocalized } from '../utils/localization';
import { useNavigate } from 'react-router-dom';
import { getArticleLink, getSectionLink } from '../utils/navigation';

interface NewsCardProps {
  item: NewsItem;
  language: 'id' | 'en';
  onClick?: () => void; // Optional now
  onCategoryClick?: (category: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (e: React.MouseEvent) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ 
  item, 
  language, 
  onClick, 
  onCategoryClick,
  isBookmarked = false,
  onToggleBookmark
}) => {
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];
  const categoryColor = getCategoryColor(item.category.en);
  
  const handleClick = (e: React.MouseEvent) => {
     if (onClick) onClick();
     navigate(getArticleLink(item));
  };

  const handleCategoryNav = (e: React.MouseEvent, categoryEn: string) => {
    e.stopPropagation();
    if (onCategoryClick) {
        onCategoryClick(categoryEn);
        return;
    }
    // Navigate to broad category page (News + Opinion + Reviews)
    navigate(getSectionLink(categoryEn));
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white dark:bg-cogray-900/50 rounded-[32px] overflow-hidden border border-cogray-200 dark:border-cogray-800 group hover:border-conime-600/50 transition-all shadow-sm hover:shadow-2xl hover:shadow-conime-600/5 cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={getLocalized(item.title, language)} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/icons/default.png';
          }}
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <button 
            onClick={(e) => handleCategoryNav(e, getLocalized(item.category, 'en'))}
            className={`${categoryColor} text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg hover:brightness-110 transition-all`}
          >
            {getLocalized(item.category, language)}
          </button>
          <button 
             onClick={(e) => handleCategoryNav(e, getLocalized(item.subCategory, 'en'))} // Simplified to route to main category for now or we need subcategory routing
            className="bg-cogray-950/80 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest hover:bg-cogray-950 transition-all"
          >
            {getLocalized(item.subCategory, language)}
          </button>
        </div>
        
        {/* Bookmark Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); if(onToggleBookmark) onToggleBookmark(item.id); }}
          className={`absolute top-4 right-4 p-2 rounded-xl backdrop-blur-md transition-all z-10 ${
            isBookmarked 
              ? 'bg-conime-600 text-white shadow-lg shadow-conime-600/20' 
              : 'bg-cogray-950/40 text-white hover:bg-cogray-950/60'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        <div className="absolute bottom-3 right-3 bg-cogray-950/60 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 text-[9px] font-bold text-white">
          <Eye className="w-3 h-3 text-conime-600" />
          <span>{typeof item.views === 'number' ? item.views.toLocaleString() : '0'}</span>
        </div>
      </div>
      
      <div className="p-6 text-left flex flex-col flex-grow">
        <h3 className="text-xl font-black text-cogray-900 dark:text-white leading-tight mb-4 line-clamp-2 uppercase group-hover:text-conime-600 transition-colors tracking-tight">
          {getLocalized(item.title, language)}
        </h3>
        <p className="text-cogray-600 dark:text-cogray-400 text-sm line-clamp-3 mb-8 leading-relaxed font-medium">
          {getLocalized(item.excerpt, language)}
        </p>
        
        <div className="mt-auto pt-6 border-t border-cogray-100 dark:border-cogray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-conime-500 animate-pulse"></span>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em]">
              <span className="text-cogray-500 dark:text-cogray-400">{item.author}</span>
              <span className="text-cogray-300 dark:text-cogray-700">|</span>
              <span className="text-cogray-400 dark:text-cogray-500">{getLocalized(item.date, language)}</span>
            </div>
          </div>
          
          <div className="bg-cogray-100 dark:bg-cogray-800/80 border border-cogray-200 dark:border-cogray-700/50 px-4 py-1.5 rounded-lg transition-all group-hover:bg-conime-600 group-hover:border-conime-500 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cogray-900 dark:text-white group-hover:text-white">
              {language === 'id' ? 'BACA' : 'READ'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
