
import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, HelpCircle, BookOpen, Cpu, ShieldCheck, MessageCircle, Info } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface FAQProps {
  language: 'id' | 'en';
  onBack: () => void;
}

const FAQ: React.FC<FAQProps> = ({ language, onBack }) => {
  const t = TRANSLATIONS[language];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = {
    id: [
      {
        category: "TENTANG CONIME",
        icon: <Info className="w-5 h-5" />,
        questions: [
          {
            q: "Apa itu CoNime?",
            a: "CoNime adalah portal berita yang dibuat untuk para penggemar anime, manga, game, dan film. Kami fokus menyajikan informasi terbaru dari dunia budaya pop visual global agar Anda tidak ketinggalan tren."
          },
          {
            q: "Apakah CoNime bagian dari studio animasi?",
            a: "Bukan, CoNime adalah media independen. Kami bekerja secara mandiri untuk memberikan ulasan dan berita yang objektif tanpa berafiliasi dengan studio atau penerbit mana pun."
          }
        ]
      },
      {
        category: "BERITA & SUMBER",
        icon: <BookOpen className="w-5 h-5" />,
        questions: [
          {
            q: "Dari mana CoNime mendapatkan berita?",
            a: "Kami selalu mencari informasi langsung dari website resmi (official) setiap judul atau studio, serta sumber-sumber terpercaya lainnya di komunitas internasional. Kami memastikan info yang kami bagikan punya dasar yang kuat."
          },
          {
            q: "Apakah CoNime menggunakan AI?",
            a: "Kami memanfaatkan teknologi untuk membantu memantau update dari seluruh dunia secara cepat. Namun, setiap tulisan tetap diperiksa dan disesuaikan lagi secara manual oleh tim kami agar kualitasnya tetap terjaga dan nyaman dibaca oleh manusia."
          }
        ]
      },
      {
        category: "KONTRIBUSI",
        icon: <ShieldCheck className="w-5 h-5" />,
        questions: [
          {
            q: "Bolehkah saya ikut menulis di CoNime?",
            a: "Tentu saja! Kami sangat senang jika ada teman-teman yang ingin berbagi opini atau ulasan karyanya. Langsung saja hubungi kami lewat WhatsApp atau email untuk ngobrol lebih lanjut."
          },
          {
            q: "Bagaimana jika ada kesalahan data di artikel?",
            a: "Dunia hiburan sangat dinamis dan perubahan bisa terjadi kapan saja. Jika Anda menemukan data yang kurang tepat, jangan ragu untuk memberi tahu kami agar bisa segera kami perbaiki."
          }
        ]
      }
    ],
    en: [
      {
        category: "ABOUT CONIME",
        icon: <Info className="w-5 h-5" />,
        questions: [
          {
            q: "What is CoNime?",
            a: "CoNime is a news portal built for fans of anime, manga, games, and movies. We focus on providing the latest info from the global visual pop culture world so you won't miss any trends."
          },
          {
            q: "Is CoNime part of an animation studio?",
            a: "No, CoNime is an independent media outlet. We work autonomously to provide objective reviews and news without being officially affiliated with any studio or publisher."
          }
        ]
      },
      {
        category: "NEWS & SOURCES",
        icon: <BookOpen className="w-5 h-5" />,
        questions: [
          {
            q: "Where does CoNime get its news?",
            a: "We always look for information directly from the official websites of each title or studio, as well as other trusted sources in the international community. We make sure the info we share has a solid foundation."
          },
          {
            q: "Does CoNime use AI?",
            a: "We utilize technology to help monitor global updates quickly. However, every article is still checked and adjusted manually by our team to ensure it's accurate and comfortable for humans to read."
          }
        ]
      },
      {
        category: "CONTRIBUTION",
        icon: <ShieldCheck className="w-5 h-5" />,
        questions: [
          {
            q: "Can I contribute to CoNime?",
            a: "Of course! We're happy to have people share their opinions or reviews. Just contact us via WhatsApp or email to discuss it further."
          },
          {
            q: "What if there's an error in an article?",
            a: "The entertainment world is very dynamic and changes can happen anytime. If you find any inaccurate data, please let us know so we can fix it immediately."
          }
        ]
      }
    ]
  };

  const currentFaq = faqData[language];
  let globalCounter = 0;

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

      <div className="max-w-4xl">
        <div className="mb-20 space-y-6">
          <div className="inline-flex items-center gap-3 bg-conime-600/10 text-conime-600 px-4 py-2 rounded-2xl">
            <HelpCircle className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">HELP CENTER</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter leading-none">
            {language === 'id' ? 'Pertanyaan Umum' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-xl text-cogray-600 dark:text-cogray-400 font-medium max-w-2xl leading-relaxed">
            {language === 'id' 
              ? 'Punya pertanyaan tentang CoNime? Temukan jawabannya di sini dengan cepat.' 
              : 'Have questions about CoNime? Find the answers here quickly.'}
          </p>
        </div>

        <div className="space-y-16">
          {currentFaq.map((cat, catIdx) => (
            <div key={catIdx} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-cogray-50 dark:bg-cogray-900 rounded-xl text-conime-600">
                  {cat.icon}
                </div>
                <h2 className="text-sm font-black text-cogray-400 uppercase tracking-[0.3em]">{cat.category}</h2>
                <div className="h-[1px] flex-grow bg-cogray-100 dark:bg-cogray-900"></div>
              </div>

              <div className="space-y-4">
                {cat.questions.map((item, qIdx) => {
                  const currentIndex = globalCounter++;
                  const isOpen = openIndex === currentIndex;
                  return (
                    <div 
                      key={qIdx} 
                      className={`rounded-[32px] border transition-all duration-300 overflow-hidden ${
                        isOpen 
                          ? 'bg-cogray-50 dark:bg-cogray-900 border-conime-600/50 shadow-xl' 
                          : 'bg-white dark:bg-cogray-950 border-cogray-100 dark:border-cogray-800 hover:border-cogray-300 dark:hover:border-cogray-700'
                      }`}
                    >
                      <button 
                        onClick={() => setOpenIndex(isOpen ? null : currentIndex)}
                        className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
                      >
                        <span className={`text-lg md:text-xl font-black uppercase tracking-tight transition-colors ${isOpen ? 'text-conime-600' : 'text-cogray-800 dark:text-white group-hover:text-conime-600'}`}>
                          {item.q}
                        </span>
                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-conime-600 text-white rotate-180' : 'bg-cogray-100 dark:bg-cogray-900 text-cogray-400 group-hover:text-conime-600'}`}>
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </button>
                      
                      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                        <div className="p-8 pt-0 text-cogray-600 dark:text-cogray-400 font-medium leading-relaxed text-base md:text-lg border-t border-cogray-200/50 dark:border-cogray-800/50 mt-2">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 md:p-20 rounded-[60px] bg-cogray-100 dark:bg-cogray-900 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-conime-600/10 to-transparent"></div>
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 bg-white/5 rounded-3xl backdrop-blur-xl shadow-2xl flex items-center justify-center mx-auto border border-white/10 text-conime-500">
               <MessageCircle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter">
              {language === 'id' ? 'Belum Menemukan Jawaban?' : 'Still Have Questions?'}
            </h2>
            <p className="text-cogray-400 font-medium max-w-md mx-auto">
              {language === 'id' 
                ? 'Langsung saja hubungi kami via WhatsApp atau Email. Tim kami siap membantu Anda.' 
                : 'Just contact us via WhatsApp or Email. Our team is ready to assist you.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://wa.me/6285179860291" target="_blank" rel="noopener noreferrer" className="w-full lg:w-fit h-16 inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-emerald-600/20 active:scale-95">
                WHATSAPP SUPPORT
              </a>
              <a href="mailto:hello@conime.id" className="w-full lg:w-fit h-16 inline-flex items-center justify-center bg-conime-600 hover:bg-conime-700 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-conime-600/40 active:scale-95">
                EMAIL REDAKSI
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
