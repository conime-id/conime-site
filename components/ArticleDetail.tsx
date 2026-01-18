import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Share2, MessageCircle, Heart, Eye, Clock, Bookmark, ArrowRight, Camera, 
  Link as LinkIcon, Instagram, Twitter, Zap, Image as ImageIcon, X, ChevronLeft, ChevronRight, 
  Play, Youtube, ZoomIn, ZoomOut, RotateCcw, Move, Check, Video, Flag 
} from 'lucide-react';
import { NewsItem } from '../types';
import { TRANSLATIONS, getCategoryColor } from '../constants';
import Sidebar from './Sidebar';
import { getLocalized } from '../utils/localization';
import { getArticleLink, getSectionLink } from '../utils/navigation';
import { CATEGORIES, SOCIAL_LINKS } from '../constants'; // Added for category mapping
import { updateMetaTags, injectJSONLD, generateArticleSchema } from '../utils/seo';
import { formatNumber } from '../utils/format';
import CommentsSection from './CommentsSection';
import ShareModal from './ShareModal';

interface ArticleDetailProps {
  article: NewsItem;
  language: 'id' | 'en';
  onBack: () => void;
  onArticleClick: (id: string) => void;
  onCategoryClick: (category: string) => void;
  onTagClick: (tag: string) => void;
  history?: any[];
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  currentUser: any;
  onLoginClick: () => void;
  articles: NewsItem[];
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ 
  article, 
  language, 
  onBack, 
  onArticleClick, 
  onCategoryClick, 
  onTagClick, 
  history = [],
  isBookmarked,
  onToggleBookmark,
  currentUser,
  onLoginClick,
  articles
}) => {
  const navigate = useNavigate();
  const t = (TRANSLATIONS[language] as any);
  const categoryEn = article.category?.en || (typeof article.category === 'string' ? article.category : '');
  const categoryColor = getCategoryColor(categoryEn);
  const articleContentRef = useRef<HTMLDivElement>(null);

  // YouTube URL Converter to fix "Refused to connect"
  const getEmbedUrl = (url: string) => {
    try {
      if (!url || typeof url !== 'string') return '';
      if (url.includes('youtube.com/embed/')) return url;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
    } catch (e) {
      console.error("Error parsing video URL:", e);
      return '';
    }
  };

  // Basic Markdown Helper for inline styles
  const renderMarkdown = (text: string) => {
    if (!text || typeof text !== 'string') return '';
    try {
      let processed = text;
      
      // Pre-process: Merge consecutive blockquotes
      // Find lines starting with > and join them with <br/> or space, then wrap in blockquote
      // This is a simple implementation:
      // 1. Replace multi-line quotes (lines starting with > followed by newline >)
      // We'll use a placeholder strategy or just handle single lines better.
      // Better strategy for this simple regex engine:
      // Group 1: Capture the blockquote content, stripping the >
      
      // Step 1: Handle Blockquotes (Multi-line support is hard with simple replace, so we treat each line)
      // But user wants the > stripped from second line.
      // Let's replace start of line > with nothing if it's inside a blockquote? No state here.
      
      // Robust Blockquote: 
      // Replace lines starting with > with a special marker, then wrap?
      // Or just standard:
      processed = processed
        // Clean up previous artifacts if any
        .replace(/<\/blockquote>\s*<br\/>/g, '</blockquote>')
        
        // Helper for raw HTML protection if needed, currently we trust the input as it is admin content locally.
        
        // Handle Blockquotes with multi-line support
        // Regex: Matches one or more lines starting with > (optional space), handling CRLF
        .replace(/((?:^>\s?.*(?:\r?\n|$))+)/gm, (match) => {
            // Remove the > markers
            let contentLines = match.split(/\r?\n/).map(line => line.replace(/^>\s?/, '').trim()).filter(l => l);
            
            // Check if last line looks like a citation (-- Author or — Author)
            let citation = '';
            const lastLine = contentLines[contentLines.length - 1];
            if (lastLine && (lastLine.startsWith('--') || lastLine.startsWith('—') || lastLine.startsWith('- '))) {
                 citation = lastLine.replace(/^(--|—|-\s)/, '').trim();
                 contentLines.pop(); // Remove it from main content
            }
            
            const contentHtml = contentLines.join('<br/>');
            
            return `
              <blockquote class="my-8 relative pl-6 border-l-4 border-conime-600/50 bg-cogray-50/50 dark:bg-cogray-900/20 py-4 pr-4 rounded-r-2xl">
                <p class="italic text-xl font-medium text-cogray-900 dark:text-white leading-relaxed">${contentHtml}</p>
                ${citation ? `<footer class="mt-3 text-sm font-black text-conime-600 uppercase tracking-widest pl-2">— ${citation}</footer>` : ''}
              </blockquote>
            `;
        })

        // Headers
        .replace(/^#\s+(.*?)$/gm, '<h1 class="text-3xl md:text-4xl font-black mt-12 mb-6 uppercase tracking-tight text-cogray-900 dark:text-white">$1</h1>')
        .replace(/^##\s+(.*?)$/gm, '<h2 class="text-2xl md:text-3xl font-black mt-10 mb-5 uppercase tracking-tight text-cogray-900 dark:text-white">$1</h2>')
        .replace(/^###\s+(.*?)$/gm, '<h3 class="text-xl md:text-2xl font-black mt-8 mb-4 uppercase tracking-tight text-cogray-900 dark:text-white">$1</h3>')
        .replace(/^####\s+(.*?)$/gm, '<h4 class="text-lg md:text-xl font-black mt-6 mb-3 uppercase tracking-tight text-cogray-900 dark:text-white">$1</h4>')
        
        // Bold: **text**
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
        // Italics: *text* or _text_
        .replace(/(\*|_)(.*?)\1/g, '<em class="italic">$2</em>')
        // Links: [text](url) - Add target blank
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-conime-600 font-bold hover:underline decoration-2 underline-offset-4" target="_blank" rel="noopener noreferrer">$1</a>')
        // Lists: - item
        .replace(/^- (.*)$/gm, '<li class="ml-4 list-disc pl-2 marker:text-conime-600">$1</li>');
        
      return processed;
    } catch (e) {
      return text;
    }
  };

  // States for interaction
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(2400); 
  const [showShareModal, setShowShareModal] = useState(false); 

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Auto-hide controls state
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const titleText = getLocalized(article.title, language);
    const excerptText = getLocalized(article.excerpt, language);
    const categoryText = getLocalized(article.category, language);
    const subCategoryText = getLocalized(article.subCategory, language);
    const tagsText = article.tags?.map(t => getLocalized(t, language)).join(', ') || '';
    
    const title = `${titleText} | CoNime`;
    const desc = excerptText;
    const keywords = `${categoryText}, ${subCategoryText}, anime news, conime, ${tagsText}`;
    const articlePath = getArticleLink(article);
    updateMetaTags(title, desc, article.imageUrl, `https://conime.id${articlePath}`, keywords);
    
    const schema = generateArticleSchema(article, language);
    injectJSONLD(schema);

    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleContentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;
      if (href.includes('#article/')) {
        e.preventDefault();
        const parts = href.split('/');
        const articleId = parts[parts.length - 1];
        if (articleId) onArticleClick(articleId);
        return;
      }
      const isInternal = href.startsWith('/') || href.startsWith(window.location.origin) || anchor.hasAttribute('data-internal');
      if (isInternal) {
        const targetPath = href.startsWith(window.location.origin) ? href.replace(window.location.origin, '') : href;
        if (!targetPath.startsWith('#') && !targetPath.includes(':')) {
          e.preventDefault();
          navigate(targetPath);
          window.scrollTo(0, 0);
        }
      }
    };

    const contentEl = articleContentRef.current;
    if (contentEl) contentEl.addEventListener('click', handleContentClick);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight' && lightboxIndex !== null) handleNextImage();
      if (e.key === 'ArrowLeft' && lightboxIndex !== null) handlePrevImage();
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      if (contentEl) contentEl.removeEventListener('click', handleContentClick);
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [article.id, language, lightboxIndex]);

  useEffect(() => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handledMouseMove = () => {
       setShowControls(true);
       if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
       controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };
    window.addEventListener('mousemove', handledMouseMove);
    window.addEventListener('touchstart', handledMouseMove);
    handledMouseMove();
    return () => {
       window.removeEventListener('mousemove', handledMouseMove);
       window.removeEventListener('touchstart', handledMouseMove);
       if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [lightboxIndex]);

  const { inlineRec1, inlineRec2, gridRelated } = useMemo(() => {
    if (!articles) return { inlineRec1: undefined, inlineRec2: undefined, gridRelated: [] };
    const otherNews = articles.filter(item => item.id !== article.id);
    const catEn = article.category?.en || (typeof article.category === 'string' ? article.category : '');
    const subCatEn = article.subCategory?.en || (typeof article.subCategory === 'string' ? article.subCategory : '');
    
    const sameCategory = otherNews.filter(item => (item.category?.en === catEn) || (typeof item.category === 'string' && item.category === catEn));
    const sameSubCategory = otherNews.filter(item => ((item.subCategory?.en === subCatEn) || (typeof item.subCategory === 'string' && item.subCategory === subCatEn)) && !sameCategory.find(sc => sc.id === item.id));
    
    let allCandidates = [...sameSubCategory, ...sameCategory];
    
    // Fallback: If not enough related news, fill with other recent news
    if (allCandidates.length < 5) {
        const remaining = otherNews.filter(n => !allCandidates.find(c => c.id === n.id));
        allCandidates = [...allCandidates, ...remaining.slice(0, 5 - allCandidates.length)];
    }

    return {
      inlineRec1: allCandidates[0],
      inlineRec2: allCandidates[1],
      gridRelated: allCandidates.slice(2, 5)
    };
  }, [articles, article.id, article.category?.en, article.subCategory?.en]);

  const paragraphs = useMemo(() => {
    const contentText = getLocalized(article.content, language);
    // Modified split regex to keep headers together if needed, but primarily split by double newline
    return contentText.split(/\r?\n\s*\r?\n/).filter(p => p.trim());
  }, [article.content, language]);

  // Adjust placement: Point 1 at 40%, Point 2 at 80% (closer to middle and end)
  const point1 = Math.max(1, Math.floor(paragraphs.length * 0.4));
  const point2 = Math.max(2, Math.floor(paragraphs.length * 0.8));

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleNextImage = () => {
    if (lightboxIndex === null || !article.gallery) return;
    setLightboxIndex((lightboxIndex + 1) % article.gallery.length);
  };

  const handlePrevImage = () => {
    if (lightboxIndex === null || !article.gallery) return;
    setLightboxIndex((lightboxIndex - 1 + article.gallery.length) % article.gallery.length);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => {
      const newZoom = Math.max(1, Math.min(prev + delta, 4));
      if (newZoom === 1) setPanPosition({ x: 0, y: 0 });
      return newZoom;
    });
  };

  const handlePanStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (zoomLevel <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX - panPosition.x, y: clientY - panPosition.y });
  };

  const handlePanMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setPanPosition({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  };

  const handlePanEnd = () => setIsDragging(false);



  const RelatedInline = ({ item, title }: { item: NewsItem, title: string }) => (
    <div onClick={() => onArticleClick(item.id)} className="my-10 p-6 bg-cogray-50 dark:bg-cogray-900/50 border-l-4 border-conime-600 rounded-r-3xl cursor-pointer group hover:bg-cogray-100 dark:hover:bg-cogray-900 transition-all shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-black text-conime-600 uppercase tracking-[0.2em]">{title}</span>
        <div className="h-[1px] flex-grow bg-cogray-200 dark:bg-cogray-800"></div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-lg md:text-xl font-black text-cogray-900 dark:text-white uppercase tracking-tight group-hover:text-conime-600 transition-colors leading-tight">{getLocalized(item.title, language)}</h4>
        <ArrowRight className="w-5 h-5 text-conime-600 group-hover:translate-x-2 transition-transform shrink-0" />
      </div>
    </div>
  );
  
  // Helper to get thumbnail from youtube if missing
  const getThumbnail = (img: any) => {
    if (img.url) return img.url;
    if (img.videoUrl) {
       const embed = getEmbedUrl(img.videoUrl);
       if (embed && embed.includes('youtube.com/embed/')) {
          const id = embed.split('/').pop();
          return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
       }
    }
    return ''; // Placeholder or empty
  };

  return (
    <div key={article.id} className="flex flex-col lg:flex-row gap-12 text-left animate-in fade-in duration-500 pb-40">
      <div className="lg:w-3/4">
        <button onClick={onBack} className="flex items-center gap-2 text-cogray-400 hover:text-conime-600 transition-colors mb-10 group">
          <div className="w-10 h-10 rounded-full border border-cogray-200 dark:border-cogray-800 flex items-center justify-center group-hover:border-conime-600 transition-all"><ArrowLeft className="w-5 h-5" /></div>
          <span className="text-xs font-bold uppercase tracking-widest">{t.back}</span>
        </button>

        <article>
          <nav className="flex items-center gap-2 mb-8 text-[10px] font-black text-cogray-400 uppercase tracking-[0.2em] overflow-x-auto no-scrollbar whitespace-nowrap py-1">
            <Link to="/" className="hover:text-conime-600 transition-colors text-cogray-300 dark:text-cogray-600 flex-shrink-0">CONIME.ID</Link>
            <span className="text-cogray-200 dark:text-cogray-800 flex-shrink-0">/</span>
            <Link to={getSectionLink(getLocalized(article.category, 'en'))} className="hover:text-conime-600 transition-colors text-cogray-300 dark:text-cogray-500 flex-shrink-0">{getLocalized(article.category, language)}</Link>
            <span className="text-cogray-200 dark:text-cogray-800 flex-shrink-0">/</span>
            <span className="text-cogray-400 dark:text-cogray-400 uppercase flex-shrink-0">{getLocalized(article.subCategory, language)}</span>
          </nav>

          <div className="mb-10 text-left">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => onCategoryClick(getLocalized(article.category, language))} className={`${categoryColor} text-white text-[10px] font-black px-5 py-2 rounded-xl uppercase tracking-widest shadow-lg hover:brightness-110 transition-all`}>{getLocalized(article.category, language)}</button>
              <button onClick={() => onCategoryClick(getLocalized(article.subCategory, language))} className="text-cogray-400 dark:text-cogray-600 text-[10px] font-black uppercase tracking-[0.2em] border border-cogray-100 dark:border-cogray-900 px-5 py-2 rounded-xl hover:text-conime-600 transition-all">{getLocalized(article.subCategory, language)}</button>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-cogray-900 dark:text-white leading-[1] tracking-tighter mb-10 uppercase">{getLocalized(article.title, language)}</h1>
            <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-cogray-100 dark:border-cogray-900">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-conime-600 flex items-center justify-center font-black text-lg text-white shadow-xl shadow-conime-600/20">{(article.author || 'A').charAt(0)}</div>
                  <div>
                    <p className="text-[10px] font-bold text-cogray-400 uppercase tracking-widest leading-none mb-1">{t.writtenBy}</p>
                    <p className="text-base font-black text-cogray-900 dark:text-white uppercase tracking-tight">{article.author}</p>
                  </div>
                </div>
                <div className="h-10 w-[1px] bg-cogray-100 dark:bg-cogray-900 hidden sm:block"></div>
                <div className="flex items-center gap-6 text-cogray-500">
                  <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-conime-600" /><span className="text-xs font-bold uppercase tracking-widest">{getLocalized(article.date, language)}</span></div>
                  <div className="flex items-center gap-2"><Eye className="w-5 h-5 text-conime-600" /><span className="text-xs font-bold uppercase tracking-widest">{formatNumber(article.views || 0)} {t.viewsLabel}</span></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowShareModal(true)} className="p-3 bg-cogray-50 dark:bg-cogray-900 text-cogray-400 hover:text-white hover:dark:text-white hover:bg-cogray-900 dark:hover:bg-conime-600 rounded-2xl transition-all border border-cogray-100 dark:border-cogray-800 shadow-sm" title="Share Article"><Share2 className="w-5 h-5" /></button>
                <button onClick={onToggleBookmark} className={`p-3 rounded-2xl transition-all border shadow-sm ${isBookmarked ? 'bg-conime-500/10 text-conime-500 border-conime-500/20' : 'bg-cogray-50 dark:bg-cogray-900 text-cogray-400 hover:text-white hover:dark:text-white hover:bg-cogray-900 dark:hover:bg-conime-600 border-cogray-100 dark:border-cogray-800'}`} title="Bookmark Article"><Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} /></button>
              </div>
            </div>
          </div>

          <div className="mb-16 space-y-6">
            <div className="relative rounded-[40px] overflow-hidden border border-cogray-100 dark:border-cogray-900 shadow-2xl">
              <img src={article.imageUrl} alt={getLocalized(article.title, language)} className="w-full h-full object-cover max-h-[850px] min-h-[450px]" />
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
              {article.imageCaption && (
                <div className="flex items-start md:items-center gap-2 max-w-2xl">
                   <div className="w-1.5 h-1.5 rounded-full bg-conime-600 shrink-0 mt-1.5"></div>
                   <p className="text-[10px] md:text-xs font-bold text-cogray-500 dark:text-cogray-400 uppercase tracking-widest leading-relaxed">{getLocalized(article.imageCaption, language)}</p>
                </div>
              )}
              {article.imageSource && (
                <div className="flex items-center gap-2 bg-cogray-50 dark:bg-cogray-900 px-3 py-1.5 rounded-xl border border-cogray-100 dark:border-cogray-800 shrink-0 self-start md:self-auto">
                  <Camera className="w-3 h-3 text-conime-600" />
                  <span className="text-[9px] font-black text-cogray-400 dark:text-cogray-600 uppercase tracking-tighter">{t.imageSourceLabel}: <a href={article.imageSourceUrl || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-conime-600 transition-colors">{article.imageSource}</a></span>
                </div>
              )}
            </div>

            {article.videoUrl && (
              <div className="mt-12 space-y-6 pt-12 border-t border-cogray-100 dark:border-cogray-900">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600/10 rounded-xl flex items-center justify-center text-red-600"><Youtube className="w-5 h-5" /></div>
                    <span className="text-xs font-black text-cogray-900 dark:text-white uppercase tracking-[0.2em]">{article.videoLabel ? getLocalized(article.videoLabel, language) : t.defaultVideoLabel}</span>
                  </div>
                  {article.videoSource && (
                    <div className="flex items-center gap-2 bg-cogray-50 dark:bg-cogray-900 px-3 py-1.5 rounded-xl border border-cogray-100 dark:border-cogray-800 self-start md:self-auto">
                      <Video className="w-3 h-3 text-conime-600" />
                      <span className="text-[9px] font-black text-cogray-400 dark:text-cogray-600 uppercase tracking-tighter">{t.videoSourceLabel}: <a href={article.videoSourceUrl || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-conime-600 transition-colors">{article.videoSource}</a></span>
                    </div>
                  )}
                </div>
                <div className="relative rounded-[40px] overflow-hidden aspect-video border border-cogray-100 dark:border-cogray-900 shadow-2xl bg-black max-w-5xl">
                  <iframe src={`${getEmbedUrl(article.videoUrl)}?rel=0&modestbranding=1`} className="absolute inset-0 w-full h-full" allowFullScreen title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                </div>
              </div>
            )}
          </div>

          <div className="article-content max-w-none text-left" ref={articleContentRef}>
            <div className="text-cogray-800 dark:text-cogray-300 leading-[1.8] space-y-8 font-medium">
              {paragraphs.map((paragraph, i) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;
                // Render already handled by replace regex above, but we need to inject it
                // Note: The regex replacements for headers/blockquotes should ideally happen BEFORE split if they span multiple lines
                // But for simplicity with the current structure where split is by double newline, blockquotes might be one chunk.
                
                return (
                  <React.Fragment key={i}>
                    <div className="text-lg md:text-xl" dangerouslySetInnerHTML={{ __html: renderMarkdown(trimmed) }} />
                    {i === point1 && inlineRec1 && <RelatedInline item={inlineRec1} title={t.readAlso} />}
                    {i === point2 && inlineRec2 && <RelatedInline item={inlineRec2} title={t.readAlso} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

      <div className="mt-20 space-y-10 animate-in fade-in duration-700">
               {article.gallery && article.gallery.length > 0 && (
                 <>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-conime-600/10 rounded-2xl flex items-center justify-center text-conime-600"><ImageIcon className="w-5 h-5" /></div>
                      <h2 className="text-2xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter">{t.visualGallery}</h2>
                      <div className="h-[1px] flex-grow bg-cogray-100 dark:bg-cogray-900"></div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {article.gallery.map((img, idx) => (
                        <div key={idx} className="group relative">
                           {img.videoUrl ? (
                             <div className="aspect-video rounded-[32px] overflow-hidden border border-cogray-100 dark:border-cogray-800 shadow-lg bg-black relative">
                                <iframe 
                                  src={`${getEmbedUrl(img.videoUrl)}?rel=0`} 
                                  className="w-full h-full" 
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                  allowFullScreen 
                                  title={img.caption?.[language] || "Gallery Video"}
                                />
                             </div>
                           ) : (
                             <div onClick={() => setLightboxIndex(idx)} className="aspect-[4/3] rounded-[32px] overflow-hidden border border-cogray-100 dark:border-cogray-800 shadow-lg bg-cogray-100 dark:bg-cogray-900 cursor-zoom-in relative">
                                <img src={getThumbnail(img)} alt={img.caption?.[language] || "Gallery item"} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-90" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Zap className="w-8 h-8 text-white animate-pulse" /></div>
                             </div>
                           )}
                           <div className="mt-3 space-y-1.5 px-4">
                              {img.videoUrl && <p className="text-[10px] font-black text-conime-600 uppercase tracking-widest">{img.videoLabel ? getLocalized(img.videoLabel, language) : t.defaultVideoLabel}</p>}
                              {img.caption && (
                                <div className="flex items-start gap-3">
                                   <div className="w-1 h-3.5 bg-cogray-200 dark:bg-cogray-800 rounded-full shrink-0 mt-0.5"></div>
                                    <p className="text-[10px] font-bold text-cogray-500 dark:text-cogray-400 uppercase tracking-widest leading-relaxed line-clamp-2">{getLocalized(img.caption, language)}</p>
                                </div>
                              )}
                              {(img.source || article.imageSource) && (
                                <div className="flex items-center gap-2">
                                  {img.videoUrl ? <Video className="w-3 h-3 text-conime-600/50" /> : <Camera className="w-3 h-3 text-conime-600/50" />}
                                  <span className="text-[9px] font-black text-cogray-400 dark:text-cogray-700 uppercase tracking-tighter">{img.videoUrl ? t.videoSourceLabel : t.imageSourceLabel}: <span className="source-link uppercase">{img.source || article.imageSource}</span></span>
                                </div>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>
                 </>
               )}
            </div>

          {lightboxIndex !== null && article.gallery && (
            <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in duration-300">
               <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden py-20" onMouseDown={zoomLevel > 1 ? handlePanStart : undefined} onMouseMove={handlePanMove} onMouseUp={handlePanEnd} onMouseLeave={handlePanEnd} onTouchStart={handlePanStart} onTouchMove={handlePanMove} onTouchEnd={handlePanEnd}>
                  <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '1000px' }}>
                     {getEmbedUrl(article.gallery[lightboxIndex].videoUrl) ? (
                       <div className="w-full h-full max-w-7xl max-h-screen aspect-video flex items-center justify-center p-4 md:p-16 lg:p-32">
                         <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/10"><iframe src={`${getEmbedUrl(article.gallery[lightboxIndex].videoUrl)}?rel=0&autoplay=1`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
                       </div>
                     ) : (
                       <div className={`relative transition-transform duration-100 ease-out select-none ${zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`} style={{ transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`, touchAction: 'none' }} onMouseDown={zoomLevel > 1 ? handlePanStart : (e) => { if (e.detail === 2) setZoomLevel(1); else if (zoomLevel === 1) handleZoom(0.5); }}>
                         <img ref={imageRef} src={article.gallery[lightboxIndex].url} alt="Large view" className="max-w-screen max-h-screen object-contain drop-shadow-2xl" draggable={false} />
                       </div>
                     )}
                  </div>
               </div>
               <div className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-6 md:p-8 bg-gradient-to-b from-black/90 via-black/50 to-transparent transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`} onMouseEnter={() => { if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current); setShowControls(true); }}>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-conime-600 border border-white/10 backdrop-blur-md">{getEmbedUrl(article.gallery[lightboxIndex].videoUrl) ? <Play className="w-6 h-6 fill-current" /> : <ImageIcon className="w-6 h-6" />}</div>
                     <div className="min-w-0 hidden md:block">
                         <h4 className="text-white font-black uppercase text-sm tracking-[0.1em] truncate max-w-[180px] md:max-w-md">{getEmbedUrl(article.gallery[lightboxIndex].videoUrl) ? (article.gallery[lightboxIndex].videoLabel ? getLocalized(article.gallery[lightboxIndex].videoLabel, language) : t.defaultVideoLabel) : t.visualGallery}</h4>
                        <p className="text-cogray-400 text-[10px] font-bold uppercase tracking-[0.2em]">{lightboxIndex + 1} / {article.gallery.length} • {zoomLevel > 1 ? `${Math.round(zoomLevel * 100)}%` : 'FIT'}</p>
                     </div>
                  </div>
                  {!getEmbedUrl(article.gallery[lightboxIndex].videoUrl) && (
                    <div className="hidden md:flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl mx-auto">
                       <button onClick={() => handleZoom(-0.5)} className="p-3 text-white hover:bg-white/10 rounded-xl transition-all" disabled={zoomLevel <= 1}><ZoomOut className="w-5 h-5" /></button>
                       <div className="w-[1px] h-6 bg-white/10"></div>
                       <button onClick={() => setZoomLevel(1)} className="p-3 text-white hover:bg-white/10 rounded-xl transition-all" title="Reset"><RotateCcw className="w-4 h-4" /></button>
                       <div className="w-[1px] h-6 bg-white/10"></div>
                       <button onClick={() => handleZoom(0.5)} className="p-3 text-white hover:bg-white/10 rounded-xl transition-all" disabled={zoomLevel >= 4}><ZoomIn className="w-5 h-5" /></button>
                    </div>
                  )}
                  <button onClick={() => setLightboxIndex(null)} className="w-12 h-12 rounded-2xl bg-white/5 text-white flex items-center justify-center hover:bg-red-600/80 transition-all border border-white/10 backdrop-blur-md shadow-lg"><X className="w-6 h-6" /></button>
               </div>
               <button onClick={(e) => { e.stopPropagation(); handlePrevImage(); }} className={`absolute left-4 md:left-8 z-50 w-14 h-14 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-conime-600 transition-all border border-white/10 backdrop-blur-md ${lightboxIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-100'} ${showControls ? '' : '!opacity-0 pointer-events-none'}`} disabled={lightboxIndex === 0} onMouseEnter={() => setShowControls(true)}><ChevronLeft className="w-8 h-8" /></button>
               <button onClick={(e) => { e.stopPropagation(); handleNextImage(); }} className={`absolute right-4 md:right-8 z-50 w-14 h-14 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-conime-600 transition-all border border-white/10 backdrop-blur-md ${(article.gallery?.length && lightboxIndex === article.gallery.length - 1) ? 'opacity-20 cursor-not-allowed' : 'opacity-100'} ${showControls ? '' : '!opacity-0 pointer-events-none'}`} disabled={article.gallery && lightboxIndex === article.gallery.length - 1} onMouseEnter={() => setShowControls(true)}><ChevronRight className="w-8 h-8" /></button>
               <div className={`absolute bottom-0 left-0 right-0 z-50 flex flex-col items-center pb-8 pt-20 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`} onMouseEnter={() => setShowControls(true)}>
                  <div className="bg-black/40 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/10 shadow-lg mb-6 max-w-2xl text-center pointer-events-auto mx-4"><p className="text-white text-sm md:text-base font-bold uppercase tracking-tight leading-tight">{getLocalized(article.gallery[lightboxIndex].caption, language) || getLocalized(article.title, language)}</p>{(article.gallery[lightboxIndex].source || article.imageSource) && (<div className="flex items-center justify-center gap-3 mt-2 opacity-60"><div className="h-[1px] w-6 bg-white"></div><p className="text-[9px] font-black uppercase tracking-[0.2em] text-white">{getEmbedUrl(article.gallery[lightboxIndex].videoUrl) ? t.videoSourceLabel : t.imageSourceLabel}: {article.gallery[lightboxIndex].source || article.imageSource}</p><div className="h-[1px] w-6 bg-white"></div></div>)}</div>
                  <div className="flex justify-center gap-3 overflow-x-auto no-scrollbar w-full px-4 pointer-events-auto">
                     {article.gallery.map((thumb, tIdx) => (
                       <button key={tIdx} onClick={() => setLightboxIndex(tIdx)} className={`w-14 md:w-16 aspect-video rounded-lg overflow-hidden border-2 transition-all shrink-0 relative hover:scale-105 ${lightboxIndex === tIdx ? 'border-conime-600 opacity-100 ring-2 ring-conime-600/30' : 'border-white/10 opacity-40 hover:opacity-100 grayscale hover:grayscale-0'}`}><img src={thumb.url} className="w-full h-full object-cover" />{thumb.videoUrl && <div className="absolute inset-0 bg-conime-600/40 flex items-center justify-center"><Play className="w-3 h-3 text-white fill-current" /></div>}</button>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {(article.source || article.sourceUrl) && (
            <div className="mt-20 p-6 rounded-3xl bg-cogray-50/50 dark:bg-cogray-900/30 border border-cogray-100 dark:border-cogray-800/50 flex flex-col sm:flex-row items-start sm:items-center gap-4 group">
              <div className="flex items-center gap-2 text-conime-600"><LinkIcon className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">{t.sourceLabel}:</span></div>
              <span className="text-sm font-black text-cogray-900 dark:text-white uppercase tracking-tight"><a href={article.sourceUrl || "#"} target="_blank" rel="noopener noreferrer" className="source-link uppercase">{article.source || "OFFICIAL WEB"}</a></span>
            </div>
          )}

          {article.tags && article.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
               <div className="w-2 h-2 rounded-full bg-conime-600 shrink-0"></div>
               <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                 {article.tags.map((tag, i) => (
                      <button key={i} onClick={() => onTagClick(typeof tag === 'string' ? tag : tag.id)} className="text-sm font-black text-cogray-500 dark:text-cogray-400 hover:text-conime-600 transition-colors uppercase tracking-tight">#{getLocalized(tag, language).replace(/\s+/g, '').toUpperCase()}</button>
                 ))}
               </div>
            </div>
          )}

          <div className="mt-8 relative overflow-hidden rounded-[40px] bg-gradient-to-br from-conime-600 to-conime-800 p-8 md:p-12 text-white shadow-2xl shadow-conime-600/30 group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-1000"></div>
             <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="text-center lg:text-left space-y-4">
                   <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md"><Zap className="w-4 h-4 fill-current" /><span className="text-[10px] font-black uppercase tracking-widest">{t.stayConnected}</span></div>
                   <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">{t.socialCallToAction}</h3>
                   <p className="text-white/80 font-medium text-sm md:text-base max-w-md">{t.socialDesc}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                   <button className="flex items-center gap-3 bg-white text-conime-600 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-cogray-50 transition-all hover:-translate-y-1 active:scale-95"><Instagram className="w-5 h-5" /><span>INSTAGRAM</span></button>
                   <button className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all hover:-translate-y-1 active:scale-95"><Twitter className="w-5 h-5" /><span>TWITTER / X</span></button>
                </div>
             </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 py-8 border-b border-cogray-100 dark:border-cogray-900">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                 <button onClick={handleLike} className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 md:px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${isLiked ? 'bg-conime-500 text-white shadow-conime-500/30 ring-2 ring-conime-500/20' : 'bg-conime-500/10 text-conime-500 hover:bg-conime-500 hover:text-white hover:dark:text-white'}`}>
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="inline">{t.likeLabel}</span>
                    <span className="opacity-60">({formatNumber(likeCount)})</span>
                 </button>
                 <button onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })} className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 md:px-8 py-4 rounded-full bg-cogray-900 text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:bg-cogray-800 active:scale-95`}>
                    <MessageCircle className="w-4 h-4" />
                    <span className="inline">{t.commentLabel}</span>
                    <span className="opacity-60">(128)</span>
                 </button>
              </div>

              <div className="flex items-center gap-3">
                 <button onClick={() => setShowShareModal(true)} className="p-4 bg-cogray-900 text-cogray-400 hover:text-white hover:dark:text-white rounded-2xl transition-colors border border-cogray-800" title={t.shareLabel}><Share2 className="w-5 h-5" /></button>
                 <button onClick={onToggleBookmark} className={`p-4 rounded-2xl transition-all border ${isBookmarked ? 'bg-conime-500/10 text-conime-500 border-conime-500/20' : 'bg-cogray-900 text-cogray-400 hover:text-white hover:dark:text-white border-cogray-800'}`} title="Bookmark"><Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} /></button>
                 <button onClick={() => {
                   const articleUrl = window.location.href;
                   window.open(`mailto:${SOCIAL_LINKS.emailReport}?subject=Report: ${article.title}&body=Link: ${articleUrl}%0D%0A%0D%0AReason for reporting:`, '_blank');
                 }} className="p-4 bg-cogray-900 text-cogray-400 hover:text-red-500 hover:dark:text-red-500 rounded-2xl transition-colors border border-cogray-800" title="Report"><Flag className="w-5 h-5" /></button>
              </div>
          </div>
        </article>

        <CommentsSection language={language} currentUser={currentUser} onLoginClick={onLoginClick} />
        <div className="mt-20 mb-40">
          <h2 className="text-3xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter mb-10">{t.relatedArticles}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {gridRelated.map((rel) => (
              <div key={rel.id} onClick={() => onArticleClick(rel.id)} className="group cursor-pointer">
                <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-6 border border-cogray-100 dark:border-cogray-800 shadow-lg group-hover:shadow-2xl transition-all relative"><img src={rel.imageUrl} alt={getLocalized(rel.title, language)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /></div>
                <div className="mb-3"><button onClick={(e) => { e.stopPropagation(); onCategoryClick(getLocalized(rel.category, 'en')); }} className={`inline-block px-3 py-1 rounded-lg border border-conime-600/30 text-[10px] font-black uppercase tracking-widest text-conime-600 dark:text-conime-500 bg-transparent hover:bg-conime-600 hover:text-white hover:dark:text-white transition-all`}>{getLocalized(rel.category, language)}</button></div>
                <h3 className="text-base font-black text-cogray-800 dark:text-cogray-100 uppercase leading-snug line-clamp-2 group-hover:text-conime-600 transition-colors tracking-tight">{getLocalized(rel.title, language)}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:w-1/4">
        <Sidebar language={language} onArticleClick={onArticleClick} onCategoryClick={onCategoryClick} history={history} articles={articles} />
      </div>
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title={getLocalized(article.title, language)} url={`https://conime.id${getArticleLink(article)}`} language={language} />
    </div>
  );
};

export default ArticleDetail;
