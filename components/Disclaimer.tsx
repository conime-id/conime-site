

import React from 'react';
import { ArrowLeft, AlertTriangle, Copyright, Info, Cpu, Image as ImageIcon } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

import { useNavigate, Link } from 'react-router-dom';

interface DisclaimerProps {
  language: 'id' | 'en';
  onBack: () => void;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ language, onBack }) => {
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  const content = {
    id: {
      title: "Sanggahan & Batasan Hukum",
      updated: "Terakhir Diperbarui: Juli 2025 (v3.0)",
      intro: "Halaman Disclaimer ini bertujuan untuk memberikan kejelasan mengenai batasan tanggung jawab CoNime dan penggunaan aset pihak ketiga dalam situs kami.",
      sections: [
        {
          title: "Kepemilikan Karakter & Seri",
          icon: <Copyright className="w-6 h-6" />,
          desc: "Seluruh karakter, judul seri, dan dunia fiksi yang dibahas di CoNime adalah hak cipta milik pencipta asli, studio, dan penerbit masing-masing.",
          items: [
            "CoNime adalah portal independen dan tidak memiliki afiliasi resmi dengan pemegang hak cipta.",
            "Konten kami bersifat apresiasi, ulasan, dan pelaporan berita.",
            "Kami berkomitmen tidak menyediakan link download ilegal."
          ]
        },
        {
          title: "Kebijakan Gambar & Visual",
          icon: <ImageIcon className="w-6 h-6" />,
          desc: "Materi visual dikelola melalui kurasi mandiri oleh tim redaksi:",
          items: [
            "Gambar diunggah secara mandiri dari basis data editor kami.",
            "Kami berupaya mencantumkan kredit sumber resmi pada setiap materi visual.",
            "Penggunaan gambar ditujukan untuk memperjelas informasi berita (Fair Use)."
          ]
        },
        {
          title: "Batasan Informasi",
          icon: <AlertTriangle className="w-6 h-6" />,
          desc: "Berita dalam industri hiburan bergerak sangat dinamis:",
          items: [
            "CoNime berupaya menyajikan data dengan merujuk pada web resmi dan sumber terpercaya lainnya.",
            "Kami tidak memberikan jaminan mutlak atas keakuratan informasi dikarenakan perubahan kebijakan mendadak dari pihak pemegang hak cipta.",
            "Koreksi akan segera dilakukan jika ditemukan kekeliruan data."
          ]
        },
        {
          title: "Transparansi Proses Konten",
          icon: <Cpu className="w-6 h-6" />,
          desc: "Sinergi teknologi dan kurasi manusia:",
          items: [
            "Kami menggunakan bantuan berbagai platform AI untuk membantu riset awal dan penyusunan draf dari sumber resmi global serta sumber terpercaya lainnya.",
            "Setiap publikasi wajib melalui tahap peninjauan dan persetujuan akhir oleh editor manusia untuk memastikan kelayakan konten."
          ]
        }
      ]
    },
    en: {
      title: "Disclaimer & Legal Terms",
      updated: "Last Updated: July 2025 (v3.0)",
      intro: "This Disclaimer page aims to provide clarity regarding CoNime's liability limits and the use of third-party assets on our site.",
      sections: [
        {
          title: "Copyright Ownership",
          icon: <Copyright className="w-6 h-6" />,
          desc: "All characters, series titles, and fictional worlds discussed at CoNime are the copyright of their respective original creators, studios, and publishers.",
          items: [
            "CoNime is an independent portal and has no official affiliation with copyright holders.",
            "Our content is for appreciation, review, and news reporting.",
            "We are committed to not providing illegal download links."
          ]
        },
        {
          title: "Image & Visual Policy",
          icon: <ImageIcon className="w-6 h-6" />,
          desc: "Visual materials are managed through independent curation by the editorial team:",
          items: [
            "Images are uploaded independently from our editorial database.",
            "We strive to include official source credits on every visual material.",
            "The use of images is intended to clarify news information (Fair Use)."
          ]
        },
        {
          title: "Information Limits",
          icon: <AlertTriangle className="w-6 h-6" />,
          desc: "News in the entertainment industry is very dynamic:",
          items: [
            "CoNime strives to present data by referring to official websites and other trusted sources.",
            "We do not provide an absolute guarantee of information accuracy due to sudden policy changes from copyright holders.",
            "Corrections will be made immediately if data errors are found."
          ]
        },
        {
          title: "Content Process Transparency",
          icon: <Cpu className="w-6 h-6" />,
          desc: "Technology synergy and human curation:",
          items: [
            "We use various AI platforms to assist in initial research and drafting from global official sources and other trusted sources.",
            "Every publication must pass through a review and final approval stage by a human editor to ensure content viability."
          ]
        }
      ]
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

      <div className="max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
           <div className="p-3 bg-conime-600 rounded-2xl text-white">
              <AlertTriangle className="w-8 h-8" />
           </div>
           <div>
              <h1 className="text-4xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter leading-none">{c.title}</h1>
              <p className="text-[10px] font-bold text-cogray-400 dark:text-cogray-600 uppercase tracking-widest mt-2">{c.updated}</p>
           </div>
        </div>

        <div className="p-8 rounded-[32px] bg-cogray-50 dark:bg-cogray-900/50 border border-cogray-100 dark:border-cogray-800 text-lg text-cogray-600 dark:text-cogray-400 leading-relaxed font-medium mb-20 italic">
          "{c.intro}"
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {c.sections.map((section, idx) => (
            <div key={idx} className="p-10 rounded-[40px] bg-white dark:bg-cogray-900/30 border border-cogray-100 dark:border-cogray-800 space-y-6">
               <div className="w-12 h-12 rounded-2xl bg-cogray-50 dark:bg-cogray-950 flex items-center justify-center text-conime-600">
                  {section.icon}
               </div>
               <h2 className="text-xl font-black text-cogray-900 dark:text-white uppercase tracking-tight">{section.title}</h2>
               <p className="text-sm font-bold text-cogray-700 dark:text-cogray-300">{section.desc}</p>
               <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-cogray-500 dark:text-cogray-400 leading-relaxed font-medium">
                       <div className="w-1 h-1 rounded-full bg-conime-600 shrink-0 mt-2"></div>
                       <span>{item}</span>
                    </li>
                  ))}
               </ul>
            </div>
          ))}
        </div>

        {/* Updated Content Report CTA box */}
        <div className="mt-20 p-12 md:p-16 rounded-[48px] bg-conime-600 text-white text-center shadow-2xl shadow-conime-600/30 relative overflow-hidden group">
           <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <h3 className="text-3xl font-black uppercase tracking-tighter mb-8">{t.contentReport}</h3>
           <Link 
             to="/contact"
             className="relative z-10 inline-block bg-white text-conime-600 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-cogray-50 transition-all active:scale-95 hover:-translate-y-1"
           >
             {t.contactEditorial}
           </Link>
        </div>

        <div className="mt-20 p-12 rounded-[48px] bg-cogray-50 dark:bg-cogray-900/50 border border-dashed border-cogray-200 dark:border-cogray-800 text-center">
           <p className="text-sm font-bold text-cogray-500 uppercase tracking-widest">
              {t.footerMotto}
           </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
