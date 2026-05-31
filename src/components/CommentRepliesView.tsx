import React, { useState } from 'react';
import {
  MessageSquare,
  Copy,
  Download,
  Loader2,
  Sparkles,
  Heart,
  User,
  Check,
  Send
} from 'lucide-react';
import { CommentReplies, CreationHistoryItem } from '../types';

interface CommentRepliesViewProps {
  history: CreationHistoryItem[];
  onGenerate: (params: { tool: string; commentText: string; niche: string; language: string; channelName: string }) => Promise<void>;
  loading: boolean;
  onCopyText: (text: string) => void;
  onDownloadText: (filename: string, content: string) => void;
  theme: 'light' | 'dark';
}

export default function CommentRepliesView({
  history,
  onGenerate,
  loading,
  onCopyText,
  onDownloadText,
  theme
}: CommentRepliesViewProps) {
  const [commentText, setCommentText] = useState('');
  const [niche, setNiche] = useState('general');
  const [language, setLanguage] = useState('english');
  const [channelName, setChannelName] = useState('');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<CreationHistoryItem | null>(null);

  // Filter local history of comment replies
  const commentsHistory = history.filter((item) => item.toolType === 'comment-replies');

  const activeItem = selectedHistoryItem || (commentsHistory.length > 0 ? commentsHistory[0] : null);
  const replies: CommentReplies | null = activeItem ? (activeItem.output as CommentReplies) : null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSelectedHistoryItem(null);
    await onGenerate({
      tool: 'comment-replies',
      commentText: commentText,
      niche: niche,
      language: language,
      channelName: channelName
    });
  };

  const formatDownloadText = (r: CommentReplies) => {
    let t = `========= EXPLODING COMMENT REPLIES =========\n`;
    t += `Original Comment: "${activeItem?.prompt}"\n`;
    t += `Creator Signature: ${activeItem?.extraParams?.channelName || 'My Channel'}\n`;
    t += `Language Option: ${activeItem?.language}\n`;
    t += `==============================================\n\n`;
    t += `[1. FRIENDLY RESPONSE 😊]:\n${r.friendly}\n\n`;
    t += `[2. FUNNY RESPONSE 😂]:\n${r.funny}\n\n`;
    t += `[3. PROFESSIONAL RESPONSE 💼]:\n${r.professional}\n\n`;
    t += `[4. MOTIVATIONAL RESPONSE 🔥]:\n${r.motivational}\n`;
    return t;
  };

  const handleDownloadReplies = () => {
    if (!replies) return;
    onDownloadText(`youtube_replies_${Date.now()}.txt`, formatDownloadText(replies));
  };

  const niches = [
    { value: 'general', label: '🌍 General / Broad' },
    { value: 'gaming', label: '🎮 Gaming' },
    { value: 'education', label: '🏫 Education' },
    { value: 'vlogs', label: '📹 Vlogs' },
    { value: 'tech', label: '💻 Tech / AI' },
    { value: 'music', label: '🎵 Music' },
    { value: 'entertainment', label: '🍿 Entertainment' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto py-2">
      {/* Parameters Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className={`p-5 rounded-2xl border ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-cyan-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Replies Setup</h3>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Paste Viewer Comment
              </label>
              <textarea
                placeholder="e.g. Great video brother! I had a quick question, can we write custom triggers in Python or should we stick to standard Javascript objects?"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                rows={4}
                className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600'
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Your Creator Name (For Sign-off)
              </label>
              <input
                type="text"
                placeholder="e.g. DH Rana, or leave blank"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className={`w-full p-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-700'
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text:[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Language</label>
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
                <label className="block text:[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Niche Category</label>
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
              disabled={loading || !commentText.trim()}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Context...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Generate 4 Reply Tones</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Local History Sidebar */}
        {commentsHistory.length > 0 && (
          <div className={`p-5 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Saved Comments runs</span>
              <span className="text-[10px] bg-slate-500/10 text-slate-400 py-0.5 px-2 rounded-full font-semibold">
                {commentsHistory.length}
              </span>
            </h4>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {commentsHistory.map((item) => (
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
                  <p className="text-xs font-bold truncate mt-0.5">"{item.prompt}"</p>
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
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 tracking-tight">Formulating Responses...</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
              We extract language characteristics, sense targeted topics, and compose tailored replies representing friendly, witty comedy, motivate, and brand authorities.
            </p>
          </div>
        ) : !replies ? (
          <div className={`flex flex-col items-center justify-center p-12 text-center h-[520px] rounded-2xl border border-dashed ${
            theme === 'dark' ? 'border-slate-800' : 'border-slate-300'
          }`}>
            <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
            <h3 className="font-bold text-sm text-slate-500">Awaiting Viewer feedback</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Paste standard comments from your channel dashboard on the left sidebar to generate friendly, professional, funny or motivational text responses tailored with custom creator signoffs.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header Control panel toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase py-0.5 px-3 rounded-full bg-cyan-500/10 text-cyan-500">
                  Target Niche: {activeItem?.niche || 'General'}
                </span>
                <h3 className="text-sm font-bold tracking-tight mt-1 text-slate-800 dark:text-slate-100 truncate max-w-sm">
                  Comment: "{activeItem?.prompt}"
                </h3>
              </div>
              <button
                onClick={handleDownloadReplies}
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Replies</span>
              </button>
            </div>

            {/* Simulated Chat Feed boxes representing 4 options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {[
                { title: 'Friendly Response 😊', tone: replies.friendly, badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
                { title: 'Funny Response 😂', tone: replies.funny, badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
                { title: 'Professional Response 💼', tone: replies.professional, badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
                { title: 'Motivational Response 🔥', tone: replies.motivational, badgeColor: 'bg-red-500/10 text-red-500 border-red-500/20' }
              ].map((box, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border flex flex-col justify-between ${
                    theme === 'dark' ? 'bg-slate-900/30 border-slate-800/80 hover:bg-slate-900/50' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Tone Header */}
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border inline-block mb-3 ${box.badgeColor}`}>
                      {box.title}
                    </span>

                    {/* Original Comment context row in grey text */}
                    <div className="flex items-center gap-2 mb-2 p-2 rounded bg-black/10 dark:bg-black/25 text-[11px] text-slate-500 line-clamp-1 italic">
                      <User className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">"{activeItem?.prompt}"</span>
                    </div>

                    {/* Spoken reply block */}
                    <p className={`text-xs leading-relaxed font-sans mt-2 whitespace-pre-wrap select-all font-medium ${theme === 'dark' ? 'text-slate-250' : 'text-slate-800'}`}>
                      {box.tone}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-200/50 dark:border-slate-800/60 pt-2 flex justify-end">
                    <button
                      onClick={() => onCopyText(box.tone)}
                      className="text-[10px] font-bold text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer hover:bg-red-500/5 px-2.5 py-1 rounded transition"
                      title="Copy exact reply text"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Reply</span>
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
