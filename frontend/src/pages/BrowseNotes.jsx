import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { categories } from '../data/mockData';
import { 
  Search, SlidersHorizontal, ArrowUpDown, Bookmark, Download, Heart, 
  Share2, Eye, Star, FileText, Play, RotateCcw, ShieldAlert, CheckCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BrowseNotes = () => {
  const { notes, savedIds, user, toggleBookmarkNote, toggleLikeNote, downloadNote, addToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Search query
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  // Expanded filters panel toggler
  const [showFilters, setShowFilters] = useState(false);

  // Dropdown states
  const [filterClass, setFilterClass] = useState('');
  const [filterSchoolGrade, setFilterSchoolGrade] = useState('');
  const [filterBoard, setFilterBoard] = useState('');
  const [filterDegree, setFilterDegree] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterResourceType, setFilterResourceType] = useState('');
  const [sortOrder, setSortOrder] = useState('Recently Uploaded');
  
  // Filter by search parameters if set from header
  useEffect(() => {
    const searchVal = searchParams.get('search');
    if (searchVal !== null) {
      setSearchQuery(searchVal);
    }
  }, [searchParams]);

  // Handle Share simulation
  const handleShare = (noteTitle) => {
    navigator.clipboard.writeText(window.location.href);
    addToast(`Link to "${noteTitle}" copied to clipboard!`, 'success');
  };

  // Filter Logic
  const currentPath = location.pathname;

  const viewConfig = useMemo(() => {
    if (currentPath === '/saved') {
      return {
        title: 'Saved Materials',
        subtitle: 'Browse the study resources you bookmarked for later review.',
        filter: (note) => savedIds.includes(note.id)
      };
    }
    if (currentPath === '/trending') {
      return {
        title: 'Trending Materials',
        subtitle: 'Explore the most downloaded and high-rated academic notes.',
        filter: (note) => note.downloadCount > 1000 || note.likeCount > 300
      };
    }
    if (currentPath === '/recommendations') {
      return {
        title: 'Recommended For You',
        subtitle: 'Suggested notes tailored to your branch and semester.',
        filter: (note) => note.branch === user.branch || note.semester === user.semester || note.degree === user.degree
      };
    }
    return {
      title: 'Academic Resources Hub',
      subtitle: 'Search, filter, and access study materials from verified uploaders.',
      filter: () => true
    };
  }, [currentPath, savedIds, user.branch, user.semester, user.degree]);

  const filteredNotes = notes.filter(note => {
    const matchesRoute = viewConfig.filter(note);
    const matchesSearch = !searchQuery.trim() || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDegree = !filterDegree || note.degree === filterDegree;
    const matchesBranch = !filterBranch || note.branch === filterBranch;
    const matchesSemester = !filterSemester || note.semester === filterSemester;
    const matchesSubject = !filterSubject || note.subject === filterSubject;
    const matchesType = !filterResourceType || note.resourceType === filterResourceType;

    // School-mode filters: if user selected School category, match by grade/board
    const matchesSchoolGrade = !filterSchoolGrade || note.grade === filterSchoolGrade || note.semester === filterSchoolGrade;
    const matchesBoard = !filterBoard || note.board === filterBoard;

    if (filterClass === 'School') {
      return matchesRoute && matchesSearch && matchesSchoolGrade && matchesBoard && matchesSubject && matchesType;
    }

    return matchesRoute && matchesSearch && matchesDegree && matchesBranch && matchesSemester && matchesSubject && matchesType;
  }).sort((a, b) => {
    if (sortOrder === 'Recently Uploaded') {
      return new Date(b.uploadDate) - new Date(a.uploadDate);
    }
    if (sortOrder === 'Most Downloaded') {
      return b.downloadCount - a.downloadCount;
    }
    if (sortOrder === 'Highest Rated') {
      return b.rating - a.rating;
    }
    if (sortOrder === 'Most Liked') {
      return b.likeCount - a.likeCount;
    }
    return 0;
  });

  const resetFilters = () => {
    setFilterClass('');
    setFilterSchoolGrade('');
    setFilterBoard('');
    setFilterDegree('');
    setFilterBranch('');
    setFilterSemester('');
    setFilterSubject('');
    setFilterResourceType('');
    setSortOrder('Recently Uploaded');
    setSearchQuery('');
    addToast('Filters reset successfully', 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading dark:text-white">{viewConfig.title}</h1>
        <p className="text-xs text-slate-400 mt-1">{viewConfig.subtitle}</p>
      </div>

      {/* Search and Filters Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Main search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by keywords, subject, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 outline-none"
            />
          </div>

          <div className="flex gap-2">
            
            {/* Filter Toggle */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold transition-all ${
                showFilters 
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>

            {/* Clear button */}
            <button 
              onClick={resetFilters}
              className="flex items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-850 bg-white dark:bg-slate-900 transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 sm:p-6 shadow-lg"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                
                {/* Academic Category */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Academic Category</label>
                  <select 
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs text-slate-600 dark:text-slate-350 outline-none"
                  >
                    <option value="">All Categories</option>
                    {categories.classes.map((cls, i) => (
                      <option key={i} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                {/* School-mode specific filters */}
                {filterClass === 'School' ? (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Class / Grade</label>
                      <select
                        value={filterSchoolGrade}
                        onChange={(e) => setFilterSchoolGrade(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs text-slate-600 dark:text-slate-350 outline-none"
                      >
                        <option value="">All Grades</option>
                        {categories.schoolGrades.map((g, i) => (
                          <option key={i} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Board</label>
                      <select
                        value={filterBoard}
                        onChange={(e) => setFilterBoard(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs text-slate-600 dark:text-slate-350 outline-none"
                      >
                        <option value="">All Boards</option>
                        {categories.boards.map((b, i) => (
                          <option key={i} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  null
                )}

                {/* Degree Options */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Degree Program</label>
                  <select 
                    value={filterDegree}
                    onChange={(e) => setFilterDegree(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs text-slate-600 dark:text-slate-350 outline-none"
                  >
                    <option value="">All Degrees</option>
                    {categories.degrees.map((deg, i) => (
                      <option key={i} value={deg}>{deg}</option>
                    ))}
                  </select>
                </div>

                {/* Branch options */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Discipline / Branch</label>
                  <select 
                    value={filterBranch}
                    onChange={(e) => setFilterBranch(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs text-slate-600 dark:text-slate-350 outline-none"
                  >
                    <option value="">All Disciplines</option>
                    {categories.branches.map((br, i) => (
                      <option key={i} value={br}>{br}</option>
                    ))}
                  </select>
                </div>

                {/* Semesters options */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Semester</label>
                  <select 
                    value={filterSemester}
                    onChange={(e) => setFilterSemester(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs text-slate-600 dark:text-slate-350 outline-none"
                  >
                    <option value="">All Semesters</option>
                    {categories.semesters.map((sem, i) => (
                      <option key={i} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>

                {/* Subjects options */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject Course</label>
                  <select 
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs text-slate-600 dark:text-slate-350 outline-none"
                  >
                    <option value="">All Courses</option>
                    {categories.subjects.map((sub, i) => (
                      <option key={i} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* Resource type options */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Resource Format</label>
                  <select 
                    value={filterResourceType}
                    onChange={(e) => setFilterResourceType(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs text-slate-600 dark:text-slate-350 outline-none"
                  >
                    <option value="">All Formats</option>
                    {categories.resourceTypes.map((res, i) => (
                      <option key={i} value={res.value}>{res.label}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Sort filter */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200/20">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-400">Sort By:</span>
                  <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="h-8 border-none bg-transparent text-xs font-bold text-sky-500 outline-none focus:ring-0 cursor-pointer"
                  >
                    <option value="Recently Uploaded">Recently Uploaded</option>
                    <option value="Most Downloaded">Most Downloaded</option>
                    <option value="Highest Rated">Highest Rated</option>
                    <option value="Most Liked">Most Liked</option>
                  </select>
                </div>

                <div className="text-[10px] font-bold text-slate-400">
                  {filteredNotes.length} matching resources found
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid Layout of Notes */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <motion.div 
              key={note.id}
              layout
              className="glass-card hover:-translate-y-1.5 hover:shadow-2xl hover:border-sky-500/25 p-5 flex flex-col justify-between group transition-all duration-300 relative bg-white dark:bg-slate-900 overflow-hidden"
            >
              {/* Premium Glow effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/0 via-sky-500/0 to-sky-500/5 group-hover:from-sky-500/5 group-hover:to-indigo-500/5 transition-all duration-500 pointer-events-none" />

              <div>
                {/* Badges Header */}
                <div className="flex justify-between items-center mb-3">
                  <span className="rounded bg-sky-500/10 text-sky-500 text-[9px] font-extrabold px-2 py-0.5 uppercase tracking-wider">
                    {note.resourceType}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{note.fileSize}</span>
                </div>

                {/* Title */}
                <h3 
                  onClick={() => navigate(`/resources/${note.id}`)}
                  className="text-sm font-bold dark:text-white line-clamp-1 leading-snug mb-1 group-hover:text-sky-500 transition-colors cursor-pointer"
                >
                  {note.title}
                </h3>
                
                {/* Description */}
                <p className="text-[11px] leading-relaxed text-slate-400 line-clamp-3 mb-4">
                  {note.description}
                </p>

                {/* Detail tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded">
                    {note.subject}
                  </span>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded">
                    {note.semester}
                  </span>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded">
                    {note.degree}
                  </span>
                </div>
              </div>

              <div>
                {/* Footer Metadata */}
                <div className="flex justify-between items-center border-t border-slate-200/20 pt-4 mt-2">
                  <div className="flex items-center gap-2">
                    <img src={note.uploader.avatar} className="h-6 w-6 rounded-full object-cover" />
                    <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[85px]">{note.uploader.name}</span>
                  </div>

                  <div className="flex gap-2">
                    {/* Share action */}
                    <button 
                      onClick={() => handleShare(note.title)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-sky-500 hover:bg-sky-500/5 transition-all"
                      title="Share Resource"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </button>
                    {/* Save action */}
                    <button 
                      onClick={() => toggleBookmarkNote(note.id)}
                      className={`p-1.5 rounded-lg border ${
                        savedIds.includes(note.id) 
                          ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500' 
                          : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/5'
                      } transition-all`}
                      title="Bookmark"
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                    </button>
                    {/* Download action */}
                    <button 
                      onClick={() => downloadNote(note.id)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all"
                      title="Download offline"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                    {/* Preview action */}
                    <button 
                      onClick={() => navigate(`/resources/${note.id}`)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-sky-500 hover:bg-sky-500/5 transition-all cursor-pointer"
                      title="Preview Resource & Reviews"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Rating & stats footer */}
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-400/80 mt-3 pt-1">
                  <span>⭐ {note.rating} ({note.downloadCount} dl)</span>
                  <span>Uploaded: {note.uploadDate}</span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-16 text-center rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
          <ShieldAlert className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <h3 className="text-base font-bold dark:text-white">No Matching Resources</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">Try resetting the dropdown filters or typing general search words like "Data Structures".</p>
          <button 
            onClick={resetFilters}
            className="mt-6 rounded-xl premium-gradient text-white text-xs font-semibold px-4 py-2.5 shadow-md shadow-indigo-500/10"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};

export default BrowseNotes;
