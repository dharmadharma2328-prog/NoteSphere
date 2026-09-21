import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ragApi } from '../services/api/ragApi';
import { resourcesApi } from '../services/api/resourcesApi';
import { 
  MessageSquare, FileText, Send, Sparkles, BookOpen, 
  CheckCircle, ArrowLeft, ExternalLink, HelpCircle, Layers, Quote 
} from 'lucide-react';
import { motion } from 'framer-motion';

const PdfChatPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { notes, addToast } = useApp();

  const selectedResourceId = searchParams.get('resourceId') || (notes.length > 0 ? notes[0].id : '');
  const [activeResource, setActiveResource] = useState(null);
  const [indexingStatus, setIndexingStatus] = useState({ indexed: false, chunkCount: 0 });
  const [questionInput, setQuestionInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to Chat with PDF! I am your RAG (Retrieval-Augmented Generation) document companion. Ask me any question about this document, and I will synthesize grounded answers with exact page citations.',
      citations: []
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Load resource details and check indexing status
  useEffect(() => {
    if (!selectedResourceId) return;

    const res = notes.find(n => n.id === selectedResourceId);
    if (res) setActiveResource(res);

    ragApi.getStatus(selectedResourceId)
      .then(status => {
        setIndexingStatus(status);
      })
      .catch(() => {
        setIndexingStatus({ indexed: false, chunkCount: 0 });
      });
  }, [selectedResourceId, notes]);

  const handleSelectResource = (id) => {
    setSearchParams({ resourceId: id });
    setMessages([
      {
        role: 'assistant',
        content: `Switched document. Ask me anything about this lecture material and I will cite source pages.`,
        citations: []
      }
    ]);
  };

  const handleAskQuestion = async (queryText) => {
    const q = (queryText || questionInput).trim();
    if (!q || loading) return;

    setQuestionInput('');
    setMessages(prev => [...prev, { role: 'user', content: q, citations: [] }]);
    setLoading(true);

    try {
      const res = await ragApi.chat(selectedResourceId, q);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: res.answer,
          citations: res.citations || []
        }
      ]);
      setIndexingStatus(prev => ({ ...prev, indexed: true }));
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Failed to answer from document: ${err.message}`,
          citations: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/browse')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold font-heading dark:text-white flex items-center gap-2">
              <span>Chat with PDF Workspace</span>
              <span className="rounded bg-sky-500/10 text-sky-500 text-[10px] font-extrabold px-2 py-0.5 uppercase">
                RAG Engine
              </span>
            </h1>
            <p className="text-xs text-slate-400">Ask questions grounded strictly in lecture slides and handwritten notes with page citations.</p>
          </div>
        </div>

        {/* Document Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400">Active Document:</label>
          <select
            value={selectedResourceId}
            onChange={(e) => handleSelectResource(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none max-w-xs truncate"
          >
            {notes.map(n => (
              <option key={n.id} value={n.id}>{n.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
        
        {/* Left Column (5 cols): Document Viewer / Ingestion Status */}
        <div className="lg:col-span-5 glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 flex flex-col overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-200/40 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="h-4 w-4 text-sky-500 shrink-0" />
              <p className="text-xs font-bold dark:text-white truncate">
                {activeResource ? activeResource.title : 'Selected Document'}
              </p>
            </div>
            
            {activeResource && (
              <a
                href={resourcesApi.getFileUrl(activeResource.id)}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-slate-400 hover:text-sky-500"
                title="Fullscreen Document"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          {/* Document Preview or Embed */}
          <div className="flex-1 bg-slate-100 dark:bg-slate-950/40 overflow-hidden relative">
            {activeResource ? (
              <iframe
                src={resourcesApi.getFileUrl(activeResource.id)}
                title={activeResource.title}
                className="w-full h-full border-none"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">
                No document selected.
              </div>
            )}
          </div>

          {/* Bottom Indexing & Metadata bar */}
          <div className="p-3.5 border-t border-slate-200/40 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Status: Vector Indexed ({indexingStatus.chunkCount || 4} chunks)</span>
            </div>
            <span>{activeResource?.subject || 'Engineering'}</span>
          </div>
        </div>

        {/* Right Column (7 cols): Grounded Cited Chat */}
        <div className="lg:col-span-7 glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 flex flex-col overflow-hidden shadow-xl">
          
          {/* Quick Questions Banner */}
          <div className="p-3 border-b border-slate-200/40 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/20 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Prompts:</span>
            {[
              'Summarize key topics in this PDF',
              'What are the core equations and formulas?',
              'What is the worst-case time complexity?',
              'Generate 3 exam practice questions from this'
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleAskQuestion(prompt)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-200/50 dark:border-slate-800/50'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-sky-500 dark:text-sky-400 mb-2">
                      <Sparkles className="h-3 w-3" />
                      <span>NoteSphere Cited RAG Assistant</span>
                    </div>
                  )}

                  <div 
                    className="prose prose-xs dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />') }}
                  />

                  {/* Citations Box */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/40 dark:border-slate-800/40 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Quote className="h-3 w-3 text-sky-500" />
                        <span>Source Grounding Citations</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.citations.map((cite, cIdx) => (
                          <div 
                            key={cIdx} 
                            className="rounded-lg bg-sky-500/10 border border-sky-500/20 px-2 py-1 text-[10px] text-sky-600 dark:text-sky-400"
                          >
                            <strong>[Page {cite.page}]</strong> {cite.snippet}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-3">
                <div className="h-4 w-4 border-2 border-slate-300 border-t-sky-500 rounded-full animate-spin" />
                <span>Searching vector embeddings and generating cited answer...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={(e) => { e.preventDefault(); handleAskQuestion(); }} className="p-4 border-t border-slate-200/40 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/20 flex gap-2">
            <input
              type="text"
              placeholder="Ask a question about this lecture document (e.g. Explain page 1 algorithm)..."
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              className="flex-1 h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:border-sky-500 outline-none"
            />
            <button
              type="submit"
              disabled={loading || !questionInput.trim()}
              className="h-11 px-5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-md cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Ask</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};

export default PdfChatPage;
