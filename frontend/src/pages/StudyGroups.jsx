import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, Calendar, MessageSquare, Video, ArrowRight, 
  MapPin, PlusCircle, Search, Sparkles 
} from 'lucide-react';

const StudyGroups = () => {
  const { groups, toggleJoinGroup, addToast } = useApp();

  // Filters states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Categories list
  const categoriesList = ["Competitive Exams", "AI & ML", "Computer Science"];

  const filteredGroups = groups.filter(g => {
    const matchesSearch = !searchQuery.trim() || 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = !filterCategory || g.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const handleLaunchMeeting = (groupName) => {
    addToast(`Launching live audio workspace for "${groupName}"...`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading dark:text-white">Study Groups & Communities</h1>
          <p className="text-xs text-slate-400 mt-1">Join subject-wise communities, find online study partners, and attend live audio circles.</p>
        </div>

        <button 
          onClick={() => addToast('Simulating group creation drawer.', 'info')}
          className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-600 dark:text-slate-300 text-xs font-bold px-4 py-3 hover:scale-105 transition-all shadow-sm"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>Create Circle</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search study circles (e.g. UPSC, GATE)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:border-sky-500 outline-none"
          />
        </div>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 font-semibold outline-none"
        >
          <option value="">All Categories</option>
          {categoriesList.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Grid of Study Groups */}
      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGroups.map((g) => (
            <div 
              key={g.id}
              className="glass-card hover:-translate-y-1 hover:shadow-xl p-5 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50"
            >
              <div>
                {/* Header categories */}
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded bg-sky-500/10 text-sky-500 text-[9px] font-extrabold px-2 py-0.5 uppercase tracking-wider">
                    {g.category}
                  </span>
                  
                  {/* Members count badge */}
                  <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-sky-500" />
                    <span>{g.members} members</span>
                  </span>
                </div>

                {/* Group Details */}
                <h3 className="text-sm font-bold dark:text-white leading-snug">{g.name}</h3>
                <p className="text-[11px] leading-relaxed text-slate-450 mt-1.5 line-clamp-2">
                  {g.description}
                </p>

                {/* Next scheduled meeting session */}
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 p-3 mt-4 border border-slate-200/50 dark:border-slate-800/50">
                  <Calendar className="h-4 w-4 text-sky-500" />
                  <div className="text-left">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Next Study session</span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">{g.nextSession}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons footer */}
              <div className="flex justify-between items-center border-t border-slate-200/20 pt-4 mt-5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-semibold">{g.onlineCount} online now</span>
                </div>

                <div className="flex gap-2">
                  {g.isJoined && (
                    <button 
                      onClick={() => handleLaunchMeeting(g.name)}
                      className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>Enter Room</span>
                    </button>
                  )}
                  
                  <button 
                    onClick={() => toggleJoinGroup(g.id)}
                    className={`rounded-lg px-4 py-1.5 text-[10px] font-extrabold border transition-all ${
                      g.isJoined 
                        ? 'border-slate-250 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:border-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800 dark:text-slate-200' 
                        : 'premium-gradient text-white border-transparent hover:scale-103 shadow-md shadow-indigo-500/10'
                    }`}
                  >
                    {g.isJoined ? 'Leave Circle' : 'Join Circle'}
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-16 text-center rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
          <Users className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <h3 className="text-base font-bold dark:text-white">No Groups Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">Refine your search or create a new study group.</p>
        </div>
      )}

    </div>
  );
};

export default StudyGroups;
