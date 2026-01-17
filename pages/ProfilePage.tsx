
import React from 'react';
import { AccountSettings } from '../components/AccountSettings';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

interface ProfilePageProps {
  currentUser: any;
  language: 'id' | 'en';
  theme: 'light' | 'dark';
  onUpdateUser: (user: any) => void;
  onThemeToggle: () => void;
  onLanguageToggle: () => void;
  onDeleteUser: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  language,
  theme,
  onUpdateUser,
  onThemeToggle,
  onLanguageToggle,
  onDeleteUser
}) => {
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/');
    return null;
  }

  return (
    <div className="pt-8">
      <AccountSettings 
        user={currentUser}
        language={language}
        theme={theme}
        onSave={onUpdateUser}
        onCancel={() => navigate(-1)}
        onThemeToggle={onThemeToggle}
        onLanguageToggle={onLanguageToggle}
        onDelete={onDeleteUser}
      />
    </div>
  );
};
