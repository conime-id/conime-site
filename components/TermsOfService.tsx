
import React from 'react';
import { ArrowLeft, Gavel, ShieldAlert, Ban, MessageSquare, RefreshCcw } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface TermsOfServiceProps {
  language: 'id' | 'en';
  onBack: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ language, onBack }) => {
  const t = TRANSLATIONS[language];

  const content = {
    id: {
      title: "Syarat & Ketentuan",
      updated: "Terakhir Diperbarui: Juli 2025 (v3.0)",
      intro: "Selamat datang di CoNime. Dengan mengakses situs ini, Anda dianggap telah menyetujui aturan main yang berlaku demi kenyamanan bersama dan kepatuhan terhadap hukum yang berlaku.",
      sections: [
        {
          title: "Penggunaan Konten",
          icon: <Ban className="w-6 h-6" />,
          items: [
            "Dilarang menyalin (copy-paste) artikel CoNime secara utuh tanpa mencantumkan link sumber aktif.",
            "Dilarang menggunakan bot atau skrip otomatis untuk melakukan 'scrapping' data dari situs kami.",
            "Konten CoNime hanya untuk penggunaan personal, bukan komersial."
          ]
        },
        {
          title: "Interaksi Pengguna & Larangan Konten",
          icon: <MessageSquare className="w-6 h-6" />,
          items: [
            "Dilarang keras mengunggah komentar atau materi yang mengandung pornografi, konten dewasa (18+), atau materi seksual eksplisit lainnya.",
            "Komentar yang mengandung SARA, ujaran kebencian, atau promosi ilegal akan dihapus tanpa pemberitahuan.",
            "CoNime tidak bertanggung jawab atas opini atau tautan yang dibagikan oleh pengguna di kolom komentar.",
            "Tanggung jawab hukum atas isi komentar sepenuhnya berada pada penulis komentar tersebut."
          ]
        },
        {
          title: "Batasan Tanggung Jawab",
          icon: <ShieldAlert className="w-6 h-6" />,
          items: [
            "CoNime menyajikan informasi 'apa adanya' dari berbagai sumber resmi dan terpercaya.",
            "Kami tidak bertanggung jawab atas kerugian atau kekecewaan yang timbul akibat perubahan jadwal rilis atau pembatalan proyek dari pihak studio.",
            "Segala keputusan yang Anda ambil berdasarkan informasi di situs ini adalah risiko pribadi."
          ]
        },
        {
          title: "Perubahan Ketentuan",
          icon: <RefreshCcw className="w-6 h-6" />,
          items: [
            "CoNime berhak mengubah Syarat & Ketentuan ini sewaktu-waktu seiring perkembangan platform.",
            "Perubahan akan langsung berlaku setelah dipublikasikan di halaman ini.",
            "Kami menyarankan Anda memeriksa halaman ini secara berkala."
          ]
        }
      ]
    },
    en: {
      title: "Terms of Service",
      updated: "Last Updated: July 2025 (v3.0)",
      intro: "Welcome to CoNime. By accessing this site, you are deemed to have agreed to the applicable rules for our mutual convenience and legal compliance.",
      sections: [
        {
          title: "Content Usage",
          icon: <Ban className="w-6 h-6" />,
          items: [
            "Prohibited to copy-paste CoNime articles in full without including an active source link.",
            "Prohibited to use bots or automated scripts to 'scrape' data from our site.",
            "CoNime content is for personal use only, not commercial."
          ]
        },
        {
          title: "User Interaction & Content Prohibitions",
          icon: <MessageSquare className="w-6 h-6" />,
          items: [
            "Strictly prohibited to upload comments or materials containing pornography, adult content (18+), or other sexually explicit materials.",
            "Comments containing hate speech, harassment, or illegal promotion will be deleted without notice.",
            "CoNime is not responsible for opinions or links shared by users in the comments section.",
            "Legal responsibility for comment content lies entirely with the author of the comment."
          ]
        },
        {
          title: "Limitation of Liability",
          icon: <ShieldAlert className="w-6 h-6" />,
          items: [
            "CoNime presents information 'as is' from various official and trusted sources.",
            "We are not responsible for any loss or disappointment arising from release schedule changes or project cancellations by studios.",
            "Any decisions you make based on information on this site are at your own risk."
          ]
        },
        {
          title: "Changes to Terms",
          icon: <RefreshCcw className="w-6 h-6" />,
          items: [
            "CoNime reserves the right to change these Terms of Service at any time as the platform evolves.",
            "Changes will take effect immediately upon publication on this page.",
            "We recommend you check this page periodically."
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
           <div className="p-3 bg-conime-600 text-white rounded-2xl">
              <Gavel className="w-8 h-8 text-white" />
           </div>
           <div>
              <h1 className="text-4xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter leading-none">{c.title}</h1>
              <p className="text-[10px] font-bold text-cogray-400 dark:text-cogray-600 uppercase tracking-widest mt-2">{c.updated}</p>
           </div>
        </div>

        <div className="p-8 rounded-[32px] bg-cogray-50 dark:bg-cogray-900/50 border border-cogray-100 dark:border-cogray-800 text-lg text-cogray-600 dark:text-cogray-400 leading-relaxed font-medium mb-16 italic">
          "{c.intro}"
        </div>

        <div className="space-y-12">
          {c.sections.map((section, idx) => (
            <div key={idx} className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-conime-600/10 rounded-xl text-conime-600">
                     {section.icon}
                  </div>
                  <h2 className="text-xl font-black text-cogray-900 dark:text-white uppercase tracking-tight">{section.title}</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-1 gap-4 ml-2">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-6 rounded-3xl bg-white dark:bg-cogray-900/30 border border-cogray-100 dark:border-cogray-800">
                       <div className="w-1.5 h-1.5 rounded-full bg-conime-600 shrink-0 mt-2"></div>
                       <p className="text-cogray-600 dark:text-cogray-400 font-medium leading-relaxed">{item}</p>
                    </div>
                  ))}
               </div>
            </div>
          ))}
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

export default TermsOfService;
