
import React, { useState } from 'react';
import { ArrowLeft, Mail, MessageSquare, Send, Instagram, Facebook, Twitter, Youtube, FilePenLine, CheckCircle2, Phone } from 'lucide-react';
import { TRANSLATIONS, SOCIAL_LINKS, TIKTOK_ICON_SVG } from '../constants';

interface ContactUsProps {
  language: 'id' | 'en';
  onBack: () => void;
}

const ContactUs: React.FC<ContactUsProps> = ({ language, onBack }) => {
  const t = TRANSLATIONS[language];
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulating API call
    setTimeout(() => setSubmitted(false), 5000);
  };

  const socialLinks = [
    { name: 'Instagram', handle: '@conime.id', url: SOCIAL_LINKS.instagram, icon: <Instagram className="w-5 h-5" />, color: 'text-conime-600 hover:text-pink-500' },
    { name: 'Facebook', handle: 'CoNime ID', url: SOCIAL_LINKS.facebook, icon: <Facebook className="w-5 h-5" />, color: 'text-conime-600 hover:text-blue-600' },
    { name: 'Twitter / X', handle: '@conime_id', url: SOCIAL_LINKS.twitter, icon: <Twitter className="w-5 h-5" />, color: 'text-conime-600 hover:text-sky-500' },
    { name: 'YouTube', handle: 'CoNime ID', url: SOCIAL_LINKS.youtube, icon: <Youtube className="w-5 h-5" />, color: 'text-conime-600 hover:text-red-600' },
    { name: 'TikTok', handle: '@conime.id', url: SOCIAL_LINKS.tiktok, icon: TIKTOK_ICON_SVG("w-5 h-5"), color: 'text-conime-600 hover:text-black' },
  ];

  return (
    <div className="animate-in fade-in duration-700 text-left">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-cogray-400 hover:text-conime-600 transition-colors mb-12 group"
      >
        <div className="w-10 h-10 rounded-full border border-cogray-200 dark:border-cogray-800 flex items-center justify-center group-hover:border-conime-600 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest">{t.back}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Left Side: Info */}
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="inline-block p-2 px-4 rounded-xl bg-conime-500/10 text-conime-600 font-black text-[10px] uppercase tracking-widest">
              GET IN TOUCH
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter leading-none">
              {language === 'id' ? 'Mari Berdiskusi' : 'Let\'s Connect'}
            </h1>
            <p className="text-xl text-cogray-600 dark:text-cogray-400 leading-relaxed font-medium max-w-md">
              {language === 'id' 
                ? 'Punya pertanyaan, kritik, atau tawaran kerja sama? Tim redaksi kami siap mendengar Anda.' 
                : 'Have questions, feedback, or partnership inquiries? Our editorial team is ready to listen.'}
            </p>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 group p-6 rounded-3xl bg-cogray-50 dark:bg-cogray-900 border border-cogray-100 dark:border-cogray-800 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-conime-600 text-white flex items-center justify-center shadow-xl shadow-conime-600/20 group-hover:scale-110 transition-transform shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[9px] font-bold text-cogray-400 uppercase tracking-widest mb-1">{language === 'id' ? 'BANTUAN & UMUM' : 'SUPPORT & GENERAL'}</p>
                  <a href={`mailto:${SOCIAL_LINKS.email}`} className="text-sm font-black text-cogray-900 dark:text-white hover:text-conime-600 transition-colors truncate block">{SOCIAL_LINKS.email}</a>
                </div>
              </div>
              
              <div className="flex items-center gap-4 group p-6 rounded-3xl bg-cogray-50 dark:bg-cogray-900 border border-cogray-100 dark:border-cogray-800 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform shrink-0">
                  <FilePenLine className="w-5 h-5" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[9px] font-bold text-cogray-400 uppercase tracking-widest mb-1">{language === 'id' ? 'REDAKSI' : 'EDITORIAL'}</p>
                  <a href={`mailto:${SOCIAL_LINKS.emailEditorial}`} className="text-sm font-black text-cogray-900 dark:text-white hover:text-blue-600 transition-colors truncate block">{SOCIAL_LINKS.emailEditorial}</a>
                </div>
              </div>

              <div className="flex items-center gap-4 group p-6 rounded-3xl bg-cogray-50 dark:bg-cogray-900 border border-cogray-100 dark:border-cogray-800 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-600/20 group-hover:scale-110 transition-transform shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-cogray-400 uppercase tracking-widest mb-1">WHATSAPP</p>
                  <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm font-black text-cogray-900 dark:text-white hover:text-emerald-600 transition-colors block">+62 851-7986-0291</a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 rounded-3xl bg-cogray-50 dark:bg-cogray-900 border border-cogray-100 dark:border-cogray-800 hover:border-conime-600 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-white dark:bg-cogray-950 flex items-center justify-center mb-4 shadow-sm transition-colors ${social.color}`}>
                    {social.icon}
                  </div>
                  <p className="text-[9px] font-bold text-cogray-400 uppercase tracking-widest mb-1">{social.name}</p>
                  <p className="text-sm font-black text-cogray-900 dark:text-white uppercase">{social.handle}</p>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="relative">
          <div className="absolute inset-0 bg-conime-600/5 blur-[100px] rounded-full -z-10"></div>
          <div className="bg-white dark:bg-cogray-900 border border-cogray-200 dark:border-cogray-800 rounded-[48px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {submitted ? (
              <div className="py-20 flex flex-col items-center text-center space-y-6 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-conime-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-conime-500/40">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter">
                  {language === 'id' ? 'Pesan Terkirim!' : 'Message Sent!'}
                </h3>
                <p className="text-cogray-500 font-medium max-w-xs">
                  {language === 'id' 
                    ? 'Terima kasih telah menghubungi CoNime. Kami akan merespons melalui email atau WhatsApp sesegera mungkin.' 
                    : 'Thank you for reaching out to CoNime. We will respond via email or WhatsApp as soon as possible.'}
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-black text-conime-600 uppercase tracking-widest hover:underline"
                >
                  {language === 'id' ? 'Kirim Pesan Lain' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-cogray-400 uppercase tracking-[0.2em] ml-4">{language === 'id' ? 'NAMA LENGKAP' : 'FULL NAME'}</label>
                    <input required type="text" className="w-full bg-cogray-50 dark:bg-cogray-950 border border-cogray-100 dark:border-cogray-800 rounded-2xl py-4 px-6 text-sm font-bold text-cogray-900 dark:text-white focus:outline-none focus:border-conime-600 transition-all uppercase tracking-tight" placeholder="YOUR NAME" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-cogray-400 uppercase tracking-[0.2em] ml-4">EMAIL</label>
                    <input required type="email" className="w-full bg-cogray-50 dark:bg-cogray-950 border border-cogray-100 dark:border-cogray-800 rounded-2xl py-4 px-6 text-sm font-bold text-cogray-900 dark:text-white focus:outline-none focus:border-conime-600 transition-all uppercase tracking-tight" placeholder="EMAIL@EXAMPLE.COM" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-cogray-400 uppercase tracking-[0.2em] ml-4">{language === 'id' ? 'SUBJEK' : 'SUBJECT'}</label>
                  <input required type="text" className="w-full bg-cogray-50 dark:bg-cogray-950 border border-cogray-100 dark:border-cogray-800 rounded-2xl py-4 px-6 text-sm font-bold text-cogray-900 dark:text-white focus:outline-none focus:border-conime-600 transition-all uppercase tracking-tight" placeholder="HOW CAN WE HELP?" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-cogray-400 uppercase tracking-[0.2em] ml-4">{language === 'id' ? 'PESAN' : 'MESSAGE'}</label>
                  <textarea required rows={5} className="w-full bg-cogray-50 dark:bg-cogray-950 border border-cogray-100 dark:border-cogray-800 rounded-[32px] py-6 px-8 text-sm font-bold text-cogray-900 dark:text-white focus:outline-none focus:border-conime-600 transition-all resize-none uppercase tracking-tight" placeholder="YOUR MESSAGE..."></textarea>
                </div>
                <button type="submit" className="w-full bg-conime-600 hover:bg-conime-700 text-white font-black py-5 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-conime-600/20 active:scale-[0.98] flex items-center justify-center gap-3 group/btn">
                  <span>{language === 'id' ? 'KIRIM SEKARANG' : 'SEND MESSAGE'}</span>
                  <Send className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
