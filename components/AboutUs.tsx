
import React from 'react';
import { ArrowLeft, Zap, Globe, Cpu, Users, Mail, Heart, Search } from 'lucide-react';
import { TRANSLATIONS, LOGO_MARK_SVG } from '../constants';

interface AboutUsProps {
  language: 'id' | 'en';
  onBack: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ language, onBack }) => {
  const t = TRANSLATIONS[language];

  const content = {
    id: {
      hero: "CoNime: Jendela Budaya Pop Visual Dunia",
      introTitle: "Siapa Kami?",
      introDesc: "CoNime adalah portal informasi independen yang menyajikan kurasi berita dan ulasan seputar industri budaya pop visual global. Kami hadir untuk menghubungkan penggemar dengan informasi terbaru dari dunia anime, komik, dan game.",
      categoriesTitle: "Apa yang Kami Liput?",
      categories: [
        { title: "JEPANG", desc: "Informasi terkini seputar Anime, Manga, dan perkembangan industri visual Jepang.", icon: <Globe className="w-6 h-6" /> },
        { title: "KOREA", desc: "Manhwa, Webtoon, dan fenomena hiburan visual Korea Selatan.", icon: <Zap className="w-6 h-6" /> },
        { title: "CHINA", desc: "Donghua dan industri manhua yang terus berkembang.", icon: <Globe className="w-6 h-6" /> },
        { title: "BARAT & GLOBAL", desc: "Film blockbuster, Video Game, dan animasi internasional.", icon: <Cpu className="w-6 h-6" /> },
        { title: "INDONESIA", desc: "Apresiasi terhadap karya lokal, komik, dan animasi orisinal anak bangsa.", icon: <Heart className="w-6 h-6" /> }
      ],
      aiTitle: "Metode Riset & Kurasi",
      aiDesc: "Kami mengadopsi efisiensi teknologi untuk menghadirkan informasi yang cepat. Kami memanfaatkan berbagai platform kecerdasan buatan (AI) untuk membantu riset awal dan merangkum informasi dari berbagai sumber resmi serta terpercaya. Namun, kendali penuh tetap berada di tangan editor manusia untuk melakukan verifikasi, penyuntingan, dan pengambilan keputusan akhir sebelum diterbitkan.",
      ctaTitle: "Ingin Berkolaborasi?",
      ctaDesc: "Kami selalu terbuka untuk saran, kritik, atau peluang kerja sama yang membangun.",
      ctaBtn: "HUBUNGI KAMI"
    },
    en: {
      hero: "CoNime: Your Window to Global Visual Pop Culture",
      introTitle: "Who Are We?",
      introDesc: "CoNime is an independent information portal providing curated news and reviews about the global visual pop culture industry. We bridge fans with the latest updates from anime, comics, and games.",
      categoriesTitle: "What Do We Cover?",
      categories: [
        { title: "JAPAN", desc: "The latest information regarding Anime, Manga, and the Japanese visual industry.", icon: <Globe className="w-6 h-6" /> },
        { title: "KOREA", desc: "Manhwa, Webtoons, and South Korean visual entertainment phenomena.", icon: <Zap className="w-6 h-6" /> },
        { title: "CHINA", desc: "Donghua and the ever-growing manhua industry.", icon: <Globe className="w-6 h-6" /> },
        { title: "WEST & GLOBAL", desc: "Blockbuster movies, Video Games, and international animation.", icon: <Cpu className="w-6 h-6" /> },
        { title: "INDONESIA", desc: "Appreciation for local works, comics, and original Indonesian animation.", icon: <Heart className="w-6 h-6" /> }
      ],
      aiTitle: "Research & Curation Method",
      aiDesc: "We embrace technological efficiency to deliver fast information. We utilize various AI platforms to assist in initial research and summarizing information from various official and trusted sources. However, full control remains in the hands of human editors for verification, editing, and final decision-making before publication.",
      ctaTitle: "Want to Collaborate?",
      ctaDesc: "We are always open to suggestions, criticism, or constructive cooperation opportunities.",
      ctaBtn: "CONTACT US"
    }
  };

  const c = content[language];

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

      <div className="relative rounded-[60px] overflow-hidden bg-cogray-100 dark:bg-cogray-900 mb-20 p-12 md:p-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-conime-600/20 via-transparent to-transparent opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-8 p-4 bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-2xl">
            {LOGO_MARK_SVG("w-20 h-20")}
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter leading-none mb-6 max-w-4xl">
            {c.hero}
          </h1>
          <p className="text-cogray-400 font-bold uppercase tracking-[0.3em] text-xs">
            {language === 'id' ? 'PORTAL BERITA INDEPENDEN • EST. 2025' : 'INDEPENDENT NEWS PORTAL • EST. 2025'}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-32 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-block p-2 px-4 rounded-xl bg-conime-500/10 text-conime-600 font-black text-[10px] uppercase tracking-widest">
              MISSION STATEMENT
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter">
              {c.introTitle}
            </h2>
            <p className="text-xl text-cogray-600 dark:text-cogray-400 leading-relaxed font-medium">
              {c.introDesc}
            </p>
          </div>
          <div className="relative aspect-square rounded-[48px] bg-cogray-50 dark:bg-cogray-900 border border-cogray-100 dark:border-cogray-800 p-12 flex items-center justify-center">
            <Users className="w-32 h-32 text-conime-600 relative z-10" />
          </div>
        </div>

        <div className="space-y-12">
          <div className="text-center space-y-4">
             <h2 className="text-3xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter">{c.categoriesTitle}</h2>
             <div className="h-1 w-20 bg-conime-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {c.categories.map((cat, i) => (
              <div key={i} className="p-10 rounded-[40px] bg-cogray-50/50 dark:bg-cogray-900/50 border border-cogray-100 dark:border-cogray-800 hover:border-conime-600 transition-all group shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-cogray-950 flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform text-conime-600">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-black text-cogray-900 dark:text-white mb-3 uppercase tracking-tight">{cat.title}</h3>
                <p className="text-sm text-cogray-500 dark:text-cogray-400 font-medium leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-20 rounded-[60px] bg-gradient-to-br from-white to-cogray-50 dark:from-cogray-900 dark:to-cogray-950 border border-cogray-100 dark:border-cogray-800 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
               <div className="flex items-center gap-4">
                  <div className="p-3 backdrop-blur-xl shadow-2xl bg-white/5 rounded-2xl border border-white/10 text-conime-500">
                    <Search className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">{c.aiTitle}</h2>
               </div>
               <p className="text-lg text-cogray-400 leading-relaxed font-medium italic">
                 "{c.aiDesc}"
               </p>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
               <div className="flex flex-col justify-center p-5 lg:p-8 rounded-[32px] bg-white/5 backdrop-blur-xl shadow-2xl border border-white/10 text-center space-y-2">
                  <span className="text-xl md:text-2xl lg:text-3xl font-black text-conime-500 uppercase">OFFICIAL</span>
                  <p className="text-[10px] font-bold text-cogray-500 uppercase tracking-widest">R&D SOURCES</p>
               </div>
               <div className="flex flex-col justify-center p-5 lg:p-8 rounded-[32px] bg-white/5 backdrop-blur-xl shadow-2xl border border-white/10 text-center space-y-2">
                  <span className="text-xl md:text-2xl lg:text-3xl font-black text-white uppercase">HUMAN</span>
                  <p className="text-[10px] font-bold text-cogray-500 uppercase tracking-widest">DECISION MAKER</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
