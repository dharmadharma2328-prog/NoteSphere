import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Home, Search, UploadCloud, Download, Bookmark, TrendingUp, Sparkles, 
  Video, Users, MessageSquare, BarChart2, Bell, User, 
  Settings, LogOut, X, Flame, BrainCircuit, GraduationCap, FileText, Shield
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logoutUser } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Browse Notes', path: '/browse', icon: Search },
    { name: 'Upload Material', path: '/upload', icon: UploadCloud },
    { name: 'AI Study Assistant', path: '/ai-assistant', icon: BrainCircuit, badge: 'AI' },
    { name: 'Chat with PDF', path: '/pdf-chat', icon: FileText, badge: 'RAG' },
    { name: 'Exam & Practice', path: '/exams', icon: GraduationCap },
    { name: 'Offline Library', path: '/downloads', icon: Download },
    { name: 'Saved Materials', path: '/saved', icon: Bookmark },
    { name: 'Trending', path: '/trending', icon: TrendingUp },
    { name: 'Recommendations', path: '/recommendations', icon: Sparkles },
    { name: 'Video Lectures', path: '/videos', icon: Video },
    { name: 'Study Groups', path: '/groups', icon: Users },
    { name: 'Discussion Forum', path: '/forum', icon: MessageSquare },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Analytics & Timer', path: '/analytics', icon: BarChart2 },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
    ...(user.role === 'Admin' ? [{ name: 'Admin Moderation', path: '/admin', icon: Shield }] : []),
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col glass-panel border-r border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/95 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-200/30 dark:border-slate-800/30">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-lg shadow-sky-500/20 text-white font-bold text-xl">
              N
            </div>
            <div>
              <span className="font-heading text-lg font-bold bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">NoteSphere</span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                {user.role || 'Student'} Portal
              </span>
            </div>
          </div>
          <button 
            onClick={toggleSidebar}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500/10 to-indigo-500/10 text-sky-600 dark:text-sky-400 border-l-4 border-sky-500 pl-3'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4.5 w-4.5 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-sky-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      }`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded bg-sky-500/10 text-sky-500 text-[9px] font-extrabold px-1.5 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Profile Section */}
        <div className="border-t border-slate-200/30 dark:border-slate-800/30 p-4 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img 
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                alt={user.name} 
                className="h-10 w-10 rounded-full border border-sky-500/30 object-cover"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate dark:text-white">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.role} • {user.branch || user.degree}</p>
              </div>
            </div>
            
            {/* Streak Counter */}
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 rounded-full px-2 py-0.5 text-xs font-semibold border border-amber-500/20">
              <Flame className="h-3.5 w-3.5 fill-amber-500" />
              <span>{user.streak || 1}d</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200/40 dark:border-red-950/40 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-2 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
