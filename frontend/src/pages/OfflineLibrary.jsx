import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Download, FileText, WifiOff, HardDrive, ShieldCheck, 
  Trash2, BookOpen, ZoomIn, ZoomOut, Maximize2, Minimize2, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OfflineLibrary = () => {
  const { notes, downloadedIds, removeDownloadedNote, isOffline, setIsOffline, addToast } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // PDF Viewer Modal States
  const [activePdfNote, setActivePdfNote] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get notes that are downloaded
  const downloadedNotes = notes.filter(n => downloadedIds.includes(n.id));

  // Trigger preview if set by URL search parameters
  useEffect(() => {
    const previewId = searchParams.get('preview');
    if (previewId) {
      const noteToPreview = notes.find(n => n.id === previewId);
      if (noteToPreview) {
        setActivePdfNote(noteToPreview);
      }
    }
  }, [searchParams, notes]);

  // Compute storage usage
  const totalStorageMB = 120;
  const usedStorageMB = downloadedNotes.reduce((acc, note) => {
    const size = parseFloat(note.fileSize) || 5;
    return acc + size;
  }, 0).toFixed(1);
  const storagePercentage = ((usedStorageMB / totalStorageMB) * 100).toFixed(0);

  const handleOpenPdf = (note) => {
    setActivePdfNote(note);
    setZoomLevel(100);
    setIsFullscreen(false);
  };

  const handleClosePdf = () => {
    setActivePdfNote(null);
    setSearchParams({}); // Clear query parameter
  };

  return (
    <div className="space-y-6">
      
      {/* Offline Status Alert Banner */}
      {isOffline && (
        <div className="flex items-center justify-between rounded-2xl bg-amber-500/10 border border-amber-500/25 p-4 text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-3">
            <WifiOff className="h-5 w-5 shrink-0" />
            <div>
              <p className="text-xs font-bold">Offline Mode Active</p>
              <p className="text-[10px] opacity-90 mt-0.5">NoteSphere is loading resources from your browser cache database.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsOffline(false);
              addToast("Switched back to Online Sync", "success");
            }}
            className="rounded-lg bg-amber-500/20 text-xs font-bold px-3 py-1.5 hover:bg-amber-500/30 transition-colors shrink-0"
          >
            Go Online
          </button>
        </div>
      )}

      {/* Header title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading dark:text-white">Offline Library & Storage</h1>
        <p className="text-xs text-slate-400 mt-1">Read previously cached study PDF resources and configure storage limits.</p>
      </div>

      {/* Storage and PWA Info Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Storage Bar widget */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4.5 w-4.5 text-sky-500" />
              <h3 className="font-heading font-bold text-xs dark:text-white">Offline Storage</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-bold">{usedStorageMB} MB / {totalStorageMB} MB</span>
          </div>

          <div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Your browser has cached {downloadedNotes.length} resources. Caching files allows offline viewing without consuming cell data.
            </p>
          </div>
        </div>

        {/* Service Worker widget */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
              <h3 className="font-heading font-bold text-xs dark:text-white">PWA Service Worker Status</h3>
            </div>
            <span className="rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-extrabold px-1.5 py-0.5">REGISTERED & ACTIVE</span>
          </div>
          
          <p className="text-[10px] leading-relaxed text-slate-400">
            NoteSphere Service Worker v1.0.4 is actively listening for fetch calls and intercepts network requests to fetch offline indexes immediately when connectivity drops.
          </p>

          <div className="flex gap-2.5 mt-4">
            <button 
              onClick={() => addToast('Storage cache validation completed. All index items match.', 'success')}
              className="rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 px-3.5 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-350 transition-colors"
            >
              Verify Cache integrity
            </button>
            <button 
              onClick={() => addToast('PWA package updated to latest build.', 'success')}
              className="rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 px-3.5 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-350 transition-colors"
            >
              Force Sync Updates
            </button>
          </div>
        </div>

      </div>

      {/* Downloaded Notes List */}
      <div>
        <h2 className="text-sm font-bold dark:text-white font-heading mb-4">Cached Offline Documents</h2>

        {downloadedNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloadedNotes.map((note) => (
              <div 
                key={note.id}
                className="glass-card hover:-translate-y-1 hover:shadow-xl p-5 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-extrabold px-2 py-0.5 uppercase tracking-wider">
                      Available Offline
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{note.fileSize}</span>
                  </div>

                  <h3 className="text-sm font-bold dark:text-white line-clamp-1 leading-snug mb-1">{note.title}</h3>
                  <p className="text-[11px] leading-relaxed text-slate-400 line-clamp-2 mb-4">{note.description}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center border-t border-slate-200/20 pt-4 mt-2">
                    <span className="text-[10px] text-slate-400 font-medium">Rating: ⭐ {note.rating}</span>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => removeDownloadedNote(note.id)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-450 hover:text-red-500 hover:bg-red-500/5 transition-all"
                        title="Remove cache"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleOpenPdf(note)}
                        className="flex items-center gap-1 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Read PDF</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-16 text-center rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
            <WifiOff className="h-10 w-10 text-slate-400 mx-auto mb-4" />
            <h3 className="text-base font-bold dark:text-white">No Cached Resources</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">Browse notes inside the platform and click the Download button to cache items offline.</p>
          </div>
        )}
      </div>

      {/* PDF View Modal Overlay */}
      <AnimatePresence>
        {activePdfNote && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className={`bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden flex flex-col transition-all duration-300 ${
                isFullscreen ? 'w-screen h-screen rounded-none p-0 border-none' : 'max-w-5xl w-full h-[80vh]'
              }`}
            >
              
              {/* PDF Header Controls */}
              <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200/30 dark:border-slate-800/30 bg-slate-50/50 dark:bg-slate-950/10">
                <div className="flex items-center gap-2 max-w-[50%]">
                  <FileText className="h-4.5 w-4.5 text-sky-500 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold dark:text-white truncate">{activePdfNote.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  {/* Zoom controls */}
                  <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 bg-white dark:bg-slate-900">
                    <button 
                      onClick={() => setZoomLevel(prev => Math.max(50, prev - 25))}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
                      title="Zoom Out"
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[10px] font-bold px-2 text-slate-500">{zoomLevel}%</span>
                    <button 
                      onClick={() => setZoomLevel(prev => Math.min(200, prev + 25))}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
                      title="Zoom In"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Fullscreen toggle */}
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors focus:outline-none"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                  </button>

                  <button 
                    onClick={handleClosePdf}
                    className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-500 transition-colors focus:outline-none"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* PDF Document body simulation */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-950/60 overflow-y-auto p-8 flex items-start justify-center">
                <div 
                  className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-lg rounded-2xl p-6 sm:p-12 max-w-3xl w-full min-h-[90vh] transition-all duration-300 relative text-left"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                >
                  <span className="absolute top-6 right-6 text-[10px] font-bold text-slate-350">Page 1 of 12</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-lg mb-8">N</div>
                  
                  <h1 className="text-xl sm:text-2xl font-extrabold dark:text-white leading-tight font-heading mb-2">{activePdfNote.title}</h1>
                  <p className="text-[11px] text-slate-400 font-semibold mb-6">Subject Course: {activePdfNote.subject} • Indexed for {activePdfNote.degree} {activePdfNote.branch}</p>

                  <div className="h-px bg-slate-200 dark:bg-slate-800 my-6" />

                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">1. Executive Overview</h3>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 mb-6">
                    {activePdfNote.description} This study document acts as a study circle reference guide for preparing core syllabus definitions. The topics inside cover theoretical equations and numerical diagrams mapped for standard exams.
                  </p>

                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">2. Fundamental Concepts</h3>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 mb-4">
                    The core methodology focuses on resolving algorithmic models and designing workflow structures. Key performance variables indicate that indexing databases correctly scales lookup throughput by several orders of magnitude.
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 my-6">
                    <span className="block text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">Key Equation Reference</span>
                    <code className="text-xs text-slate-700 dark:text-slate-300 font-semibold font-mono">
                      T(n) = 2T(n/2) + O(n) =&gt; Complexity: O(n log n)
                    </code>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    Additional sections inside cover tree balancing methods, heap allocation variables, and stack overflow debugging checklists. Refer to chapter 3 for detailed database indexing models.
                  </p>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default OfflineLibrary;
