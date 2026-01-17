
import React from 'react';
import { ArrowLeft, Shield, Scale, Copyright, AlertTriangle, EyeOff, FileText, UserCircle } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface PrivacyPolicyProps {
  language: 'id' | 'en';
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ language, onBack }) => {
  const t = TRANSLATIONS[language];

  const content = {
    id: {
      title: "Kebijakan Privasi & Ketentuan Hukum",
      updated: "Terakhir Diperbarui: Juli 2025 (v3.0)",
      intro: "CoNime berkomitmen untuk melindungi privasi Anda dan menjamin transparansi mengenai pengelolaan konten. Halaman ini menjelaskan praktik privasi kami serta kebijakan hukum atas informasi yang kami sajikan.",
      sections: [
        {
          title: "1. Data Pengunjung",
          icon: <Shield className="w-6 h-6" />,
          desc: "Kami mengumpulkan informasi minimal untuk kenyamanan akses Anda:",
          items: [
            "Log Files: Data teknis browser dan halaman yang dikunjungi untuk analisis statistik internal.",
            "Cookies: Menyimpan preferensi pengaturan situs seperti bahasa dan tema.",
            "Komentar: Data yang Anda kirimkan secara sukarela pada kolom interaksi (jika aktif)."
          ]
        },
        {
          title: "2. Keanggotaan & Akun",
          icon: <UserCircle className="w-6 h-6" />,
          desc: "Terkait rencana pengembangan fitur interaksi personal di versi v3.0:",
          items: [
            "Pengumpulan data (seperti email) hanya akan dilakukan untuk sinkronisasi profil dan fitur personalisasi jika fitur akun diluncurkan.",
            "Privasi data anggota dijaga sesuai standar keamanan digital global.",
            "Kami berkomitmen tidak memperjualbelikan data pribadi pengguna kepada pihak ketiga."
          ]
        },
        {
          title: "3. Standar Publikasi & Verifikasi",
          icon: <FileText className="w-6 h-6" />,
          desc: "Kebijakan redaksional dalam penyusunan konten:",
          items: [
            "Bantuan AI digunakan untuk efisiensi riset draf awal dari sumber-sumber resmi global.",
            "Kami melakukan upaya terbaik untuk memverifikasi data dan membandingkan informasi dengan sumber asli guna meminimalkan misinformasi.",
            "Editor manusia memiliki kendali penuh atas persetujuan akhir setiap artikel sebelum dipublikasikan."
          ]
        },
        {
          title: "4. Hak Cipta & Visual",
          icon: <Copyright className="w-6 h-6" />,
          desc: "Penghormatan atas hak kekayaan intelektual:",
          items: [
            "Materi Visual: Kami berupaya mencantumkan sumber resmi pada gambar yang diunggah secara mandiri.",
            "Takedown: Kami menanggapi laporan keberatan hak cipta secara serius melalui jalur komunikasi resmi kami."
          ]
        }
      ],
      footer: "Dengan menggunakan situs CoNime, Anda menyetujui ketentuan yang berlaku. Untuk pertanyaan lebih lanjut, silakan hubungi tim kami."
    },
    en: {
      title: "Privacy Policy & Legal Terms",
      updated: "Last Updated: July 2025 (v3.0)",
      intro: "CoNime is committed to protecting your privacy and ensuring transparency regarding content management. This page explains our privacy practices and the legal policies of the information we present.",
      sections: [
        {
          title: "1. Visitor Data",
          icon: <Shield className="w-6 h-6" />,
          desc: "We collect minimal information for your access convenience:",
          items: [
            "Log Files: Browser technical data and pages visited for internal statistical analysis.",
            "Cookies: Stores site settings preferences such as language and theme.",
            "Comments: Data you voluntarily submit in interaction columns (if active)."
          ]
        },
        {
          title: "2. Membership & Accounts",
          icon: <UserCircle className="w-6 h-6" />,
          desc: "Regarding planned personal interaction features in v3.0:",
          items: [
            "Data collection (such as email) will only be for profile synchronization and personalization features if account features are launched.",
            "Member data privacy will be maintained according to global digital security standards.",
            "We are committed not to sell user personal data to third parties."
          ]
        },
        {
          title: "3. Publication & Verification Standards",
          icon: <FileText className="w-6 h-6" />,
          desc: "Editorial policy in content preparation:",
          items: [
            "AI assistance is used for early draft research efficiency from global official sources.",
            "We make our best efforts to verify data and compare information with original sources to minimize misinformation.",
            "Human editors have full control over the final approval of every article before publication."
          ]
        },
        {
          title: "4. Copyright & Visuals",
          icon: <Copyright className="w-6 h-6" />,
          desc: "Respect for intellectual property rights:",
          items: [
            "Visual Materials: We strive to include official sources on images uploaded independently.",
            "Takedown: We take copyright objection reports seriously through our official communication channels."
          ]
        }
      ],
      footer: "By using the CoNime site, you agree to the applicable terms. For further questions, please contact our team."
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
              <Scale className="w-8 h-8 text-white" />
           </div>
           <div>
              <h1 className="text-4xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter leading-none">{c.title}</h1>
              <p className="text-[10px] font-bold text-cogray-400 dark:text-cogray-600 uppercase tracking-widest mt-2">{c.updated}</p>
           </div>
        </div>

        <div className="p-8 rounded-[32px] bg-cogray-50 dark:bg-cogray-900/50 border border-cogray-100 dark:border-cogray-800 text-lg text-cogray-600 dark:text-cogray-400 leading-relaxed font-medium mb-16 italic">
           "{c.intro}"
        </div>
      </div>

      <div className="max-w-4xl space-y-20 mb-20">
         {c.sections.map((section, idx) => (
            <div key={idx} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-conime-500/10 rounded-xl text-conime-600">
                     {section.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-cogray-900 dark:text-white uppercase tracking-tight">
                     {section.title}
                  </h2>
               </div>
               <div className="space-y-6">
                  <p className="text-lg font-bold text-cogray-800 dark:text-cogray-200">{section.desc}</p>
                  <ul className="space-y-4">
                     {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-4 group">
                           <div className="w-1.5 h-1.5 rounded-full bg-conime-600 shrink-0 mt-2.5 transition-transform group-hover:scale-150"></div>
                           <p className="text-cogray-600 dark:text-cogray-400 font-medium leading-relaxed">{item}</p>
                        </li>
                     ))}
                  </ul>
               </div>
               {idx !== c.sections.length - 1 && (
                 <div className="h-[1px] w-full bg-cogray-100 dark:bg-cogray-900 mt-12"></div>
               )}
            </div>
         ))}
      </div>

      <div className="max-w-4xl mb-20 p-12 rounded-[48px] bg-cogray-50 dark:bg-cogray-900/50 border border-dashed border-cogray-200 dark:border-cogray-800 text-center">
         <p className="text-sm font-bold text-cogray-500 uppercase tracking-widest">
            {t.footerMotto}
         </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
