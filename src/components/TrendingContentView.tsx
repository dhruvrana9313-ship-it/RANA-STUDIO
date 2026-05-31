import React, { useState } from 'react';
import {
  Flame,
  Copy,
  Download,
  Loader2,
  Sparkles,
  Award,
  ShieldCheck,
  TrendingUp,
  Gauge
} from 'lucide-react';
import { TrendingIdea, CreationHistoryItem } from '../types';

interface TrendingContentViewProps {
  history: CreationHistoryItem[];
  onGenerate: (params: { tool: string; niche: string; language: string }) => Promise<void>;
  loading: boolean;
  onCopyText: (text: string) => void;
  onDownloadText: (filename: string, content: string) => void;
  theme: 'light' | 'dark';
}

export default function TrendingContentView({
  history,
  onGenerate,
  loading,
  onCopyText,
  onDownloadText,
  theme
}: TrendingContentViewProps) {
  const [niche, setNiche] = useState('general');
  const [language, setLanguage] = useState('english');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<CreationHistoryItem | null>(null);

  // Filter local history of this tool type
  const trendingHistory = history.filter((item) => item.toolType === 'trending-content');

  const activeItem = selectedHistoryItem || (trendingHistory.length > 0 ? trendingHistory[0] : null);
  const trendsList: TrendingIdea[] = activeItem ? (activeItem.output as TrendingIdea[]) : [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedHistoryItem(null);
    await onGenerate({
      tool: 'trending-content',
      niche: niche,
      language: language
    });
  };

  const handleCopyAll = () => {
    if (!trendsList || trendsList.length === 0) return;
    const all = trendsList
      .map((t, idx) => `Trend idea #${idx + 1}: ${t.title}\nTrend Trigger Angle: ${t.trendAngle}\nBehavioral justification: ${t.whyItWorks}\nDifficulty: ${t.difficulty}\n`)
      .join('\n');
    onCopyText(all);
  };

  const handleDownloadAllText = () => {
    if (!trendsList || trendsList.length === 0) return;
    const all = trendsList
      .map((t, idx) => `Idea #${idx + 1}: ${t.title}\nTrigger Trigger: ${t.trendAngle}\nWhy it works: ${t.whyItWorks}\nDifficulty: ${t.difficulty}\n`)
      .join('\n');
    onDownloadText(`rana_trends_${activeItem?.niche || 'general'}.txt`, all);
  };

  const niches = [
    { value: 'general', label: '🌍 General Niche / Broad Hub' },
    { value: 'gaming', label: '🎮 Gaming & esports current spikes' },
    { value: 'education', label: '🏫 High intelligence learning tutorials' },
    { value: 'vlogs', label: '📹 Lifestyle traveling storytelling' },
    { value: 'tech', label: '💻 AI, Coding, gadgets momentum' },
    { value: 'music', label: '🎵 Music, covers & audios' },
    { value: 'entertainment', label: '🍿 Comedy, memes, drama' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto py-2">
      {/* Parameters Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className={`p-5 rounded-2xl border ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-red-500 fill-red-500/20 animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Trend Analyzer</h3>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Channel Category Niche
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className={`w-full p-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-800 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                {niches.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Translate Output To
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`w-full p-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-800 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="english">🇺🇸 English</option>
                <option value="hindi">🇮🇳 Hindi</option>
                <option value="hinglish">🗣️ Hinglish</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning YouTube Feed...</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4 animate-pulse" />
                  <span>Analyze Niche Trends</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Local History Sidebar */}
        {trendingHistory.length > 0 && (
          <div className={`p-5 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Saved Trend runs</span>
              <span className="text-[10px] bg-slate-500/10 text-slate-400 py-0.5 px-2 rounded-full font-semibold">
                {trendingHistory.length}
              </span>
            </h4>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {trendingHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedHistoryItem(item)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                    activeItem?.id === item.id
                      ? 'border-red-500 bg-red-600/5 text-red-600 dark:text-red-400'
                      : theme === 'dark'
                      ? 'border-slate-800 bg-slate-950/20 text-slate-400 hover:bg-slate-800/30'
                      : 'border-slate-100 bg-slate-50/20 text-slate-600 hover:bg-slate-100/50'
                  }`}
                >
                  <p className="text-xs font-bold truncate capitalize">Run Niche: {item.niche}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Output results */}
      <div className="lg:col-span-8">
        {loading ? (
          <div className={`flex flex-col items-center justify-center p-12 text-center h-[520px] rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900/10 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 tracking-tight">Mapping Exploding Topics...</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
              We extract high performing concepts, analyzing current audience spikes, production formats, and high yield tags.
            </p>
          </div>
        ) : trendsList.length === 0 ? (
          <div className={`flex flex-col items-center justify-center p-12 text-center h-[520px] rounded-2xl border border-dashed ${
            theme === 'dark' ? 'border-slate-800' : 'border-slate-300'
          }`}>
            <Flame className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3 animate-pulse" />
            <h3 className="font-bold text-sm text-slate-500">Form trends query</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Select niche on left sidebar and trigger scanning to fetch exploding video titles, behavioral trend momentum and direct strategic tips.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header toolbar control */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase py-0.5 px-3 rounded-full bg-red-600/10 text-red-600">
                  Exploding trends tracking: {activeItem?.niche?.toUpperCase() || 'General'}
                </span>
                <h3 className="text-sm font-bold tracking-tight mt-1 text-slate-500">
                  Total Ideas: {trendsList.length}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyAll}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Trends</span>
                </button>
                <button
                  onClick={handleDownloadAllText}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export TXT</span>
                </button>
              </div>
            </div>

            {/* List of Exploding trends */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {trendsList.map((trend, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-xl border flex flex-col justify-between transition ${
                    theme === 'dark'
                      ? 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/60'
                      : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Header line containing Trend ID and difficulty indicator */}
                    <div className="flex sm:items-center justify-between gap-2 border-b border-slate-200/55 dark:border-slate-800/40 pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-red-500">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                          {trend.title}
                        </h4>
                      </div>

                      {/* Difficulty Level indicator chips */}
                      <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        trend.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : trend.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        <Gauge className="w-3 h-3" />
                        <span>Effort: {trend.difficulty}</span>
                      </span>
                    </div>

                    {/* Exploding trigger row block style */}
                    <div className="flex items-start gap-2 text-xs leading-relaxed mb-2.5">
                      <span className="text-red-500 font-extrabold text-[10px] tracking-wide uppercase mt-0.5 shrink-0">TREND ANGLE:</span>
                      <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {trend.trendAngle}
                      </p>
                    </div>

                    {/* Why works behavioral trigger text */}
                    <div className="flex items-start gap-2 text-xs leading-relaxed">
                      <span className="text-indigo-500 font-extrabold text-[10px] tracking-wide uppercase mt-0.5 shrink-0">WHY IT WORKS:</span>
                      <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {trend.whyItWorks}
                      </p>
                    </div>
                  </div>

                  {/* Actions line */}
                  <div className="mt-4 border-t border-slate-200/50 dark:border-slate-800/60 pt-2 flex justify-end">
                    <button
                      onClick={() => onCopyText(`Trending Title: ${trend.title}\nTrend Angle: ${trend.trendAngle}\nWhy it Works: ${trend.whyItWorks}`)}
                      className="text-[10px] font-bold text-red-500 hover:text-red-650 flex items-center gap-1 px-2.5 py-1 rounded hover:bg-red-500/5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Concept</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
