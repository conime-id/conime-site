import React, { useState, useEffect } from 'react';
import { Send, Heart, Reply, MoreHorizontal, Flag, Link2, ChevronDown, Trash2, XCircle } from 'lucide-react';
import { Comment } from '../types';
import { TRANSLATIONS, SOCIAL_LINKS } from '../constants';
import { getLocalized } from '../utils/localization';
import { formatNumber } from '../utils/format';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  updateDoc,
  increment
} from 'firebase/firestore';

interface CommentItemProps {
  comment: Comment;
  language: 'id' | 'en';
  currentUser: any;
  onLoginClick: () => void;
  isReply?: boolean;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  handleReply: (e: React.FormEvent, parentId: string) => void;
  handleDelete: (commentId: string) => void;
  t: any;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  language, 
  currentUser, 
  onLoginClick,
  isReply = false,
  activeMenu,
  setActiveMenu,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  handleReply,
  handleDelete,
  t
}) => {
  const [showReplies, setShowReplies] = useState(true);
  // Check ownership: match by userId if available, fallback to username
  const isOwner = currentUser && (
    (comment.userId && currentUser.id && comment.userId === currentUser.id) || 
    (comment.username === currentUser.username)
  );

  // Helper to generate consistent random background color from string (username)
  // Excluding brand red/conime colors (approx hue 340-360 & 0-20)
  const getAvatarColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate HSL
    // Hue: 0-360. We want to avoid approx 330-360 and 0-15 (Red/Pink range)
    // Safe ranges: 20-330
    const hue = Math.abs(hash % 310) + 20; 
    return `hsl(${hue}, 70%, 85%)`; // Pastel background
  };

  const avatarBg = React.useMemo(() => {
     return getAvatarColor(comment.username || 'user');
  }, [comment.username]);

  const timeAgo = (date: any) => {
    if (!date) return '';
    // Handle Firestore Timestamp or serialized object
    const seconds = date.seconds ? date.seconds : (typeof date === 'object' && date.id ? Date.now()/1000 : 0); // Fallback
    
    // If it's the specific Date logic from before
    if (date.id && date.en) return getLocalized(date, language);

    // Calc from timestamp
    const now = Math.floor(Date.now() / 1000);
    const diff = now - seconds;
    
    if (diff < 60) return language === 'id' ? 'Baru saja' : 'Just now';
    if (diff < 3600) return `${Math.floor(diff/60)} ${language === 'id' ? 'menit' : 'mins'}`;
    if (diff < 86400) return `${Math.floor(diff/3600)} ${language === 'id' ? 'jam' : 'hours'}`;
    return `${Math.floor(diff/86400)} ${language === 'id' ? 'hari' : 'days'}`;
  };

  return (
    <div id={`comment-${comment.id}`} className={`group flex flex-col gap-6 animate-in fade-in duration-500 ${isReply ? 'ml-10 md:ml-16 mt-6 border-l-2 border-cogray-100 dark:border-cogray-800 pl-6' : ''}`}>
      <div className="scroll-mt-32 flex gap-6">
        <div className="shrink-0">
          <div 
            className={`${isReply ? 'w-10 h-10' : 'w-14 h-14'} rounded-2xl border border-cogray-200 dark:border-cogray-800 overflow-hidden flex items-center justify-center font-black ${isReply ? 'text-sm' : 'text-xl'} text-cogray-400 group-hover:border-conime-600/30 transition-all`}
            style={{ backgroundColor: comment.avatar ? 'transparent' : avatarBg }}
          >
            <img 
              src={comment.avatar && comment.avatar.length > 2 ? comment.avatar : '/icons/avatar-robot.svg'} 
              alt={comment.user} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icons/default.png';
              }} 
            />
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className={`${isReply ? 'text-sm' : 'text-base'} font-black text-cogray-900 dark:text-white tracking-tight`}>{comment.user}</span>
              <div className="w-1 h-1 rounded-full bg-cogray-200 dark:bg-cogray-800"></div>
              <span className="text-[10px] font-bold text-cogray-400 uppercase tracking-widest">{typeof comment.date === 'object' && comment.date.id ? getLocalized(comment.date, language) : timeAgo(comment.date)}</span>
            </div>
            <div className="relative">
              <button 
                onClick={() => setActiveMenu(activeMenu === comment.id ? null : comment.id)}
                className="text-cogray-300 hover:text-conime-600 p-1 rounded-lg hover:bg-cogray-50 dark:hover:bg-cogray-900 transition-all"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              {activeMenu === comment.id && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setActiveMenu(null)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-cogray-950 border border-cogray-100 dark:border-cogray-800 rounded-2xl shadow-xl z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      onClick={() => {
                        const baseUrl = window.location.origin + window.location.pathname;
                        const commentUrl = `${baseUrl}#comment-${comment.id}`;
                        navigator.clipboard.writeText(commentUrl);
                        setActiveMenu(null);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-cogray-700 dark:text-cogray-300 hover:bg-cogray-50 dark:hover:bg-cogray-900 transition-colors border-b border-cogray-50 dark:border-cogray-900"
                    >
                      <Link2 className="w-4 h-4" />
                      <span>{language === 'id' ? 'Salin Tautan' : 'Copy Link'}</span>
                    </button>
                    {isOwner ? (
                      <button 
                        onClick={() => { handleDelete(comment.id); setActiveMenu(null); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{language === 'id' ? 'Hapus Komentar' : 'Delete Comment'}</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          const baseUrl = window.location.origin + window.location.pathname;
                          const commentUrl = `${baseUrl}#comment-${comment.id}`;
                          window.open(`mailto:${SOCIAL_LINKS.emailReport}?subject=Report Comment: ${comment.user}&body=Comment Link: ${commentUrl}%0D%0A%0D%0AReason for reporting:`, '_blank');
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-cogray-700 dark:text-cogray-300 hover:bg-cogray-50 dark:hover:bg-cogray-900 transition-colors"
                      >
                        <Flag className="w-4 h-4 text-red-500" />
                        <span>{language === 'id' ? 'Laporkan' : 'Report'}</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <p className={`${isReply ? 'text-sm' : 'text-base'} text-cogray-600 dark:text-cogray-300 leading-relaxed font-medium mb-4`}>
            {comment.text}
          </p>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cogray-400 hover:text-conime-600 transition-colors">
              <Heart className="w-4 h-4" />
              <span>{formatNumber(comment.likes)}</span><span className="hidden md:inline">{t.likesLabel}</span>
            </button>
            {!isReply && (
              <button 
                onClick={() => {
                  if (!currentUser) { onLoginClick(); return; }
                  setReplyingTo(replyingTo === comment.id ? null : comment.id);
                }}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${replyingTo === comment.id ? 'text-conime-600' : 'text-cogray-400 hover:text-conime-600'}`}
              >
                <Reply className="w-4 h-4" />
                <span>{t.replyLabel}</span>
              </button>
            )}
            {comment.replies && comment.replies.length > 0 && (
              <button 
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-conime-600 hover:underline"
              >
                <ChevronDown className={`w-3 h-3 transition-transform ${showReplies ? 'rotate-180' : ''}`} />
                <span>{showReplies 
                  ? (language === 'id' ? 'Sembunyikan Balasan' : 'Hide Replies') 
                  : `${comment.replies.length} ${language === 'id' ? 'Balasan' : 'Replies'}`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reply Input Area */}
      {replyingTo === comment.id && (
        <div className="ml-14 pl-6 border-l-2 border-cogray-100 dark:border-cogray-800 animate-in slide-in-from-top-2 duration-300">
          <form onSubmit={(e) => handleReply(e, comment.id)} className="bg-cogray-50 dark:bg-cogray-900/50 p-4 rounded-2xl border border-cogray-100 dark:border-cogray-800 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-cogray-200 dark:border-cogray-800 flex items-center justify-center bg-cogray-100 dark:bg-cogray-800 text-white font-black text-[10px]">
                <img 
                  src={currentUser?.avatar || '/icons/default.png'} 
                  alt={currentUser?.username || 'User'} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/icons/default.png';
                  }} 
                />
              </div>
              <div className="flex-grow relative flex items-center">
                <input 
                  autoFocus
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={language === 'id' ? `Balas @${comment.username}...` : `Reply to @${comment.username}...`}
                  className="w-full bg-transparent border-none text-sm font-bold text-cogray-900 dark:text-white focus:outline-none placeholder:text-cogray-400 tracking-tight pr-8"
                />
                {replyText && (
                  <button 
                    type="button"
                    onClick={() => setReplyText('')}
                    className="absolute right-0 text-cogray-300 hover:text-conime-600 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3">
              <button 
                type="button"
                onClick={() => { setReplyingTo(null); setReplyText(''); }}
                className="text-[10px] font-black text-cogray-400 hover:text-red-500 uppercase tracking-widest px-4 py-2 transition-colors"
              >
                {t.cancel}
              </button>
              <button 
                type="submit"
                disabled={!replyText.trim()}
                className="bg-conime-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-conime-700 transition-all shadow-lg shadow-conime-600/20 disabled:opacity-50 flex items-center gap-2"
              >
                <span>{language === 'id' ? 'KIRIM' : 'REPLY'}</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Nested Replies */}
      {showReplies && comment.replies && (
        <div className="space-y-2">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              isReply 
              language={language}
              currentUser={currentUser}
              onLoginClick={onLoginClick}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              handleReply={handleReply}
              handleDelete={handleDelete}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CommentsSectionProps {
  articleId?: string;
  language: 'id' | 'en';
  currentUser: any;
  onLoginClick: () => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId, language, currentUser, onLoginClick }) => {
  const t = (TRANSLATIONS[language] as any);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [visibleComments, setVisibleComments] = useState(5);

  // Subscribe to comments
  useEffect(() => {
    if (!articleId) return;

    const q = query(
      collection(db, 'comments'),
      where('articleId', '==', articleId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allDocs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        date: doc.data().createdAt // Use createdAt for sorting/display
      })) as any[];

      // Reconstruct tree
      const rootComments: Comment[] = [];
      const replyMap: {[key: string]: Comment[]} = {};

      // First pass: gather replies
      allDocs.forEach(c => {
        if (c.parentId) {
          if (!replyMap[c.parentId]) replyMap[c.parentId] = [];
          replyMap[c.parentId].push(c);
        }
      });

      // Second pass: gather roots and attach replies
      allDocs.forEach(c => {
        if (!c.parentId) {
          // Sort replies by time ascending usually, but here whatever
          const replies = replyMap[c.id] ? replyMap[c.id].sort((a: any, b: any) => a.date?.seconds - b.date?.seconds) : [];
          rootComments.push({ ...c, replies });
        }
      });

      setComments(rootComments);
    });

    return () => unsubscribe();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    try {
      await addDoc(collection(db, 'comments'), {
        articleId,
        text: commentText,
        userId: currentUser.id,
        user: currentUser.displayName,
        username: currentUser.username || 'user',
        avatar: currentUser.avatar,
        likes: 0,
        createdAt: serverTimestamp(),
      });
      setCommentText('');
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyText.trim() || !currentUser) return;
    
    try {
      await addDoc(collection(db, 'comments'), {
        articleId,
        parentId,
        text: replyText,
        userId: currentUser.id,
        user: currentUser.displayName,
        username: currentUser.username || 'user',
        avatar: currentUser.avatar,
        likes: 0,
        createdAt: serverTimestamp(),
      });
      
      setReplyText('');
      setReplyingTo(null);
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm(language === 'id' ? 'Hapus komentar ini?' : 'Delete this comment?')) return;
    try {
      // NOTE: In a real app, we should also delete nested replies recursively or via Cloud Functions.
      // For now, we only delete the document. Orphaned replies might stay or we hide them client side.
      await deleteDoc(doc(db, 'comments', commentId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (!articleId) return null;

  return (
    <section id="comments" className="mt-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-5 mb-10">
        <div className="w-1.5 h-10 bg-conime-600 rounded-full"></div>
        <h2 className="text-3xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter">
          {t.commentLabel} ({formatNumber(comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0))})
        </h2>
      </div>

      {/* Comment Form */}
      <div className="bg-cogray-50 dark:bg-cogray-900/40 border border-cogray-100 dark:border-cogray-800 rounded-[32px] p-6 md:p-8 mb-12 shadow-sm relative overflow-hidden group/form">
        {!currentUser && (
          <div className="absolute inset-0 z-10 bg-white/40 dark:bg-cogray-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
             <div className="mb-4 p-4 bg-white dark:bg-cogray-900 rounded-[24px] shadow-xl border border-cogray-100 dark:border-cogray-800 group-hover/form:scale-105 transition-transform duration-500">
                <p className="text-sm font-black text-cogray-900 dark:text-white uppercase tracking-tighter mb-1">
                  {language === 'id' ? 'Gabung dalam Percakapan' : 'Join the Conversation'}
                </p>
                <p className="text-[10px] font-bold text-cogray-400 uppercase tracking-widest leading-relaxed px-4">
                  {language === 'id' ? 'Login sekarang untuk mulai berbagi opini Anda dengan komunitas CoNime.' : 'Login now to start sharing your opinions with the CoNime community.'}
                </p>
             </div>
             <button 
               onClick={onLoginClick}
               className="bg-conime-600 hover:bg-conime-700 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-conime-600/20 active:scale-95 group-hover/form:scale-110"
             >
               {language === 'id' ? 'Login untuk Berkomentar' : 'Login to Comment'}
             </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={`space-y-6 transition-all duration-500 ${!currentUser ? 'opacity-20 blur-[1px]' : ''}`}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-conime-600 flex items-center justify-center font-black text-white shrink-0 shadow-lg shadow-conime-600/20">
              <img 
                src={currentUser?.avatar || '/icons/default.png'} 
                alt={currentUser?.username || 'User'} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icons/default.png';
                }}
              />
            </div>
            <div className="flex-grow relative">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={!currentUser}
                placeholder={language === 'id' ? 'TULIS KOMENTAR ANDA...' : 'WRITE YOUR COMMENT...'}
                className="w-full bg-white dark:bg-cogray-950 border border-cogray-200 dark:border-cogray-800 rounded-2xl p-4 md:p-6 text-sm font-bold text-cogray-800 dark:text-white placeholder:text-cogray-300 dark:placeholder:text-cogray-700 focus:outline-none focus:ring-2 focus:ring-conime-600/20 focus:border-conime-600 transition-all resize-none h-32 tracking-tight pr-12"
              />
              {commentText && (
                <button 
                  type="button"
                  onClick={() => setCommentText('')}
                  className="absolute right-4 top-4 text-cogray-300 hover:text-conime-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="flex items-center gap-3 bg-conime-600 hover:bg-conime-700 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-conime-600/20 active:scale-95 disabled:opacity-50"
            >
              <span>{language === 'id' ? 'KIRIM' : 'POST'}</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-10">
        {comments.slice(0, visibleComments).map((comment) => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            language={language}
            currentUser={currentUser}
            onLoginClick={onLoginClick}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            replyText={replyText}
            setReplyText={setReplyText}
            handleReply={handleReply}
            handleDelete={handleDelete}
            t={t}
          />
        ))}
      </div>

      {visibleComments < comments.length && (
        <div className="flex justify-center mt-12 pb-12">
          <button 
            onClick={() => setVisibleComments(prev => prev + 5)}
            className="flex items-center gap-2 px-8 py-3 bg-white dark:bg-cogray-900 border border-cogray-200 dark:border-cogray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-cogray-600 dark:text-cogray-300 hover:border-conime-600 hover:text-conime-600 transition-all shadow-lg shadow-cogray-200/20 dark:shadow-none active:scale-95"
          >
            {language === 'id' ? 'Tampilkan Lebih Banyak' : 'Load More Comments'}
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};

export default CommentsSection;
