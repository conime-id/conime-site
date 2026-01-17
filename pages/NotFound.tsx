import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Ghost } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface NotFoundProps {
  language?: 'id' | 'en';
}

export const NotFound: React.FC<NotFoundProps> = ({ language = 'id' }) => {
  const navigate = useNavigate();
  const t = {
    title: language === 'id' ? 'Halaman Tidak Ditemukan' : 'Page Not Found',
    desc: language === 'id' 
      ? 'Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.' 
      : 'Sorry, the page you are looking for does not exist or has been moved.',
    back: language === 'id' ? 'Kembali' : 'Go Back',
    home: language === 'id' ? 'Ke Beranda' : 'Go Home',
  };

  useEffect(() => {
    document.title = `404 - ${t.title} | CoNime.id`;
  }, [language]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-cogray-950 px-6">
      <div className="text-center max-w-md">
        <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
           <div className="absolute inset-0 bg-conime-600/20 rounded-full blur-2xl animate-pulse"></div>
           <div className="relative bg-cogray-50 dark:bg-cogray-900 border border-cogray-100 dark:border-cogray-800 p-8 rounded-[40px] shadow-2xl rotate-12 hover:rotate-0 transition-transform duration-500">
              {/* Custom Ghost SVG */}
              <svg viewBox="0 0 482 524" className="w-20 h-20 text-conime-600 fill-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M242.38 11.2665C148.066 14.5997 119.087 86.2079 109.31 141.131C105.687 161.49 84.5721 174.655 65.5497 166.544L52.338 160.911C32.4437 152.428 11.688 167.665 21.5873 186.893C32.318 207.737 49.4049 226.077 67.5668 242.133C79.0154 252.254 82.3002 269.29 77.3602 283.75C69.6581 306.296 63.1436 336.11 54.2197 366.52C20.5 481.427 79 472.173 107 465.673C135 459.173 186.24 434.507 212.217 481.427C238.193 528.347 317.392 524.044 327.123 452.7C336.855 381.356 397.504 434.501 428.624 425.889C459.745 417.277 507 411.173 451.127 322.472C438.676 302.706 424.742 273.49 416.703 245.655C413.555 234.753 418.115 223.413 426.807 216.119C454.977 192.479 468.197 173.286 468.965 150.015C469.635 129.693 443.747 124.669 429.886 139.545C416.233 154.196 392.669 149.677 386.461 130.637C366.449 69.2605 347.357 7.55643 242.38 11.2665Z" stroke="currentColor" strokeWidth="15"/>
                <path d="M173.895 124.723L196.916 147.744" stroke="currentColor" strokeWidth="15" strokeLinecap="round"/>
                <path d="M196.916 124.723L173.895 147.744" stroke="currentColor" strokeWidth="15" strokeLinecap="round"/>
                <path d="M303.16 124.723L326.181 147.744" stroke="currentColor" strokeWidth="15" strokeLinecap="round"/>
                <path d="M326.182 124.723L303.16 147.744" stroke="currentColor" strokeWidth="15" strokeLinecap="round"/>
                <path d="M184.444 201.826H304.618" stroke="currentColor" strokeWidth="15" strokeLinecap="round"/>
                <path d="M273.018 232.947C253.867 232.947 251.154 209.806 250.994 201.826H295.521C295.201 212.679 290.595 232.947 273.018 232.947Z" fill="currentColor" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
              </svg>
           </div>
           <div className="absolute -bottom-4 -right-4 bg-white dark:bg-cogray-900 px-4 py-2 rounded-xl border border-cogray-100 dark:border-cogray-800 shadow-lg -rotate-6">
              <span className="text-2xl font-black text-cogray-900 dark:text-white">404</span>
           </div>
        </div>
        <h2 className="text-2xl font-black text-cogray-900 dark:text-white uppercase tracking-tight mb-4">{t.title}</h2>
        <p className="text-cogray-500 dark:text-cogray-400 mb-10 leading-relaxed font-medium">
          {t.desc}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-cogray-200 dark:border-cogray-800 text-cogray-600 dark:text-cogray-300 font-bold uppercase tracking-widest hover:bg-cogray-50 dark:hover:bg-cogray-900 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>
          
          <Link 
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-conime-600 text-white font-bold uppercase tracking-widest hover:bg-conime-700 transition-all shadow-lg shadow-conime-600/20"
          >
            <Home className="w-4 h-4" />
            <span>{t.home}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
