
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
  addHistory: (article: NewsItem) => void;
  articles: NewsItem[];
  isLoading?: boolean;
}


interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("🛑 Component Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-20 text-center bg-red-600/10 rounded-[40px] border border-red-600/20 m-12">
          <h2 className="text-2xl font-black text-red-600 uppercase mb-4">Gagal Menampilkan Konten</h2>
          <p className="text-cogray-400 font-bold uppercase tracking-widest text-sm mb-8">Terjadi kesalahan teknis saat merender artikel ini.</p>
          <pre className="text-left bg-black/80 text-red-400 p-6 rounded-2xl overflow-x-auto text-xs no-scrollbar">
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-4 bg-red-600 text-white font-black rounded-2xl uppercase tracking-widest"
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const ArticlePage: React.FC<ArticlePageProps> = ({
  language,
  history,
  bookmarks,
  toggleBookmark,
  currentUser,
  onLoginClick,
  addHistory,
  articles,
  isLoading
}) => {
  const { id, subCategory } = useParams();
  const navigate = useNavigate();

  // Log component mount/remount
  useEffect(() => {
    console.log("✨ ArticlePage Mounted/Remounted");
    return () => {
      console.log("🗑️ ArticlePage Unmounted");
    };
  }, []);

  const articleId = id || subCategory;
  const article = useMemo(() => {
    const found = articles.find(n => n.id === articleId);
    console.log("🔍 Article Detection:", {
      id_param: id,
      subCategory_param: subCategory,
      computedId: articleId,
      found: !!found,
      articleTitle: found?.title?.id
    });
    return found;
  }, [articleId, articles]);

  // Update Reading History and Document Title
  useEffect(() => {
    console.log("📖 ArticlePage Rendered for ID:", id);
    if (article) {
      addHistory(article);
      
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-cogray-950">
        <div className="w-16 h-16 border-4 border-conime-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-black text-cogray-400 uppercase tracking-widest text-xs animate-pulse">Loading Content...</p>
      </div>
    );
  }

  if (!article) {
    return <NotFound language={language} />;
  }


  return (
    <ErrorBoundary>
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
        articles={articles}
      />
    </ErrorBoundary>
  );
};
