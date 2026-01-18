import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, DEFAULT_AVATAR } from '../constants';
import { useSearchParams } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { checkAvailability } from '../utils/authValidation'; // We keep checkAvailability mock for now or remove if we trust Firestore uniqueness (simpler: trust for now)
import { X, User, Mail, Shield, Palette, Globe, Trash2, Save, Camera, Check, ChevronRight, Upload } from 'lucide-react';
import { User as UserType } from '../types';

interface AccountSettingsProps {
  user: UserType;
  language: 'id' | 'en';
  onSave: (updatedUser: UserType) => void;
  onCancel: () => void;
  onThemeToggle: () => void;
  onLanguageToggle: () => void;
  theme: 'light' | 'dark';
  onDelete: () => void;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ 
  user, 
  language, 
  onSave, 
  onCancel,
  onThemeToggle,
  onLanguageToggle,
  theme,
  onDelete
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'profile' | 'account') || 'profile';
  const [activeTab, setActiveTab] = useState<'profile' | 'account'>(initialTab);

  // Sync state when URL params change
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'profile' || tab === 'account') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'profile' | 'account') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };
  const [formData, setFormData] = useState({
    username: user.username,
    displayName: user.displayName,
    email: user.email,
    bio: user.bio || '',
    avatar: user.avatar
  });
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State defined at top
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const t = TRANSLATIONS[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate availability
    const availability = checkAvailability(
      formData.username, 
      formData.email, 
      language, 
      user.username, 
      user.email
    );

    if (!availability.valid) {
      setError(availability.message || 'Error');
      return;
    }

    // Generate avatar if empty
    let avatarToSave = formData.avatar;
    if (!avatarToSave || avatarToSave.trim() === '') {
      avatarToSave = DEFAULT_AVATAR;
    }

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: formData.displayName,
          photoURL: avatarToSave
        });
        
        await setDoc(doc(db, 'users', user.id), {
          username: formData.username,
          displayName: formData.displayName,
          email: formData.email,
          avatar: avatarToSave,
          bio: formData.bio || ''
        }, { merge: true });
        
        onSave({ ...user, ...formData, avatar: avatarToSave });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'profile', label: t.editProfile, icon: <User className="w-5 h-5" /> },
    { id: 'account', label: t.accountSettings, icon: <Shield className="w-5 h-5" /> }
  ];

  return (
    <>
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-cogray-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowDeleteConfirm(false)}></div>
          <div className="relative w-full max-w-sm bg-white dark:bg-cogray-900 rounded-[32px] p-8 shadow-2xl border border-red-500/20 animate-in zoom-in-95 duration-300 transform transition-all">
             <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 dark:text-red-500">
               <Trash2 className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-black text-center text-cogray-900 dark:text-white uppercase tracking-tighter mb-2">
               {language === 'id' ? 'Hapus Akun Permanen?' : 'Delete Account Permanently?'}
             </h3>
             <p className="text-xs font-bold text-center text-cogray-500 dark:text-cogray-400 uppercase tracking-widest leading-relaxed mb-8">
               {language === 'id' ? 'Tindakan ini tidak dapat dibatalkan. Semua data profil dan riwayat akan hilang.' : 'This action cannot be undone. All profile data and history will be lost.'}
             </p>
             <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={() => setShowDeleteConfirm(false)}
                 className="py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-cogray-100 dark:bg-cogray-800 text-cogray-600 dark:text-cogray-300 hover:bg-cogray-200 dark:hover:bg-cogray-700 transition-colors"
               >
                 {t.cancel}
               </button>
               <button 
                 onClick={() => {
                   onDelete();
                 }}
                 className="py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all active:scale-95"
               >
                 {t.deleteAccount}
               </button>
             </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Profile Header Banner */}
        <div className="relative h-64 md:h-80 rounded-[48px] overflow-hidden mb-8 border border-cogray-100 dark:border-cogray-800 shadow-2xl group">
           <div className="absolute inset-0 bg-gradient-to-br from-conime-600 via-conime-700 to-indigo-900 group-hover:scale-105 transition-transform duration-1000"></div>
           <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
           <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
           
           <div className="absolute bottom-8 left-8 md:left-12 text-left z-20">
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2 leading-none drop-shadow-2xl">
                {language === 'id' ? 'Pengaturan Akun' : 'Account Settings'}
              </h1>
              <p className="text-xs md:text-sm font-bold text-white/70 uppercase tracking-[0.3em] drop-shadow-lg">
                {t.portalBudayaPop} • Premium Member
              </p>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Nav */}
          <div className="lg:w-1/3 xl:w-1/4">
            <div className="bg-white/80 dark:bg-cogray-900/80 backdrop-blur-xl rounded-[40px] p-2 border border-cogray-100 dark:border-cogray-800 shadow-2xl sticky top-24">
              <div className="p-8 mb-4 text-center">
                <div className="relative inline-block group mb-6">
                  <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white dark:border-cogray-950 group-hover:border-conime-600 transition-all shadow-2xl relative z-10">
                    <img src={formData.avatar} alt={formData.username} className="w-full h-full object-cover" />
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-2.5 bg-conime-600 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer group/cam z-20">
                    <Camera className="w-4 h-4 group-hover/cam:scale-110 transition-transform" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
                <h3 className="text-xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter truncate">{formData.displayName}</h3>
                <p className="text-[10px] font-bold text-conime-600 uppercase tracking-widest mb-1">@{formData.username}</p>
                <p className="text-[9px] font-bold text-cogray-400 uppercase tracking-widest">{user.role}</p>
              </div>
  
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as any)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${
                      activeTab === tab.id 
                      ? 'bg-conime-600 text-white shadow-lg shadow-conime-600/20' 
                      : 'hover:bg-cogray-50 dark:hover:bg-cogray-950 text-cogray-600 dark:text-cogray-400 hover:text-conime-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {tab.icon}
                      <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                  </button>
                ))}
              </nav>
  
              <div className="mt-8 pt-6 border-t border-cogray-100 dark:border-cogray-800">
                <button 
                  onClick={onCancel}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-cogray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group"
                >
                  <X className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">{t.cancel}</span>
                </button>
              </div>
            </div>
          </div>
  
          {/* Content Area */}
          <div className="lg:flex-grow">
            <div className="bg-white/80 dark:bg-cogray-900/80 backdrop-blur-xl rounded-[48px] p-8 md:p-16 border border-cogray-100 dark:border-cogray-800 shadow-2xl relative overflow-hidden">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-conime-600/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>
  
              {activeTab === 'profile' ? (
                <form onSubmit={handleSubmit} className="relative space-y-10">
                  <header>
                    <h2 className="text-3xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter mb-2">{t.editProfile}</h2>
                    <p className="text-sm font-bold text-cogray-400 uppercase tracking-widest italic">{t.portalBudayaPop}</p>
                  </header>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {error && (
                      <div className="md:col-span-2 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl animate-in shake duration-300">
                        <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest text-center">
                          {error}
                        </p>
                      </div>
                    )}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-conime-600 uppercase tracking-[0.2em] ml-2">{t.displayNameLabel}</label>
                      <div className="relative group">
                        <User className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-cogray-400 group-focus-within:text-conime-600 transition-colors" />
                        <input 
                          type="text" 
                          value={formData.displayName}
                          onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                          className="w-full bg-cogray-50 dark:bg-cogray-950 border-2 border-transparent focus:border-conime-600/30 rounded-[28px] py-7 pl-16 pr-8 text-sm font-bold text-cogray-900 dark:text-white outline-none transition-all placeholder:text-cogray-400 shadow-sm"
                        />
                      </div>
                    </div>
  
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-conime-600 uppercase tracking-[0.2em] ml-2">{t.usernameLabel}</label>
                      <div className="relative group">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-cogray-400 font-bold text-sm">@</span>
                        <input 
                          type="text" 
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value})}
                          className="w-full bg-cogray-50 dark:bg-cogray-950 border-2 border-transparent focus:border-conime-600/30 rounded-[28px] py-7 pl-12 pr-8 text-sm font-bold text-cogray-900 dark:text-white outline-none transition-all placeholder:text-cogray-400 shadow-sm"
                        />
                      </div>
                    </div>
  
                    <div className="space-y-4">
                      <div className="flex items-center justify-between ml-2">
                         <label className="text-[10px] font-black text-conime-600 uppercase tracking-[0.2em]">{t.emailPlaceholder}</label>
                         <div className="flex items-center gap-1.5 px-2 py-0.5 bg-cogray-100 dark:bg-cogray-800 rounded-lg border border-cogray-200 dark:border-cogray-700">
                            <Check className="w-3 h-3 text-conime-600" />
                            <span className="text-[8px] font-black text-cogray-500 dark:text-cogray-400 uppercase tracking-widest leading-none">Private Info</span>
                         </div>
                      </div>
                      <div className="relative group">
                        <Mail className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-cogray-400 group-focus-within:text-conime-600 transition-colors" />
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-cogray-50 dark:bg-cogray-950 border-2 border-transparent focus:border-conime-600/30 rounded-[28px] py-7 pl-16 pr-8 text-sm font-bold text-cogray-900 dark:text-white outline-none transition-all placeholder:text-cogray-400 shadow-sm"
                        />
                      </div>
                      <p className="text-[9px] font-bold text-cogray-400 uppercase tracking-widest ml-4 italic">* Perubahan email memerlukan verifikasi ulang.</p>
                    </div>
  
                    <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] font-black text-conime-600 uppercase tracking-[0.2em] ml-2">{t.bioLabel}</label>
                      <div className="relative group">
                        <textarea 
                          rows={4}
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          className="w-full bg-cogray-50 dark:bg-cogray-950 border-2 border-transparent focus:border-conime-600/30 rounded-[32px] py-8 px-8 text-sm font-bold text-cogray-900 dark:text-white outline-none transition-all resize-none placeholder:text-cogray-400 shadow-sm"
                          placeholder={language === 'id' ? 'Ceritakan sedikit tentang dirimu...' : 'Tell us a bit about yourself...'}
                        ></textarea>
                      </div>
                    </div>
  
                    <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] font-black text-conime-600 uppercase tracking-[0.2em] ml-2">{t.avatarLabel}</label>
                      <div className="flex gap-3">
                        <div className="relative flex-grow group">
                          <input 
                            type="url" 
                            value={formData.avatar}
                            onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                            className="w-full bg-cogray-50 dark:bg-cogray-950 border-2 border-transparent focus:border-conime-600/30 rounded-[28px] py-7 px-8 text-sm font-bold text-cogray-900 dark:text-white outline-none transition-all placeholder:text-cogray-400 shadow-sm"
                          />
                        </div>
                        <label className="shrink-0 flex items-center justify-center p-6 bg-cogray-100 dark:bg-cogray-800 rounded-3xl hover:bg-conime-600 hover:text-white transition-all cursor-pointer shadow-sm group">
                          <Upload className="w-5 h-5" />
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
  
                  <div className="flex items-center justify-end gap-4 pt-6">
                    <button 
                      type="submit"
                      className={`flex items-center gap-3 font-black px-10 py-5 rounded-[24px] uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95 ${
                        isSaved 
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20' 
                        : 'bg-conime-600 hover:bg-conime-700 text-white shadow-conime-600/20'
                      }`}
                    >
                      {isSaved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                      <span>{isSaved ? (language === 'id' ? 'TERSIMPAN!' : 'SAVED') : (language === 'id' ? 'SIMPAN PERUBAHAN' : t.saveChanges)}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="relative space-y-12">
                  <header>
                    <h2 className="text-3xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter mb-2">{t.accountSettings}</h2>
                    <p className="text-sm font-bold text-cogray-400 uppercase tracking-widest italic">CoNime Privacy & Preferences</p>
                  </header>
  
                  <div className="space-y-8">
                    <section className="space-y-4">
                      <h4 className="text-[10px] font-black text-cogray-400 dark:text-cogray-600 uppercase tracking-[0.3em] ml-2">{t.appearance}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                          onClick={onThemeToggle}
                          className="flex items-center justify-between p-6 bg-cogray-50 dark:bg-cogray-950/50 border-2 border-transparent hover:border-conime-600/30 rounded-[32px] transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-white dark:bg-cogray-900 rounded-2xl shadow-sm text-conime-600">
                              <Palette className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <span className="block text-xs font-black uppercase tracking-widest text-cogray-900 dark:text-white">{t.themeLabel}</span>
                              <span className="text-[10px] font-bold text-cogray-400 uppercase">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                            </div>
                          </div>
                          <div className={`w-12 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-conime-600' : 'bg-cogray-200'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${theme === 'dark' ? 'left-7' : 'left-1'}`}></div>
                          </div>
                        </button>
  
                        <button 
                          onClick={onLanguageToggle}
                          className="flex items-center justify-between p-6 bg-cogray-50 dark:bg-cogray-950/50 border-2 border-transparent hover:border-conime-600/30 rounded-[32px] transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-white dark:bg-cogray-900 rounded-2xl shadow-sm text-conime-600">
                              <Globe className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <span className="block text-xs font-black uppercase tracking-widest text-cogray-900 dark:text-white">{t.languageLabel}</span>
                              <span className="text-[10px] font-bold text-cogray-400 uppercase">{language === 'id' ? 'Bahasa Indonesia' : 'English'}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-cogray-300 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </section>
  
                    <div className="h-[1px] bg-cogray-100 dark:bg-cogray-800"></div>
  
                    <section className="space-y-6">
                      <h4 className="text-[10px] font-black text-red-600/50 uppercase tracking-[0.3em] ml-2">{t.dangerZone}</h4>
                      <div className="p-8 rounded-[32px] bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                          <p className="text-sm font-black text-red-600 uppercase tracking-tighter mb-1">{t.deleteAccount}</p>
                          <p className="text-xs font-medium text-red-400">{t.confirmDelete}</p>
                        </div>
                        <button 
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>{t.deleteAccount}</span>
                        </button>
                      </div>
                    </section>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
