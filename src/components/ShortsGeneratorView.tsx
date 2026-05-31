import React, { useState } from 'react';
import {
  Zap,
  Copy,
  Download,
  Loader2,
  Sparkles,
  Search,
  Check,
  TrendingUp,
  Flame,
  Gauge
} from 'lucide-react';
import { ShortsIdea, CreationHistoryItem } from '../types';

interface ShortsGeneratorViewProps {
  history: CreationHistoryItem[];
  onGenerate: (params: { tool: string; topic: string; niche: string; language: string }) => Promise<void>;
  loading: boolean;
  onCopyText: (text: string) => void;
  onDownloadText: (filename: string, content: string) => void;
  theme: 'light' | 'dark';
}

export default function ShortsGeneratorView({
  history,
  onGenerate,
  loading,
  onCopyText,
  onDownloadText,
  theme
}: ShortsGeneratorViewProps) {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('general');
  const [language, setLanguage] = useState('english');
  const [internalSearch, setInternalSearch] = useState('');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<CreationHistoryItem | null>(null);

  // Filter history of this tool type
  const shortsHistory = history.filter((item) => item.toolType === 'shorts-generator');

  const activeItem = selectedHistoryItem || (shortsHistory.length > 0 ? shortsHistory[0] : null);
  const ideasList: ShortsIdea[] = activeItem ? (activeItem.output as ShortsIdea[]) : [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setSelectedHistoryItem(null);
    await onGenerate({
      tool: 'shorts-generator',
      topic: topic,
      niche: niche,
      language: language
    });
  };

  const filteredIdeas = ideasList.filter((item) => {
    const q = internalSearch.toLowerCase();
    if (!q) return true;
    return item.idea.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
  });

  const handleCopyAll = () => {
    if (!ideasList || ideasList.length === 0) return;
    const allText = ideasList
      .map((item, idx) => `Shorts Idea #${idx + 1}: ${item.idea}\nDescription: ${item.description}\nAudience Interest: ${item.estimatedInterest}\nTip: ${item.tips}\n`)
      .join('\n');
    onCopyText(allText);
  };

  const handleDownloadAllText = () => {
    if (!ideasList || ideasList.length === 0) return;
    const allText = ideasList
      .map((item, idx) => `Idea #${idx + 1}: ${item.idea}\nDescription: ${item.description}\nAudience Interest: ${item.estimatedInterest}\nTip: ${item.tips}\n`)
      .join('\n');
    onDownloadText(`rana_shorts_${activeItem?.prompt.replace(/\s+/g, '_') || 'youtube'}.txt`, allText);
  };

  const niches = [
    { value: 'general', label: '🌍 General / Broad' },
    { value: 'gaming', label: '🎮 Gaming Shorts' },
    { value: 'education', label: '🏫 Tutorials & Facts' },
    { value: 'vlogs', label: '📹 Lifestyle & Daily' },
    { value: 'tech', label: '💻 Tech Hacks & Code' },
    { value: 'music', label: '🎵 Music Hooks' },
    { value: 'entertainment', label: '🍿 Comedy / Relatable' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto py-2">
      {/* Parameters Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className={`p-5 rounded-2xl border ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-500 fill-purple-500/20" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Shorts Blueprint</h3>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Primary Core Topic
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const samplesList = [
                      "5 hidden computer secrets hackers do not want you to know",
                      "How I built a full React application in under 1 hour",
                      "The truth about drinking 1 gallon of water daily for a month",
                      "3 dangerous financial habits destroying your 20s",
                      "Crazy Minecraft building patterns you should construct today"
                    ];
                    const randomVal = samplesList[Math.floor(Math.random() * samplesList.length)];
                    setTopic(randomVal);
                  }}
                  className={`text-[9px] font-bold uppercase py-0.5 px-2 rounded-lg transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 border border-indigo-500/20'
                      : 'bg-red-600/10 text-red-650 hover:bg-red-600/20 border border-red-600/10'
                  }`}
                  title="Generate a random template idea topic inside the entry field"
                >
                  ✨ Auto-Draft Idea
                </button>
              </div>
              <textarea
                placeholder="e.g. 5 hidden secrets, productivity routines, React tips"
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
                Categorized Niche
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
                Language style
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
                <option value="english">🇺🇸 English Shorts</option>
                <option value="hindi">🇮🇳 Hindi Voice (हिन्दी)</option>
                <option value="hinglish">🗣️ Hinglish Loop style (Hindi written in Roman)</option>
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
                  <span>Drafting 50 Ideas...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 animate-pulse" />
                  <span>Generate 50 Shorts Ideas</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Local History Sidebar */}
        {shortsHistory.length > 0 && (
          <div className={`p-5 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Saved Shorts Idea runs</span>
              <span className="text-[10px] bg-slate-500/10 text-slate-400 py-0.5 px-2 rounded-full font-semibold">
                {shortsHistory.length}
              </span>
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {shortsHistory.map((item) => (
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
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold flex justify-between">
                    <span>{item.niche}</span>
                    <span>{item.language}</span>
                  </div>
                  <p className="text-xs font-bold truncate mt-0.5">{item.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Grid display area */}
      <div className="lg:col-span-8">
        {loading ? (
          <div className={`flex flex-col items-center justify-center p-12 text-center h-[520px] rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900/10 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 tracking-tight">Compiling 50 Viral Concepts...</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
              We are generating 50 modern, high interest, low-barrier-to-entry micro-scripts with professional editing instructions in the selected language.
            </p>
          </div>
        ) : ideasList.length === 0 ? (
          <div className={`flex flex-col items-center justify-center p-12 text-center h-[520px] rounded-2xl border border-dashed ${
            theme === 'dark' ? 'border-slate-800 bg-slate-900/5' : 'border-slate-300'
          }`}>
            <Zap className="w-12 h-12 text-slate-300 dark:text-zinc-650 mb-3 animate-pulse" />
            <h3 className="font-bold text-sm text-slate-500 dark:text-zinc-400">Provide topic on the left to start</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Generate 50 distinct vertical format video ideas. Each comes with a core storyline, interest score estimation, and looping script hacks!
            </p>

            <div className="mt-8 border-t border-dashed border-inherit pt-6 w-full max-w-sm">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-zinc-500 block mb-3 tracking-wider">
                ⚡ OR CLICK TO AUTOTYPE TOPICS
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {[
                  "5 Hidden Tech Secrets",
                  "Building Real Apps Fast",
                  "Interactive Routine Hacks"
                ].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => {
                      const topicMapping: Record<string, string> = {
                        "5 Hidden Tech Secrets": "5 hidden computer secrets hackers do not want you to know",
                        "Building Real Apps Fast": "How I built a full React application in under 1 hour live coding",
                        "Interactive Routine Hacks": "The truth about drinking 1 gallon of water daily for a month"
                      };
                      setTopic(topicMapping[sample] || sample);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all active:scale-95 cursor-pointer ${
                      theme === 'dark'
                        ? 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/10'
                        : 'border-slate-200 bg-slate-50 text-slate-650 hover:border-red-500 hover:text-red-600 hover:bg-red-500/5'
                    }`}
                  >
                    💡 {sample}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase py-1 px-3 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  Total Generated: 50 Shorts Ideas
                </span>
                <h3 className="text-sm font-bold tracking-tight mt-1 text-slate-800 dark:text-slate-100 truncate max-w-md">
                  Topic: "{activeItem?.prompt}"
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyAll}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title="Copy all 50 ideas to clipboard"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy List</span>
                </button>
                <button
                  onClick={handleDownloadAllText}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title="Download list as TXT file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
              </div>
            </div>

            {/* Internal Search bar inside results list */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search generated ideas..."
                value={internalSearch}
                onChange={(e) => setInternalSearch(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  theme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800 text-white placeholder-slate-600'
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                }`}
              />
            </div>

            {/* List of 50 Ideas */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredIdeas.map((idea, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition ${
                    theme === 'dark'
                      ? 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-950/40'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/30 dark:border-slate-800/40 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-red-500">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                        {idea.idea}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Interest badge */}
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">
                        <Flame className="w-3 h-3" />
                        <span>Interest: {idea.estimatedInterest}</span>
                      </span>
                      <button
                        onClick={() => onCopyText(`Idea: ${idea.idea}\nDescription: ${idea.description}\nLoop Hack: ${idea.tips}`)}
                        className="p-1 text-slate-400 hover:text-red-500 transition"
                        title="Copy this specific idea"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    🎬 <strong>Short Outline:</strong> {idea.description}
                  </p>
                  <p className="text-xs leading-relaxed mt-2 text-purple-600 dark:text-purple-400">
                    🔄 <strong>Viral Looping Tip:</strong> {idea.tips}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
