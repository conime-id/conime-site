
import React from 'react';
import { ArrowLeft, ShieldCheck, Mail, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface DMCAProps {
  language: 'id' | 'en';
  onBack: () => void;
}

const DMCA: React.FC<DMCAProps> = ({ language, onBack }) => {
  const t = TRANSLATIONS[language];

  const content = {
    id: {
      title: "DMCA Copyright Notice",
      updated: "Terakhir Diperbarui: Juli 2025 (v3.0)",
      intro: "CoNime sangat menghormati hak kekayaan intelektual orang lain. Kami berkomitmen untuk menanggapi laporan dugaan pelanggaran hak cipta sesuai dengan Digital Millennium Copyright Act (DMCA).",
      proceduresTitle: "Prosedur Pengajuan Laporan",
      procedures: [
        "Identifikasi karya berhak cipta yang diklaim telah dilanggar.",
        "Identifikasi materi yang dianggap melanggar beserta URL lokasinya di CoNime.",
        "Informasi kontak Anda (Email, Alamat, atau Nomor Telepon).",
        "Pernyataan 'itikat baik' bahwa penggunaan materi tidak diizinkan oleh pemilik hak cipta.",
        "Pernyataan bahwa informasi dalam laporan adalah akurat.",
        "Tanda tangan fisik atau elektronik dari pemilik hak cipta atau wakilnya."
      ],
      contactTitle: "Saluran Resmi Laporan",
      contactDesc: "Silakan kirimkan pemberitahuan pelanggaran Anda ke alamat email khusus legal kami:",
      legalEmail: "legal@conime.id",
      warning: "Harap diperhatikan bahwa penyalahgunaan laporan DMCA dapat berakibat pada tanggung jawab hukum sesuai peraturan yang berlaku."
    },
    en: {
      title: "DMCA Copyright Notice",
      updated: "Last Updated: July 2025 (v3.0)",
      intro: "CoNime respects the intellectual property rights of others. We are committed to responding to notices of alleged copyright infringement in compliance with the Digital Millennium Copyright Act (DMCA).",
      proceduresTitle: "Notice Procedures",
      procedures: [
        "Identification of the copyrighted work claimed to have been infringed.",
        "Identification of the material that is claimed to be infringing and its URL location on CoNime.",
        "Your contact information (Email, Address, or Phone Number).",
        "A 'good faith belief' statement that the use is not authorized by the copyright owner.",
        "A statement that the information in the notification is accurate.",
        "A physical or electronic signature of the copyright owner or authorized representative."
      ],
      contactTitle: "Official Report Channel",
      contactDesc: "Please send your infringement notices to our dedicated legal email address:",
      legalEmail: "legal@conime.id",
      warning: "Please be aware that misrepresentation in a DMCA notice may lead to legal liability according to applicable regulations."
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
           <div className="p-3 bg-conime-600 text-white rounded-2xl border border-conime-500/20 shadow-xl shadow-conime-500/10">
              <ShieldCheck className="w-8 h-8" />
           </div>
           <div>
              <h1 className="text-4xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter leading-none">{c.title}</h1>
              <p className="text-[10px] font-bold text-cogray-400 dark:text-cogray-600 uppercase tracking-widest mt-2">{c.updated}</p>
           </div>
        </div>

        <div className="p-10 rounded-[40px] bg-cogray-50 dark:bg-cogray-900/50 border border-cogray-100 dark:border-cogray-800 text-lg text-cogray-600 dark:text-cogray-400 leading-relaxed font-medium mb-16 italic relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <FileText className="w-32 h-32" />
          </div>
          <span className="relative z-10">"{c.intro}"</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-12">
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-cogray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
               <div className="w-1 h-8 bg-conime-600 rounded-full"></div>
               {c.proceduresTitle}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {c.procedures.map((step, i) => (
                <div key={i} className="flex items-start gap-5 p-6 rounded-3xl bg-white dark:bg-cogray-900/30 border border-cogray-100 dark:border-cogray-800 group hover:border-conime-600/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-conime-500/10 text-conime-600 flex items-center justify-center text-xs font-black shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-cogray-700 dark:text-cogray-300 font-bold leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-12 rounded-[48px] bg-cogray-100 dark:bg-cogray-900 border border-cogray-200 dark:border-cogray-800 text-white relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-conime-600/10 to-transparent"></div>
             <div className="relative z-10 space-y-6 text-center">
                <Mail className="w-12 h-12 text-conime-500 mx-auto" />
                <h3 className="text-2xl text-cogray-900 dark:text-white font-black uppercase tracking-tighter">{c.contactTitle}</h3>
                <p className="text-cogray-400 font-medium max-w-md mx-auto">{c.contactDesc}</p>
                <a href={`mailto:${c.legalEmail}`} className="block text-2xl md:text-3xl font-black text-conime-500 hover:text-conime-400 transition-colors tracking-tight underline decoration-conime-500/30 underline-offset-8">
                  {c.legalEmail}
                </a>
             </div>
          </div>
        </div>

        <div className="mt-16 flex items-start gap-4 p-8 rounded-3xl bg-amber-500/5 border border-amber-500/20">
           <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
           <p className="text-sm font-bold text-amber-500/80 uppercase tracking-wide leading-relaxed">
              {c.warning}
           </p>
        </div>
      </div>
    </div>
  );
};

export default DMCA;
