
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, User, MessageCircle, Share2, Tag, ChevronRight, Eye } from 'lucide-react';
import { NewsItem } from '../types';
import CommentsSection from './CommentsSection';
import { getLocalized } from '../utils/localization';
import { TRANSLATIONS } from '../constants';

interface SingleArticleProps {
  article: NewsItem;
  onBack: () => void;
  language: 'id' | 'en';
}

const SingleArticle: React.FC<SingleArticleProps> = ({ article, onBack, language }) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const t = (TRANSLATIONS[language] as any);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setReadingProgress((window.scrollY / scrollHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article.id]);

  return (
    <div className="min-h-screen bg-white dark:bg-cogray-950 transition-colors duration-300">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-[100] bg-cogray-100 dark:bg-cogray-900">
        <div 
          className="h-full bg-conime-600 transition-all duration-300 shadow-[0_0_10px_rgba(207,1,43,0.5)]" 
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black text-cogray-400 mb-10 uppercase tracking-[0.2em]">
          <button onClick={onBack} className="hover:text-conime-600 transition-colors">
            {language === 'id' ? 'Beranda' : 'Home'}
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-cogray-900 dark:text-white">{getLocalized(article.category, language)}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-cogray-900 dark:text-white mb-8 leading-[1.1] tracking-tighter uppercase">
            {getLocalized(article.title, language)}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-cogray-100 dark:border-cogray-900">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-conime-600 flex items-center justify-center font-black text-white text-xs shadow-lg shadow-conime-600/20">
                  {article.author?.[0] || 'A'}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-cogray-900 dark:text-white uppercase tracking-wider">{article.author}</span>
                  <span className="text-[9px] font-bold text-cogray-400 uppercase tracking-widest">{t.writtenBy}</span>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-cogray-100 dark:bg-cogray-900 hidden sm:block"></div>
              <div className="flex items-center gap-6 text-cogray-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-conime-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{getLocalized(article.date, language)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-conime-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{article.views?.toLocaleString() || 0} {t.viewsLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="rounded-[40px] overflow-hidden mb-16 shadow-2xl border border-cogray-100 dark:border-cogray-900">
          <img 
            src={article.imageUrl} 
            alt={getLocalized(article.title, language)} 
            className="w-full h-auto object-cover max-h-[700px]" 
          />
        </div>

        {/* Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none mb-20 text-cogray-700 dark:text-cogray-300 leading-relaxed font-medium"
          dangerouslySetInnerHTML={{ __html: getLocalized(article.content, language) }}
        />

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-4 py-10 border-y border-cogray-100 dark:border-cogray-900 mb-20">
          <div className="p-2.5 bg-cogray-50 dark:bg-cogray-900 rounded-xl">
            <Tag className="w-5 h-5 text-conime-600" />
          </div>
          <div className="flex flex-wrap gap-5">
            {article.tags?.map((tag, i) => (
              <button key={i} className="text-xs font-black text-cogray-500 dark:text-cogray-400 hover:text-conime-600 transition-colors uppercase tracking-[0.1em]">
                #{getLocalized(tag, language).replace(/\s+/g, '')}
              </button>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <CommentsSection language={language} />

        {/* Back Button */}
        <div className="mt-24 pt-12 border-t border-cogray-100 dark:border-cogray-900">
          <button 
            onClick={onBack}
            className="flex items-center gap-5 text-conime-600 font-black uppercase tracking-[0.2em] group text-xs"
          >
            <div className="w-12 h-12 rounded-full border-2 border-conime-600 flex items-center justify-center group-hover:bg-conime-600 group-hover:text-white transition-all shadow-lg shadow-conime-600/10">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span>{t.back}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleArticle;
