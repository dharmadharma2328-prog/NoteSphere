import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { resourcesApi } from '../services/api/resourcesApi';
import aiApi from '../services/api/aiApi';
import { 
  FileText, Download, Bookmark, Heart, Star, Share2, 
  MessageSquare, Sparkles, ShieldCheck, ArrowLeft, CheckCircle, 
  Send, ExternalLink, AlertTriangle 
} from 'lucide-react';
import { motion } from 'framer-motion';

const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    user, toggleBookmarkNote, toggleLikeNote, downloadNote, 
    rateNote, savedIds, downloadedIds, addToast 
  } = useApp();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Rating form
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  // AI Summary Modal
  const [aiSummary, setAiSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    setLoading(true);
    resourcesApi.getById(id)
      .then(res => {
        setResource(res.resource);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Resource not found.');
        setLoading(false);
      });
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Link copied to clipboard!', 'success');
  };

  const handleRateSubmit = async (e) => {
    e.preventDefault();
    setSubmittingRating(true);
    try {
      await rateNote(id, selectedRating, reviewText);
      setReviewText('');
      // Reload resource to reflect new rating & review
      const res = await resourcesApi.getById(id);
      setResource(res.resource);
    } catch {
      // toast already handled
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleGenerateSummary = async () => {
    setSummarizing(true);
    try {
      const res = await aiApi.summarize(
        `${resource.title}. ${resource.description}`,
        resource.subject
      );
      setAiSummary(res.summary);
      addToast('AI Summary generated!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to generate summary.', 'error');
    } finally {
      setSummarizing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 border-4 border-slate-200 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="glass-panel p-12 text-center rounded-3xl max-w-lg mx-auto my-12 border border-slate-200/50 dark:border-slate-800/50">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-lg font-bold dark:text-white">Resource Not Found</h2>
        <p className="text-xs text-slate-400 mt-1 mb-6">The requested study material may have been moved or removed.</p>
        <button 
          onClick={() => navigate('/browse')}
          className="rounded-xl premium-gradient text-white text-xs font-bold px-4 py-2.5 shadow-md shadow-sky-500/20"
        >
          Return to Browse
        </button>
      </div>
    );
  }

  const isBookmarked = savedIds.includes(resource.id);
  const isDownloaded = downloadedIds.includes(resource.id);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-sky-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Resources</span>
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </button>
          <button 
            onClick={() => toggleBookmarkNote(resource.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
              isBookmarked 
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Resource Info Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-xl space-y-6">
        
        {/* Badges & Meta row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-extrabold px-2.5 py-1 uppercase tracking-wider">
              {resource.resourceType}
            </span>
            {resource.verified && (
              <span className="flex items-center gap-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold px-2.5 py-1 uppercase tracking-wider border border-emerald-500/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Faculty Material</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <span>⭐ {resource.rating} ({resource.ratingCount || 1} ratings)</span>
            <span>⬇️ {resource.downloadCount} downloads</span>
            <span>💾 {resource.fileSize}</span>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading dark:text-white leading-tight">
            {resource.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-3">
            {resource.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-lg">
            Subject: {resource.subject}
          </span>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-lg">
            {resource.degree} • {resource.branch}
          </span>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-lg">
            {resource.semester}
          </span>
          {resource.tags && resource.tags.map((tag, i) => (
            <span key={i} className="bg-sky-500/5 text-sky-600 dark:text-sky-400 text-xs font-medium px-3 py-1 rounded-lg border border-sky-500/10">
              #{tag}
            </span>
          ))}
        </div>

        {/* Uploader Card & Action Row */}
        <div className="pt-6 border-t border-slate-200/40 dark:border-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={resource.uploader?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
              alt="uploader" 
              className="h-11 w-11 rounded-full object-cover border border-sky-500/20"
            />
            <div>
              <p className="text-sm font-bold dark:text-white">{resource.uploader?.name}</p>
              <p className="text-[11px] text-slate-400">{resource.uploader?.role || 'Academic Scholar'} • Uploaded {resource.uploadDate}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Like */}
            <button 
              onClick={() => toggleLikeNote(resource.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:border-rose-500/30 transition-all"
            >
              <Heart className="h-4 w-4" />
              <span>{resource.likeCount} Likes</span>
            </button>

            {/* Chat with PDF */}
            <button 
              onClick={() => navigate(`/pdf-chat?resourceId=${resource.id}`)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-bold hover:scale-105 transition-all shadow-md shadow-sky-500/20"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Chat with PDF (RAG)</span>
            </button>

            {/* Summarize AI */}
            <button 
              onClick={handleGenerateSummary}
              disabled={summarizing}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-500/20 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>{summarizing ? 'Analyzing...' : 'AI Summary'}</span>
            </button>

            {/* Download */}
            <button 
              onClick={() => downloadNote(resource.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isDownloaded 
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:scale-105'
              }`}
            >
              <Download className="h-4 w-4" />
              <span>{isDownloaded ? 'Downloaded Offline' : 'Download Material'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* AI Summary Box (if requested) */}
      {aiSummary && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 via-sky-500/5 to-transparent space-y-4"
        >
          <div className="flex items-center gap-2 text-indigo-500">
            <Sparkles className="h-5 w-5" />
            <h3 className="font-heading font-bold text-sm">NoteSphere AI Summary & Exam Takeaways</h3>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: aiSummary.replace(/\n/g, '<br />') }} />
          </div>
        </motion.div>
      )}

      {/* Document Reader / Live Preview Workspace */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-sky-500" />
            <h2 className="text-sm font-bold font-heading dark:text-white">Document Preview</h2>
          </div>
          <a 
            href={resourcesApi.getFileUrl(resource.id)}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-sky-500 hover:underline"
          >
            <span>Open in Fullscreen</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Embedded Viewer */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-950 h-[500px]">
          <iframe 
            src={resourcesApi.getFileUrl(resource.id)} 
            title={resource.title}
            className="w-full h-full border-none"
          />
        </div>
      </div>

      {/* Community Ratings & Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Submit Rating */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 space-y-4">
          <h3 className="text-sm font-bold font-heading dark:text-white">Rate This Material</h3>
          <p className="text-xs text-slate-400">Help your classmates by sharing feedback on syllabus coverage and accuracy.</p>

          <form onSubmit={handleRateSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  type="button" 
                  onClick={() => setSelectedRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star className={`h-6 w-6 ${star <= selectedRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                </button>
              ))}
              <span className="text-xs font-bold text-amber-500 ml-2">{selectedRating}.0</span>
            </div>

            <div>
              <textarea 
                placeholder="Write a brief review (e.g. Excellent explanation of trees and AVL rotation steps)..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows="3"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs focus:border-sky-500 outline-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={submittingRating}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{submittingRating ? 'Saving...' : 'Submit Rating'}</span>
            </button>
          </form>
        </div>

        {/* Right: Reviews List */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 space-y-4">
          <h3 className="text-sm font-bold font-heading dark:text-white">Student Reviews & Feedback</h3>
          
          {resource.ratings && resource.ratings.length > 0 ? (
            <div className="space-y-3">
              {resource.ratings.map((r, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/30 dark:border-slate-800/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img 
                        src={r.reviewer_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                        alt="reviewer" 
                        className="h-6 w-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-bold dark:text-white">{r.reviewer_name || 'Scholar'}</span>
                    </div>
                    <span className="text-[10px] text-amber-500 font-bold">⭐ {r.rating} / 5.0</span>
                  </div>
                  {r.review && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      "{r.review}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No written reviews yet. Be the first to rate this resource!</p>
          )}
        </div>

      </div>

      {/* Related Resources */}
      {resource.related && resource.related.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-base font-bold font-heading dark:text-white">Related Academic Materials</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {resource.related.map((rel) => (
              <div 
                key={rel.id} 
                onClick={() => navigate(`/resources/${rel.id}`)}
                className="glass-panel p-4 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 hover:border-sky-500/30 cursor-pointer transition-all hover:-translate-y-1 bg-white dark:bg-slate-900"
              >
                <span className="text-[9px] font-bold text-sky-500 uppercase">{rel.resourceType}</span>
                <h4 className="text-xs font-bold dark:text-white line-clamp-1 mt-1">{rel.title}</h4>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-200/20">
                  <span>{rel.subject}</span>
                  <span>⭐ {rel.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ResourceDetailPage;
