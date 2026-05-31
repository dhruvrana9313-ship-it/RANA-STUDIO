/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import TitleGeneratorView from './components/TitleGeneratorView';
import ScriptWriterView from './components/ScriptWriterView';
import ThumbnailGeneratorView from './components/ThumbnailGeneratorView';
import ShortsGeneratorView from './components/ShortsGeneratorView';
import HashtagGeneratorView from './components/HashtagGeneratorView';
import CommentRepliesView from './components/CommentRepliesView';
import DescriptionGeneratorView from './components/DescriptionGeneratorView';
import TrendingContentView from './components/TrendingContentView';
import FavoritesView from './components/FavoritesView';
import SettingsView from './components/SettingsView';
import { ToolType, CreatorSettings, CreationHistoryItem, LanguageType } from './types';
import { Sparkles, Youtube, Check, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation active tab State
  const [activeTab, setActiveTab] = useState<ToolType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Floating custom toast alerts state
  const [toast, setToast] = useState<{ message: string; visible: boolean; isError?: boolean }>({
    message: '',
    visible: false,
    isError: false
  });

  const triggerToast = (message: string, isError = false) => {
    setToast({ message, visible: true, isError });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4500);
  };

  // Profile preferences state
  const [settings, setSettings] = useState<CreatorSettings>(() => {
    const saved = localStorage.getItem('rana_studio_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    // High-contrast clean dark-mode standard fallback
    return {
      theme: 'dark',
      defaultLanguage: 'english',
      channelName: '',
      niche: 'general'
    };
  });

  // Creation History logs state loaded from Cache
  const [history, setHistory] = useState<CreationHistoryItem[]>(() => {
    const saved = localStorage.getItem('rana_creation_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [];
  });

  // Watch theme switches to dynamically paint the root container HTML classes
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#050505'; // Cozy dark background
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#f8fafc'; // Clean light grey slate
    }
  }, [settings.theme]);

  // Synchronise history to localStorage
  useEffect(() => {
    localStorage.setItem('rana_creation_history', JSON.stringify(history));
  }, [history]);

  // Unified Copy clipboard driver
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        triggerToast('Asset copied to clipboard successfully!');
      })
      .catch(() => {
        triggerToast('Failed to copy. Please click to select text manually.', true);
      });
  };

  // Unified File Downloader
  const handleDownloadText = (filename: string, content: string) => {
    try {
      const element = document.createElement('a');
      const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      triggerToast(`Saved ${filename} successfully!`);
    } catch {
      triggerToast('Unable to export file. Please copy payload instead.', true);
    }
  };

  // Core API router calling handler
  const handleGenerateAI = async (params: {
    tool: string;
    topic?: string;
    niche?: string;
    language?: string;
    commentText?: string;
    scriptType?: string;
    channelName?: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          channelName: params.channelName || settings.channelName,
          niche: params.niche || settings.niche,
          language: params.language || settings.defaultLanguage
        })
      });

      const data = await response.json();

      if (data.success && data.result) {
        const generatedItem: CreationHistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          toolType: params.tool as ToolType,
          timestamp: new Date().toISOString(),
          prompt: params.topic || params.commentText || `Niche Analysis (${params.niche || settings.niche})`,
          language: (params.language || settings.defaultLanguage) as LanguageType,
          niche: params.niche || settings.niche,
          extraParams: { scriptType: params.scriptType, channelName: params.channelName },
          isFavorite: false,
          output: data.result
        };

        setHistory((prev) => [generatedItem, ...prev]);
        triggerToast('AI Output generated successfully! Saving to local studio catalog.');
      } else {
        triggerToast(data.error || 'The Gemini server encountered an error processing metadata.', true);
      }
    } catch (e: any) {
      console.error(e);
      triggerToast(e.message || 'Failure connecting to Rana AI Studio endpoint. Please verify API configuration.', true);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('rana_creation_history');
  };

  // Dynamic View Switch Router
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            history={history}
            setHistory={setHistory}
            setActiveTab={setActiveTab}
            onCopyText={handleCopyText}
            theme={settings.theme}
          />
        );
      case 'title-generator':
        return (
          <TitleGeneratorView
            history={history}
            onGenerate={handleGenerateAI}
            loading={loading}
            onCopyText={handleCopyText}
            onDownloadText={handleDownloadText}
            theme={settings.theme}
          />
        );
      case 'script-writer':
        return (
          <ScriptWriterView
            history={history}
            onGenerate={handleGenerateAI}
            loading={loading}
            onCopyText={handleCopyText}
            onDownloadText={handleDownloadText}
            theme={settings.theme}
          />
        );
      case 'thumbnail-generator':
        return (
          <ThumbnailGeneratorView
            history={history}
            onGenerate={handleGenerateAI}
            loading={loading}
            onCopyText={handleCopyText}
            onDownloadText={handleDownloadText}
            theme={settings.theme}
          />
        );
      case 'shorts-generator':
        return (
          <ShortsGeneratorView
            history={history}
            onGenerate={handleGenerateAI}
            loading={loading}
            onCopyText={handleCopyText}
            onDownloadText={handleDownloadText}
            theme={settings.theme}
          />
        );
      case 'hashtag-generator':
        return (
          <HashtagGeneratorView
            history={history}
            onGenerate={handleGenerateAI}
            loading={loading}
            onCopyText={handleCopyText}
            onDownloadText={handleDownloadText}
            theme={settings.theme}
          />
        );
      case 'comment-replies':
        return (
          <CommentRepliesView
            history={history}
            onGenerate={handleGenerateAI}
            loading={loading}
            onCopyText={handleCopyText}
            onDownloadText={handleDownloadText}
            theme={settings.theme}
          />
        );
      case 'video-description':
        return (
          <DescriptionGeneratorView
            history={history}
            onGenerate={handleGenerateAI}
            loading={loading}
            onCopyText={handleCopyText}
            onDownloadText={handleDownloadText}
            theme={settings.theme}
          />
        );
      case 'trending-content':
        return (
          <TrendingContentView
            history={history}
            onGenerate={handleGenerateAI}
            loading={loading}
            onCopyText={handleCopyText}
            onDownloadText={handleDownloadText}
            theme={settings.theme}
          />
        );
      case 'favorites':
        return (
          <FavoritesView
            history={history}
            setHistory={setHistory}
            onCopyText={handleCopyText}
            onDownloadText={handleDownloadText}
            theme={settings.theme}
          />
        );
      case 'settings':
        return (
          <SettingsView
            settings={settings}
            setSettings={setSettings}
            onClearHistory={handleClearHistory}
            theme={settings.theme}
          />
        );
      default:
        return <div className="text-center py-12">Tab not found.</div>;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Studio Hub';
      case 'title-generator': return '20 Viral YouTube Titles';
      case 'script-writer': return 'Screenplay Script Writer';
      case 'thumbnail-generator': return '20 Thumbnail Text Overlays';
      case 'shorts-generator': return '50 YouTube Shorts Blueprints';
      case 'hashtag-generator': return 'SEO Categorized Hashtags';
      case 'comment-replies': return '4 Tone Comment Replies';
      case 'video-description': return 'Full SEO Description Builder';
      case 'trending-content': return 'Niche Exploding Trends Analyzer';
      case 'favorites': return 'Saved Creator Bookmarks';
      case 'settings': return 'Studio Workspace Settings';
      default: return 'Creator Workspace';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-200 relative overflow-hidden ${
      settings.theme === 'dark' ? 'bg-[#050505] text-zinc-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Background Glows for Immersive UI theme */}
      {settings.theme === 'dark' && (
        <>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute top-[40%] -left-12 w-80 h-80 bg-rose-600/5 rounded-full blur-[100px] pointer-events-none z-0" />
        </>
      )}

      {/* Side Navigation panel */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        theme={settings.theme}
      />

      {/* Main Workspace display Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden z-10 relative">
        {/* Top Header bar with search indices description */}
        <header className={`h-16 shrink-0 border-b flex items-center justify-between px-6 z-20 backdrop-blur-md ${
          settings.theme === 'dark' ? 'bg-zinc-950/40 border-zinc-800/50 text-zinc-100' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div>
            <h2 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 capitalize">
              <span>{getTabTitle()}</span>
            </h2>
            <p className="text-[10px] text-slate-500 font-medium hidden sm:block uppercase tracking-wider">
              Rana AI Creator Studio • Active Niche: <span className="text-red-500 dark:text-red-400 font-bold">{settings.niche}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Creator Credit Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all tracking-wider ${
              settings.theme === 'dark'
                ? 'bg-gradient-to-r from-pink-500/15 via-indigo-500/15 to-purple-500/15 border border-indigo-500/30 text-indigo-300 shadow-[0_0_12px_-2px_rgba(99,102,241,0.25)] animate-pulse'
                : 'bg-red-50 text-red-600 border border-red-200/60 font-black'
            }`}>
              👑 MADE BY DHRUV RANA
            </div>

            {/* Quick Profile Signature prefill */}
            {settings.channelName && (
              <span className="text-[11px] font-bold py-1 px-3 rounded-xl bg-red-600/10 text-red-650 dark:text-red-400 border border-red-500/15 max-w-[130px] sm:max-w-none truncate">
                📺 @{settings.channelName}
              </span>
            )}

            {/* Quick Toggle theme triggers */}
            <button
              onClick={() => {
                const toggled = settings.theme === 'dark' ? 'light' : 'dark';
                setSettings((prev) => {
                  const updated = { ...prev, theme: toggled };
                  localStorage.setItem('rana_studio_settings', JSON.stringify(updated));
                  return updated;
                });
                triggerToast(`Switched interface focus mode to ${toggled}!`);
              }}
              className={`p-2 rounded-xl border cursor-pointer hover:border-slate-400 dark:hover:border-zinc-700 transition ${
                settings.theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800 text-amber-400 hover:bg-zinc-800/60' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
              title="Quick Toggle Brightness Canvas Theme"
            >
              {settings.theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* Action view displaying scrolling area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Floating immersive custom toast alerts */}
      {toast.visible && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 border transition-all duration-300 animate-[bounce_1s_1] ${
          toast.isError
            ? 'bg-rose-950 border-rose-900/60 text-white'
            : settings.theme === 'dark'
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
            : 'bg-white border-slate-200 text-slate-950 shadow-slate-300/60'
        }`}>
          {toast.isError ? (
            <AlertCircle className="w-4 h-4 text-rose-500" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          )}
          <span className="text-xs font-semibold leading-normal">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
