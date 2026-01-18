import React, { useState, useRef } from 'react';
import { 
  Upload, FileText, CheckCircle, AlertCircle, ArrowLeft, 
  Trash2, Eye, Save, Clock, User, Tag, Image as ImageIcon 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';

interface AdminUploadProps {
  language: 'id' | 'en';
}

const AdminUpload: React.FC<AdminUploadProps> = ({ language }) => {
  const navigate = useNavigate();
  const t = (TRANSLATIONS[language] as any);
  
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>('');
  const [fullText, setFullText] = useState<string>('');
  const [metadata, setMetadata] = useState<any>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'news' | 'opinion' | 'reviews'>('news');
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseMD = (text: string) => {
    try {
      const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
      const match = text.match(frontmatterRegex);
      
      if (!match) throw new Error('Invalid frontmatter format. Ensure it starts and ends with --- on new lines.');
      
      const yamlBlock = match[1];
      const body = text.replace(frontmatterRegex, '').trim();
      
      const meta: any = {};
      yamlBlock.split('\n').forEach(line => {
        const idx = line.indexOf(':');
        if (idx !== -1) {
          const key = line.substring(0, idx).trim();
          let value = line.substring(idx + 1).trim();
          // Remove wrapping quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          meta[key] = value;
        }
      });
      
      // Fallback for title if title_id/en usage
      if (!meta.title) {
         if (meta.title_id) meta.title = meta.title_id;
         else if (meta.title_en) meta.title = meta.title_en;
      }
      
      return { meta, body };
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const validateFile = (meta: any, body: string) => {
     if (!meta.title && !meta.title_id && !meta.title_en) return 'Judul artikel (title/title_id) wajib diisi.';
     if (!meta.date) return 'Tanggal (date) wajib diisi.';
     if (!meta.layout && !meta.category) return 'Layout atau Category sebaiknya diisi.';
     if (!body || body.length < 10) return 'Konten artikel tampaknya kosong atau terlalu pendek.';
     return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.md')) {
        setError('Hanya file .md yang diperbolehkan');
        return;
      }
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile: File) => {
    setIsParsing(true);
    setError(null);
    setSuccess(false);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const { meta, body } = parseMD(text);
        
        const validationError = validateFile(meta, body);
        if (validationError) {
           setError(validationError);
           // Still allow viewing but maybe block save
        }

        setFile(selectedFile);
        setContent(body);
        setFullText(text);
        setMetadata(meta);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsParsing(false);
      }
    };
    reader.onerror = () => {
      setError('Gagal membaca file');
      setIsParsing(false);
    };
    reader.readAsText(selectedFile);
  };
  
  // Re-validate before save
  const handleSave = async () => {
      if (!file) return;
      const validationError = validateFile(metadata, content);
      if (validationError) {
         setError(validationError + " Perbaiki file sebelum menyimpan.");
         return;
      }

      setIsSaving(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:3001/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            content: fullText,
            category: selectedCategory
          })
        });
        const data = await res.json();
        if (data.success) {
          setSuccess(true);
        } else {
          setError(data.error || 'Gagal menyimpan');
        }
      } catch (err: any) {
        setError('Gagal menghubungi helper server. Pastikan server.js berjalan.');
      } finally {
        setIsSaving(false);
      }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const handleReset = () => {
    setFile(null);
    setContent('');
    setMetadata(null);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="min-h-screen pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-cogray-400 hover:text-conime-600 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full border border-cogray-200 dark:border-cogray-800 flex items-center justify-center group-hover:border-conime-600 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">{t.back}</span>
        </button>
        
        <div className="text-right">
          <h1 className="text-2xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter">Content Importer</h1>
          <p className="text-xs font-bold text-cogray-400 uppercase tracking-widest">Update Articles via Markdown</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Upload Section */}
        <div className="space-y-8">
          {!file ? (
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-cogray-200 dark:border-cogray-800 rounded-[40px] p-20 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-conime-600 dark:hover:border-conime-600 hover:bg-cogray-50 dark:hover:bg-cogray-900/30 transition-all group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".md"
              />
              <div className="w-20 h-20 rounded-3xl bg-conime-600/10 flex items-center justify-center text-conime-600 group-hover:scale-110 transition-transform">
                <Upload className="w-10 h-10" />
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-cogray-900 dark:text-white uppercase">Lepas file .md di sini</p>
                <p className="text-sm font-bold text-cogray-400 uppercase tracking-widest mt-2">atau klik untuk memilih file</p>
              </div>
            </div>
          ) : (
            <div className="bg-cogray-50 dark:bg-cogray-900/50 rounded-[40px] p-8 border border-cogray-100 dark:border-cogray-800 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                  <button 
                    onClick={handleReset}
                    className="p-3 text-cogray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
               </div>
               
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-conime-600 flex items-center justify-center text-white shadow-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-cogray-400 uppercase tracking-widest">{file.name}</p>
                    <h2 className="text-xl font-black text-cogray-900 dark:text-white uppercase truncate max-w-md">{metadata?.title || 'No Title Found'}</h2>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-3xl bg-white dark:bg-cogray-900 border border-cogray-100 dark:border-cogray-800/50">
                    <div className="flex items-center gap-2 text-conime-600 mb-2">
                       <Tag className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Simpan Di Folder</span>
                    </div>
                    <select 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value as any)}
                      className="w-full bg-transparent text-sm font-bold text-cogray-800 dark:text-cogray-200 focus:outline-none"
                    >
                      <option value="news">News (Berita)</option>
                      <option value="opinion">Opinion (Opini)</option>
                      <option value="reviews">Reviews (Ulasan)</option>
                    </select>
                  </div>
                  <div className="p-4 rounded-3xl bg-white dark:bg-cogray-900 border border-cogray-100 dark:border-cogray-800/50">
                    <div className="flex items-center gap-2 text-conime-600 mb-2">
                       <User className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Author</span>
                    </div>
                    <p className="text-sm font-bold text-cogray-800 dark:text-cogray-200">{metadata?.author || 'N/A'}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-3xl bg-white dark:bg-cogray-900 border border-cogray-100 dark:border-cogray-800/50">
                    <div className="flex items-center gap-2 text-conime-600 mb-2">
                       <Clock className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Date</span>
                    </div>
                    <p className="text-sm font-bold text-cogray-800 dark:text-cogray-200">{metadata?.date?.split('T')[0] || 'N/A'}</p>
                  </div>
                  <div className="p-4 rounded-3xl bg-white dark:bg-cogray-900 border border-cogray-100 dark:border-cogray-800/50">
                    <div className="flex items-center gap-2 text-conime-600 mb-2">
                       <ImageIcon className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Thumb</span>
                    </div>
                    <p className="text-sm font-bold text-cogray-800 dark:text-cogray-200 truncate">{metadata?.thumbnail || 'N/A'}</p>
                  </div>
               </div>

               <div className="mt-8 pt-8 border-t border-cogray-100 dark:border-cogray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Format Valid</span>
                  </div>
                  <button 
                    disabled={isSaving}
                    onClick={handleSave}
                    className={`flex items-center gap-2 bg-conime-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-conime-600/20 hover:brightness-110 active:scale-95 transition-all ${isSaving ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Ke Project'}</span>
                  </button>
               </div>
            </div>
          )}

          {error && (
            <div className="p-6 rounded-3xl bg-red-600/10 border border-red-600/20 flex items-center gap-4 text-red-600 animate-in slide-in-from-top duration-300">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p className="text-sm font-bold uppercase tracking-[0.05em]">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-8 rounded-[40px] bg-green-600 text-white shadow-2xl shadow-green-600/30 animate-in zoom-in duration-500">
               <div className="flex items-center gap-6 mb-4">
                  <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase">Berhasil Disimpan!</h3>
                    <p className="text-white/80 text-sm font-medium">File telah ditulis ke folder: src/content/{selectedCategory}/{file?.name}. Browser mungkin perlu di-refresh untuk melihat perubahan.</p>
                  </div>
               </div>
               <button onClick={handleReset} className="mt-4 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black uppercase tracking-widest transition-colors w-full">
                  Upload File Lain
               </button>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <Eye className="w-5 h-5 text-conime-600" />
             <h3 className="text-lg font-black text-cogray-900 dark:text-white uppercase tracking-tighter">Live Preview</h3>
          </div>
          
          <div className="bg-white dark:bg-cogray-950 border border-cogray-100 dark:border-cogray-900 rounded-[40px] h-[600px] overflow-y-auto no-scrollbar shadow-inner p-8">
            {metadata ? (
              <div className="article-content max-w-none text-left">
                <h1 className="text-3xl font-black text-cogray-900 dark:text-white uppercase mb-8">{metadata.title_id || metadata.title}</h1>
                <div className="text-cogray-700 dark:text-cogray-400 leading-relaxed space-y-4 whitespace-pre-wrap font-medium">
                  {content}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-cogray-300 dark:text-cogray-800">
                <FileText className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-sm font-black uppercase tracking-[0.2em]">Pilih file untuk pratinjau</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-20 p-10 bg-cogray-50 dark:bg-cogray-900/30 rounded-[40px] border border-cogray-100 dark:border-cogray-800/50">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-cogray-900 dark:text-white uppercase tracking-tighter">Panduan Import Markdown</h3>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  const template = `---
layout: news
title_id: "Judul Artikel (ID)"
title_en: "Article Title (EN)"
excerpt_id: "Ringkasan artikel dalam bahasa Indonesia."
excerpt_en: "Summary of the article in English."
author: "Author Name"
date: ${new Date().toISOString()}
category: "Category Name"
thumbnail: "/images/uploads/your-image.jpg"
---

## Subjudul (ID)
Isi artikel bahasa Indonesia...

---

## Subtitle (EN)
English article content...
`;
                  const blob = new Blob([template], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'template-article.md';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-cogray-800 border-2 border-conime-600/20 text-conime-600 dark:text-conime-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-conime-600 hover:text-white hover:dark:text-white transition-all shadow-lg shadow-conime-600/10"
              >
                <FileText className="w-4 h-4" /> Download Template
              </button>
            </div>
         </div>
         <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
               <div className="w-8 h-8 rounded-full bg-conime-600 text-white flex items-center justify-center font-black text-xs">1</div>
               <p className="text-sm font-bold text-cogray-800 dark:text-cogray-200 uppercase tracking-tight">Format Frontmatter</p>
               <p className="text-xs text-cogray-500 leading-relaxed font-medium">Pastikan file .md memiliki header di antara baris ---. Gunakan template agar tidak salah format.</p>
            </div>
            <div className="space-y-3">
               <div className="w-8 h-8 rounded-full bg-conime-600 text-white flex items-center justify-center font-black text-xs">2</div>
               <p className="text-sm font-bold text-cogray-800 dark:text-cogray-200 uppercase tracking-tight">Kategori & Folder</p>
               <p className="text-xs text-cogray-500 leading-relaxed font-medium">Pilih folder penyimpanan (News/Opinion) di menu kiri. Kategori spesifik (misal: "K-Drama") tulis di dalam file frontmatter.</p>
            </div>
            <div className="space-y-3">
               <div className="w-8 h-8 rounded-full bg-conime-600 text-white flex items-center justify-center font-black text-xs">3</div>
               <p className="text-sm font-bold text-cogray-800 dark:text-cogray-200 uppercase tracking-tight">Simpan Otomatis</p>
               <p className="text-xs text-cogray-500 leading-relaxed font-medium">Klik tombol simpan dan file akan langsung ditulis ke folder project oleh server lokal.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminUpload;
