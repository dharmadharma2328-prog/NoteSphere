import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { useApp } from '../context/AppContext';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts } = useApp();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Navigation Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <TopNav toggleSidebar={toggleSidebar} />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 no-scrollbar bg-slate-50/50 dark:bg-slate-950/20">
          <Outlet />
        </main>
      </div>

      {/* App Toasts Notification Overlay */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className={`flex items-start gap-3 rounded-2xl p-4 shadow-xl border backdrop-blur-md pointer-events-auto ${
                toast.type === 'success' ? 'bg-emerald-500/10 dark:bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300' :
                toast.type === 'warning' ? 'bg-amber-500/10 dark:bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300' :
                'bg-slate-900/90 dark:bg-slate-850 border-slate-700 text-white'
              }`}
            >
              {toast.type === 'success' && <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />}
              {toast.type === 'warning' && <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />}
              {toast.type === 'info' && <Info className="h-5 w-5 shrink-0 text-sky-500" />}
              
              <div className="flex-1">
                <p className="text-xs font-semibold leading-relaxed">{toast.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default MainLayout;
