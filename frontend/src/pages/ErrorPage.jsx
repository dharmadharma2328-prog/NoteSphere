import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12 font-sans text-slate-800 dark:text-slate-100 text-center">
      
      {/* Glow Backdrop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-red-500/10 dark:bg-red-500/5 blur-3xl -z-10" />

      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl space-y-6">
        <div className="h-16 w-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <ShieldAlert className="h-9 w-9" />
        </div>

        <div>
          <h1 className="text-4xl font-black font-heading dark:text-white tracking-wider">404</h1>
          <h2 className="text-base font-bold dark:text-white mt-2">Workspace Page Not Found</h2>
          <p className="text-xs text-slate-450 leading-relaxed mt-2 max-w-xs mx-auto">
            The path you are looking for does not exist or has been archived. Check spelling or return back to the workspace.
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl font-bold text-xs hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

    </div>
  );
};

export default ErrorPage;
