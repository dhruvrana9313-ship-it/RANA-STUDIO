import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  FileText,
  Image,
  Zap,
  Hash,
  MessageSquare,
  AlignLeft,
  Flame,
  Heart,
  Settings,
  Menu,
  X,
  Youtube
} from 'lucide-react';
import { ToolType } from '../types';

interface SidebarProps {
  activeTab: ToolType;
  setActiveTab: (tab: ToolType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  theme: 'light' | 'dark';
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  theme
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as ToolType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'title-generator' as ToolType, label: 'Title Generator', icon: Sparkles },
    { id: 'script-writer' as ToolType, label: 'Script Writer', icon: FileText },
    { id: 'thumbnail-generator' as ToolType, label: 'Thumbnail Texts', icon: Image },
    { id: 'shorts-generator' as ToolType, label: 'Shorts Ideas', icon: Zap },
    { id: 'hashtag-generator' as ToolType, label: 'Hashtag Generator', icon: Hash },
    { id: 'comment-replies' as ToolType, label: 'Comment Replies', icon: MessageSquare },
    { id: 'video-description' as ToolType, label: 'Video Description', icon: AlignLeft },
    { id: 'trending-content' as ToolType, label: 'Trending Content', icon: Flame },
    { id: 'favorites' as ToolType, label: 'Favorites', icon: Heart },
    { id: 'settings' as ToolType, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className={`md:hidden flex items-center justify-between p-4 border-b h-16 shrink-0 z-50 ${
        theme === 'dark' ? 'bg-zinc-950/85 border-zinc-850/50 text-zinc-100' : 'bg-red-600 text-white'
      }`}>
        <div className="flex items-center gap-2">
          <Youtube className={`w-6 h-6 ${theme === 'dark' ? 'text-indigo-400 fill-current' : 'fill-white'}`} />
          <span className="font-bold tracking-tight text-lg">Rana Studio</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1 rounded transition ${theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-red-750'}`}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for mobile active sidebar */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-40 transition-opacity"
        />
      )}

      {/* Sidebar navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-full md:h-screen w-64 z-40 shrink-0 border-r transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          theme === 'dark'
            ? 'bg-zinc-950/40 border-zinc-900/50 text-zinc-100 backdrop-blur-md'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Desktop Header */}
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-inherit h-16 shrink-0">
          <div className={`p-2 rounded-lg text-white shadow-md ${
            theme === 'dark' ? 'bg-indigo-600 shadow-indigo-600/10' : 'bg-red-600 shadow-red-600/10'
          }`}>
            <Youtube className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className={`font-extrabold tracking-tight text-base leading-none ${
              theme === 'dark' ? 'text-zinc-100' : 'text-red-500'
            }`}>Rana Studio</h1>
            <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase tracking-wider">Creator Workspace</p>
          </div>
        </div>

        {/* Sidebar Tabs */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 h-[calc(100vh-64px-40px)] select-none">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const IsActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ease-out border ${
                  IsActive
                    ? theme === 'dark'
                      ? 'bg-indigo-600/10 text-indigo-400 border-indigo-600/20 shadow-[0_0_15px_-3px_rgba(79,70,229,0.25)]'
                      : 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/10'
                    : theme === 'dark'
                    ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/30 border-transparent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${IsActive ? (theme === 'dark' ? 'text-indigo-400' : 'text-white') : 'text-inherit opacity-75'}`} />
                <span>{item.label}</span>
                {item.id === 'favorites' && IsActive === false && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400">
                    Favs
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Small branding label */}
        <div className="p-4 border-t border-inherit text-center flex flex-col items-center gap-1.5 shrink-0">
          <div className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-[0_0_12px_-2px_rgba(99,102,241,0.3)] animate-pulse'
              : 'bg-red-600 text-white shadow-md shadow-red-600/15'
          }`}>
            ⭐️ MADE BY DHRUV RANA
          </div>
          <span className="text-[9px] text-zinc-500 font-semibold tracking-wider uppercase">
            Rana AI Studio v1.1
          </span>
        </div>
      </aside>
    </>
  );
}
