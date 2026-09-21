import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, BookOpen, Clock, Heart, Eye, Bookmark, Share2, 
  ChevronRight, Save, CheckCircle, Video, ListVideo 
} from 'lucide-react';
import { motion } from 'framer-motion';

const VideoLectures = () => {
  const { videos, addToast } = useApp();

  // Active Video State
  const [activeVideo, setActiveVideo] = useState(videos[0]);
  
  // Interactive study notes editor state
  const [studyNotesText, setStudyNotesText] = useState('');
  const [savedNotesList, setSavedNotesList] = useState([
    { time: "05:15", text: "DP is defined by overlapping subproblems & optimal substructure." },
    { time: "15:30", text: "Memoization (Top-down) uses recursion + lookup array." }
  ]);

  const handleSaveNotes = () => {
    if (!studyNotesText.trim()) return;
    const newNote = {
      time: "Current",
      text: studyNotesText
    };
    setSavedNotesList([...savedNotesList, newNote]);
    setStudyNotesText('');
    addToast('Study notes saved for this lecture!', 'success');
  };

  const handleSelectVideo = (video) => {
    setActiveVideo(video);
    setStudyNotesText('');
    setSavedNotesList([
      { time: "01:20", text: "Core definition overview." },
      { time: "08:45", text: "Examples shown on blackboard." }
    ]);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading dark:text-white">Video Tutorials & Lectures</h1>
        <p className="text-xs text-slate-400 mt-1">Watch academic playlist guides and capture study notes in real-time.</p>
      </div>

      {/* Main Player Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Side: Player and Notes */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* YouTube Embed Player Card */}
          <div className="glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden bg-black shadow-xl">
            <div className="relative aspect-video w-full bg-slate-950">
              <iframe 
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
            
            {/* Title Details */}
            <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border-t border-slate-200/20 text-left">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold dark:text-white leading-snug">{activeVideo.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">Uploaded by {activeVideo.uploader} • Subject: {activeVideo.subject}</p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => addToast('Video bookmarked successfully.', 'success')}
                    className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    title="Bookmark Lecture"
                  >
                    <Bookmark className="h-4.5 w-4.5" />
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(activeVideo.videoUrl);
                      addToast('Lecture link copied!', 'success');
                    }}
                    className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    title="Share Lecture"
                  >
                    <Share2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mt-5 pt-4 border-t border-slate-200/10">
                <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {activeVideo.viewCount.toLocaleString()} views</span>
                <span className="flex items-center gap-1"><Heart className="h-4 w-4 text-red-500" /> {activeVideo.likeCount.toLocaleString()} likes</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {activeVideo.duration}</span>
              </div>
            </div>
          </div>

          {/* Interactive Side Notes Pad */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 text-left">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-sky-500" />
              <h3 className="font-heading font-bold text-sm dark:text-white">Active Lecture Study Notes</h3>
            </div>

            <div className="space-y-4">
              {/* Type notes area */}
              <div className="flex gap-3">
                <textarea 
                  placeholder="Type study reviews or formulas here while watching..."
                  value={studyNotesText}
                  onChange={(e) => setStudyNotesText(e.target.value)}
                  rows="2"
                  className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:border-sky-500 outline-none"
                />
                <button 
                  onClick={handleSaveNotes}
                  className="rounded-xl premium-gradient text-white text-xs font-bold px-4 py-3 shrink-0 flex items-center justify-center self-end"
                >
                  <Save className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Saved Notes lists */}
              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pt-2">
                {savedNotesList.map((n, i) => (
                  <div key={i} className="flex gap-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 p-3 text-xs">
                    <span className="font-bold text-sky-500 shrink-0">[{n.time}]</span>
                    <p className="text-slate-600 dark:text-slate-350">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Playlist & Chapters */}
        <div className="space-y-6">
          
          {/* Chapters List */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 text-left">
            <h3 className="font-heading font-bold text-xs dark:text-white mb-4">Lecture Chapters</h3>
            <div className="space-y-2">
              {activeVideo.chapters.map((chap, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/40 p-2.5 cursor-pointer text-xs transition-colors"
                  onClick={() => addToast(`Skipped to timeline: ${chap.time}`, 'info')}
                >
                  <span className="font-semibold text-slate-500 dark:text-slate-400">{chap.title}</span>
                  <span className="font-mono text-sky-500 font-bold shrink-0">{chap.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Video Playlist Selector */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 text-left">
            <div className="flex items-center gap-2 mb-4">
              <ListVideo className="h-4.5 w-4.5 text-indigo-500" />
              <h3 className="font-heading font-bold text-xs dark:text-white">Related Video Playlist</h3>
            </div>
            
            <div className="space-y-3">
              {videos.map((vid) => (
                <div 
                  key={vid.id}
                  onClick={() => handleSelectVideo(vid)}
                  className={`flex gap-3 rounded-xl p-2.5 cursor-pointer border transition-colors ${
                    activeVideo.id === vid.id 
                      ? 'bg-sky-500/5 border-sky-500/20' 
                      : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="h-14 w-20 rounded-lg bg-slate-950 flex items-center justify-center shrink-0 text-white relative">
                    <Play className="h-4 w-4" />
                    <span className="absolute bottom-1 right-1 bg-black/60 px-1 py-0.5 rounded text-[8px] font-bold text-white">{vid.duration}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold dark:text-white truncate">{vid.title}</h4>
                    <p className="text-[9px] text-slate-400 mt-1 truncate">{vid.uploader}</p>
                    <p className="text-[9px] text-indigo-500 font-semibold mt-0.5">{vid.subject}</p>
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

export default VideoLectures;
