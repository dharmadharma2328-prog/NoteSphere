import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, Bell, Shield, Languages, HardDrive, WifiOff, 
  Trash2, RefreshCw, Moon, Sun 
} from 'lucide-react';

const SettingsPage = () => {
  const { theme, toggleTheme, addToast } = useApp();

  // Settings states
  const [lang, setLang] = useState('English');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [autoCache, setAutoCache] = useState(true);
  const [storageLimit, setStorageLimit] = useState(500); // 500MB default

  const handleClearCache = () => {
    localStorage.removeItem('ns_downloads');
    addToast('Offline resources cache database cleared.', 'success');
  };

  const handleSaveSettings = () => {
    addToast('Configuration settings updated successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading dark:text-white">Account Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure study workspaces, notification triggers, and offline storage caching limits.</p>
      </div>

      {/* Main Settings layout panel */}
      <div className="glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 overflow-hidden divide-y divide-slate-200/20 text-left">
        
        {/* Theme Settings */}
        <div className="p-6 sm:p-8 flex items-center justify-between">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold dark:text-white">Workspace Color Theme</h3>
              <p className="text-xs text-slate-450 leading-relaxed mt-0.5">Toggle between dark mode (sleek premium aesthetics) and clean light mode layouts.</p>
            </div>
          </div>

          <button 
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-100 transition-colors"
          >
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>

        {/* Notification Settings */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold dark:text-white">Notification Alert Options</h3>
              <p className="text-xs text-slate-450 leading-relaxed mt-0.5">Control email digests and study circle calendar notification prompts.</p>
            </div>
          </div>

          <div className="pl-14 space-y-3 pt-2">
            <label className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-350 cursor-pointer">
              <input 
                type="checkbox" 
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded border-slate-300 text-sky-500 focus:ring-sky-500/25" 
              />
              <span>Send me email notifications for uploader resource releases.</span>
            </label>

            <label className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-350 cursor-pointer">
              <input 
                type="checkbox" 
                checked={sessionReminders}
                onChange={(e) => setSessionReminders(e.target.checked)}
                className="rounded border-slate-300 text-sky-500 focus:ring-sky-500/25" 
              />
              <span>Remind me 30 minutes before study circle video session timetables.</span>
            </label>
          </div>
        </div>

        {/* Language Selection */}
        <div className="p-6 sm:p-8 flex items-center justify-between">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0">
              <Languages className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold dark:text-white">Interface Language</h3>
              <p className="text-xs text-slate-450 leading-relaxed mt-0.5">Select your default translation preference for menus and labels.</p>
            </div>
          </div>

          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-350 font-semibold outline-none"
          >
            <option value="English">English (US)</option>
            <option value="Spanish">Español (ES)</option>
            <option value="French">Français (FR)</option>
            <option value="Hindi">हिन्दी (IN)</option>
          </select>
        </div>

        {/* Offline Cache Configuration */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold dark:text-white">Offline Cache Management</h3>
              <p className="text-xs text-slate-450 leading-relaxed mt-0.5">Manage indexed storage size limits allocated for offline PWA resource cache.</p>
            </div>
          </div>

          <div className="pl-14 space-y-4 pt-2">
            
            {/* Storage slider */}
            <div className="max-w-md">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-2">
                <span>Maximum Storage Allocated:</span>
                <span>{storageLimit} MB</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="1000" 
                step="50"
                value={storageLimit}
                onChange={(e) => setStorageLimit(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-850 rounded-full appearance-none cursor-pointer accent-sky-500 focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-350 cursor-pointer">
              <input 
                type="checkbox" 
                checked={autoCache}
                onChange={(e) => setAutoCache(e.target.checked)}
                className="rounded border-slate-300 text-sky-500 focus:ring-sky-500/25" 
              />
              <span>Automatically cache clicked PDF study resource sheets offline.</span>
            </label>

            <div className="flex gap-2.5 pt-2">
              <button 
                onClick={handleClearCache}
                className="flex items-center gap-1.5 rounded-xl border border-red-200/40 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-2.5 text-xs font-bold transition-colors focus:outline-none"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear Cache</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Save Settings Footer */}
      <div className="flex justify-end gap-3 pt-2">
        <button 
          onClick={handleSaveSettings}
          className="rounded-xl premium-gradient text-white text-xs font-extrabold px-6 py-3 hover:scale-105 transition-all shadow-md shadow-indigo-500/10"
        >
          Save Configuration
        </button>
      </div>

    </div>
  );
};

export default SettingsPage;
