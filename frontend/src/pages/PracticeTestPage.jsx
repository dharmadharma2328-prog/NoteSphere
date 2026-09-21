import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { testsApi } from '../services/api/testsApi';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, RefreshCw, Zap, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PracticeTestPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    setLoading(true);
    testsApi.getPracticeQuestions('', '', 10)
      .then(res => {
        setQuestions(res.questions || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSelectOption = (opt) => {
    if (selectedOption !== null) return; // Prevent changing after answered
    setSelectedOption(opt);

    const isCorrect = opt.trim().toLowerCase() === questions[currentIndex].answer.trim().toLowerCase();
    setStats(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Reload another batch
      setLoading(true);
      testsApi.getPracticeQuestions('', '', 10)
        .then(res => {
          setQuestions(res.questions || []);
          setCurrentIndex(0);
          setLoading(false);
        });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-10 w-10 border-4 border-slate-200 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/exams')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-sky-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Exit Practice Mode</span>
        </button>

        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="text-slate-400">Question {currentIndex + 1} of {questions.length}</span>
          <span className="rounded-full bg-emerald-500/10 text-emerald-500 px-3 py-1">
            Score: {stats.correct} / {stats.total}
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-xl space-y-6">
        
        {/* Meta badges */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span className="text-sky-500 uppercase">{currentQ.subject} • {currentQ.topic || 'Core'}</span>
          <span className="uppercase text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            {currentQ.difficulty || 'Medium'}
          </span>
        </div>

        {/* Question text */}
        <h2 className="text-base sm:text-lg font-bold dark:text-white leading-relaxed">
          {currentQ.question}
        </h2>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isCorrect = opt.trim().toLowerCase() === currentQ.answer.trim().toLowerCase();
            const hasAnswered = selectedOption !== null;

            let borderStyle = 'border-slate-200 dark:border-slate-800 hover:border-sky-500/50 bg-slate-50/50 dark:bg-slate-950/20';
            if (hasAnswered) {
              if (isCorrect) {
                borderStyle = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold';
              } else if (isSelected) {
                borderStyle = 'border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold';
              } else {
                borderStyle = 'opacity-50 border-slate-200 dark:border-slate-800';
              }
            }

            return (
              <button
                key={idx}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(opt)}
                className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${borderStyle}`}
              >
                <span>{opt}</span>
                {hasAnswered && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                {hasAnswered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-rose-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation Card upon Answer */}
        <AnimatePresence>
          {selectedOption !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-800/50 space-y-2 text-xs leading-relaxed"
            >
              <p className="font-bold dark:text-white flex items-center gap-1.5 text-sky-500">
                <Zap className="h-4 w-4" />
                <span>Instant Explanation:</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300">{currentQ.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        {selectedOption !== null && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:scale-105 transition-all shadow-md cursor-pointer"
            >
              <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Practice More Questions'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

export default PracticeTestPage;
