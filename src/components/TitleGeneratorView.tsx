import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Download,
  Heart,
  Loader2,
  Calendar,
  Check,
  Search,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { LanguageType, TitleIdea, CreationHistoryItem } from '../types';

interface TitleGeneratorViewProps {
  history: CreationHistoryItem[];
  onGenerate: (params: { tool: string; topic: string; niche: string; language: string }) => Promise<void>;
  loading: boolean;
  onCopyText: (text: string) => void;
  onDownloadText: (filename: string, content: string) => void;
  theme: 'light' | 'dark';
}

export default function TitleGeneratorView({
  history,
  onGenerate,
  loading,
  onCopyText,
  onDownloadText,
  theme
}: TitleGeneratorViewProps) {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('general');
  const [language, setLanguage] = useState<string>('english');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<CreationHistoryItem | null>(null);

  // Filter history items of this tool type
  const titleHistory = history.filter((item) => item.toolType === 'title-generator');

  const activeItem = selectedHistoryItem || (titleHistory.length > 0 ? titleHistory[0] : null);
  const titlesList: TitleIdea[] = activeItem ? (activeItem.output as TitleIdea[]) : [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setSelectedHistoryItem(null); // Reset selection to show the newest result
    await onGenerate({
      tool: 'title-generator',
      topic: topic,
      niche: niche,
      language: language
    });
  };

  const handleDownloadAll = () => {
    if (!titlesList || titlesList.length === 0) return;
    const txtContent = titlesList
      .map((t, idx) => `${idx + 1}. Title: ${t.title}\n   Hook Reason: ${t.engagementHook}\n`)
      .join('\n');
    onDownloadText(`rana_titles_${activeItem?.prompt.replace(/\s+/g, '_') || 'youtube'}.txt`, txtContent);
  };

  const handleCopyAll = () => {
    if (!titlesList || titlesList.length === 0) return;
    const allTitles = titlesList.map((t, idx) => `${idx + 1}. ${t.title}`).join('\n');
    onCopyText(allTitles);
  };

  const niches = [
    { value: 'general', label: '🌍 General Niche / Broad' },
    { value: 'gaming', label: '🎮 Gaming & Esports' },
    { value: 'education', label: '🏫 Education & Tutorials' },
    { value: 'vlogs', label: '📹 Vlogs & Storytelling' },
    { value: 'tech', label: '💻 Tech, Gadgets & Science' },
    { value: 'music', label: '🎵 Music & Covers' },
    { value: 'entertainment', label: '🍿 Entertainment, Film & Comedy' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto py-2">
      {/* Configuration Form on Left */}
      <div className="space-y-6 lg:col-span-4">
        <div className={`p-5 rounded-2xl border ${
          theme === 'dark' ? 'bg-zinc-900/40 backdrop-blur-md border-zinc-800/85' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className={`w-5 h-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-amber-500 fill-amber-500/20'}`} />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">Titles Builder</h3>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  What is your Video Topic?
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const samplesList = [
                      "How to build a custom gaming PC for $500 in 2026",
                      "10 productivity hacks that save 10 hours a week",
                      "I tried coding in React vs Vue for 24 hours...",
                      "The ultimate guide to grow a YouTube channel from 0 subscribers",
                      "Why AI won't replace software developers in 2026"
                    ];
                    const randomVal = samplesList[Math.floor(Math.random() * samplesList.length)];
                    setTopic(randomVal);
                  }}
                  className={`text-[9px] font-bold uppercase py-0.5 px-2 rounded-lg transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 border border-indigo-500/20'
                      : 'bg-red-650/10 text-red-650 hover:bg-red-650/20 border border-red-650/10'
                  }`}
                  title="Generate a random template idea topic inside the entry field"
                >
                  ✨ Auto-Draft Idea
                </button>
              </div>
              <textarea
                placeholder="e.g. How to grow a YouTube channel as a beginner in 2026, or Minecraft speedrun tricks"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                rows={3}
                className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-2 resize-none ${
                  theme === 'dark'
                    ? 'bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:ring-indigo-500/50'
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-red-500/50'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Channel Category Niche
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className={`w-full p-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-zinc-950/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/50'
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-red-500/50'
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
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Output Language style
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`w-full p-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-zinc-950/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/50'
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-red-500/50'
                }`}
              >
                <option value="english">🇺🇸 English (Standard USA / Global)</option>
                <option value="hindi">🇮🇳 Hindi (हिन्दी - Devnagari Script)</option>
                <option value="hinglish">🗣️ Hinglish (Hindi written in English alphabet)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === 'dark' ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating 20 Titles...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 20 CTR Titles</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Local History Sidebar List for Past Titles */}
        {titleHistory.length > 0 && (
          <div className={`p-5 rounded-2xl border ${
            theme === 'dark' ? 'bg-zinc-900/40 backdrop-blur-md border-zinc-800/80' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Saved Title Runs</span>
              <span className="text-[10px] bg-slate-500/10 text-slate-400 py-0.5 px-2 rounded-full font-semibold">
                {titleHistory.length}
              </span>
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {titleHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedHistoryItem(item)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                    activeItem?.id === item.id
                      ? theme === 'dark'
                        ? 'border-indigo-500 bg-indigo-500/5 text-indigo-400'
                        : 'border-red-500 bg-red-605/5 text-red-600'
                      : theme === 'dark'
                      ? 'border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:bg-zinc-800/30'
                      : 'border-slate-100 bg-slate-50/20 text-slate-600 hover:bg-slate-100/50'
                  }`}
                >
                  <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold flex justify-between">
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

      {/* Main Results Display on Right */}
      <div className="lg:col-span-8">
        {loading ? (
          <div className={`flex flex-col items-center justify-center p-12 text-center h-[520px] rounded-2xl border ${
            theme === 'dark' ? 'bg-zinc-900/20 backdrop-blur-md border-zinc-800/80 text-zinc-100' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <Loader2 className={`w-12 h-12 mb-4 animate-spin ${theme === 'dark' ? 'text-indigo-400' : 'text-red-650'}`} />
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-zinc-100">Analyzing Viral Title Structures...</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
              Our AI is reviewing high-performing video formulas across YouTube to generate titles optimized for peak click-through rate.
            </p>
          </div>
        ) : titlesList.length === 0 ? (
          <div className={`flex flex-col items-center justify-center p-12 text-center h-[520px] rounded-2xl border border-dashed ${
            theme === 'dark' ? 'border-zinc-800/80 bg-zinc-900/10' : 'border-slate-300'
          }`}>
            <Sparkles className="w-12 h-12 text-slate-300 dark:text-zinc-650 mb-3 animate-pulse" />
            <h3 className="font-bold text-sm text-slate-505 dark:text-zinc-400">Provide a topic on the left to start</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Get 20 highly engineered titles with detailed psychological hooks for gaming, blogs, educational categories and lifestyle videos.
            </p>

            <div className="mt-8 border-t border-dashed border-inherit pt-6 w-full max-w-sm">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-zinc-500 block mb-3 tracking-wider">
                ⚡ OR CLICK TO AUTOTYPE TOPICS
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {[
                  "Building a $500 Gaming PC",
                  "10 Secret AI Coding Hacks",
                  "React vs Vue in 2026 Speedrun"
                ].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => {
                      const topicMapping: Record<string, string> = {
                        "Building a $500 Gaming PC": "How to build a custom gaming PC for $500 in 2026",
                        "10 Secret AI Coding Hacks": "10 productivity hacks that save 10 hours a week using AI",
                        "React vs Vue in 2026 Speedrun": "I tried coding in React vs Vue for 24 hours to see which is faster"
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
            {/* Action Bar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className={`text-[10px] font-extrabold uppercase py-0.5 px-2.5 rounded-full ${
                  theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-500/10 text-slate-400'
                }`}>
                  Target Niche: {activeItem?.niche || 'General'}
                </span>
                <h3 className="text-base font-bold tracking-tight mt-1 text-slate-800 dark:text-zinc-100">
                  Topic: "{activeItem?.prompt}"
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyAll}
                  className={`px-3 py-1.5 border hover:bg-slate-100 dark:hover:bg-zinc-805 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-zinc-300 cursor-pointer ${
                    theme === 'dark' ? 'border-zinc-800' : 'border-slate-205'
                  }`}
                  title="Copy all 20 titles to clipboard"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy List</span>
                </button>
                <button
                  onClick={handleDownloadAll}
                  className={`px-3 py-1.5 border hover:bg-slate-100 dark:hover:bg-zinc-805 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-zinc-300 cursor-pointer ${
                    theme === 'dark' ? 'border-zinc-800' : 'border-slate-205'
                  }`}
                  title="Download all as TXT"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
              </div>
            </div>

            {/* List of 20 Title Cards */}
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-2">
              {titlesList.map((t, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex items-start gap-4 justify-between group transition ${
                    theme === 'dark'
                      ? 'bg-zinc-900/40 border-zinc-850 hover:bg-zinc-900/60'
                      : 'bg-white border-slate-200/80 hover:shadow-sm hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-extrabold w-5 ${
                        theme === 'dark' ? 'text-indigo-400' : 'text-red-500'
                      }`}>
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      {t.engagementHook.toLowerCase().includes('fear') ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 uppercase tracking-wide">Fear Trigger</span>
                      ) : t.engagementHook.toLowerCase().includes('curios') ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-505 uppercase tracking-wide">Curiosity Trigger</span>
                      ) : t.engagementHook.toLowerCase().includes('benefit') || t.engagementHook.toLowerCase().includes('gain') ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 uppercase tracking-wide">Self Benefit</span>
                      ) : (
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                          theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-blue-500/10 text-blue-500'
                        }`}>SEO CTR Hook</span>
                      )}
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-zinc-100 select-all leading-snug">
                      {t.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      💡 <strong>Algorithm Advantage:</strong> {t.engagementHook}
                    </p>
                  </div>
                  <button
                    onClick={() => onCopyText(t.title)}
                    className="p-2 text-slate-400 hover:text-red-500 bg-slate-500/5 hover:bg-red-500/10 rounded-lg shrink-0 transition"
                    title="Copy this title"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
