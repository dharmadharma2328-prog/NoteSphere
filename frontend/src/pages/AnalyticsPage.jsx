import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, Pause, RotateCcw, Clock, Coffee, ShieldCheck, 
  BarChart2, TrendingUp, PieChart as PieIcon, Flame, Brain 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend 
} from 'recharts';

const AnalyticsPage = () => {
  const { pomodoro, setPomodoro, addToast } = useApp();

  // Selected Pomodoro mode handlers
  const handleSetMode = (mode, duration) => {
    setPomodoro(prev => ({
      ...prev,
      mode,
      timeRemaining: duration * 60,
      isRunning: false
    }));
    addToast(`Timer set to ${mode} mode (${duration} mins).`, 'info');
  };

  const handleToggleTimer = () => {
    setPomodoro(prev => ({
      ...prev,
      isRunning: !prev.isRunning
    }));
  };

  const handleResetTimer = () => {
    const defaultTime = pomodoro.mode === 'work' ? 25 * 60 : 5 * 60;
    setPomodoro(prev => ({
      ...prev,
      timeRemaining: defaultTime,
      isRunning: false
    }));
    addToast('Timer reset completed.', 'info');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Recharts Chart Mock Data
  const weeklyStudyData = [
    { day: 'Mon', hours: 4.5 },
    { day: 'Tue', hours: 6.0 },
    { day: 'Wed', hours: 3.5 },
    { day: 'Thu', hours: 5.0 },
    { day: 'Fri: focus', hours: 5.5 },
    { day: 'Sat', hours: 2.0 },
    { day: 'Sun', hours: 3.0 }
  ];

  const uploadDownloadTrend = [
    { week: 'W1', uploads: 1, downloads: 3 },
    { week: 'W2', uploads: 0, downloads: 6 },
    { week: 'W3', uploads: 2, downloads: 5 },
    { week: 'W4', uploads: 1, downloads: 12 },
    { week: 'W5', uploads: 3, downloads: 18 }
  ];

  const subjectDistribution = [
    { name: 'Computer Science', value: 45, color: '#0ea5e9' },
    { name: 'Mathematics', value: 20, color: '#6366f1' },
    { name: 'AI & ML', value: 15, color: '#a855f7' },
    { name: 'Chemistry', value: 10, color: '#f59e0b' },
    { name: 'Others', value: 10, color: '#10b981' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading dark:text-white">Study Analytics & Timer</h1>
        <p className="text-xs text-slate-400 mt-1">Track focus cycles, view study progression, and review category metrics.</p>
      </div>

      {/* Analytics Main Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Pomodoro study widget */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 text-center flex flex-col justify-between h-[360px]">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4.5 w-4.5 text-sky-500" />
              <h3 className="font-heading font-bold text-xs dark:text-white">Pomodoro study Timer</h3>
            </div>
            
            <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Flame className="h-3 w-3 fill-amber-500" />
              <span>Cycle {pomodoro.cyclesCompleted}</span>
            </span>
          </div>

          {/* Time digits display */}
          <div className="my-6">
            <span className="text-5xl sm:text-6xl font-extrabold font-mono dark:text-white tracking-wider">
              {formatTime(pomodoro.timeRemaining)}
            </span>
            <p className="text-[10px] text-slate-450 uppercase tracking-widest mt-2">
              {pomodoro.mode === 'work' ? '🎯 Focus Session' : '☕ Break Interval'}
            </p>
          </div>

          {/* Mode Toggles */}
          <div className="flex justify-center gap-2">
            <button 
              onClick={() => handleSetMode('work', 25)}
              className={`rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all ${
                pomodoro.mode === 'work' 
                  ? 'bg-sky-500 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-350'
              }`}
            >
              Focus (25m)
            </button>
            <button 
              onClick={() => handleSetMode('shortBreak', 5)}
              className={`rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all ${
                pomodoro.mode === 'shortBreak' 
                  ? 'bg-sky-500 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-350'
              }`}
            >
              Break (5m)
            </button>
          </div>

          {/* Controls bar */}
          <div className="flex justify-center gap-4 border-t border-slate-200/20 pt-4 mt-2">
            <button 
              onClick={handleResetTimer}
              className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"
              title="Reset Timer"
            >
              <RotateCcw className="h-4.5 w-4.5" />
            </button>
            <button 
              onClick={handleToggleTimer}
              className="rounded-full premium-gradient text-white p-3 hover:scale-105 transition-all shadow-md shadow-indigo-500/10"
            >
              {pomodoro.isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
            </button>
          </div>

        </div>

        {/* Right Side: Subject categories Breakdown */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 flex flex-col justify-between h-[360px] text-left">
          
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="h-4.5 w-4.5 text-indigo-500" />
            <h3 className="font-heading font-bold text-xs dark:text-white">Subject study distribution</h3>
          </div>

          {/* Recharts Pie Chart container */}
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="w-full sm:w-1/2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectDistribution}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {subjectDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '10px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legends list */}
            <div className="w-full sm:w-1/2 space-y-2">
              {subjectDistribution.map((entry, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                    <span className="font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{entry.name}</span>
                  </div>
                  <span className="font-bold dark:text-white">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Grid of Progression charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Weekly hours chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 text-left h-[340px] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="h-4.5 w-4.5 text-sky-500" />
            <h3 className="font-heading font-bold text-xs dark:text-white">Weekly Focus Time (hours)</h3>
          </div>

          <div className="flex-1 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyStudyData}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(14,165,233,0.05)' }} contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '10px', color: '#fff' }} />
                <Bar dataKey="hours" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Uploads vs Downloads Line Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 text-left h-[340px] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4.5 w-4.5 text-indigo-500" />
            <h3 className="font-heading font-bold text-xs dark:text-white">Uploads vs Downloads Trend</h3>
          </div>

          <div className="flex-1 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={uploadDownloadTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '10px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="uploads" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="downloads" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsPage;
