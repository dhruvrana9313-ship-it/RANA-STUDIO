import React, { useState } from 'react';
import {
  Heart,
  Copy,
  Download,
  Trash2,
  Search,
  BookOpen,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CreationHistoryItem, ToolType } from '../types';

interface FavoritesViewProps {
  history: CreationHistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<CreationHistoryItem[]>>;
  onCopyText: (text: string) => void;
  onDownloadText: (filename: string, content: string) => void;
  theme: 'light' | 'dark';
}

export default function FavoritesView({
  history,
  setHistory,
  onCopyText,
  onDownloadText,
  theme
}: FavoritesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter out non-favorite elements
  const favorites = history.filter((item) => item.isFavorite);

  const filteredFavs = favorites.filter((item) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      item.prompt?.toLowerCase().includes(q) ||
      item.toolType?.toLowerCase().includes(q) ||
      item.language?.toLowerCase().includes(q)
    );
  });

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Remove this item from your favorites list?')) {
      setHistory((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isFavorite: false } : item
        )
      );
    }
  };

  const handleCopyValue = (item: CreationHistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (typeof item.output === 'string') {
        onCopyText(item.output);
      } else {
        onCopyText(JSON.stringify(item.output, null, 2));
      }
    } catch {
      onCopyText('Unable to copy this data structured output.');
    }
  };

  const handleDownloadValue = (item: CreationHistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const txt = typeof item.output === 'string' ? item.output : JSON.stringify(item.output, null, 2);
      onDownloadText(`rana_saved_${item.toolType}_${Date.now()}.txt`, txt);
    } catch {
      alert('Unable to generate text format for this file.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Search Header toolbar bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-current" />
            <span>My Bookmarked Creations</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Browse and download previously generated viral assets, customized script templates and SEO hashtag packages.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search favorite assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500 ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-600'
                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {filteredFavs.length === 0 ? (
        <div className={`p-16 text-center rounded-2xl border border-dashed ${
          theme === 'dark' ? 'border-slate-800 bg-slate-900/10' : 'border-slate-300 bg-slate-50/20'
        }`}>
          <Heart className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
          <h4 className="font-bold text-sm text-slate-500">No favorite items found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
            Click the Heart icon on any output result card in titles, scripts, templates or thumbnail generators to view them inside bookmarks!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFavs.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className={`p-5 rounded-xl border cursor-pointer transition flex flex-col ${
                  theme === 'dark'
                    ? 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/60'
                    : 'bg-white border-slate-250 shadow-xs hover:border-slate-300'
                }`}
              >
                {/* Visual Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase py-0.5 px-2 bg-red-600/10 text-red-600 rounded">
                        {item.toolType.replace('-', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">
                        • {item.language}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        • Compiled {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 select-all truncate max-w-md sm:max-w-xl">
                      "{item.prompt}"
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => handleToggleFavorite(item.id, e)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                      title="Remove from bookmarks"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={(e) => handleCopyValue(item, e)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition"
                      title="Copy item payload data"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDownloadValue(item, e)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition"
                      title="Download as TXT file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <div className="text-slate-400 ml-1.5 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Section View block content */}
                {isExpanded && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/60 font-sans text-xs select-all text-slate-700 dark:text-slate-300 max-h-96 overflow-y-auto ${
                      theme === 'dark' ? 'text-slate-350' : 'text-slate-700'
                    }`}
                  >
                    {/* Render different output representations structurally based on tool type metadata */}
                    {item.toolType === 'title-generator' && (
                      <div className="space-y-2">
                        {Array.isArray(item.output) && item.output.map((t, idx) => (
                          <div key={idx} className="p-2.5 rounded bg-black/10 dark:bg-black/35 font-sans leading-relaxed">
                            <span className="text-red-500 font-extrabold mr-2">#{idx + 1}</span>
                            <strong>{t.title}</strong>
                            <p className="text-[11px] mt-1 text-slate-400">💡 {t.engagementHook}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.toolType === 'script-writer' && (
                      <div className="space-y-3 font-mono">
                        <p><strong>[HOOK]:</strong> {item.output.hook}</p>
                        <p><strong>[INTRO]:</strong> {item.output.introduction}</p>
                        <p><strong>[SECTIONS]:</strong></p>
                        {Array.isArray(item.output.mainContent) && item.output.mainContent.map((s, i) => (
                          <div key={i} className="ml-4 p-2.5 rounded bg-black/10 dark:bg-black/35 mb-2 font-mono">
                            <span className="text-blue-400 font-bold block">{s.section}</span>
                            <span>{s.content}</span>
                          </div>
                        ))}
                        <p><strong>[CTA]:</strong> {item.output.callToAction}</p>
                        <p><strong>[OUTRO]:</strong> {item.output.ending}</p>
                      </div>
                    )}

                    {item.toolType === 'thumbnail-generator' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Array.isArray(item.output) && item.output.map((t, idx) => (
                          <div key={idx} className="p-3 rounded bg-black/15 dark:bg-black/35 leading-relaxed font-sans">
                            <span className="bg-amber-400 text-slate-950 font-extrabold px-1 text-[11px] uppercase mr-2.5 rounded leading-none">{t.thumbnailText}</span>
                            <p className="text-[11px] mt-2 text-slate-400">🎨 Layout: {t.conceptEmotion}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.toolType === 'shorts-generator' && (
                      <div className="space-y-2.5">
                        {Array.isArray(item.output) && item.output.map((s, idx) => (
                          <div key={idx} className="p-3 bg-black/15 dark:bg-black/35 rounded-lg leading-relaxed font-sans">
                            <h5 className="font-extrabold text-[12px] text-red-500">#{idx + 1} {s.idea}</h5>
                            <p className="mt-1">{s.description}</p>
                            <p className="text-[11px] text-purple-400 mt-1">🔄 Hack: {s.tips}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.toolType === 'hashtag-generator' && (
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 tracking-wider">TRENDING SECTIONS:</span>
                          <p className="text-amber-500 font-bold mt-1 font-mono">{Array.isArray(item.output.trending) ? item.output.trending.join(' ') : ''}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 tracking-wider">NICHE SPECIFIC:</span>
                          <p className="text-emerald-500 font-bold mt-1 font-mono">{Array.isArray(item.output.niche) ? item.output.niche.join(' ') : ''}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 tracking-wider">BROAD STRATEGY:</span>
                          <p className="text-blue-500 font-bold mt-1 font-mono">{Array.isArray(item.output.broad) ? item.output.broad.join(' ') : ''}</p>
                        </div>
                      </div>
                    )}

                    {item.toolType === 'comment-replies' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['friendly', 'funny', 'professional', 'motivational'].map((k) => (
                          <div key={k} className="p-3 bg-black/10 dark:bg-black/35 rounded-lg leading-normal font-sans">
                            <span className="text-[9px] uppercase font-extrabold tracking-wide text-slate-400">{k} tone</span>
                            <p className="mt-1 font-sans">{item.output[k]}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.toolType === 'video-description' && (
                      <div className="space-y-3 font-mono">
                        <p><strong>[HOOK]:</strong> {item.output.hooks}</p>
                        <p><strong>[ABOUT_VIDEO]:</strong> {item.output.aboutVideo}</p>
                        {item.output.timestamps && (
                          <div>
                            <p><strong>[CHAPTERS INDEX]:</strong></p>
                            {Array.isArray(item.output.timestamps) && item.output.timestamps.map((t, i) => (
                              <div key={i} className="ml-4">{t.time} - {t.label}</div>
                            ))}
                          </div>
                        )}
                        <p><strong>[SOCIALS AND LINKS]:</strong> {item.output.linksAndSocials}</p>
                        <p className="text-teal-400 font-bold mt-2"><strong>[HASHTAGS]:</strong> {Array.isArray(item.output.hashtags) ? item.output.hashtags.join(' ') : ''}</p>
                      </div>
                    )}

                    {/* Fallback to simple details */}
                    {typeof item.output === 'string' && (
                      <p className="whitespace-pre-wrap font-mono bg-black/10 p-4 rounded-lg">{item.output}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
