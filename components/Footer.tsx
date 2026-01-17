
import React from 'react';
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, ArrowUp } from 'lucide-react';
import { LOGO_SVG, TRANSLATIONS, SOCIAL_LINKS, TIKTOK_ICON_SVG } from '../constants';
import { Link, useLocation } from 'react-router-dom';
import { getSectionLink } from '../utils/navigation';

interface FooterProps {
  language: 'id' | 'en';
  onNavChange: (nav: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavChange }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' || path === '') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = TRANSLATIONS[language];

  const socialLinks = [
    { icon: <Instagram className="w-5 h-5" />, color: 'hover:bg-pink-500 hover:border-pink-500', url: SOCIAL_LINKS.instagram },
    { icon: <Facebook className="w-5 h-5" />, color: 'hover:bg-blue-600 hover:border-blue-600', url: SOCIAL_LINKS.facebook },
    { icon: <Twitter className="w-5 h-5" />, color: 'hover:bg-sky-500 hover:border-sky-500', url: SOCIAL_LINKS.twitter },
    { icon: <Youtube className="w-5 h-5" />, color: 'hover:bg-red-600 hover:border-red-600', url: SOCIAL_LINKS.youtube },
    { icon: TIKTOK_ICON_SVG("w-5 h-5"), color: 'hover:bg-black hover:border-black', url: SOCIAL_LINKS.tiktok },
  ];

  return (
    <footer className="bg-cogray-50 dark:bg-cogray-950 border-t border-cogray-200 dark:border-cogray-800 pt-20 pb-10 mt-10 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6 text-left">
            {LOGO_SVG("h-12 w-auto text-cogray-900 dark:text-white transition-colors")}
            <p className="text-cogray-600 dark:text-cogray-400 text-sm leading-relaxed max-w-xs">
              {t.footerDesc}
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${social.url.split('com/')[1]?.split('/')[0] || 'Social Media'}`}
                  className={`w-10 h-10 bg-white dark:bg-cogray-900 border border-cogray-200 dark:border-cogray-800 rounded-full flex items-center justify-center ${social.color} hover:text-white transition-all duration-300 shadow-sm group hover:scale-110 active:scale-95`}
                >
                  <span className="text-cogray-600 dark:text-cogray-400 group-hover:text-white transition-colors duration-300">{social.icon}</span>
                </a>
              ))}
            </div>
            <div className="space-y-2 text-xs text-cogray-500 dark:text-cogray-400 font-bold uppercase tracking-widest">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-conime-500" />
                <a href={`mailto:${SOCIAL_LINKS.email}`} className="dark:text-cogray-400 text-cogray-600 hover:text-conime-500 transition-colors uppercase">{SOCIAL_LINKS.email}</a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-conime-500" />
                <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="dark:text-cogray-400 text-cogray-600 hover:text-conime-500 transition-colors uppercase">+62 851-7986-0291</a>
              </div>
            </div>
          </div>

          <div className="text-left">
            <h4 className="text-cogray-900 dark:text-white font-black uppercase tracking-tight mb-8">
              {t.quickNavigation}
            </h4>
            <ul className="space-y-4 text-xs font-bold text-cogray-500 dark:text-cogray-400 uppercase tracking-widest">
              {(language === 'id' 
                ? ["Beranda", "Anime", "Komik", "Film", "Game", "Opini", "Ulasan"] 
                : ["Home", "Anime", "Comics", "Movies", "Games", "Opinion", "Reviews"]
              ).map(item => {
                const path = getSectionLink(item, true);
                const active = isActive(path);
                return (
                  <li key={item}>
                    <Link 
                      to={path}
                      onClick={() => onNavChange(item)} 
                      className={`uppercase text-left block transition-colors ${
                        active 
                        ? 'text-conime-600 underline underline-offset-4 decoration-2' 
                        : 'hover:text-conime-500'
                      }`}
                      aria-label={`Navigate to ${item}`}
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-cogray-900 dark:text-white font-black uppercase tracking-tight mb-8">
              {language === 'id' ? 'BANTUAN' : 'SUPPORT'}
            </h4>
            <ul className="space-y-4 text-xs font-bold text-cogray-500 dark:text-cogray-400 uppercase tracking-widest">
              {[
                { label: t.aboutUs, path: getSectionLink(t.aboutUs) },
                { label: t.contactUs, path: getSectionLink(t.contactUs) },
                { label: 'FAQ', path: getSectionLink('FAQ') },
                { label: t.disclaimer, path: getSectionLink(t.disclaimer) }
              ].map((link, idx) => {
                 const active = isActive(link.path);
                 return (
                  <li key={idx}>
                    <Link 
                      to={link.path}
                      onClick={() => onNavChange(link.label)}
                      className={`uppercase text-left block transition-colors ${
                        active 
                        ? 'text-conime-600 underline underline-offset-4 decoration-2' 
                        : 'hover:text-conime-500'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                 );
              })}
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-cogray-900 dark:text-white font-black uppercase tracking-tight mb-8">{t.newsletterTitle}</h4>
            <p className="text-xs text-cogray-500 dark:text-cogray-400 uppercase tracking-widest mb-6 leading-relaxed">
              {language === 'id' 
                ? 'Kami sedang menyiapkan fitur newsletter eksklusif. Untuk sementara, Anda bisa menghubungi kami di'
                : 'We are preparing an exclusive newsletter feature. For now, you can contact us at'}
            </p>
            <div className="bg-cogray-100 dark:bg-cogray-900 rounded-xl p-4 border border-cogray-200 dark:border-cogray-800">
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="text-[10px] font-black text-conime-600 dark:text-conime-400 uppercase tracking-widest hover:underline block truncate">
                {SOCIAL_LINKS.email}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-cogray-200 dark:border-cogray-800 text-[10px] font-bold text-cogray-500 dark:text-cogray-500 uppercase tracking-widest">
          <p className="mb-4 md:mb-0 uppercase">{t.copy}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              to={getSectionLink(t.termsLabel)}
              onClick={() => onNavChange(t.termsLabel)} 
              className={`transition-colors uppercase ${isActive(getSectionLink(t.termsLabel)) ? 'text-conime-600 font-bold' : 'hover:text-conime-500 dark:hover:text-white'}`}
            >
              {t.termsLabel}
            </Link>
            <Link 
              to={getSectionLink(t.privacyPolicy)}
              onClick={() => onNavChange(t.privacyPolicy)} 
              className={`transition-colors uppercase ${isActive(getSectionLink(t.privacyPolicy)) ? 'text-conime-600 font-bold' : 'hover:text-conime-500 dark:hover:text-white'}`}
            >
              {t.privacyPolicy}
            </Link>
            <Link 
              to={getSectionLink(t.dmca)}
              onClick={() => onNavChange(t.dmca)} 
              className={`transition-colors uppercase ${isActive(getSectionLink(t.dmca)) ? 'text-conime-600 font-bold' : 'hover:text-conime-500 dark:hover:text-white'}`}
            >
              {t.dmca}
            </Link>

            <button onClick={scrollToTop} className="flex items-center space-x-1 text-cogray-700 dark:text-cogray-200 hover:text-conime-500 transition-colors">
               <ArrowUp className="w-4 h-4" />
               <span>{language === 'id' ? 'KE ATAS' : 'TO TOP'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
