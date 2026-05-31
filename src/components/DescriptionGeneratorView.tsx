import React, { useState } from 'react';
import {
  AlignLeft,
  Copy,
  Download,
  Loader2,
  Sparkles,
  Link,
  MapPin,
  Check,
  Hash
} from 'lucide-react';
import { VideoDescription, CreationHistoryItem } from '../types';

interface DescriptionGeneratorViewProps {
  history: CreationHistoryItem[];
  onGenerate: (params: { tool: string; topic: string; niche: string; language: string; channelName: string }) => Promise<void>;
  loading: boolean;
  onCopyText: (text: string) => void;
  onDownloadText: (filename: string, content: string) => void;
  theme: 'light' | 'dark';
}

export default function DescriptionGeneratorView({
  history,
  onGenerate,
  loading,
  onCopyText,
  onDownloadText,
  theme
}: DescriptionGeneratorViewProps) {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('general');
  const [language, setLanguage] = useState('english');
  const [channelName, setChannelName] = useState('');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<CreationHistoryItem | null>(null);

  // Filter history of this tool type
  const descHistory = history.filter((item) => item.toolType === 'video-description');

  const activeItem = selectedHistoryItem || (descHistory.length > 0 ? descHistory[0] : null);
  const desc: VideoDescription | null = activeItem ? (activeItem.output as VideoDescription) : null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setSelectedHistoryItem(null);
    await onGenerate({
      tool: 'video-description',
      topic: topic,
      niche: niche,
      language: language,
      channelName: channelName
    });
  };

  const formatDescriptionText = (d: VideoDescription) => {
    let output = `${d.hooks}\n\n`;
    output += `🔴 ABOUT THE VIDEO:\n${d.aboutVideo}\n\n`;
    
    if (d.keyPoints && d.keyPoints.length > 0) {
      output += `💡 KEY TOPICS COVERED:\n`;
      d.keyPoints.forEach((point) => {
        output += `• ${point}\n`;
      });
      output += `\n`;
    }

    if (d.timestamps && d.timestamps.length > 0) {
      output += `⏰ TIMESTAMPS / CHAPTERS:\n`;
      d.timestamps.forEach((item) => {
        output += `${item.time} - ${item.label}\n`;
      });
      output += `\n`;
    }

    output += `🔗 CONNECT WITH ME:\n${d.linksAndSocials}\n`;
    output += `Subscribe here: youtube.com/${channelName.replace(/\s+/g, '') || 'my_channel'}\n\n`;
    output += `${d.hashtags.join(' ')}\n`;
    return output;
  };

  const handleCopyDescription = () => {
    if (!desc) return;
    onCopyText(formatDescriptionText(desc));
  };

  const handleDownloadDescription = () => {
    if (!desc) return;
    onDownloadText(`youtube_description_${Date.now()}.txt`, formatDescriptionText(desc));
  };

  const niches = [
    { value: 'general', label: '🌍 General Niche' },
    { value: 'gaming', label: '🎮 Gaming' },
    { value: 'education', label: '🏫 Education' },
    { value: 'vlogs', label: '📹 Vlogs' },
    { value: 'tech', label: '💻 Tech / AI' },
    { value: 'music', label: '🎵 Music' },
    { value: 'entertainment', label: '🍿 Entertainment' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto py-2">
      {/* Configuration sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className={`p-5 rounded-2xl border ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <AlignLeft className="w-5 h-5 text-teal-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">SEO Description Setup</h3>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Video Topic or Exact Title
              </label>
              <textarea
                placeholder="e.g. 10 Mistakes beginner creators make in their first 3 Months"
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
                Channel Handle / Name
              </label>
              <input
                type="text"
                placeholder="e.g. RanaCreatorStudio"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className={`w-full p-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-700'
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`w-full p-2 text-xs rounded-lg border ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="english">🇺🇸 English</option>
                  <option value="hindi">🇮🇳 Hindi</option>
                  <option value="hinglish">🗣️ Hinglish</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Niche style</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className={`w-full p-2 text-xs rounded-lg border ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  {niches.map((n) => (
                    <option key={n.value} value={n.value}>
                      {n.value.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting SEO File...</span>
                </>
              ) : (
                <>
                  <AlignLeft className="w-4 h-4" />
                  <span>Generate SEO Description</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Saved Description local list */}
        {descHistory.length > 0 && (
          <div className={`p-5 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Saved Descriptions runs</span>
              <span className="text-[10px] bg-slate-500/10 text-slate-400 py-0.5 px-2 rounded-full font-semibold">
                {descHistory.length}
              </span>
            </h4>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {descHistory.map((item) => (
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
                  <p className="text-xs font-bold truncate">"{item.prompt}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Preview Panel area */}
      <div className="lg:col-span-8">
        {loading ? (
          <div className={`flex flex-col items-center justify-center p-12 text-center h-[520px] rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900/10 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <Loader2 className="w-12 h-12 text-teal-500 animate-spin mb-4" />
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 tracking-tight">Formulating Metadata Document...</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
              We draft dual lines optimized for first search queries, write detail paragraphs, auto-generate MM:SS timestamps, and compile relevant search metadata.
            </p>
          </div>
        ) : !desc ? (
          <div className={`flex flex-col items-center justify-center p-12 text-center h-[520px] rounded-2xl border border-dashed ${
            theme === 'dark' ? 'border-slate-800' : 'border-slate-300'
          }`}>
            <AlignLeft className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
            <h3 className="font-bold text-sm text-slate-500">Provide topic context on left sidebar</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Instantly layout long, fluid, search optimized descriptions complete with dynamic chapters, social linking anchors and SEO hashtag listings.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header copy tools toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase py-0.5 px-3 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  Target Niche: {activeItem?.niche || 'General'}
                </span>
                <h3 className="text-sm font-bold tracking-tight mt-1 text-slate-800 dark:text-slate-100">
                  Topic: "{activeItem?.prompt}"
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyDescription}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Full Description</span>
                </button>
                <button
                  onClick={handleDownloadDescription}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download file</span>
                </button>
              </div>
            </div>

            {/* Document display style container panel */}
            <div className={`p-6 rounded-2xl border font-mono text-xs space-y-6 max-h-[520px] overflow-y-auto pr-2 ${
              theme === 'dark' ? 'bg-slate-900/30 border-slate-800 text-slate-300' : 'bg-slate-50 text-slate-800 border-slate-250 shadow-xs'
            }`}>
              {/* Block 1: Hook */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">🔗 AT-GLANCE SEARCH COOP WRITER HOOKS:</span>
                <p className="bg-black/10 dark:bg-black/35 p-3 rounded-lg leading-relaxed border-l-2 border-teal-500 select-all font-sans">
                  {desc.hooks}
                </p>
              </div>

              {/* Block 2: About Video */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">🔴 COMPREHENSIVE SEO NARRATOR DETAILS:</span>
                <p className="bg-black/10 dark:bg-black/35 p-3 rounded-lg leading-relaxed whitespace-pre-wrap select-all font-sans">
                  {desc.aboutVideo}
                </p>
              </div>

              {/* Block 3: Key Insights */}
              {desc.keyPoints && desc.keyPoints.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">💡 KEY INSIGHTS LIST COVERED:</span>
                  <div className="bg-black/10 dark:bg-black/35 p-3 rounded-lg leading-relaxed select-all font-sans space-y-1">
                    {desc.keyPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-teal-500 font-bold">•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Block 4: Chapters Timestamps */}
              {desc.timestamps && desc.timestamps.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">⏰ GRAPHIC INDEX TIMESTAMPS / CHAPTER LANDMARKS:</span>
                  <div className="bg-black/10 dark:bg-black/35 p-3 rounded-lg leading-relaxed select-all">
                    {desc.timestamps.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <span className="text-teal-500 font-bold">{item.time}</span>
                        <span>- {item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Block 5: Social hooks */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1 font-mono">🔗 SOCIAL CONNECT & SUBSCRIPTION SCHEMES:</span>
                <div className="bg-black/10 dark:bg-black/35 p-3 rounded-lg leading-relaxed whitespace-pre-wrap select-all font-sans">
                  {desc.linksAndSocials}
                  {"\n"}Subscribe for more: youtube.com/{channelName.replace(/\s+/g, '') || 'my_channel'}
                </div>
              </div>

              {/* Block 6: Hashtags */}
              {desc.hashtags && desc.hashtags.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">🏷️ OPTIMIZED METADATA TAGS:</span>
                  <p className="bg-black/10 dark:bg-black/35 p-3 rounded-lg whitespace-normal leading-relaxed text-teal-500 font-bold font-sans">
                    {desc.hashtags.join(' ')}
                  </p>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
