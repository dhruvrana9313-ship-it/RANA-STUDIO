import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  FileText,
  Image,
  Hash,
  MessageSquare,
  AlignLeft,
  Flame,
  Search,
  Heart,
  Clock,
  Trash2,
  Copy,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { ToolType, CreationHistoryItem } from '../types';

interface DashboardViewProps {
  history: CreationHistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<CreationHistoryItem[]>>;
  setActiveTab: (tab: ToolType) => void;
  onCopyText: (text: string) => void;
  theme: 'light' | 'dark';
}

export default function DashboardView({
  history,
  setHistory,
  setActiveTab,
  onCopyText,
  theme
}: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Statistics calculation
  const totalCreations = history.length;
  const totalFavorites = history.filter((item) => item.isFavorite).length;

  // Let's count characters generated
  const totalCharacters = history.reduce((acc, item) => {
    try {
      const str = JSON.stringify(item.output);
      return acc + (str ? str.length : 0);
    } catch {
      return acc;
    }
  }, 0);

  // Time saved estimate: 15 minutes per generation
  const totalMinutesSaved = totalCreations * 15;
  const hoursSaved = Math.floor(totalMinutesSaved / 60);
  const remainingMinutes = totalMinutesSaved % 60;
  const timeSavedString =
    hoursSaved > 0
      ? `${hoursSaved}h ${remainingMinutes}m`
      : `${remainingMinutes} mins`;

  const quickTools = [
    { id: 'title-generator' as ToolType, label: 'Title Generator', desc: 'Generate 20 viral, high-CTR YouTube titles.', icon: Sparkles, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    { id: 'script-writer' as ToolType, label: 'Script Writer', desc: 'Craft complete short & long form scripts.', icon: FileText, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { id: 'thumbnail-generator' as ToolType, label: 'Thumbnail Texts', desc: 'Generate 20 eye-catching curiosity hooks.', icon: Image, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    { id: 'shorts-generator' as ToolType, label: 'Shorts Ideas', desc: 'Get 50 high-interest trending Shorts concepts.', icon: Zap, color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    { id: 'hashtag-generator' as ToolType, label: 'Hashtags', desc: 'SEO-boost with 30 categorized hashtags.', icon: Hash, color: 'bg-pink-500/10 text-pink-500 border-pink-500/20' },
    { id: 'comment-replies' as ToolType, label: 'Comment Replies', desc: 'Instant friendly/funny replies to viewers.', icon: MessageSquare, color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' },
    { id: 'video-description' as ToolType, label: 'SEO Description', desc: 'Generate descriptions with chapters and tags.', icon: AlignLeft, color: 'bg-teal-500/10 text-teal-500 border-teal-500/20' },
    { id: 'trending-content' as ToolType, label: 'Niche Trends', desc: 'Find out what content is exploding right now.', icon: Flame, color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  ];

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this creation log?')) {
      setHistory((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const filteredHistory = history.filter((item) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    const promptMatch = item.prompt?.toLowerCase().includes(q);
    const toolMatch = item.toolType?.toLowerCase().includes(q);
    const languageMatch = item.language?.toLowerCase().includes(q);
    return promptMatch || toolMatch || languageMatch;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Welcome Banner */}
      <div className={`p-6 md:p-8 rounded-2xl relative overflow-hidden border ${
        theme === 'dark' 
          ? 'bg-zinc-900/40 backdrop-blur-md border-zinc-800/85 text-zinc-100' 
          : 'bg-slate-50 border-slate-200 text-slate-800'
      }`}>
        <div className="relative z-10 max-w-2xl">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-red-600/10 text-red-600'
          } mb-4`}>
            <Award className="w-3.5 h-3.5" /> FREE FOREVER CREATOR TOOLKIT
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Rana AI Creator Studio
          </h2>
          <p className="text-sm md:text-base mt-2 opacity-85 leading-relaxed">
            Create Better Content Faster With AI. Launch modular generation tools specifically optimized for high Click-Through Rates (CTR) and YouTube search growth algorithms.
          </p>
        </div>
        {/* Subtle decorative circles */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
      </div>

      {/* Numerical Analytics statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Creations', value: totalCreations, desc: 'AI responses generated', icon: Sparkles, color: 'text-amber-500' },
          { label: 'Saved Favorites', value: totalFavorites, desc: 'Bookmarked outcomes', icon: Heart, color: 'text-rose-500' },
          { label: 'Estimated Time Saved', value: timeSavedString, desc: 'At 15m per optimization', icon: Clock, color: 'text-emerald-500' },
          { label: 'Characters Written', value: totalCharacters.toLocaleString(), desc: 'Total AI metadata tokens', icon: TrendingUp, color: 'text-indigo-400' }
        ].map((stat, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl border ${
              theme === 'dark'
                ? 'bg-zinc-900/40 backdrop-blur-md border-zinc-850/50'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-zinc-550' : 'text-slate-500'
              }`}>
                {stat.label}
              </span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {stat.value}
            </div>
            <div className={`mt-1 text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
              {stat.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Tools Quick Grid Access */}
      <div>
        <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
          <Zap className={`w-5 h-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-red-500'}`} />
          <span>Launch AI Creator Tools</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`p-5 rounded-2xl border cursor-pointer group hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-zinc-900/40 backdrop-blur-md border-zinc-800/80 hover:bg-zinc-900/60 hover:border-indigo-500/30'
                    : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${tool.color} mb-3 font-semibold`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className={`font-bold text-sm tracking-tight transition-colors ${
                  theme === 'dark' ? 'text-zinc-100 group-hover:text-indigo-400' : 'text-slate-800 group-hover:text-red-500'
                }`}>
                  {tool.label}
                </h4>
                <p className={`text-xs mt-1 leading-relaxed ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-550'}`}>
                  {tool.desc}
                </p>
                <div className={`mt-4 flex items-center text-xs font-bold transition-transform group-hover:translate-x-1 ${
                  theme === 'dark' ? 'text-indigo-400' : 'text-red-500'
                }`}>
                  <span>Open Tool</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and History of Creations */}
      <div className={`p-6 rounded-2xl border ${
        theme === 'dark' ? 'bg-zinc-900/40 backdrop-blur-md border-zinc-800/80 Text-zinc-100' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold tracking-tight">Creation Logs & History</h3>
            <p className="text-xs text-zinc-550">Search and recall previously generated titles, tags, and script items.</p>
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search keyword, tool, or language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-zinc-950/60 border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:ring-indigo-500/50'
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-red-500'
              }`}
            />
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <p className="text-sm">No creations found.</p>
            <p className="text-xs mt-1 text-zinc-550">Launch any tool from above to generate YouTube resources!</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.toolType)}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-4 justify-between group ${
                  theme === 'dark'
                    ? 'hover:bg-zinc-800/40 border-zinc-800/60 bg-zinc-950/30 text-zinc-100'
                    : 'hover:bg-slate-50 border-slate-100 bg-slate-50/20'
                }`}
              >
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded ${
                      theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-red-600/10 text-red-600'
                    }`}>
                      {item.toolType.replace('-', ' ')}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      • {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[10px] font-semibold text-zinc-550 uppercase">
                      • {item.language}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-100 dark:text-zinc-100 truncate">
                    {item.prompt || 'Untitled Topic'}
                  </h4>
                  <p className="text-xs text-zinc-500 line-clamp-1">
                    Click to load this creation session in the respective tool
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => handleToggleFavorite(item.id, e)}
                    className={`p-2 rounded-lg transition ${
                      item.isFavorite
                        ? theme === 'dark' ? 'text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20' : 'text-red-500 bg-red-500/10 hover:bg-red-500/20'
                        : theme === 'dark' ? 'text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/5' : 'text-slate-400 hover:text-red-500 hover:bg-red-500/5'
                    }`}
                    title={item.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  >
                    <Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteHistory(item.id, e)}
                    className={`p-2 rounded-lg transition ${
                      theme === 'dark' ? 'text-zinc-505 hover:text-red-400 hover:bg-red-500/5' : 'text-slate-400 hover:text-red-500 hover:bg-red-500/10'
                    }`}
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Strategic Growth Box details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-2xl border ${
          theme === 'dark' ? 'bg-zinc-900/40 backdrop-blur-md border-zinc-800/80 text-zinc-100' : 'bg-white border-slate-200'
        }`}>
          <h4 className={`font-extrabold text-sm tracking-tight mb-3 uppercase tracking-wider ${
            theme === 'dark' ? 'text-indigo-400' : 'text-red-500'
          }`}>💡 YouTube Growth Formulas</h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start gap-2 leading-relaxed">
              <span className={`shrink-0 font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-red-500'}`}>1.</span>
              <span><strong>The Title-Thumbnail Gap:</strong> Thumbnails should show emotional curiosity (Fear, Surprise), while the title validates the topic. Never repeat the title words in the thumbnail text directly.</span>
            </li>
            <li className="flex items-start gap-2 leading-relaxed">
              <span className={`shrink-0 font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-red-500'}`}>2.</span>
              <span><strong>The First 5 Seconds:</strong> Avoid introductory logo animations or slow hello speeches. Start directly with an intensive, high-stakes question or curiosity claim (the Hook) to boost audience retention!</span>
            </li>
            <li className="flex items-start gap-2 leading-relaxed">
              <span className={`shrink-0 font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-red-500'}`}>3.</span>
              <span><strong>Looping Shorts:</strong> End standard YouTube Shorts in the middle of a spoken sentence or with a setup that feeds seamlessly back into the very first hook line. This creates a perfect loop metric.</span>
            </li>
          </ul>
        </div>

        <div className={`p-6 rounded-2xl border ${
          theme === 'dark' ? 'bg-zinc-900/40 backdrop-blur-md border-zinc-800/80 text-zinc-100' : 'bg-white border-slate-200'
        }`}>
          <h4 className={`font-extrabold text-sm tracking-tight mb-3 uppercase tracking-wider ${
            theme === 'dark' ? 'text-indigo-400' : 'text-red-500'
          }`}>🌟 Rana Studio Quick Tips</h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start gap-2 leading-relaxed">
              <span className={`shrink-0 font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-red-500'}`}>✓</span>
              <span><strong>Hinglish Support:</strong> Target broader Hindi-speaking markets by choosing 'Hinglish' to generate spoken structures written in the English alphabet which are highly clickable.</span>
            </li>
            <li className="flex items-start gap-2 leading-relaxed">
              <span className={`shrink-0 font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-red-500'}`}>✓</span>
              <span><strong>Export Toolkit:</strong> Every generation result panel is equipped with instant Copy buttons and TXT file download operations to build offline databases fast!</span>
            </li>
            <li className="flex items-start gap-2 leading-relaxed">
              <span className={`shrink-0 font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-red-500'}`}>✓</span>
              <span><strong>Safety Note:</strong> Your personal workspace API Key is hidden entirely and protected behind secure Cloud Sandboxed server proxies on our background layer.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
