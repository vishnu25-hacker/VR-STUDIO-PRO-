
import React from 'react';
import { LayoutDashboard, AppWindow, Sparkles, ShoppingBag, Settings, LogOut, Video, Image as ImageIcon } from 'lucide-react';
import { View, NavItem } from '../types';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, view: View.DASHBOARD },
  { label: 'App Builder', icon: AppWindow, view: View.APP_BUILDER },
  { label: 'Prompt Studio', icon: Sparkles, view: View.PROMPT_GENERATOR },
  { label: 'Image Studio', icon: ImageIcon, view: View.IMAGE_GENERATOR },
  { label: 'Video Studio', icon: Video, view: View.VIDEO_GENERATOR },
  { label: 'Marketplace', icon: ShoppingBag, view: View.MARKETPLACE },
  { label: 'Settings', icon: Settings, view: View.SETTINGS },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  return (
    <div className="w-64 h-full bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-900/50">
          AI
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Studio Pro
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Platform</p>
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.view;
          const Icon = item.icon;
          return (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-brand-600/10 text-brand-500 border border-brand-600/20' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-100'} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
