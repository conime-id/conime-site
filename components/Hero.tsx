
import React, { useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS, getCategoryColor, DEFAULT_THUMBNAIL } from '../constants';
import { getLocalized } from '../utils/localization';
import { NewsItem } from '../types';

interface HeroProps {
  language: 'id' | 'en';
  onArticleClick: (id: string) => void;
  onCategoryClick: (category: string) => void;
  articles: NewsItem[];
}

const Hero: React.FC<HeroProps> = ({ language, onArticleClick, onCategoryClick, articles }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Use first 5 items as featured slides
  const featuredSlides = articles.slice(0, 5);
  const t = TRANSLATIONS[language];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % featuredSlides.length);
  }, [featuredSlides.length]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide, isHovered]);

  return (
    <section 
      className="relative h-[450px] md:h-[600px] rounded-[48px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-cogray-100 dark:border-cogray-900 bg-cogray-950 group transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {featuredSlides.map((slide, index) => {
        // Map category color
        const categoryEn = typeof slide.category === 'string' ? slide.category : slide.category.en;
        let categoryColorClass = "bg-conime-500";
        if (getCategoryColor) {
           categoryColorClass = getCategoryColor(categoryEn);
        }

        return (
          <div 
            key={slide.id}
            onClick={() => onArticleClick(slide.id)}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out cursor-pointer ${
              index === currentSlide 
                ? 'opacity-100 scale-100 translate-y-0 z-10' 
                : 'opacity-0 scale-105 translate-y-10 z-0 pointer-events-none'
            }`}
          >
            <img 
              alt={getLocalized(slide.title, language)} 
              className="w-full h-full object-cover transform transition-transform duration-[8000ms] ease-linear group-hover:scale-110 opacity-90 dark:opacity-100" 
              src={slide.imageUrl}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_THUMBNAIL;
              }}
            />
            
            {/* Premium Multi-layer Gradient for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-4xl text-left">
              <div className={`flex gap-3 mb-8 transition-all duration-1000 delay-300 ${
                index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryClick(getLocalized(slide.category, language));
                  }}
                  className={`${categoryColorClass} text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.3em] shadow-xl hover:brightness-110 transition-all active:scale-95`}
                >
                  {getLocalized(slide.category, language)}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryClick(getLocalized(slide.subCategory, language));
                  }}
                  className="bg-cogray-100/80 dark:bg-white/10 backdrop-blur-md border border-cogray-200 dark:border-white/20 text-cogray-800 dark:text-white text-[10px] font-bold px-5 py-2 rounded-full uppercase tracking-widest hover:bg-white dark:hover:bg-white/20 transition-all active:scale-95"
                >
                  {getLocalized(slide.subCategory, language)}
                </button>
              </div>
              
              <h1 className={`text-3xl md:text-6xl font-black text-white mb-8 leading-[1] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] uppercase tracking-tighter transition-all duration-1000 delay-500 ${
                index === currentSlide ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-8 opacity-0 blur-sm'
              }`}>
                {getLocalized(slide.title, language)}
              </h1>
              
              <div className={`flex items-center gap-6 text-xs text-cogray-600 dark:text-cogray-200 font-bold uppercase tracking-[0.2em] transition-all duration-1000 delay-700 ${
                index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="min-w-10 min-h-10 w-10 h-10 rounded-2xl bg-conime-500 border border-white/20 flex items-center justify-center text-sm font-black shadow-lg text-white">
                    {slide.author.charAt(0)}
                  </div>
                  <span className="text-white">
                    {t.writtenBy} <span className="text-conime-500 font-black">{slide.author}</span>
                  </span>
                </div>
                <span className="text-cogray-400 dark:text-cogray-500">|</span>
                <span className="text-cogray-500 dark:text-cogray-400">{getLocalized(slide.date, language)}</span>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4">
        {featuredSlides.map((_, idx) => (
          <button 
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(idx);
            }}
            className="group p-2 focus:outline-none transition-all"
            aria-label={`Go to slide ${idx + 1}`}
          >
            {idx === currentSlide ? (
              <div className="w-1.5 h-10 bg-conime-500 rounded-full shadow-[0_0_20px_rgba(255,21,69,0.6)] animate-in slide-in-from-top-2 duration-500"></div>
            ) : (
              <div className="w-1.5 h-1.5 bg-cogray-300 dark:bg-cogray-600 group-hover:bg-conime-500 dark:group-hover:bg-white rounded-full transition-all duration-300 group-hover:scale-150"></div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
