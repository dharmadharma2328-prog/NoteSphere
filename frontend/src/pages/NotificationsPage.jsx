import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, ShieldCheck, Trash2, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const NotificationsPage = () => {
  const { notifications, markAllNotificationsRead, clearNotifications } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading dark:text-white">Notification Center</h1>
          <p className="text-xs text-slate-400 mt-1">Stay updated with downloads, uploads, community alerts, and offline sync reminders.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={markAllNotificationsRead}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
          >
            Mark all read
          </button>
          <button
            onClick={clearNotifications}
            className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-300 text-xs font-bold px-4 py-3 hover:bg-red-500/20 transition-colors"
          >
            Clear notifications
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-6 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold dark:text-white">Notification Highlights</h2>
              <p className="text-[10px] text-slate-400 mt-1">Get a quick view of your most recent activity and alerts.</p>
            </div>
          </div>
          <div className="space-y-3 text-xs text-slate-500 dark:text-slate-400">
            <p className="leading-relaxed">• Keep track of downloaded lectures, trending uploads, and group reminders.</p>
            <p className="leading-relaxed">• Notifications are grouped by type and updated in real-time with your dashboard actions.</p>
            <p className="leading-relaxed">• Use this page to manage all alerts from NoteSphere in one place.</p>
          </div>
        </div>

        <div className="glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-6 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-indigo-500" />
            <h2 className="text-sm font-bold dark:text-white">Notification stats</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/40 p-4">
              <p className="text-slate-400 uppercase tracking-wide">Total alerts</p>
              <p className="mt-3 text-2xl font-bold dark:text-white">{notifications.length}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/40 p-4">
              <p className="text-slate-400 uppercase tracking-wide">Unread</p>
              <p className="mt-3 text-2xl font-bold dark:text-white">{notifications.filter(item => !item.read).length}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-6 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            <h2 className="text-sm font-bold dark:text-white">Action board</h2>
          </div>
          <div className="space-y-3 text-xs text-slate-500 dark:text-slate-400">
            <p>• Record recent downloads and sync statuses for offline reading.</p>
            <p>• Notice new uploads from your branch or recommended topics.</p>
            <p>• Review group updates and study session reminders before you jump back into work.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/30 dark:border-slate-800/30">
          <div>
            <h2 className="text-base font-bold dark:text-white">All Notifications</h2>
            <p className="text-[10px] text-slate-400 mt-1">Swipe through your latest resource and study group alerts.</p>
          </div>
        </div>

        <div className="divide-y divide-slate-200/30 dark:divide-slate-800/30">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-4 px-6 py-5 ${notification.read ? 'bg-transparent' : 'bg-slate-50 dark:bg-slate-950/40'}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold dark:text-white">{notification.title}</h3>
                    <span className="text-[10px] uppercase font-bold text-slate-400">{notification.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{notification.message}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              No notifications available. Your recent activity and updates will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
