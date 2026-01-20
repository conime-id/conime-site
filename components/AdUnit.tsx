import React from 'react';
import { TRANSLATIONS } from '../constants';

interface AdUnitProps {
  language: 'id' | 'en';
  slot: 'sidebar' | 'header' | 'in-feed' | 'in-article';
  className?: string;
  showLabel?: boolean;
}

const AdUnit: React.FC<AdUnitProps> = ({ language, slot, className = '', showLabel = true }) => {
  const isDev = true; // Toggle this to false when real ads are connected

  // Placeholder dimensions based on slot
  const getDimensions = () => {
    switch (slot) {
      case 'sidebar': return 'h-[250px] w-full';
      case 'header': return 'h-[90px] w-full';
      case 'in-feed': return 'h-[120px] md:h-[150px] w-full';
      case 'in-article': return 'min-h-[250px] w-full';
      default: return 'h-[250px] w-full'; // Medium Rectangle standard
    }
  };

  const getLabel = () => {
    return language === 'id' ? 'IKLAN' : 'ADVERTISEMENT';
  };

  if (!isDev) {
    // Return actual ad code here (e.g. Google AdSense)
    // For now returning null or empty div if not configured
    return <div className={`ad-slot ${className}`}></div>;
  }

  return (
    <div className={`my-6 flex flex-col items-center justify-center ${className}`}>
        {showLabel && (
            <div className="text-[9px] font-bold text-cogray-400 dark:text-cogray-600 uppercase tracking-widest mb-2 w-full text-center">
                {getLabel()}
            </div>
        )}
        <div className={`
            relative overflow-hidden group w-full bg-cogray-100 dark:bg-cogray-900 border border-cogray-200 dark:border-cogray-800 rounded-2xl flex flex-col items-center justify-center text-center p-4
            ${getDimensions()}
        `}>
            {/* Background Pattern for "Premium Placeholder" feel */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-conime-600 via-transparent to-transparent"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-conime-500/20 blur-3xl rounded-full"></div>

            {/* Placeholder Content */}
            <div className="relative z-10 space-y-2">
                <span className="block text-[10px] font-black text-cogray-400 dark:text-cogray-600 uppercase tracking-[0.2em]">
                    {language === 'id' ? 'Area Promosi' : 'Promotion Area'}
                </span>
                <p className="text-xs font-bold text-cogray-500 dark:text-cogray-400 max-w-[200px] leading-relaxed">
                   {language === 'id' ? 'Pasang iklan Anda di sini dan jangkau penggemar Pop Culture.' : 'Place your ad here to reach Pop Culture fans.'}
                </p>
                <button className="mt-2 px-4 py-1.5 bg-white dark:bg-cogray-800 text-conime-600 text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm hover:scale-105 transition-transform">
                    Contact Us
                </button>
            </div>
        </div>
    </div>
  );
};

export default AdUnit;
