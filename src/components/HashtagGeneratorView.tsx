import React, { useState } from 'react';
import {
  Hash,
  Copy,
  Download,
  Loader2,
  Sparkles,
  TrendingUp,
  Tag,
  Globe
} from 'lucide-react';
import { HashtagSet, CreationHistoryItem } from '../types';

interface HashtagGeneratorViewProps {
  history: CreationHistoryItem[];
  onGenerate: (params: { tool: string; topic: string; niche: string; language: string }) => Promise<void>;
  loading: boolean;
  onCopyText: (text: string) => void;
  onDownloadText: (filename: string, content: string) => void;
  theme: 'light' | 'dark';
}

export default function HashtagGeneratorView({
  history,
  onGenerate,
  loading,
  onCopyText,
  onDownloadText,
  theme
}: HashtagGeneratorViewProps) {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('general');
  const [language, setLanguage] = useState('english');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<CreationHistoryItem | null>(null);

  // Filter local history for hashtags
  const hashHistory = history.filter((item) => item.toolType === 'hashtag-generator');

  const activeItem = selectedHistoryItem || (hashHistory.length > 0 ? hashHistory[0] : null);
  const tagSet: HashtagSet | null = activeItem ? (activeItem.output as HashtagSet) : null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setSelectedHistoryItem(null);
    await onGenerate({
      tool: 'hashtag-generator',
      topic: topic,
      niche: niche,
      language: language
    });
  };

  const formatAllTagsText = (set: HashtagSet) => {
    return [...set.trending, ...set.niche, ...set.broad].join(' ');
  };

  const handleCopyAllTags = () => {
    if (!tagSet) return;
    onCopyText(formatAllTagsText(tagSet));
  };

  const handleDownloadAllTags = () => {
    if (!tagSet) return;
    let txt = `========= YOUTUBE HASHTAGS SELECTION =========\n`;
    txt += `Topic context: ${activeItem?.prompt}\n\n`;
    txt += `[TRENDING SECTIONS (10)]:\n${tagSet.trending.join(' ')}\n\n`;
    txt += `[NICHE SPECIFIC SECTIONS (10)]:\n${tagSet.niche.join(' ')}\n\n`;
    txt += `[BROAD GENERAL SECTIONS (10)]:\n${tagSet.broad.join(' ')}\n\n`;
    txt += `[FULL MASS COPY BLOCK]:\n${formatAllTagsText(tagSet)}\n`;
    onDownloadText(`rana_hashtags_${activeItem?.prompt.replace(/\s+/g, '_') || 'youtube'}.txt`, txt);
  };

  const niches = [
    { value: 'general', label: '🌍 General / Broad' },
    { value: 'gaming', label: '🎮 Gaming' },
    { value: 'education', label: '🏫 Education' },
    { value: 'vlogs', label: '📹 Vlogs' },
    { value: 'tech', label: '💻 Tech / AI' },
    { value: 'music', label: '🎵 Music' },
    { value: 'entertainment', label: '🍿 Entertainment / Comedy' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto py-2">
      {/* Parameter sidebar panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className={`p-5 rounded-2xl border ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-5 h-5 text-pink-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Hashtags Builder</h3>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Video Topic
              </label>
              <textarea
                placeholder="e.g. Free dynamic web app hosting, or custom PC build in 2026"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                rows={3}
                className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600'
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Target Niche
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

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Harvesting Hashtags...</span>
                </>
              ) : (
                <>
                  <Hash className="w-4 h-4" />
                  <span>Generate 30 Hashtags</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Local History Sidebar */}
        {hashHistory.length > 0 && (
          <div className={`p-5 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Saved hashtag runs</span>
              <span className="text-[10px] bg-slate-500/10 text-slate-400 py-0.5 px-2 rounded-full font-semibold">
                {hashHistory.length}
              </span>
            </h4>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {hashHistory.map((item) => (
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
                  <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">{item.niche}</p>
                  <p className="text-xs font-bold truncate mt-0.5">{item.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main selection blocks */}
      <div className="lg:col-span-8">
        {loading ? (
          <div className={`flex flex-col items-center justify-center p-12 text-center h-[520px] rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900/10 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 tracking-tight">Mining Search Intents...</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
              We are grouping 30 hashtags into Trending, Niche relevant, and general Broad scopes for absolute optimal YouTube discovery.
            </p>
          </div>
        ) : !tagSet ? (
          <div className={`flex flex-col items-center justify-center p-12 text-center h-[520px] rounded-2xl border border-dashed ${
            theme === 'dark' ? 'border-slate-800' : 'border-slate-300'
          }`}>
            <Hash className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3 animate-[pulse_2s_infinite]" />
            <h3 className="font-bold text-sm text-slate-500">Provide topic details on the left</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Instantly compile 30 highly optimized hashtags split across category, general discovery, and current search trends for tags that actually drive views!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Action Bar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase py-0.5 px-3 rounded-full bg-pink-500/10 text-pink-500">
                  Topic SEO Tags
                </span>
                <h3 className="text-sm font-bold tracking-tight mt-1 text-slate-800 dark:text-slate-100">
                  Topic: "{activeItem?.prompt}"
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyAllTags}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title="Copy all 30 hashtags separated by spaces"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All 30 Tags</span>
                </button>
                <button
                  onClick={handleDownloadAllTags}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title="Download hashtags as a text file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download TXT</span>
                </button>
              </div>
            </div>

            {/* Three distinct column categories containing tags */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Box 1: Trending Hashtags */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50/50 border-slate-200'
              }`}>
                <div>
                  <div className="flex items-center gap-2 mb-3 border-b border-slate-200/50 dark:border-slate-800/60 pb-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Trending Tags</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tagSet.trending.map((tag, i) => (
                      <span
                        key={i}
                        onClick={() => onCopyText(tag)}
                        className="text-[11px] font-mono cursor-pointer transition hover:scale-105 active:scale-95 px-2 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold select-all"
                        title="Click to copy single hashtag"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => onCopyText(tagSet.trending.join(' '))}
                  className="w-full text-center py-1.5 mt-4 text-[10px] font-bold uppercase rounded bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 cursor-pointer transition"
                >
                  Copy Trending Tags
                </button>
              </div>

              {/* Box 2: Niche específico Hashtags */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50/50 border-slate-200'
              }`}>
                <div>
                  <div className="flex items-center gap-2 mb-3 border-b border-slate-200/50 dark:border-slate-800/60 pb-2">
                    <Tag className="w-4 h-4 text-emerald-500" />
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Niche Tags</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tagSet.niche.map((tag, i) => (
                      <span
                        key={i}
                        onClick={() => onCopyText(tag)}
                        className="text-[11px] font-mono cursor-pointer transition hover:scale-105 active:scale-95 px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold select-all"
                        title="Click to copy"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => onCopyText(tagSet.niche.join(' '))}
                  className="w-full text-center py-1.5 mt-4 text-[10px] font-bold uppercase rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 cursor-pointer transition"
                >
                  Copy Niche Tags
                </button>
              </div>

              {/* Box 3: Broad Audience matching Hashtags */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50/50 border-slate-200'
              }`}>
                <div>
                  <div className="flex items-center gap-2 mb-3 border-b border-slate-200/50 dark:border-slate-800/60 pb-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Broad Tags</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tagSet.broad.map((tag, i) => (
                      <span
                        key={i}
                        onClick={() => onCopyText(tag)}
                        className="text-[11px] font-mono cursor-pointer transition hover:scale-105 active:scale-95 px-2 py-1 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 font-bold select-all"
                        title="Click to copy"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => onCopyText(tagSet.broad.join(' '))}
                  className="w-full text-center py-1.5 mt-4 text-[10px] font-bold uppercase rounded bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 cursor-pointer transition"
                >
                  Copy Broad Tags
                </button>
              </div>

            </div>

            {/* Mass Copy Area display block */}
            <div className={`p-4 rounded-xl border ${
              theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-2">Mass copy paste block (Ready for description field)</span>
              <div className="text-xs font-mono select-all bg-black/15 dark:bg-black/35 p-3 rounded-lg overflow-x-auto whitespace-normal break-all">
                {formatAllTagsText(tagSet)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
