import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { testsApi } from '../services/api/testsApi';
import { 
  GraduationCap, Clock, Award, CheckCircle, ArrowRight, 
  HelpCircle, Zap, BrainCircuit, Play, History, ShieldAlert 
} from 'lucide-react';

const ExamsPage = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    setLoading(true);
    testsApi.getTests(selectedSubject)
      .then(res => {
        setTests(res.tests || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [selectedSubject]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Hero Banner */}
      <div className="rounded-3xl premium-gradient p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              Semester Assessment Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading mt-3">
              Exam Preparation & Timed Mock Tests
            </h1>
            <p className="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed">
              Test your knowledge under real university exam conditions. Timed countdowns, randomized questions, negative marking, and automated weak-topic detection.
            </p>
          </div>

          <button
            onClick={() => navigate('/exams/practice')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-950 font-bold text-xs hover:scale-105 transition-all shadow-lg shrink-0 cursor-pointer"
          >
            <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span>Launch Quick Practice</span>
          </button>
        </div>
      </div>

      {/* Mode Cards: Practice Mode vs Timed Exam Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Practice Mode Card */}
        <div 
          onClick={() => navigate('/exams/practice')}
          className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 hover:border-sky-500/30 transition-all hover:-translate-y-1 cursor-pointer bg-white dark:bg-slate-900 shadow-md flex items-start gap-4"
        >
          <div className="h-12 w-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-heading dark:text-white">Self-Paced Practice Mode</h3>
              <span className="rounded bg-sky-500/10 text-sky-500 text-[9px] font-extrabold px-2 py-0.5 uppercase">Untimed</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Practice questions with instant answer reveal and step-by-step explanations. Ideal for topic mastery before exams.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-500 mt-4">
              <span>Start Practice Questions</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        {/* Demo Scorecard Card */}
        <div 
          onClick={() => navigate('/exams/results/att-demo-1')}
          className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 hover:border-emerald-500/30 transition-all hover:-translate-y-1 cursor-pointer bg-white dark:bg-slate-900 shadow-md flex items-start gap-4"
        >
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-heading dark:text-white">Recent Mock Test Analytics</h3>
              <span className="rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-extrabold px-2 py-0.5 uppercase">Score: 87.5%</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              View your scorecard, accuracy percentage, time-per-question analysis, and recommended study notes for weak topics.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 mt-4">
              <span>Inspect Weak-Topic Analysis</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

      </div>

      {/* Available Timed Mock Tests */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold font-heading dark:text-white">Available Mock Examinations</h2>
            <p className="text-xs text-slate-400">Faculty-curated assessments with strict timers and negative marking.</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
            >
              <option value="">All Subjects</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Data Structures">Data Structures</option>
              <option value="Operating Systems">Operating Systems</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading tests...</div>
        ) : tests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map(test => (
              <div
                key={test.id}
                className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-md flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded bg-indigo-500/10 text-indigo-500 text-[10px] font-extrabold px-2 py-0.5 uppercase">
                      {test.subject}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{test.duration_minutes} Mins</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold dark:text-white mb-2 leading-snug">{test.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{test.description}</p>
                </div>

                <div>
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-200/30 dark:border-slate-800/30 text-center my-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Questions</p>
                      <p className="text-sm font-extrabold dark:text-white mt-0.5">{test.question_count || 8}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Total Marks</p>
                      <p className="text-sm font-extrabold dark:text-white mt-0.5">{test.total_marks}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Negative</p>
                      <p className="text-sm font-extrabold text-rose-500 mt-0.5">-{test.negative_marking}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/exams/test/${test.id}`)}
                    className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Start Timed Examination</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 text-center rounded-3xl border border-slate-200/50 dark:border-slate-800/50 text-slate-400 text-xs">
            No mock tests found for the selected filter.
          </div>
        )}
      </div>

    </div>
  );
};

export default ExamsPage;
