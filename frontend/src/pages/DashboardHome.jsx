import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  UploadCloud, Search, ArrowRight, Download, Bookmark, BookOpen, 
  Flame, Award, Eye, Heart, Star, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardHome = () => {
  const { notes, user, toggleBookmarkNote, toggleLikeNote, downloadNote, savedIds } = useApp();
  const navigate = useNavigate();

  // Carousel index state
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Daily study quotes
  const quotes = [
    "Success is the sum of small efforts, repeated day in and day out.",
    "The secret of getting ahead is getting started. Keep learning!",
    "Do not let what you cannot do interfere with what you can do.",
    "Consistency is the key to mastering any engineering concept.",
    "Your streak is at 5 days. Keep up the high-momentum focus today!"
  ];
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  const rotateQuote = () => {
    setActiveQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  // Filter notes for sections
  const recentNotes = notes.slice(0, 3);
  const trendingNotes = notes.filter(n => n.downloadCount > 1000);
  const recommendedNotes = notes.filter(n => n.branch === user.branch || n.semester === user.semester);

  // Carousel actions
  const nextSlide = () => {
    setCarouselIndex(prev => (prev + 1) % Math.max(1, trendingNotes.length));
  };
  const prevSlide = () => {
    setCarouselIndex(prev => (prev - 1 + trendingNotes.length) % Math.max(1, trendingNotes.length));
  };

  return (
    <div className="space-y-8">
      
      {/* Hero Welcome Banner */}
      <div className="rounded-3xl premium-gradient p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        
        <div className="max-w-2xl relative z-10">
          <span className="text-[10px] bg-white/20 font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Study Workspace
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading mt-4 mb-2">
            Welcome back, {user.name}!
          </h1>
          
          {/* Animated Quote */}
          <div className="flex items-center gap-2 cursor-pointer mt-3 mb-6" onClick={rotateQuote}>
            <p className="text-xs sm:text-sm text-white/80 italic font-medium">
              "{quotes[activeQuoteIndex]}"
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => navigate('/upload')}
              className="flex items-center gap-2 rounded-xl bg-white text-slate-950 text-xs font-bold px-4 py-3 hover:scale-105 transition-all shadow-lg"
            >
              <UploadCloud className="h-4 w-4 text-sky-600" />
              <span>Upload Notes</span>
            </button>
            <button 
              onClick={() => navigate('/browse')}
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-3 hover:scale-105 transition-all"
            >
              <Search className="h-4 w-4" />
              <span>Browse Materials</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Counters Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "My Uploads", val: user.uploadsCount, icon: UploadCloud, color: "text-sky-500 bg-sky-500/10" },
          { label: "Downloads Cache", val: user.downloadsCount, icon: Download, color: "text-emerald-500 bg-emerald-500/10" },
          { label: "Saved Notes", val: user.savedCount, icon: Bookmark, color: "text-indigo-500 bg-indigo-500/10" },
          { label: "Active Streak", val: `${user.streak} Days`, icon: Flame, color: "text-amber-500 bg-amber-500/10" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card p-5 flex items-center gap-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{stat.label}</p>
                <p className="text-lg sm:text-xl font-extrabold dark:text-white mt-0.5">{stat.val}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Left content, Right Widgets */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Side: Recent & Recommendations */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Recently Uploaded */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold dark:text-white font-heading">Recently Uploaded Resources</h2>
              <button onClick={() => navigate('/browse')} className="text-xs font-bold text-sky-500 hover:text-sky-600 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentNotes.map((note) => (
                <div key={note.id} className="glass-card p-5 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2 py-0.5 text-[9px] font-bold">
                        {note.resourceType}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{note.fileSize}</span>
                    </div>

                    <h3 className="text-sm font-bold dark:text-white line-clamp-1 mb-1">{note.title}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-4">{note.description}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between border-t border-slate-200/20 pt-3">
                      <div className="flex items-center gap-2">
                        <img src={note.uploader.avatar} className="h-6 w-6 rounded-full object-cover" />
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[80px]">{note.uploader.name}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => toggleBookmarkNote(note.id)}
                          className={`p-1.5 rounded-lg border ${
                            savedIds.includes(note.id) 
                              ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500' 
                              : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <Bookmark className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => downloadNote(note.id)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-sky-500"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommended Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 bg-indigo-500 rounded-full animate-ping" />
                <h2 className="text-lg font-bold dark:text-white font-heading">Recommended For Your Stream</h2>
              </div>
              <span className="text-[10px] text-indigo-500 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {user.branch} • {user.semester}
              </span>
            </div>

            <div className="space-y-3">
              {recommendedNotes.map((note) => (
                <div 
                  key={note.id} 
                  className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-500 shrink-0 font-bold text-sm">
                      {note.subject.slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold dark:text-white">{note.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 font-semibold">{note.subject}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-[10px] text-sky-500 font-semibold">{note.resourceType}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-[10px] text-slate-400 font-medium">⭐ {note.rating} ({note.downloadCount} dl)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 self-end sm:self-center shrink-0">
                    <button 
                      onClick={() => {
                        navigate('/downloads');
                        downloadNote(note.id);
                      }}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 px-3.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side Widgets panel */}
        <div className="space-y-8">
          
          {/* Trending Materials Carousel Slider Widget */}
          {trendingNotes.length > 0 && (
            <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm dark:text-white font-heading">Trending Materials</h3>
                <div className="flex gap-1">
                  <button 
                    onClick={prevSlide}
                    className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Carousel Panel */}
              <div className="relative overflow-hidden h-48 rounded-2xl bg-slate-100/50 dark:bg-slate-950/40 p-4 border border-slate-200/30 dark:border-slate-800/30 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="rounded bg-indigo-500/10 text-indigo-500 text-[9px] font-extrabold px-1.5 py-0.5">
                      {trendingNotes[carouselIndex].subject}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{trendingNotes[carouselIndex].resourceType}</span>
                  </div>
                  <h4 className="text-xs font-bold dark:text-white line-clamp-2 mt-2 leading-relaxed">
                    {trendingNotes[carouselIndex].title}
                  </h4>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/10 pt-3">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-500 fill-current" />
                    <span>{trendingNotes[carouselIndex].likeCount} Likes</span>
                  </span>
                  
                  <button 
                    onClick={() => downloadNote(trendingNotes[carouselIndex].id)}
                    className="text-[10px] font-bold text-sky-500 hover:text-sky-600 flex items-center gap-0.5"
                  >
                    <span>Download</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Achievements Streak Panel */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
            <h3 className="font-bold text-sm dark:text-white font-heading mb-4">Focus Achievements</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/15 rounded-xl p-3">
                <Flame className="h-8 w-8 text-amber-500 fill-amber-500" />
                <div>
                  <h4 className="text-xs font-bold dark:text-white">5-Day Study Streak</h4>
                  <p className="text-[9px] text-slate-400">Keep it up! Complete 1 study session today.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-indigo-500/5 border border-indigo-500/15 rounded-xl p-3">
                <Award className="h-8 w-8 text-indigo-500" />
                <div>
                  <h4 className="text-xs font-bold dark:text-white">Scholar Explorer Badge</h4>
                  <p className="text-[9px] text-slate-400">You downloaded 5 different notes library assets.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default DashboardHome;
