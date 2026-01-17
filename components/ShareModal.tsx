import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Send 
} from 'lucide-react';
import { createPortal } from 'react-dom';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a0.5 0.5 0 0 0 1 0V9a0.5 0.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a0.5 0.5 0 0 0 0-1h-1a0.5 0.5 0 0 0 0 1" />
  </svg>
);

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  language: 'id' | 'en';
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, url, language }) => {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon className="w-6 h-6" strokeWidth={2.5} />,
      color: 'bg-[#25D366]',
      url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-6 h-6" strokeWidth={2.5} />,
      color: 'bg-[#1877F2]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },
    {
      name: 'Twitter / X',
      icon: <Twitter className="w-6 h-6" strokeWidth={2.5} />,
      color: 'bg-black',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    },
    {
      name: 'Telegram',
      icon: <Send className="w-6 h-6" strokeWidth={2.5} />,
      color: 'bg-[#0088cc]',
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-6 h-6" strokeWidth={2.5} />,
      color: 'bg-[#0A66C2]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
  ];

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-cogray-950/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white dark:bg-cogray-900 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-cogray-100 dark:border-cogray-800">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter">
              {language === 'id' ? 'Bagikan Artikel' : 'Share Article'}
            </h3>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-cogray-100 dark:bg-cogray-800 flex items-center justify-center text-cogray-500 hover:bg-cogray-200 dark:hover:bg-cogray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-8">
             <p className="text-[10px] font-bold text-cogray-400 uppercase tracking-widest mb-3">
               {language === 'id' ? 'Salin Tautan' : 'Copy Link'}
             </p>
             <div className="flex items-center gap-3 bg-cogray-50 dark:bg-cogray-950 border border-cogray-200 dark:border-cogray-800 rounded-2xl p-2 pr-4 relative overflow-hidden group">
                <div className="p-3 bg-white dark:bg-cogray-900 rounded-xl shadow-sm md:shadow-none pointer-events-none md:bg-transparent">
                   <div className="w-5 h-5 rounded-full bg-conime-600"></div>
                </div>
                <input 
                  type="text" 
                  readOnly 
                  value={url} 
                  className="bg-transparent border-none text-sm font-bold text-cogray-600 dark:text-cogray-300 flex-grow outline-none w-full truncate"
                />
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    copied 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                      : 'bg-conime-500 hover:bg-conime-600 text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? (language === 'id' ? 'Disalin' : 'Copied') : (language === 'id' ? 'Salin' : 'Copy')}</span>
                </button>
             </div>
          </div>

          <div>
             <p className="text-[10px] font-bold text-cogray-400 uppercase tracking-widest mb-4">
               {language === 'id' ? 'Atau Bagikan Ke' : 'Or Share To'}
             </p>
             <div className="grid grid-cols-5 gap-3">
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 group/icon"
                    title={link.name}
                  >
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${link.color} text-white flex items-center justify-center transform transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:rotate-3 shadow-lg`}>
                       {link.icon}
                    </div>
                    <span className="text-[9px] font-bold text-cogray-400 group-hover/icon:text-cogray-900 dark:group-hover/icon:text-white transition-colors uppercase tracking-tight text-center hidden md:block">
                      {link.name}
                    </span>
                  </a>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ShareModal;
