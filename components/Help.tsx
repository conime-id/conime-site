
import React from 'react';

export const Help: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-20 pb-20">
      <section className="text-center space-y-6 pt-10">
        <div className="inline-block bg-conime-500/10 border border-conime-500/20 px-4 py-1.5 rounded-full">
          <span className="text-[10px] font-black text-conime-500 uppercase tracking-[0.3em]">Support Center</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
          Pusat <span className="text-conime-500">Bantuan</span>
        </h1>
        <p className="max-w-2xl mx-auto text-cogray-400 font-bold uppercase tracking-widest text-xs leading-relaxed">
          Butuh panduan atau mengalami masalah teknis? Cari solusinya di sini.
        </p>
        
        <div className="max-w-xl mx-auto mt-10 relative">
          <input 
            type="text" 
            placeholder="CARI TOPIK BANTUAN..."
            className="w-full bg-cogray-900 border border-cogray-800 rounded-3xl px-8 py-5 text-xs font-bold text-white focus:outline-none focus:border-conime-500 transition-all placeholder:text-cogray-700 uppercase tracking-widest shadow-2xl"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-conime-500 text-white p-2.5 rounded-2xl hover:bg-conime-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: 'Pengaturan Akun', desc: 'Cara daftar, ganti password, dan profil.', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
          { title: 'Panduan Konten', desc: 'Aturan penulisan, review, dan hak cipta.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
          { title: 'Masalah Teknis', desc: 'Error website, loading lama, atau bug.', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
          { title: 'Privasi & Data', desc: 'Bagaimana kami mengelola datamu.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
          { title: 'Newsletter', desc: 'Berhenti berlangganan atau ganti email.', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
          { title: 'Kerja Sama', desc: 'Prosedur media partner dan iklan.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }
        ].map((item, i) => (
          <div key={i} className="bg-cogray-900 border border-cogray-800 p-8 rounded-[40px] space-y-6 hover:border-conime-500 transition-all cursor-pointer group shadow-xl">
            <div className="w-14 h-14 bg-conime-500/10 rounded-2xl flex items-center justify-center text-conime-500 border border-conime-500/20 group-hover:bg-conime-500 group-hover:text-white transition-all">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}/></svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">{item.title}</h3>
              <p className="text-xs text-cogray-400 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-gradient-to-br from-cogray-900 to-cogray-950 border border-conime-500/20 rounded-[40px] p-10 md:p-16 text-center space-y-8 shadow-2xl">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Tidak menemukan solusi?</h2>
        <p className="max-w-xl mx-auto text-cogray-400 font-bold uppercase tracking-widest text-xs leading-relaxed">
          Tim support kami siap membantu Nakama secara langsung. Silakan kirimkan tiket bantuan.
        </p>
        <button className="bg-conime-500 hover:bg-conime-600 text-white font-black px-12 py-4 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-conime-500/20 active:scale-95">
          Buat Tiket Bantuan
        </button>
      </section>
    </div>
  );
};
