import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, ArrowUp, Send, Tag, Search, PlusCircle, 
  MessageCircle, HelpCircle, X, ShieldAlert 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DiscussionForum = () => {
  const { discussions, addDiscussion, upvoteDiscussion, addReplyToDiscussion, addToast } = useApp();

  // Search/Filters states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Post Question Modal Toggle
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTagsStr, setNewTagsStr] = useState('');

  // Active question thread (to view replies and reply)
  const [activeThread, setActiveThread] = useState(null);
  const [replyInput, setReplyInput] = useState('');

  // Filter discussions
  const filteredDiscussions = discussions.filter(d => {
    const matchesSearch = !searchQuery.trim() || 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = !selectedTag || d.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Extract all unique tags
  const allTags = [...new Set(discussions.flatMap(d => d.tags))];

  const handlePostQuestion = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      addToast('Please fill in a Title and Description.', 'warning');
      return;
    }

    const tagsArr = newTagsStr.split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    addDiscussion(newTitle, newDesc, tagsArr.length > 0 ? tagsArr : ['General']);
    setNewTitle('');
    setNewDesc('');
    setNewTagsStr('');
    setPostModalOpen(false);
  };

  const handlePostReply = (e) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    addReplyToDiscussion(activeThread.id, replyInput);
    
    // Update active thread locally to show reply immediately
    setActiveThread(prev => ({
      ...prev,
      replies: [
        ...prev.replies,
        {
          id: `rep-${Date.now()}`,
          author: 'Dharamraj',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          content: replyInput,
          date: 'Just now',
          upvotes: 0
        }
      ]
    }));

    setReplyInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading dark:text-white">Discussion Forum</h1>
          <p className="text-xs text-slate-400 mt-1">Ask questions, share explanations, and review study help threads.</p>
        </div>

        <button 
          onClick={() => setPostModalOpen(true)}
          className="flex items-center gap-2 rounded-xl premium-gradient text-white text-xs font-bold px-4 py-3 hover:scale-105 transition-all shadow-lg self-start sm:self-center"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>Ask Question</span>
        </button>
      </div>

      {/* Main Grid: Left Forum Lists, Right Active Thread Detail */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Side: Threads List */}
        <div className="xl:col-span-2 space-y-4">
          
          {/* Search and Tag filter filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search forum questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:border-sky-500 outline-none"
              />
            </div>
            
            {/* Tag selector */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 font-semibold outline-none"
            >
              <option value="">Filter by Tag</option>
              {allTags.map((tag, i) => (
                <option key={i} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Forum Cards list */}
          <div className="space-y-4">
            {filteredDiscussions.length > 0 ? (
              filteredDiscussions.map((disc) => (
                <div 
                  key={disc.id}
                  onClick={() => setActiveThread(disc)}
                  className={`glass-card hover:-translate-y-0.5 hover:shadow-xl p-5 flex gap-4 cursor-pointer text-left transition-all ${
                    activeThread?.id === disc.id 
                      ? 'border-sky-500/35 bg-sky-500/5 dark:bg-sky-500/5' 
                      : 'bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/50'
                  }`}
                >
                  {/* Upvotes layout */}
                  <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50 px-3 py-2 shrink-0 h-16 w-14">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        upvoteDiscussion(disc.id);
                      }}
                      className="text-slate-400 hover:text-sky-500 transition-colors"
                    >
                      <ArrowUp className="h-4.5 w-4.5" />
                    </button>
                    <span className="text-xs font-extrabold dark:text-white mt-1">{disc.upvotes}</span>
                  </div>

                  {/* Body Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold dark:text-white truncate hover:text-sky-500 transition-colors">
                      {disc.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {disc.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-2 border-t border-slate-200/20">
                      <div className="flex items-center gap-2">
                        <img src={disc.uploader.avatar} className="h-5 w-5 rounded-full object-cover" />
                        <span className="text-[10px] text-slate-400 font-semibold">{disc.uploader.name}</span>
                        <span className="text-[9px] text-slate-355">{disc.date}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {disc.tags.slice(0, 2).map((t, i) => (
                          <span key={i} className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                        <span className="text-[10px] text-slate-450 font-bold flex items-center gap-1">
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>{disc.replies.length} replies</span>
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="glass-panel p-16 text-center rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                <HelpCircle className="h-10 w-10 text-slate-400 mx-auto mb-4" />
                <h3 className="text-base font-bold dark:text-white">No Discussions Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">Ask a question or reset search parameters.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Active Thread Detail view */}
        <div>
          {activeThread ? (
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 text-left space-y-6 sticky top-24">
              
              <div className="flex justify-between items-start border-b border-slate-200/20 pb-4">
                <div>
                  <span className="text-[10px] text-sky-500 font-extrabold uppercase bg-sky-500/10 px-2 py-0.5 rounded">
                    Active Thread
                  </span>
                  <h2 className="text-sm font-bold dark:text-white leading-snug mt-2">{activeThread.title}</h2>
                </div>
                <button 
                  onClick={() => setActiveThread(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Uploader Details */}
              <div className="flex items-center gap-3">
                <img src={activeThread.uploader.avatar} className="h-8 w-8 rounded-full object-cover" />
                <div>
                  <p className="text-xs font-bold dark:text-white">{activeThread.uploader.name}</p>
                  <p className="text-[9px] text-slate-400">Asked on {activeThread.date}</p>
                </div>
              </div>

              {/* Main question content */}
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-350">
                {activeThread.description}
              </p>

              {/* Replies Thread list */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/10 pb-2">
                  Replies ({activeThread.replies.length})
                </h4>

                <div className="space-y-3 max-h-52 overflow-y-auto no-scrollbar">
                  {activeThread.replies.map((rep) => (
                    <div key={rep.id} className="bg-slate-50 dark:bg-slate-950/40 rounded-xl p-3 border border-slate-200/60 dark:border-slate-850 text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img src={rep.avatar} className="h-5 w-5 rounded-full object-cover" />
                          <span className="font-bold dark:text-white">{rep.author}</span>
                        </div>
                        <span className="text-[8px] text-slate-450">{rep.date}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{rep.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handlePostReply} className="flex gap-2 pt-2 border-t border-slate-200/20">
                <input 
                  type="text" 
                  placeholder="Write an explanation..."
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  className="flex-1 h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:border-sky-500 outline-none"
                />
                <button 
                  type="submit"
                  className="rounded-xl premium-gradient text-white p-2.5 shrink-0 flex items-center justify-center"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

            </div>
          ) : (
            <div className="glass-panel p-10 text-center rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 sticky top-24">
              <MessageSquare className="h-8 w-8 text-slate-400 mx-auto mb-3" />
              <h4 className="text-xs font-bold dark:text-white">No Selected Question</h4>
              <p className="text-[10px] text-slate-400 mt-1">Select a discussion thread from the list on the left to read and post replies.</p>
            </div>
          )}
        </div>

      </div>

      {/* Ask Question Modal Overlay */}
      <AnimatePresence>
        {postModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200/50 dark:border-slate-800/50 shadow-2xl relative text-left"
            >
              <button 
                onClick={() => setPostModalOpen(false)}
                className="absolute top-5 right-5 p-1 rounded-lg text-slate-450 hover:text-red-500 hover:bg-red-500/5"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-lg font-bold font-heading mb-2 dark:text-white">Ask a Study Question</h2>
              <p className="text-xs text-slate-450 mb-6">Describe your problem clearly to get answers from uploader communities.</p>

              <form onSubmit={handlePostQuestion} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Question Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Why are balanced BSTs useful in database indexing depth?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 text-xs focus:border-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description / Context details</label>
                  <textarea 
                    placeholder="Provide equations, compiler warnings, or context details..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows="4"
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 text-xs focus:border-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tags (comma-separated)</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 h-4 w-4 text-slate-450" />
                    <input 
                      type="text" 
                      placeholder="e.g. DBMS, Data Structures, Midterm"
                      value={newTagsStr}
                      onChange={(e) => setNewTagsStr(e.target.value)}
                      className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 text-xs focus:border-sky-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl font-bold text-xs hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Post to Forum</span>
                </button>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DiscussionForum;
