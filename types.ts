
export enum View {
  DASHBOARD = 'DASHBOARD',
  APP_BUILDER = 'APP_BUILDER',
  PROMPT_GENERATOR = 'PROMPT_GENERATOR',
  MARKETPLACE = 'MARKETPLACE',
  SETTINGS = 'SETTINGS',
  VIDEO_GENERATOR = 'VIDEO_GENERATOR',
  IMAGE_GENERATOR = 'IMAGE_GENERATOR'
}

export interface NavItem {
  label: string;
  icon: any;
  view: View;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  role: string;
  apiKey?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface SearchResult {
  type: 'INTERNAL' | 'WEB';
  title: string;
  content: string;
  url?: string;
  source?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  template: string;
  description: string;
}

export interface GeneratedPrompt {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export interface MarketplaceApp {
  id: number;
  title: string;
  category: string;
  rating: number;
  downloads: string;
  author: string;
  price: string;
  description: string;
  reviews: { user: string; rating: number; comment: string }[];
  versionHistory: { version: string; date: string; notes: string }[];
}

export enum AppGenerationStatus {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
