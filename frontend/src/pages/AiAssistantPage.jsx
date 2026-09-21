import React, { useState } from 'react';
import { aiApi } from '../services/api/aiApi';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, MessageSquare, BookOpen, HelpCircle, Layers, 
  Calendar, Send, RefreshCw, CheckCircle2, ChevronRight, 
  ChevronLeft, Award, Zap, BrainCircuit 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AiAssistantPage = () => {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('chat'); // chat | summarize | questions | flashcards | planner

  // 1. Chat State
  const [chatMessage, setChatMessage] = useState('');
  const [chatContext, setChatContext] = useState('Data Structures');
  const [chatLevel, setChatLevel] = useState('intermediate'); // beginner | intermediate | exam
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      content: `Hello! I am your NoteSphere Academic AI Study Assistant. I can explain complex syllabus concepts at your preferred difficulty level (Beginner, Intermediate, or Exam High-Yield), generate practice questions, or synthesize lecture summaries. What would you like to explore today?`
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // 2. Summarizer State
  const [summaryTopic, setSummaryTopic] = useState('Operating Systems Paging & Virtual Memory');
  const [summaryText, setSummaryText] = useState('');
  const [summaryResult, setSummaryResult] = useState('');
  const [summarizing, setSummarizing] = useState(false);

  // 3. Question & MCQ Generator State
  const [qTopic, setQTopic] = useState('Data Structures & Graph Algorithms');
  const [qMode, setQMode] = useState('mcqs'); // mcqs | exam
  const [generatedQuestions, setGeneratedQuestions] = useState('');
  const [generatedMcqs, setGeneratedMcqs] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [qLoading, setQLoading] = useState(false);

  // 4. Flashcards State
  const [fcTopic, setFcTopic] = useState('Database Management Systems');
  const [flashcards, setFlashcards] = useState([
    { front: 'What is Boyce-Codd Normal Form (BCNF)?', back: 'A relation is in BCNF iff for every non-trivial functional dependency X -> Y, X is a superkey of the relation.' },
    { front: 'What are the ACID properties in DBMS?', back: 'Atomicity (all or nothing), Consistency (preserves invariants), Isolation (concurrency control), and Durability (committed data survives crashes).' },
    { front: 'Why do databases index with B+ Trees over B-Trees?', back: 'B+ Trees store all actual record pointers strictly at the leaf nodes linked in a chain, enabling very efficient range queries and high node fan-out.' }
  ]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [fcLoading, setFcLoading] = useState(false);

  // 5. Study Planner State
  const [planSubject, setPlanSubject] = useState('Operating Systems');
  const [planDays, setPlanDays] = useState(7);
  const [planHours, setPlanHours] = useState(3);
  const [studyPlan, setStudyPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);

  // Handle Chat Submit
  const handleSendChat = async (e) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim() || chatLoading) return;

    const userMsg = chatMessage.trim();
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);

    try {
      const res = await aiApi.chat(userMsg, chatContext, chatLevel, chatHistory);
      setChatHistory(prev => [...prev, { role: 'assistant', content: res.response, source: res.source }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: `Apologies, I encountered an issue: ${err.message}. Please try again.` }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle Summarizer Submit
  const handleSummarize = async () => {
    setSummarizing(true);
    try {
      const res = await aiApi.summarize(summaryText || summaryTopic, summaryTopic);
      setSummaryResult(res.summary);
      addToast('Summary generated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to generate summary.', 'error');
    } finally {
      setSummarizing(false);
    }
  };

  // Handle Question Generator
  const handleGenerateQuestions = async () => {
    setQLoading(true);
    setSelectedAnswers({});
    try {
      if (qMode === 'mcqs') {
        const res = await aiApi.generateMcqs(qTopic, 4, 'medium');
        setGeneratedMcqs(res.mcqs || []);
      } else {
        const res = await aiApi.generateQuestions(qTopic, 5);
        setGeneratedQuestions(res.questions || '');
      }
      addToast('Exam materials synthesized!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to generate questions.', 'error');
    } finally {
      setQLoading(false);
    }
  };

  // Handle Flashcards Generation
  const handleGenerateFlashcards = async () => {
    setFcLoading(true);
    setCurrentCardIndex(0);
    setCardFlipped(false);
    try {
      const res = await aiApi.generateFlashcards(fcTopic, 6);
      if (res.flashcards && res.flashcards.length > 0) {
        setFlashcards(res.flashcards);
        addToast('Fresh revision deck ready!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to generate deck.', 'error');
    } finally {
      setFcLoading(false);
    }
  };

  // Handle Study Planner Generation
  const handleGeneratePlan = async () => {
    setPlanLoading(true);
    try {
      const res = await aiApi.generateStudyPlan(planSubject, planDays, planHours);
      setStudyPlan(res);
      addToast('Personalized study roadmap generated!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to generate study plan.', 'error');
    } finally {
      setPlanLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl premium-gradient p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                AI Academic Studio
              </span>
              <span className="text-[11px] text-white/80">Syllabus Grounded & Exam Aligned</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
              AI Study Assistant & Exam Copilot
            </h1>
            <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
              Get concepts explained at beginner or exam level, generate practice MCQs, flip flashcards, and build personalized study roadmaps.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
            <BrainCircuit className="h-5 w-5 text-sky-300" />
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-white/70">Engine Mode</p>
              <p className="text-xs font-bold text-white">Active & Grounded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
        {[
          { id: 'chat', label: 'Tutor Chat', icon: MessageSquare },
          { id: 'summarize', label: 'Smart Summarizer', icon: BookOpen },
          { id: 'questions', label: 'MCQs & Questions', icon: HelpCircle },
          { id: 'flashcards', label: 'Flashcard Deck', icon: Layers },
          { id: 'planner', label: 'Exam Study Planner', icon: Calendar }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-850'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Tutor Chat */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls sidebar */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tutor Configuration</h3>
            
            <div>
              <label className="block text-xs font-bold dark:text-slate-300 mb-1.5">Target Depth / Level</label>
              <select
                value={chatLevel}
                onChange={(e) => setChatLevel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold outline-none"
              >
                <option value="beginner">Beginner (Analogies & Intuition)</option>
                <option value="intermediate">Intermediate (Formulas & Definitions)</option>
                <option value="exam">Exam High-Yield (Edge cases & PYQs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold dark:text-slate-300 mb-1.5">Subject Context</label>
              <select
                value={chatContext}
                onChange={(e) => setChatContext(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold outline-none"
              >
                <option value="Data Structures">Data Structures & Algorithms</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="DBMS">Database Management Systems</option>
                <option value="Machine Learning">Machine Learning & Neural Nets</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="Mathematics">Engineering Mathematics</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/40 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Inquiries</span>
              {[
                'Explain AVL tree rotations with examples',
                'How does Virtual Memory Paging work?',
                'Differentiate BCNF vs 3NF',
                'Explain Dijkstra algorithm complexity'
              ].map((pill, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setChatMessage(pill); }}
                  className="block w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 hover:bg-sky-500/10 hover:text-sky-500 text-[11px] text-slate-500 transition-colors"
                >
                  &rarr; {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Workspace */}
          <div className="lg:col-span-3 glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 flex flex-col h-[600px] overflow-hidden">
            {/* Messages feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-200/50 dark:border-slate-800/50'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-500 dark:text-indigo-400 mb-1.5">
                        <Sparkles className="h-3 w-3" />
                        <span>NoteSphere Academic AI</span>
                      </div>
                    )}
                    <div 
                      className="prose prose-xs dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />') }} 
                    />
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 p-3">
                  <div className="h-4 w-4 border-2 border-slate-300 border-t-sky-500 rounded-full animate-spin" />
                  <span>Synthesizing syllabus explanation...</span>
                </div>
              )}
            </div>

            {/* Input bar */}
            <form onSubmit={handleSendChat} className="p-4 border-t border-slate-200/40 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/20 flex gap-2">
              <input
                type="text"
                placeholder="Ask any academic question, proof, algorithm derivation..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:border-sky-500 outline-none"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatMessage.trim()}
                className="h-11 px-5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-md"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Ask</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Smart Summarizer */}
      {activeTab === 'summarize' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold font-heading dark:text-white">Input Topic or Lecture Text</h3>
            <p className="text-xs text-slate-400">Paste your raw notes, chapter text, or provide a course module title to distill.</p>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Topic Title</label>
              <input
                type="text"
                value={summaryTopic}
                onChange={(e) => setSummaryTopic(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Optional Detailed Text (Up to 3,000 words)</label>
              <textarea
                rows="8"
                placeholder="Paste lecture notes or textbook excerpts..."
                value={summaryText}
                onChange={(e) => setSummaryText(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none"
              />
            </div>

            <button
              onClick={handleSummarize}
              disabled={summarizing}
              className="w-full py-3 rounded-xl premium-gradient text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>{summarizing ? 'Distilling Core Points...' : 'Generate Academic Summary'}</span>
            </button>
          </div>

          {/* Output */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 overflow-y-auto max-h-[600px] space-y-3">
            <h3 className="text-sm font-bold font-heading dark:text-white">Executive Academic Takeaways</h3>
            {summaryResult ? (
              <div 
                className="prose prose-xs dark:prose-invert max-w-none text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: summaryResult.replace(/\n/g, '<br />') }}
              />
            ) : (
              <div className="text-center py-20 text-slate-400 text-xs">
                <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>Click "Generate Academic Summary" to view executive bullet points and key formulas.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: MCQs & Exam Questions */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Topic / Subject</label>
              <input
                type="text"
                value={qTopic}
                onChange={(e) => setQTopic(e.target.value)}
                placeholder="e.g. Dynamic Programming or Operating Systems Paging"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setQMode('mcqs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${qMode === 'mcqs' ? 'bg-white dark:bg-slate-900 text-sky-500 shadow-sm' : 'text-slate-500'}`}
                >
                  MCQs Quiz
                </button>
                <button
                  type="button"
                  onClick={() => setQMode('exam')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${qMode === 'exam' ? 'bg-white dark:bg-slate-900 text-sky-500 shadow-sm' : 'text-slate-500'}`}
                >
                  2/5/10-Mark Questions
                </button>
              </div>

              <button
                onClick={handleGenerateQuestions}
                disabled={qLoading}
                className="py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>{qLoading ? 'Synthesizing...' : 'Generate Sets'}</span>
              </button>
            </div>
          </div>

          {/* Questions display */}
          {qMode === 'mcqs' && generatedMcqs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedMcqs.map((mcq, qIdx) => {
                const selected = selectedAnswers[qIdx];
                const isSubmitted = selected !== undefined;
                return (
                  <div key={qIdx} className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-sky-500 uppercase">Question {qIdx + 1} • {mcq.difficulty}</span>
                    </div>
                    <p className="text-xs font-bold dark:text-white leading-relaxed">{mcq.question}</p>

                    <div className="space-y-2">
                      {mcq.options.map((opt, oIdx) => {
                        const isChosen = selected === opt;
                        const isCorrect = opt === mcq.answer;
                        let btnStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850';
                        if (isSubmitted) {
                          if (isCorrect) btnStyle = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold';
                          else if (isChosen) btnStyle = 'border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400';
                        }
                        return (
                          <button
                            key={oIdx}
                            disabled={isSubmitted}
                            onClick={() => setSelectedAnswers(prev => ({ ...prev, [qIdx]: opt }))}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isSubmitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                          </button>
                        );
                      })}
                    </div>

                    {isSubmitted && (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/40 dark:border-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        <strong>Explanation:</strong> {mcq.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {qMode === 'exam' && generatedQuestions && (
            <div className="glass-panel p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900">
              <div 
                className="prose prose-xs dark:prose-invert max-w-none text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: generatedQuestions.replace(/\n/g, '<br />') }}
              />
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Flashcard Deck */}
      {activeTab === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={fcTopic}
              onChange={(e) => setFcTopic(e.target.value)}
              className="flex-1 h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none"
              placeholder="Topic for flashcards..."
            />
            <button
              onClick={handleGenerateFlashcards}
              disabled={fcLoading}
              className="h-10 px-4 rounded-xl premium-gradient text-white text-xs font-bold shadow-sm"
            >
              {fcLoading ? 'Generating...' : 'New Deck'}
            </button>
          </div>

          {/* Interactive Flashcard */}
          <div 
            onClick={() => setCardFlipped(!cardFlipped)}
            className="cursor-pointer h-72 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-xl p-8 flex flex-col justify-between text-center transition-all hover:border-sky-500/40 select-none relative overflow-hidden"
          >
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
              <span>CARD {currentCardIndex + 1} OF {flashcards.length}</span>
              <span className="text-sky-500 uppercase">Click anywhere to flip</span>
            </div>

            <div className="flex-1 flex items-center justify-center px-4">
              <p className={`text-base font-bold leading-snug ${cardFlipped ? 'text-indigo-600 dark:text-indigo-400 font-medium text-sm' : 'dark:text-white'}`}>
                {cardFlipped ? flashcards[currentCardIndex]?.back : flashcards[currentCardIndex]?.front}
              </p>
            </div>

            <div className="text-[10px] font-semibold text-slate-400">
              {cardFlipped ? 'Answer & Explanation' : 'Question Prompt'}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setCardFlipped(false);
                setCurrentCardIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => {
                setCardFlipped(false);
                setCurrentCardIndex(prev => (prev + 1) % flashcards.length);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold hover:scale-105 transition-transform"
            >
              <span>Next Card</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Exam Study Planner */}
      {activeTab === 'planner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold font-heading dark:text-white">Plan Configuration</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Subject</label>
              <input
                type="text"
                value={planSubject}
                onChange={(e) => setPlanSubject(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Days Remaining: {planDays} days</label>
              <input
                type="range"
                min="3"
                max="30"
                value={planDays}
                onChange={(e) => setPlanDays(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Study Hours / Day: {planHours} hrs</label>
              <input
                type="range"
                min="1"
                max="8"
                value={planHours}
                onChange={(e) => setPlanHours(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={planLoading}
              className="w-full py-3 rounded-xl premium-gradient text-white text-xs font-bold shadow-md shadow-sky-500/20"
            >
              {planLoading ? 'Computing Schedule...' : 'Build Custom Roadmap'}
            </button>
          </div>

          {/* Schedule roadmap */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold font-heading dark:text-white">
              {studyPlan ? `${studyPlan.subject} Study Roadmap (${studyPlan.totalHours} Total Hours)` : 'Personalized Exam Timeline'}
            </h3>

            {studyPlan ? (
              <div className="space-y-4">
                {studyPlan.schedule.map((phase, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/40 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-sky-500 uppercase">{phase.phase}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{phase.days} • {phase.dailyHours}</span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-4 list-disc">
                      {phase.goals.map((g, gIdx) => (
                        <li key={gIdx}>{g}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-12 text-center">
                Configure your available study timeline on the left and click "Build Custom Roadmap".
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AiAssistantPage;
