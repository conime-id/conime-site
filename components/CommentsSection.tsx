import React, { useState } from 'react';
import { Send, Heart, Reply, MoreHorizontal, Flag, Link2, ChevronDown, Trash2, XCircle } from 'lucide-react';
import { Comment } from '../types';
import { TRANSLATIONS } from '../constants';
import { getLocalized } from '../utils/localization';

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
  handleReply: (e: React.FormEvent) => void;
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
  const [showReplies, setShowReplies] = useState(false);
  const isOwner = currentUser && comment.username === currentUser.username;

  // Auto-expand if a new reply is added (simple check if replies length > 0 we could default to open, but that's messy)
  // Instead, let's leave it as explicit user action to toggle, BUT if the user is writing a reply, we can auto-open it after submission?
  // We'll leave it simple for now to avoid bugs.
  
  return (
    <div className={`group flex flex-col gap-6 animate-in fade-in duration-500 ${isReply ? 'ml-10 md:ml-16 mt-6 border-l-2 border-cogray-100 dark:border-cogray-800 pl-6' : ''}`}>
      <div className="flex gap-6">
        <div className="shrink-0">
          <div className={`${isReply ? 'w-10 h-10' : 'w-14 h-14'} rounded-2xl bg-cogray-100 dark:bg-cogray-900 border border-cogray-200 dark:border-cogray-800 overflow-hidden flex items-center justify-center font-black ${isReply ? 'text-sm' : 'text-xl'} text-cogray-400 group-hover:border-conime-600/30 transition-all`}>
            {comment.avatar.length > 2 ? (
              <img src={comment.avatar} alt={comment.user} className="w-full h-full object-cover" />
            ) : comment.avatar}
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className={`${isReply ? 'text-sm' : 'text-base'} font-black text-cogray-900 dark:text-white tracking-tight`}>{comment.user}</span>
              <div className="w-1 h-1 rounded-full bg-cogray-200 dark:bg-cogray-800"></div>
              <span className="text-[10px] font-bold text-cogray-400 uppercase tracking-widest">{getLocalized(comment.date, language)}</span>
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
                        // Optional: show a toast notification here
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
                          window.open(`mailto:report@conime.id?subject=Report Comment: ${comment.user}&body=Reason for reporting comment ID ${comment.id}:`, '_blank');
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
              <span>{comment.likes}</span><span className="hidden md:inline">{t.likesLabel}</span>
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
          <form onSubmit={handleReply} className="bg-cogray-50 dark:bg-cogray-900/50 p-4 rounded-2xl border border-cogray-100 dark:border-cogray-800 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-cogray-200 dark:border-cogray-800">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.username} className="w-full h-full object-cover" />
                ) : <div className="w-full h-full flex items-center justify-center bg-conime-600 text-white font-black text-[10px]">U</div>}
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
  language: 'id' | 'en';
  currentUser: any;
  onLoginClick: () => void;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    user: 'Kaito Shinpachi',
    username: 'kaito_shinpachi',
    avatar: 'K',
    text: 'Visualnya gila banget sih kalau beneran digarap sama studio itu. Gak sabar nunggu rilis resminya!',
    date: { id: '2 jam yang lalu', en: '2 hours ago' },
    likes: 24,
    replies: [
      {
        id: 'r1',
        user: 'Nezuko Fan',
        username: 'nezuko_fan',
        avatar: 'N',
        text: 'Setuju banget! Ufotable kayaknya bakal dapet.',
        date: { id: '1 jam yang lalu', en: '1 hour ago' },
        likes: 5
      }
    ]
  },
  {
    id: 'c2',
    user: 'Haruki Kun',
    username: 'haruki_kun',
    avatar: 'H',
    text: 'Sakamoto Days akhirnya dapet adaptasi! Semoga koreografi aksinya tetep sekeren di manganya.',
    date: { id: '5 jam yang lalu', en: '5 hours ago' },
    likes: 12
  }
];

const CommentsSection: React.FC<CommentsSectionProps> = ({ language, currentUser, onLoginClick }) => {
  const t = (TRANSLATIONS[language] as any);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [visibleComments, setVisibleComments] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      user: currentUser?.displayName || currentUser?.username || 'User_CoNime',
      username: currentUser?.username || 'user_conime',
      avatar: currentUser?.avatar || 'U',
      text: commentText,
      date: { 
        id: 'Baru saja', 
        en: 'Just now' 
      },
      likes: 0
    };

    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !replyingTo) return;
    
    const newReply: Comment = {
      id: Date.now().toString(),
      user: currentUser?.displayName || currentUser?.username || 'User_CoNime',
      username: currentUser?.username || 'user_conime',
      avatar: currentUser?.avatar || 'U',
      text: replyText,
      date: { id: 'Baru saja', en: 'Just now' },
      likes: 0
    };

    setComments(comments.map(c => {
      if (c.id === replyingTo) {
        return { ...c, replies: [newReply, ...(c.replies || [])] };
      }
      return c;
    }));
    
    setReplyText('');
    setReplyingTo(null);
  };

  const handleDelete = (commentId: string) => {
    // Recursive delete function to find and remove from top-level or nested replies
    const deleteRecursive = (list: Comment[]): Comment[] => {
      return list
        .filter(c => c.id !== commentId)
        .map(c => ({
          ...c,
          replies: c.replies ? deleteRecursive(c.replies) : undefined
        }));
    };
    
    setComments(deleteRecursive(comments));
  };

  return (
    <section id="comments" className="mt-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-5 mb-10">
        <div className="w-1.5 h-10 bg-conime-600 rounded-full"></div>
        <h2 className="text-3xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter">
          {t.commentLabel} ({comments.length + 126})
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
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.username} className="w-full h-full object-cover" />
              ) : <div className="w-full h-full flex items-center justify-center font-black text-xl">U</div>}
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
            handleReply={(e) => {
              handleReply(e);
              // We rely on the parent updating the state, and potentially the child component re-rendering.
              // Logic to auto-open relies on the fact that if a user just replied, they probably want to see it.
              // However, since state is inside CommentItem, we might need a signal or just leave it manual for now
              // to keep it simple, OR we can force it open if we uplift state. 
              // A simpler UX: After replying, showing a "Reply sent" toast or just manual expand is acceptable.
              // BUT, to make it "langsung terlihat", we ideally want it to expand.
              // Let's stick to the core task first.
            }}
            handleDelete={handleDelete}
            t={t}
            // Pass a prop to force open if needed, or just let user expand.
            // For this iteration, we keep it simple as user asked "should it auto hide?".
            // Defaulting to hidden is standard.
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
