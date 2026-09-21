import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testsApi } from '../services/api/testsApi';
import { useApp } from '../context/AppContext';
import { 
  Clock, Flag, CheckCircle, ChevronLeft, ChevronRight, 
  AlertTriangle, Send, ShieldAlert, Award 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TestRunnerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useApp();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const initialSecondsRef = useRef(0);

  // Load test
  useEffect(() => {
    setLoading(true);
    testsApi.getTestById(id)
      .then(res => {
        setTest(res.test);
        setQuestions(res.test.questions || []);
        const totalSecs = (res.test.duration_minutes || 15) * 60;
        setTimeRemaining(totalSecs);
        initialSecondsRef.current = totalSecs;
        setLoading(false);
      })
      .catch(err => {
        addToast(err.message || 'Failed to load test.', 'error');
        navigate('/exams');
      });
  }, [id, navigate, addToast]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    const timeSpent = Math.max(1, initialSecondsRef.current - timeRemaining);

    try {
      const res = await testsApi.submitTest(id, answers, timeSpent);
      addToast('Mock examination submitted successfully!', 'success');
      navigate(`/exams/results/${res.attemptId}`, { replace: true });
    } catch (err) {
      addToast(err.message || 'Submission error.', 'error');
      setSubmitting(false);
    }
  }, [id, answers, timeRemaining, submitting, navigate, addToast]);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining <= 0 && !loading && test) {
      // Auto submit on timer expiry!
      addToast('Time has expired! Automatically submitting your examination.', 'warning');
      handleSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, loading, test, handleSubmit, addToast]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const toggleFlag = (qId) => {
    setFlagged(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  if (loading || !test) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 border-4 border-slate-200 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Exam Header Bar */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-sky-500 uppercase tracking-wider">Timed Examination</span>
          <h1 className="text-base sm:text-lg font-bold dark:text-white truncate max-w-md">{test.title}</h1>
        </div>

        {/* Live Timer Countdown */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono font-bold text-sm ${
            timeRemaining < 180 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 animate-pulse' 
              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white'
          }`}>
            <Clock className="h-4 w-4" />
            <span>{formatTimer(timeRemaining)}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Examination Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (8 cols): Active Question Workspace */}
        <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-xl space-y-6 flex flex-col justify-between min-h-[480px]">
          
          <div className="space-y-6">
            {/* Header: Question Number & Flag */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-500 uppercase">
                Question {currentIndex + 1} of {questions.length} • {currentQ.topic}
              </span>

              <button
                type="button"
                onClick={() => toggleFlag(currentQ.id)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                  flagged[currentQ.id]
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'
                }`}
              >
                <Flag className="h-3.5 w-3.5" />
                <span>{flagged[currentQ.id] ? 'Flagged for Review' : 'Flag'}</span>
              </button>
            </div>

            {/* Question Statement */}
            <h2 className="text-base sm:text-lg font-bold dark:text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentQ.id] === opt;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectAnswer(currentQ.id, opt)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/20'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-sky-500 bg-sky-500' : 'border-slate-400'}`}>
                      {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold disabled:opacity-30 shadow-sm"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

        </div>

        {/* Right (4 cols): Question Navigation Grid & Stats */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-lg space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Questions Navigation Palette
            </h3>

            {/* Grid of buttons */}
            <div className="grid grid-cols-4 gap-2.5">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isFlagged = flagged[q.id];
                const isCurrent = currentIndex === idx;

                let btnStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-500';
                if (isCurrent) {
                  btnStyle = 'border-sky-500 ring-2 ring-sky-500/30 text-sky-500 font-bold';
                } else if (isFlagged) {
                  btnStyle = 'border-amber-500/50 bg-amber-500/10 text-amber-500 font-bold';
                } else if (isAnswered) {
                  btnStyle = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl border text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-400 pt-6 border-t border-slate-200/30 dark:border-slate-800/30 mt-6">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span>Flagged ({Object.values(flagged).filter(Boolean).length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span>Unanswered ({questions.length - answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border border-sky-500 bg-sky-500/20" />
                <span>Current Question</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/30 dark:border-slate-800/30 text-[11px] text-slate-400 space-y-1">
            <p>• Negative Marking: <strong>-{test.negative_marking || 0.25}</strong> per wrong answer.</p>
            <p>• Passing Marks: <strong>{test.passing_marks || 4} / {test.total_marks || 8}</strong>.</p>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200/50 dark:border-slate-800/50 shadow-2xl space-y-4"
            >
              <h3 className="text-lg font-bold font-heading dark:text-white">Confirm Submission</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                You have answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.
                {questions.length - answeredCount > 0 && (
                  <span className="text-amber-500 block mt-1 font-semibold">
                    Warning: You have {questions.length - answeredCount} unanswered questions!
                  </span>
                )}
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Return to Test
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold shadow-md"
                >
                  {submitting ? 'Evaluating...' : 'Confirm & Finish'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TestRunnerPage;
