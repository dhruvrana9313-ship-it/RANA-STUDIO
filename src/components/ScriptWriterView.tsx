import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Download,
  Loader2,
  Calendar,
  Layers,
  Sparkles,
  Camera,
  Play,
  Volume2,
  Check
} from 'lucide-react';
import { YouTubeScript, CreationHistoryItem } from '../types';

interface ScriptWriterViewProps {
  history: CreationHistoryItem[];
  onGenerate: (params: { tool: string; topic: string; niche: string; language: string; scriptType: string }) => Promise<void>;
  loading: boolean;
  onCopyText: (text: string) => void;
  onDownloadText: (filename: string, content: string) => void;
  theme: 'light' | 'dark';
}

export default function ScriptWriterView({
  history,
  onGenerate,
  loading,
  onCopyText,
  onDownloadText,
  theme
}: ScriptWriterViewProps) {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('general');
  const [language, setLanguage] = useState('english');
  const [scriptType, setScriptType] = useState('long');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<CreationHistoryItem | null>(null);

  // Filter history of this tool type
  const scriptHistory = history.filter((item) => item.toolType === 'script-writer');

  const activeItem = selectedHistoryItem || (scriptHistory.length > 0 ? scriptHistory[0] : null);
  const script: YouTubeScript | null = activeItem ? (activeItem.output as YouTubeScript) : null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setSelectedHistoryItem(null);
    await onGenerate({
      tool: 'script-writer',
      topic: topic,
      niche: niche,
      language: language,
      scriptType: scriptType
    });
  };

  const formatFullScriptText = (s: YouTubeScript) => {
    let text = `========= YOUTUBE CONTENT SCRIPT =========\n`;
    text += `Topic: ${activeItem?.prompt || 'YouTube Video'}\n`;
    text += `Format: ${activeItem?.extraParams?.scriptType === 'short' ? 'Short Form (vertical)' : 'Long Form'}\n`;
    text += `Language Style: ${activeItem?.language || 'english'}\n`;
    text += `==========================================\n\n`;
    text += `[01. THE HOOK (0-10 seconds)]:\n${s.hook}\n\n`;
    text += `[02. INTRODUCTION (Premise)]:\n${s.introduction}\n\n`;
    text += `[03. MAIN BODY CONCEPTS]:\n`;
    s.mainContent.forEach((sec, idx) => {
      text += `  • Section ${idx + 1}: ${sec.section}\n    Dialogue: ${sec.content}\n\n`;
    });
    text += `[04. CALL TO ACTION (CTA)]:\n${s.callToAction}\n\n`;
    text += `[05. EXTENDED OUTRO (End Card Optimization)]:\n${s.ending}\n`;
    return text;
  };

  const handleCopyFullScript = () => {
    if (!script) return;
    onCopyText(formatFullScriptText(script));
  };

  const handleDownloadFullScript = () => {
    if (!script) return;
    const filename = `rana_script_${activeItem?.prompt.replace(/\s+/g, '_') || 'youtube'}.txt`;
    onDownloadText(filename, formatFullScriptText(script));
  };

  const niches = [
    { value: 'general', label: '🌍 General / Broad' },
    { value: 'gaming', label: '🎮 Gaming & Esports' },
    { value: 'education', label: '🏫 Education & Tutorials' },
    { value: 'vlogs', label: '📹 Vlogs & Travel' },
    { value: 'tech', label: '💻 Tech, AI & Code' },
    { value: 'music', label: '🎵 Music & Songs' },
    { value: 'entertainment', label: '🍿 Entertainment, Drama & Comedy' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto py-2">
      {/* Parameter Control Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className={`p-5 rounded-2xl border ${
          theme === 'dark' ? 'bg-zinc-900/40 backdrop-blur-md border-zinc-800/85' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Layers className={`w-5 h-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-blue-500'}`} />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">Script Parameters</h3>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Video Topic / Premise
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const samplesList = [
                      "5 dangerous cybersecurity habits you do daily",
                      "How real-life detective investigation works vs movies",
                      "The secret history of how pizza became a global food",
                      "Why fast-food hamburgers actually do not spoil easily",
                      "10 signs your computer has hidden adware background running"
                    ];
                    const randomVal = samplesList[Math.floor(Math.random() * samplesList.length)];
                    setTopic(randomVal);
                  }}
                  className={`text-[9px] font-bold uppercase py-0.5 px-2 rounded-lg transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 border border-indigo-500/20'
                      : 'bg-red-650/10 text-red-650 hover:bg-red-650/20 border border-red-650/10'
                  }`}
                  title="Generate a random template premise inside the entry field"
                >
                  ✨ Auto-Draft Idea
                </button>
              </div>
              <textarea
                placeholder="e.g. 5 dangerous cybersecurity habits you do daily, or why fast-food hamburgers don't spoil"
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
                Script Duration Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setScriptType('short')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                    scriptType === 'short'
                      ? theme === 'dark' ? 'border-indigo-550 bg-indigo-500/10 text-indigo-400' : 'border-red-500 bg-red-650/10 text-red-650'
                      : theme === 'dark'
                      ? 'border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:bg-zinc-800/40'
                      : 'border-slate-200 bg-slate-50 text-slate-650 hover:bg-slate-100'
                  }`}
                >
                  ⚡ Short (vertical)
                </button>
                <button
                  type="button"
                  onClick={() => setScriptType('long')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                    scriptType === 'long'
                      ? theme === 'dark' ? 'border-indigo-550 bg-indigo-500/10 text-indigo-400' : 'border-red-500 bg-red-650/10 text-red-650'
                      : theme === 'dark'
                      ? 'border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:bg-zinc-800/40'
                      : 'border-slate-200 bg-slate-50 text-slate-650 hover:bg-slate-100'
                  }`}
                >
                  📹 Long Form (5-10m)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Video Niche Style
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
                Language Tone Output
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
                <option value="english">🇺🇸 English Speak & Setup</option>
                <option value="hindi">🇮🇳 Hindi Voiceover (हिन्दी - देवनागरी)</option>
                <option value="hinglish">🗣️ Hinglish Vocal style (Hindi in Roman script)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className={`w-full py-3 px-4 font-bold text-xs rounded-xl active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === 'dark' ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting Screenplay...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Write YouTube Script</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Local History Workspace for scripts */}
        {scriptHistory.length > 0 && (
          <div className={`p-5 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Saved Scripts</span>
              <span className="text-[10px] bg-slate-500/10 text-slate-400 py-0.5 px-2 rounded-full font-semibold">
                {scriptHistory.length}
              </span>
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {scriptHistory.map((item) => (
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
                    <span>{item.extraParams?.scriptType === 'short' ? 'Short' : 'Long'}</span>
                    <span>{item.language}</span>
                  </div>
                  <p className="text-xs font-bold truncate mt-0.5">{item.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Screenplay script Editor */}
      <div className="lg:col-span-8">
        {loading ? (
          <div className={`flex flex-col items-center justify-center p-12 text-center h-[520px] rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900/10 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Generating High-Retention Script Blueprint...</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
              We are pacing the timeline, spacing out call-to-actions, and embedding organic loop hooks to maximize watch time.
            </p>
          </div>
        ) : !script ? (
          <div className={`flex flex-col items-center justify-center p-12 text-center h-[520px] rounded-2xl border border-dashed ${
            theme === 'dark' ? 'border-zinc-800' : 'border-slate-300'
          }`}>
            <Sparkles className="w-12 h-12 text-slate-300 dark:text-zinc-650 mb-3 animate-pulse" />
            <h3 className="font-bold text-sm text-slate-500 dark:text-zinc-400">Provide video detail on the left</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Generate fully structured scripts complete with a high-tension opening Hook, a concise Intro block, structured Main sections with audio-visual guides, CTAs, and optimized outro tags.
            </p>

            <div className="mt-8 border-t border-dashed border-inherit pt-6 w-full max-w-sm">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-zinc-500 block mb-3 tracking-wider">
                ⚡ OR CLICK TO AUTOTYPE TOPICS
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {[
                  "5 Cybersecurity Bad Habits",
                  "Reality of Detective Work",
                  "Why Fast-food Doesn't Spoil"
                ].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => {
                      const topicMapping: Record<string, string> = {
                        "5 Cybersecurity Bad Habits": "5 dangerous cybersecurity habits you do daily on your phone and PC",
                        "Reality of Detective Work": "How real-life detective investigation actually works vs popular Hollywood movies",
                        "Why Fast-food Doesn't Spoil": "Why fast-food hamburgers actually do not spoil or rot easily"
                      };
                      setTopic(topicMapping[sample] || sample);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all active:scale-95 cursor-pointer ${
                      theme === 'dark'
                        ? 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/10'
                        : 'border-slate-200 bg-slate-50 text-slate-660 hover:border-red-500 hover:text-red-600 hover:bg-red-500/5'
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase py-0.5 px-3 rounded-full bg-blue-500/10 text-blue-500">
                  {activeItem?.extraParams?.scriptType === 'short' ? '⚡ VERTICAL SHORT' : '📹 LONG FORM VIDEO'}
                </span>
                <h3 className="text-base font-bold tracking-tight mt-1 truncate max-w-md text-slate-800 dark:text-slate-100">
                  Topic: "{activeItem?.prompt}"
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyFullScript}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title="Copy full script formatted text"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Script</span>
                </button>
                <button
                  onClick={handleDownloadFullScript}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title="Download script as TXT file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download TXT</span>
                </button>
              </div>
            </div>

            {/* Structured Segmented Blocks */}
            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2">
              {/* Segment 1: The Hook */}
              <div className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-900/30 border-slate-800/80' : 'bg-slate-50/50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between border-b pb-2 mb-3 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2 text-[10px] font-bold bg-red-500 text-white rounded">HOOK</span>
                    <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">The First 0 to 10 Seconds</h4>
                  </div>
                  <button
                    onClick={() => onCopyText(script.hook)}
                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/5 rounded"
                    title="Copy this section"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div className="w-0.5 flex-1 bg-slate-300 dark:bg-slate-800 my-1" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                      <Camera className="w-3 h-3" /> AUDIO SPOKEN DIALOGUE & VISUAL PACE
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-150 leading-relaxed font-mono whitespace-pre-wrap select-all">
                      {script.hook}
                    </p>
                  </div>
                </div>
              </div>

              {/* Segment 2: Introduction */}
              <div className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-900/30 border-slate-800/80' : 'bg-slate-50/50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between border-b pb-2 mb-3 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2 text-[10px] font-bold bg-blue-500 text-white rounded">INTRO</span>
                    <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Introduction & Premise Setup</h4>
                  </div>
                  <button
                    onClick={() => onCopyText(script.introduction)}
                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/5 rounded"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div className="w-0.5 flex-1 bg-slate-300 dark:bg-slate-800 my-1" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                      <Volume2 className="w-3 h-3" /> TALAK SPOKEN Premised Introduction
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-150 leading-relaxed font-mono whitespace-pre-wrap select-all">
                      {script.introduction}
                    </p>
                  </div>
                </div>
              </div>

              {/* Segment 3: Main body concepts */}
              <div className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-900/30 border-slate-800/80' : 'bg-slate-50/50 border-slate-200'
              }`}>
                <div className="border-b pb-2 mb-3 border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2 text-[10px] font-bold bg-emerald-500 text-white rounded">BODY</span>
                    <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Core Body & Narrative Chapters</h4>
                  </div>
                </div>
                <div className="space-y-4">
                  {script.mainContent.map((section, idx) => (
                    <div key={idx} className="flex gap-3 relative">
                      <div className="shrink-0 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs z-10 bg-slate-100 dark:bg-slate-900 border border-emerald-500/20">
                          {idx + 3}
                        </div>
                        {idx < script.mainContent.length - 1 && (
                          <div className="w-0.5 absolute top-8 bottom-0 bg-slate-300 dark:bg-slate-800 left-4" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5 p-3 rounded-xl bg-black/10 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-500 tracking-wide uppercase">
                            🖥️ {section.section}
                          </span>
                          <button
                            onClick={() => onCopyText(`${section.section}\n${section.content}`)}
                            className="p-1 text-slate-400 hover:text-emerald-500 rounded"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-wrap select-all">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Segment 4: Call to Actions */}
              <div className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-900/30 border-slate-800/80' : 'bg-slate-50/50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between border-b pb-2 mb-3 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2 text-[10px] font-bold bg-purple-500 text-white rounded">CTA</span>
                    <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Seamless Call to Action (CTA)</h4>
                  </div>
                  <button
                    onClick={() => onCopyText(script.callToAction)}
                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/5 rounded"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs">
                      {script.mainContent.length + 3}
                    </div>
                    <div className="w-0.5 flex-1 bg-slate-300 dark:bg-slate-800 my-1" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-slate-400 mb-1">
                      📢 ENGAGEMENT TRIGGER
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-150 leading-relaxed font-mono whitespace-pre-wrap select-all">
                      {script.callToAction}
                    </p>
                  </div>
                </div>
              </div>

              {/* Segment 5: Outro Endings */}
              <div className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-900/30 border-slate-800/80' : 'bg-slate-50/50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between border-b pb-2 mb-3 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2 text-[10px] font-bold bg-slate-700 text-white rounded">OUTRO</span>
                    <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Default Outro / Next Watch Trigger</h4>
                  </div>
                  <button
                    onClick={() => onCopyText(script.ending)}
                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/5 rounded"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-700/10 text-slate-400 flex items-center justify-center font-bold text-xs">
                      {script.mainContent.length + 4}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-slate-400 mb-1">
                      🛑 ENDSCREEN CLICK-THROUGH PACE
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-150 leading-relaxed font-mono whitespace-pre-wrap select-all">
                      {script.ending}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
