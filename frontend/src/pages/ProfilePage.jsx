import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, Award, Bookmark, Shield, Flame, Mail, 
  MapPin, Edit3, Trash2, FileText, ExternalLink 
} from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser, notes, badges, addToast } = useApp();

  // Edit details toggler
  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState(user.bio);
  const [collegeInput, setCollegeInput] = useState(user.college);
  const [skillsInput, setSkillsInput] = useState(user.skills.join(', '));

  // User uploaded notes history
  const myUploads = notes.filter(n => n.uploader.name === user.name);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      bio: bioInput,
      college: collegeInput,
      skills: skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
    }));
    setIsEditing(false);
    addToast('Profile updated successfully!', 'success');
  };

  const handleBannerUpload = () => {
    addToast('Cover banner edit simulation triggered.', 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* Profile Banner */}
      <div 
        className="h-44 sm:h-52 w-full rounded-t-3xl relative flex items-end p-6 border-b border-slate-200/20 shadow-inner"
        style={{ background: user.banner }}
      >
        <button 
          onClick={handleBannerUpload}
          className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-lg p-1.5 text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 transition-colors focus:outline-none"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit Cover</span>
        </button>

        {/* Floating Avatar */}
        <div className="relative translate-y-10 sm:translate-y-12 flex flex-col sm:flex-row sm:items-end gap-4 z-10 text-left">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-slate-50 dark:border-slate-950 object-cover shadow-xl"
          />
          <div className="mb-2">
            <h1 className="text-lg sm:text-2xl font-extrabold dark:text-white font-heading">{user.name}</h1>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">{user.degree} • {user.branch} • {user.semester}</p>
          </div>
        </div>
      </div>

      {/* Spacer for avatar shift */}
      <div className="h-10 sm:h-12" />

      {/* Profile body grid layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Side: Details & Badges */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Bio details card */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-sm dark:text-white">Academic Profile Details</h3>
              
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-sky-500 hover:text-sky-600 flex items-center gap-1 focus:outline-none"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">College / Institution</label>
                  <input 
                    type="text" 
                    value={collegeInput}
                    onChange={(e) => setCollegeInput(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 text-xs focus:border-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Bio Overview</label>
                  <textarea 
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    rows="3"
                    className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 text-xs focus:border-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Skills (comma-separated)</label>
                  <input 
                    type="text" 
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 text-xs focus:border-sky-500 outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="rounded-xl premium-gradient text-white text-xs font-bold px-4 py-2.5 hover:scale-101 transition-all"
                >
                  Save Profile Details
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-xs space-y-2.5 text-slate-500 dark:text-slate-400">
                  <p className="flex items-center gap-2 font-semibold">
                    <Shield className="h-4.5 w-4.5 text-sky-500 shrink-0" />
                    <span>University: {user.college}</span>
                  </p>
                  <p className="leading-relaxed">
                    Bio: {user.bio}
                  </p>
                </div>

                {/* Skills tags */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Interests / Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, i) => (
                      <span key={i} className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3.5 py-1 text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Upload History */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 text-left">
            <h3 className="font-heading font-bold text-sm dark:text-white mb-4">My Upload History ({myUploads.length})</h3>
            
            <div className="space-y-3">
              {myUploads.length > 0 ? (
                myUploads.map((note) => (
                  <div key={note.id} className="flex gap-4 items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 p-3.5 text-xs transition-colors">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold dark:text-white truncate">{note.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{note.subject} • {note.resourceType} • {note.fileSize}</p>
                      </div>
                    </div>
                    
                    <span className="text-[10px] text-slate-450 font-bold shrink-0">⭐ {note.rating} ({note.downloadCount} dl)</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">You haven't uploaded any study materials yet.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Side Widgets: Streaks & Badges */}
        <div className="space-y-6">
          
          {/* Streak details */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 text-center space-y-4">
            <div className="h-16 w-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto relative animate-pulse">
              <Flame className="h-9 w-9 fill-amber-500" />
            </div>
            
            <div>
              <h4 className="font-heading font-bold text-sm dark:text-white">Active Focus Streak</h4>
              <p className="text-2xl font-black text-amber-500 mt-1">{user.streak} Days</p>
              <p className="text-[10px] text-slate-400 mt-1.5">Maintain your daily study cycles to earn high-tier badges.</p>
            </div>
          </div>

          {/* Gamification Badges */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 text-left">
            <h3 className="font-heading font-bold text-xs dark:text-white mb-4">Achievements Badges</h3>
            
            <div className="space-y-3.5">
              {badges.map((b) => (
                <div 
                  key={b.id} 
                  className={`flex gap-3 rounded-xl p-2.5 border transition-all ${
                    b.unlocked 
                      ? 'bg-emerald-500/5 border-emerald-500/10 text-slate-700 dark:text-slate-200' 
                      : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60 dark:bg-slate-950/20 dark:border-slate-800/30'
                  }`}
                >
                  <span className="text-xl shrink-0">{b.icon}</span>
                  <div>
                    <h4 className="text-[11px] font-bold">{b.name}</h4>
                    <p className="text-[9px] text-slate-450 leading-relaxed mt-0.5">{b.description}</p>
                    <span className={`block text-[8px] font-bold uppercase tracking-wider mt-1.5 ${
                      b.unlocked ? 'text-emerald-500' : 'text-slate-400'
                    }`}>
                      {b.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
