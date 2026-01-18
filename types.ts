
export interface NewsItem {
  id: string;
  title: {
    id: string;
    en: string;
  };
  excerpt: {
    id: string;
    en: string;
  };
  content: {
    id: string;
    en: string;
  };
  category: {
    id: string;
    en: string;
  };
  subCategory: {
    id: string;
    en: string;
  };
  author: string;
  date: {
    id: string;
    en: string;
  };
  imageUrl: string;
  videoUrl?: string; // URL YouTube Embed untuk video utama
  videoLabel?: {
    id: string;
    en: string;
  }; // Label kustom untuk video utama
  videoSource?: string;
  videoSourceUrl?: string;
  imageSource?: string;
  imageSourceUrl?: string;
  imageCaption?: {
    id: string;
    en: string;
  };
  gallery?: {
    url: string;
    videoUrl?: string; // Jika item galeri ini adalah video
    videoLabel?: {
      id: string;
      en: string;
    }; // Label kustom untuk video di galeri
    source?: string;
    caption?: {
      id: string;
      en: string;
    };
  }[];
  source?: string;
  sourceUrl?: string;
  views: number;
  featured?: boolean;
  tags?: {
    id: string;
    en: string;
  }[];
}

export interface CategoryCount {
  name: {
    id: string;
    en: string;
  };
  count: number;
}

export interface Comment {
  id: string;
  user: string; // This will now represent "displayName"
  username: string; // Add unique identifier for tagging and ownership
  avatar: string;
  text: string;
  date: {
    id: string;
    en: string;
  };
  likes: number;
  replies?: Comment[];
  userId?: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  bio?: string;
  role: 'user' | 'admin' | 'editor';
}
