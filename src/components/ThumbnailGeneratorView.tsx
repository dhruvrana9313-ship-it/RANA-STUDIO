import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Copy,
  Download,
  Loader2,
  Sparkles,
  Smile,
  Heart
} from 'lucide-react';
import { ThumbnailTextIdea, CreationHistoryItem } from '../types';

interface ThumbnailGeneratorViewProps {
  history: CreationHistoryItem[];
  onGenerate: (params: { tool: string; topic: string; niche: string; language: string }) => Promise<void>;
  loading: boolean;
  onCopyText: (text: string) => void;
  onDownloadText: (filename: string, content: string) => void;
  theme: 'light' | 'dark';
}

export default function ThumbnailGeneratorView({
  history,
  onGenerate,
  loading,
  onCopyText,
  onDownloadText,
  theme
}: ThumbnailGeneratorViewProps) {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('general');
  const [language, setLanguage] = useState('english');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<CreationHistoryItem | null>(null);

  // Filter local history of this tool type
  const thumbHistory = history.filter((item) => item.toolType === 'thumbnail-generator');

  const activeItem = selectedHistoryItem || (thumbHistory.length > 0 ? thumbHistory[0] : null);
  const textIdeas: ThumbnailTextIdea[] = activeItem ? (activeItem.output as ThumbnailTextIdea[]) : [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setSelectedHistoryItem(null);
    await onGenerate({
      tool: 'thumbnail-generator',
      topic: topic,
      niche: niche,
      language: language
    });
  };

  const handleCopyAll = () => {
    if (!textIdeas || textIdeas.length === 0) return;
    const all = textIdeas.map((t, idx) => `${idx + 1}. Thumbnail Text: "${t.thumbnailText}" - Layout: ${t.conceptEmotion}`).join('\n');
    onCopyText(all);
  };

  const handleDownloadAll = () => {
    if (!textIdeas || textIdeas.length === 0) return;
    const txtContent = textIdeas
      .map((t, idx) => `${idx + 1}. TEXT: "${t.thumbnailText}"\n   PREVIEW CONCEPT: ${t.conceptEmotion}\n`)
      .join('\n');
    onDownloadText(`rana_thumbnails_${activeItem?.prompt.replace(/\s+/g, '_') || 'youtube'}.txt`, txtContent);
  };

  const niches = [
    { value: 'general', label: '🌍 General / Broad' },
    { value: 'gaming', label: '🎮 Gaming channels' },
    { value: 'education', label: '🏫 Tutorials & Educational' },
    { value: 'vlogs', label: '📹 Vlogs / Travel' },
    { value: 'tech', label: '💻 Tech / Science' },
    { value: 'music', label: '🎵 Music / Vocalists' },
    { value: 'entertainment', label: '🍿 Comedy / Filming' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto py-2">
      {/* Parameter Control */}
      <div className="lg:col-span-4 space-y-6">
        <div className={`p-5 rounded-2xl border ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Thumbnail Hook Generator</h3>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Video Topic
              </label>
              <textarea
                placeholder="e.g. How I made 10 Lakhs in 30 Days using AI tools"
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
                Target Category Niche
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
                Output Language style
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
                <option value="english">🇺🇸 English Short hooks</option>
                <option value="hindi">🇮🇳 Hindi Vocalised Text (हिन्दी)</option>
                <option value="hinglish">🗣️ Hinglish Punchwords (Hindi in English font)</option>
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
                  <span>Developing Hook Words...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 20 Thumbnail Texts</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Saved thumbnail runs */}
        {thumbHistory.length > 0 && (
          <div className={`p-5 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Saved Thumbnail Runs</span>
              <span className="text-[10px] bg-slate-500/10 text-slate-400 py-0.5 px-2 rounded-full font-semibold">
                {thumbHistory.length}
              </span>
            </h4>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {thumbHistory.map((item) => (
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

      {/* Output results */}
      <div className="lg:col-span-8">
        {loading ? (
          <div className={`flex flex-col items-center justify-center p-12 text-center h-[520px] rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900/10 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 font-sans tracking-tight">Creating Eye-Catching Hooks...</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
              Synthesizing emotion metrics (Curiosity gap, extreme FOMO, and emotional relief keywords) to generate 1-4 word overlays.
            </p>
          </div>
        ) : textIdeas.length === 0 ? (
          <div className={`flex flex-col items-center justify-center p-12 text-center h-[520px] rounded-2xl border border-dashed ${
            theme === 'dark' ? 'border-slate-800' : 'border-slate-300'
          }`}>
            <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
            <h3 className="font-bold text-sm text-slate-500">Awaiting Topic details</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Generate 20 micro-phrases with massive visual weight specifically optimized to stand out in the YouTube recommendations feed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header control toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase py-0.5 px-3 rounded-full bg-emerald-500/10 text-emerald-500">
                  Total Ideas: 20
                </span>
                <h3 className="text-base font-bold tracking-tight mt-1 text-slate-800 dark:text-slate-100">
                  Topic: "{activeItem?.prompt}"
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyAll}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All</span>
                </button>
                <button
                  onClick={handleDownloadAll}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download TXT</span>
                </button>
              </div>
            </div>

            {/* Simulated Thumbnail Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[580px] overflow-y-auto pr-2">
              {textIdeas.map((t, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col justify-between group h-44 relative overflow-hidden transition ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
                      : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                  }`}
                >
                  {/* Mock Thumbnail Design card overlay simulation */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-40 z-0 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold text-slate-400">
                        Concept #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <Smile className="w-3.5 h-3.5 text-emerald-500 opacity-60" />
                    </div>

                    {/* Bold Text Simulation */}
                    <div className="bg-amber-400 text-slate-950 uppercase font-extrabold px-3 py-1.5 rounded text-sm tracking-tight w-fit max-w-full leading-none shadow-md transform -rotate-1 self-start font-sans">
                      {t.thumbnailText}
                    </div>

                    <p className={`text-xs mt-4 leading-relaxed font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      🎨 <strong>Visual Setup:</strong> {t.conceptEmotion}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-end border-t pt-2 border-slate-200/50 dark:border-slate-800/60 mt-auto">
                    <button
                      onClick={() => onCopyText(t.thumbnailText)}
                      className="text-[10px] font-bold text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer hover:bg-red-500/5 px-2 py-1 rounded"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Hook</span>
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
