import React, { useState } from 'react';
import {
  Settings,
  Moon,
  Sun,
  Globe,
  Youtube,
  Trash2,
  Database,
  Check,
  AlertTriangle
} from 'lucide-react';
import { CreatorSettings, LanguageType } from '../types';

interface SettingsViewProps {
  settings: CreatorSettings;
  setSettings: React.Dispatch<React.SetStateAction<CreatorSettings>>;
  onClearHistory: () => void;
  theme: 'light' | 'dark';
}

export default function SettingsView({
  settings,
  setSettings,
  onClearHistory,
  theme
}: SettingsViewProps) {
  const [successMsg, setSuccessMsg] = useState('');

  const handleSaveSettings = (updates: Partial<CreatorSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('rana_studio_settings', JSON.stringify(updated));
      return updated;
    });

    setSuccessMsg('Branding settings saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleFlushCache = () => {
    if (confirm('CRITICAL WARNING: This will permanently delete ALL your generated scripts, titles, and bookmarks. This action cannot be undone. Are you sure?')) {
      onClearHistory();
      alert('All creator history logs have been flushed!');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-2">
      {/* Title */}
      <div>
        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 flex items-center gap-2">
          <Settings className={`w-5 h-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-500'}`} />
          <span>Studio Settings</span>
        </h3>
        <p className="text-xs text-zinc-550 mt-1">
          Customize the visual interface and default branding sign-offs for quick automated generations.
        </p>
      </div>

      {/* Settings Grid Boxes */}
      <div className="space-y-4">
        {/* Box 1: Visual Theme controls */}
        <div className={`p-5 rounded-xl border ${
          theme === 'dark' ? 'bg-zinc-900/40 backdrop-blur-md border-zinc-800/80' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <span className="text-[11px] font-extrabold uppercase text-zinc-400 block mb-3">🖥️ Interface Theme Scheme</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSaveSettings({ theme: 'light' })}
              className={`p-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-2 ${
                settings.theme === 'light'
                  ? 'border-red-500 bg-red-600/10 text-red-500 font-extrabold'
                  : theme === 'dark'
                  ? 'border-zinc-800 bg-zinc-950/25 text-zinc-400 hover:bg-zinc-800/40'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light Mode canvas</span>
            </button>
            <button
              onClick={() => handleSaveSettings({ theme: 'dark' })}
              className={`p-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-2 ${
                settings.theme === 'dark'
                  ? theme === 'dark'
                    ? 'border-indigo-500 bg-indigo-505/10 text-indigo-400 font-extrabold'
                    : 'border-red-500 bg-red-650/10 text-red-550 font-extrabold'
                  : theme === 'dark'
                  ? 'border-zinc-800 bg-zinc-950/25 text-zinc-400 hover:bg-zinc-800/40'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Dark Ambient canvas</span>
            </button>
          </div>
        </div>

        {/* Box 2: Language defaults presets */}
        <div className={`p-5 rounded-xl border ${
          theme === 'dark' ? 'bg-zinc-900/40 backdrop-blur-md border-zinc-800/80' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <span className="text-[11px] font-extrabold uppercase text-zinc-400 block mb-3">🗣️ Default Language Preset</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'english' as LanguageType, label: 'Pure English', flag: '🇺🇸' },
              { id: 'hindi' as LanguageType, label: 'Devanagari (हिन्दी)', flag: '🇮🇳' },
              { id: 'hinglish' as LanguageType, label: 'Roman Hinglish', flag: '🗣️' }
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => handleSaveSettings({ defaultLanguage: lang.id })}
                className={`py-2 p-2 rounded-lg border text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 ${
                  settings.defaultLanguage === lang.id
                    ? theme === 'dark' ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-455' : 'border-red-500 bg-red-600/10 text-red-500'
                    : theme === 'dark'
                    ? 'border-zinc-800 bg-zinc-950/25 text-zinc-400 hover:bg-zinc-800/40'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Box 3: Creator Branding signatures */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const channel = (form.elements.namedItem('channel') as HTMLInputElement).value;
            const niche = (form.elements.namedItem('niche') as HTMLSelectElement).value;
            handleSaveSettings({ channelName: channel, niche: niche });
          }}
          className={`p-5 rounded-xl border space-y-4 ${
            theme === 'dark' ? 'bg-zinc-900/40 backdrop-blur-md border-zinc-800/80' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <span className="text-[11px] font-extrabold uppercase text-zinc-400 block pb-1 border-b border-inherit">Signature Channel Prefills</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text:[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Your Default Channel Handle / Name</label>
              <div className="relative">
                <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                <input
                  type="text"
                  name="channel"
                  placeholder="e.g. DhruvRanaStudio"
                  defaultValue={settings.channelName}
                  className={`w-full pl-9 pr-4 py-2 text-xs rounded-lg border focus:outline-none focus:ring-2 ${
                    theme === 'dark' ? 'bg-zinc-950/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/50' : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-red-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text:[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Primary Niche Category</label>
              <select
                name="niche"
                defaultValue={settings.niche}
                className={`w-full p-2 text-xs rounded-lg border focus:outline-none focus:ring-2 ${
                  theme === 'dark' ? 'bg-zinc-950/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/50' : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-red-500'
                }`}
              >
                <option value="general">🌍 General / Broad Channel</option>
                <option value="gaming">🎮 Gaming & Esports</option>
                <option value="education">🏫 Tutorials & Facts</option>
                <option value="vlogs">📹 Storytelling Vlogs</option>
                <option value="tech">💻 Tech & Development</option>
                <option value="music">🎵 Music & Beats</option>
                <option value="entertainment">🍿 Entertainment comedies</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className={`px-4 py-2 font-bold text-xs rounded-lg transition-transform active:scale-95 cursor-pointer text-white ${
              theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            Save Channel Prefills
          </button>

          {successMsg && (
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold rounded-lg flex items-center gap-1.5 animate-fade-in">
              <Check className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}
        </form>

        {/* Box 4: Reset & cleaning controls */}
        <div className={`p-5 rounded-xl border ${
          theme === 'dark' ? 'bg-zinc-900/40 backdrop-blur-md border-zinc-800/80' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[11px] font-bold text-red-500 uppercase flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Danger Zone / Cache controls</span>
          </span>
          <p className="text-xs text-zinc-500 leading-relaxed mb-4">
            Flushing the local cache will wipe your saved creations, search index history logs, and resets settings values back to global fallback standards.
          </p>

          <button
            onClick={handleFlushCache}
            className={`px-4 py-2 border font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors ${
              theme === 'dark' ? 'border-red-500/30 hover:bg-red-500/10 text-red-400' : 'border-red-500/30 hover:bg-red-500/10 text-red-500'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Flush Saved Creation History</span>
          </button>
        </div>
      </div>
    </div>
  );
}
