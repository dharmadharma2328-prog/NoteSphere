import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Menu, Sun, Moon, Bell, Search, Mic, MicOff, Check, AlertTriangle, 
  Trash2, BookOpen, Shield, ShieldCheck, Wifi, WifiOff 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TopNav = ({ toggleSidebar }) => {
  const { 
    theme, toggleTheme, user, notifications, markAllNotificationsRead, 
    clearNotifications, recentSearches, setRecentSearches, addToast,
    isOffline, setIsOffline
  } = useApp();
  
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  // Voice search state
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('Listening...');

  // Dropdown states
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Auto-suggestions search bank
  const searchBank = [
    "Data Structures syllabus", "Algorithms PDF Bari", "Operating Systems cheatsheet", 
    "DBMS laboratory manual", "Machine learning handwritten notes", 
    "UPSC History syllabus", "GATE CSE solved papers", "Python programming cheat sheet"
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Update suggestions on search input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = searchBank.filter(term => 
      term.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSuggestions(filtered);
  }, [searchQuery]);

  const handleSearchSubmit = (term) => {
    const finalTerm = term || searchQuery;
    if (!finalTerm.trim()) return;

    // Cache search
    if (!recentSearches.includes(finalTerm)) {
      setRecentSearches(prev => [finalTerm, ...prev.slice(0, 4)]);
    }
    setSearchFocused(false);
    setSearchQuery(finalTerm);
    navigate(`/browse?search=${encodeURIComponent(finalTerm)}`);
  };

  // Mock Voice Search Trigger
  const triggerVoiceSearch = () => {
    setIsListening(true);
    setVoiceText("Listening...");
    
    // Simulate speech detection
    setTimeout(() => {
      setVoiceText('Detecting "Data Structures"...');
    }, 1500);

    setTimeout(() => {
      setIsListening(false);
      setSearchQuery('Data Structures');
      addToast('Voice recognized: "Data Structures"', 'success');
      navigate('/browse?search=Data%20Structures');
    }, 3000);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 shadow-sm">
      {/* Sidebar Mobile Toggle */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar Container */}
        <div ref={searchRef} className="relative hidden md:block w-80 lg:w-[420px]">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
            <input 
              type="text"
              placeholder="AI Smart Search notes, videos, cheat sheets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              className="w-full h-11 pl-11 pr-12 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-all outline-none"
            />
            <button 
              onClick={triggerVoiceSearch}
              className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-sky-500 transition-colors focus:outline-none"
              title="Voice Search"
            >
              <Mic className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Autocomplete / Suggestions Dropdown */}
          <AnimatePresence>
            {searchFocused && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 mt-2 rounded-2xl glass-panel p-4 shadow-xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 overflow-hidden"
              >
                {/* Suggestions List */}
                {suggestions.length > 0 ? (
                  <div className="mb-4">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Search Suggestions</p>
                    <div className="space-y-1">
                      {suggestions.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => handleSearchSubmit(term)}
                          className="flex items-center gap-2.5 w-full text-left rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          <BookOpen className="h-4 w-4 text-sky-500" />
                          <span className="font-medium">{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : searchQuery ? (
                  <div className="py-2 text-center text-sm text-slate-500">
                    No autocomplete match. Press Enter to search "{searchQuery}"
                  </div>
                ) : null}

                {/* Recent Searches */}
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Recently Searched</p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearchSubmit(term)}
                        className="rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Side Options Controls */}
      <div className="flex items-center gap-3">
        
        {/* Connection Switch Simulator */}
        <button 
          onClick={() => {
            setIsOffline(prev => !prev);
            addToast(!isOffline ? "NoteSphere switched to Offline cache" : "Online connectivity active", !isOffline ? "warning" : "success");
          }}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
            isOffline 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
          }`}
          title="Toggle online state simulator"
        >
          {isOffline ? <WifiOff className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">{isOffline ? 'Offline Cache' : 'Cloud Connected'}</span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="rounded-xl p-2.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors focus:outline-none"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications Hub */}
        <div ref={notifRef} className="relative">
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative rounded-xl p-2.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors focus:outline-none"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification List Dropdown */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-panel p-4 shadow-xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900"
              >
                <div className="flex items-center justify-between border-b border-slate-200/30 dark:border-slate-800/30 pb-3 mb-3">
                  <h3 className="font-bold text-sm dark:text-white">Notifications ({unreadCount} new)</h3>
                  <div className="flex gap-3">
                    <button 
                      onClick={markAllNotificationsRead}
                      className="text-xs font-semibold text-sky-500 hover:text-sky-600 focus:outline-none"
                    >
                      Read All
                    </button>
                    <button 
                      onClick={clearNotifications}
                      className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
                      title="Clear notifications"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-3 no-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`flex gap-3 rounded-xl p-3 text-left transition-colors border ${
                          n.read 
                            ? 'bg-transparent border-transparent' 
                            : 'bg-sky-500/5 border-sky-500/10'
                        }`}
                      >
                        <div className={`mt-0.5 rounded-full p-1.5 ${
                          n.type === 'download' ? 'bg-emerald-500/10 text-emerald-500' :
                          n.type === 'upload' ? 'bg-sky-500/10 text-sky-500' :
                          'bg-indigo-500/10 text-indigo-500'
                        }`}>
                          <BookOpen className="h-4.5 w-4.5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold dark:text-white">{n.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                          <span className="block text-[9px] text-slate-400 mt-1">{n.date}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-sm text-slate-400">
                      No notifications yet
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Navigation Trigger */}
        <div ref={profileRef} className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors focus:outline-none"
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-8 w-8 rounded-lg object-cover"
            />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute right-0 mt-3 w-52 rounded-2xl glass-panel p-2 shadow-xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900"
              >
                <button 
                  onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                  className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  My Profile
                </button>
                <button 
                  onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                  className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  Settings
                </button>
                <div className="border-t border-slate-200/30 dark:border-slate-800/30 my-1" />
                <button 
                  onClick={() => { setProfileOpen(false); navigate('/'); }}
                  className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-red-600 hover:bg-red-500/5 transition-colors"
                >
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Voice Listening Overlay Alert */}
      <AnimatePresence>
        {isListening && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="rounded-3xl glass-panel max-w-sm w-full mx-4 p-8 text-center border border-white/20 bg-slate-900 text-white"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-500/10 text-sky-500 mx-auto mb-6 relative animate-pulse">
                <Mic className="h-10 w-10 relative z-10" />
                <span className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping duration-1000" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-2">Voice AI Search</h3>
              <p className="text-sm text-slate-300 font-medium">{voiceText}</p>
              <button 
                onClick={() => setIsListening(false)}
                className="mt-6 rounded-xl bg-slate-800 hover:bg-slate-700 px-6 py-2 text-xs font-semibold text-slate-300 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default TopNav;
