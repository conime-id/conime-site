
import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';
import { checkAvailability, saveSimulatedUser, findUser } from '../utils/authValidation';
import { X, Mail, Lock, User, Github, MessageSquare, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'id' | 'en';
  onLoginSuccess: (user: any) => void;
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, language, onLoginSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    
    // Generate valid username from display name
    // 1. Lowercase
    // 2. Replace non-alphanumeric with nothing (remove spaces/symbols)
    // 3. Append random number for uniqueness
    const generatedUsername = tab === 'register' 
      ? username.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000)
      : username;

    // Mock authentication delay
    setTimeout(() => {
      let finalUser;
      
      if (tab === 'register') {
        const availability = checkAvailability(generatedUsername, email, language);
        
        if (!availability.valid) {
          setError(availability.message || 'Error');
          setIsLoading(false);
          return;
        }

        const initials = username.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=200&bold=true&font-size=0.33`;

        finalUser = {
          id: 'user_' + Date.now(),
          username: generatedUsername,
          displayName: username,
          email: email.toLowerCase(),
          avatar: avatarUrl,
          role: 'user',
          bio: 'CoNime Enthusiast & Writer'
        };

        // Save simulated user
        saveSimulatedUser(finalUser);
        onLoginSuccess(finalUser);
      } else {
        // LOGIN LOGIC
        // 1. Try to find user in permitted "DB"
        const existingUser = findUser(email) || findUser(username);

        if (existingUser) {
          onLoginSuccess(existingUser);
        } else {
          setError(language === 'id' ? 'Akun tidak ditemukan atau password salah' : 'Account not found or invalid credentials');
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(false);
      onClose();
    }, 1500);
  };

  const socialLogins = [
    { 
      icon: <GoogleIcon />, 
      label: 'Google', 
      providerColor: 'border-cogray-100 dark:border-cogray-800 hover:border-conime-600/30 hover:bg-cogray-50 dark:hover:bg-cogray-950',
      textColor: 'text-cogray-700 dark:text-cogray-300'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-4 pt-16 md:pt-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-cogray-950/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-cogray-900 rounded-[32px] md:rounded-[40px] shadow-2xl border border-cogray-100 dark:border-cogray-800 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-conime-600/15 to-transparent"></div>
        
        <div className="relative p-6 md:p-10">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-cogray-100 dark:hover:bg-cogray-800 text-cogray-400 dark:text-cogray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-cogray-900 dark:text-white uppercase tracking-tighter mb-1">
              {tab === 'login' ? t.loginTitle : t.registerTitle}
            </h2>
            <p className="text-[10px] md:text-xs font-bold text-cogray-500 uppercase tracking-widest italic">
              CoNime News Portal
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-cogray-50 dark:bg-cogray-950 p-1 rounded-2xl mb-6">
            <button 
              onClick={() => setTab('login')}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                tab === 'login' 
                ? 'bg-white dark:bg-cogray-800 text-conime-600 shadow-sm' 
                : 'text-cogray-500 hover:text-cogray-900 dark:hover:text-cogray-100'
              }`}
            >
              {t.login}
            </button>
            <button 
              onClick={() => setTab('register')}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                tab === 'register' 
                ? 'bg-white dark:bg-cogray-800 text-conime-600 shadow-sm' 
                : 'text-cogray-500 hover:text-cogray-900 dark:hover:text-cogray-100'
              }`}
            >
              Daftar
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl animate-in shake duration-300">
              <p className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest text-center">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div className="relative group">
                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-cogray-400 group-focus-within:text-conime-600 transition-colors" />
                <input 
                  type="text" 
                  required
                  placeholder={language === 'id' ? "Nama Tampilan (Lengkap)" : "Display Name (Full Name)"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-cogray-50 dark:bg-cogray-950 border-2 border-transparent focus:border-conime-600/30 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-cogray-900 dark:text-white outline-none transition-all placeholder:text-cogray-400"
                />
              </div>
            )}
            
            <div className="relative group">
              <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-cogray-400 group-focus-within:text-conime-600 transition-colors" />
              <input 
                type={tab === 'login' ? "text" : "email"} 
                required
                placeholder={tab === 'login' ? t.loginIdentifierLabel : t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cogray-50 dark:bg-cogray-950 border-2 border-transparent focus:border-conime-600/30 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-cogray-900 dark:text-white outline-none transition-all placeholder:text-cogray-400"
              />
            </div>

            <div className="relative group">
              <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-cogray-400 group-focus-within:text-conime-600 transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cogray-50 dark:bg-cogray-950 border-2 border-transparent focus:border-conime-600/30 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-cogray-900 dark:text-white outline-none transition-all placeholder:text-cogray-400"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cogray-400 hover:text-conime-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full relative group bg-conime-600 hover:bg-conime-700 text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-conime-600/20 active:scale-[0.98] overflow-hidden"
            >
              <span className={`flex items-center justify-center gap-2 transition-transform duration-300 ${isLoading ? '-translate-y-10' : ''}`}>
                {tab === 'login' ? t.loginSubmit : t.registerSubmit}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-conime-600">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-cogray-100 dark:border-cogray-800"></div></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-cogray-400 bg-white dark:bg-cogray-900 px-4">
                {t.orContinueWith}
              </div>
            </div>

            <div className="flex justify-center">
              {socialLogins.map((social) => (
                <button 
                  key={social.label}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-3xl border-2 transition-all active:scale-[0.98] ${social.providerColor}`}
                >
                  {social.icon}
                  <span className={`font-black text-[11px] uppercase tracking-widest ${social.textColor}`}>
                    {language === 'id' ? 'Lanjutkan dengan' : 'Continue with'} {social.label}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-8 text-xs font-bold text-cogray-500 dark:text-cogray-400">
              {tab === 'login' ? t.dontHaveAccount : t.alreadyHaveAccount}{' '}
              <button 
                onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
                className="text-conime-600 hover:underline hover:underline-offset-4"
              >
                {tab === 'login' ? 'Daftar' : t.login}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
