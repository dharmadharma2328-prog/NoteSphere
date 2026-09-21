import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testsApi } from '../services/api/testsApi';
import { 
  Award, CheckCircle2, XCircle, Clock, ArrowLeft, 
  AlertTriangle, BookOpen, ChevronRight, Zap, Target 
} from 'lucide-react';

const TestResultsPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attemptData, setAttemptData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    testsApi.getAttemptById(attemptId)
      .then(res => {
        setAttemptData(res.attempt);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 border-4 border-slate-200 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!attemptData) {
    return (
      <div className="glass-panel p-12 text-center rounded-3xl max-w-lg mx-auto my-12 border border-slate-200/50 dark:border-slate-800/50">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-lg font-bold dark:text-white">Attempt Record Not Found</h2>
        <button 
          onClick={() => navigate('/exams')}
          className="mt-6 rounded-xl premium-gradient text-white text-xs font-bold px-4 py-2.5 shadow-md"
        >
          Return to Exams
        </button>
      </div>
    );
  }

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Back Link */}
      <button 
        onClick={() => navigate('/exams')}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-sky-500 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Exam Center</span>
      </button>

      {/* Scorecard Hero Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-sky-500 uppercase tracking-wider">Examination Scorecard</span>
            <h1 className="text-xl sm:text-2xl font-bold font-heading dark:text-white mt-1">{attemptData.test_title}</h1>
            <p className="text-xs text-slate-400">Subject: {attemptData.subject}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-4 py-2 rounded-2xl text-xs font-extrabold uppercase tracking-wider ${
              attemptData.passed
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            }`}>
              {attemptData.passed ? 'Status: PASSED' : 'Status: NEEDS IMPROVEMENT'}
            </span>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/40 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total Score</p>
            <p className="text-xl font-extrabold text-sky-500 mt-1">{attemptData.score} / {attemptData.total_marks}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/40 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Accuracy</p>
            <p className="text-xl font-extrabold text-indigo-500 mt-1">{attemptData.accuracy}%</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/40 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Time Spent</p>
            <p className="text-xl font-extrabold text-emerald-500 mt-1">{formatSeconds(attemptData.time_spent_seconds)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/40 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">XP Awarded</p>
            <p className="text-xl font-extrabold text-amber-500 mt-1">{attemptData.passed ? '+40 XP' : '+10 XP'}</p>
          </div>
        </div>
      </div>

      {/* Weak Topics Detection Banner */}
      {attemptData.weakTopics && attemptData.weakTopics.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Target className="h-5 w-5" />
            <h3 className="font-heading font-bold text-sm">Automated Weak-Topic Detection</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Based on the questions you missed, our diagnostic engine recommends prioritizing revision on these topics:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {attemptData.weakTopics.map((topic, i) => (
              <span key={i} className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-bold">
                ⚠️ {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Study Notes for Revision */}
      {attemptData.recommendations && attemptData.recommendations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold font-heading dark:text-white">Recommended Revision Materials</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {attemptData.recommendations.map(r => (
              <div 
                key={r.id}
                onClick={() => navigate(`/resources/${r.id}`)}
                className="glass-panel p-4 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 hover:border-sky-500/30 cursor-pointer transition-all bg-white dark:bg-slate-900"
              >
                <span className="text-[9px] font-bold text-sky-500 uppercase">{r.resourceType}</span>
                <h4 className="text-xs font-bold dark:text-white line-clamp-1 mt-1">{r.title}</h4>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-200/20">
                  <span>{r.subject}</span>
                  <span className="text-sky-500 font-bold flex items-center gap-0.5">
                    <span>Study Note</span>
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Question Review */}
      <div className="space-y-4">
        <h3 className="text-base font-bold font-heading dark:text-white">Question-by-Question Review</h3>
        
        {attemptData.answers && attemptData.answers.map((ans, idx) => {
          const isCorrect = !!ans.is_correct;
          return (
            <div 
              key={idx}
              className={`p-6 rounded-3xl border transition-all space-y-4 ${
                isCorrect 
                  ? 'border-emerald-500/20 bg-white dark:bg-slate-900' 
                  : 'border-rose-500/20 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Question {idx + 1} • {ans.topic}
                </span>
                <span className={`flex items-center gap-1 text-xs font-bold ${
                  isCorrect ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <span>{isCorrect ? `Correct (+${ans.marks})` : 'Incorrect (Deducted)'}</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm font-bold dark:text-white leading-relaxed">
                {ans.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/40">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Your Answer:</span>
                  <span className={`font-semibold ${isCorrect ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {ans.selected_answer || 'Unattempted (No penalty)'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/40">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Correct Answer:</span>
                  <span className="font-semibold text-emerald-500">{ans.correct_answer}</span>
                </div>
              </div>

              {ans.explanation && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/30 dark:border-slate-800/30 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  <strong>Explanation:</strong> {ans.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default TestResultsPage;
