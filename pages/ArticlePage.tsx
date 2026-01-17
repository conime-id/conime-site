
import React, { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArticleDetail from '../components/ArticleDetail';
import { NotFound } from './NotFound';
import { NewsItem } from '../types';
import { getLocalized } from '../utils/localization';
import { getArticleLink, getSectionLink } from '../utils/navigation';
import { updateMetaTags } from '../utils/seo';
import { User } from '../types'; 

interface ArticlePageProps {
  language: 'id' | 'en';
  history: any[];
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  currentUser: any;
  onLoginClick: () => void;
  addHistory: (id: string) => void;
  articles: NewsItem[];
}

export const ArticlePage: React.FC<ArticlePageProps> = ({
  language,
  history,
  bookmarks,
  toggleBookmark,
  currentUser,
  onLoginClick,
  addHistory,
  articles
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Log component mount/remount
  useEffect(() => {
    console.log("✨ ArticlePage Mounted/Remounted");
    return () => {
      console.log("🗑️ ArticlePage Unmounted");
    };
  }, []);

  const article = useMemo(() => articles.find(n => n.id === id), [id, articles]);

  // Update Reading History and Document Title
  useEffect(() => {
    console.log("📖 ArticlePage Rendered for ID:", id);
    if (article) {
      addHistory(article.id);
      
      const title = getLocalized(article.title, language);
      const description = getLocalized(article.excerpt, language);
      const url = `https://conime.id${getArticleLink(article)}`;
      
      // Update SEO Meta Tags
      updateMetaTags(
        `${title} | CoNime.id`,
        description,
        article.imageUrl,
        url
      );
    }
  }, [article, language, addHistory, id]);

  if (!article) {
    return <NotFound language={language} />;
  }


  return (
    <ArticleDetail
      key={article.id}
      article={article}
      language={language}
      onBack={() => navigate(-1)}
      onArticleClick={(newId) => {
        // Find article to determine correct path (News vs Opinion vs Review)
        const targetArticle = articles.find(n => n.id === newId);
        if (targetArticle) {
           navigate(getArticleLink(targetArticle));
        } else {
           // Fallback
           navigate(`/news/${newId}`); 
        }
      }}
      onCategoryClick={(cat) => navigate(getSectionLink(cat))}
      onTagClick={(tag) => navigate(`/topic/${tag}`)}
      history={history}
      isBookmarked={bookmarks.includes(article.id)}
      onToggleBookmark={() => toggleBookmark(article.id)}
      currentUser={currentUser}
      onLoginClick={onLoginClick}
    />
  );
};
