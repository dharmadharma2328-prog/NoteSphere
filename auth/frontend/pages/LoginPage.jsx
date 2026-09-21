import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../../frontend/src/context/AppContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const { loginUser, addToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all credentials.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      addToast(`Welcome back, ${res.user.name}!`, 'success');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
    addToast(`Loaded ${demoRole} demo credentials. Click "Sign In" to proceed.`, 'info');
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">

      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >

          {/* Logo */}
          <div
            className="flex items-center gap-2 mb-8 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-lg">
              N
            </div>

            <span className="font-heading text-xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              NoteSphere
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold font-heading mb-2 dark:text-white">
            Welcome back
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Enter your credentials to access study resources and collaborative workspaces.
          </p>

          {/* Quick Demo Switcher Panel */}
          <div className="mb-6 p-3.5 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20">
            <p className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-2">
              ⚡ Quick Demo Roles
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillQuickDemo('student@notesphere.edu', 'Student')}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 transition-all text-slate-700 dark:text-slate-200 shadow-sm"
              >
                <GraduationCap className="h-3.5 w-3.5 text-sky-500" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('faculty@notesphere.edu', 'Faculty')}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all text-slate-700 dark:text-slate-200 shadow-sm"
              >
                <UserCheck className="h-3.5 w-3.5 text-indigo-500" />
                <span>Faculty</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('admin@notesphere.edu', 'Admin')}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all text-slate-700 dark:text-slate-200 shadow-sm"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-purple-500" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3.5 text-xs font-semibold mb-6">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />

                <input
                  type="email"
                  placeholder="name@notesphere.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 pl-11 pr-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 outline-none transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs font-semibold pt-1">
              <label className="flex items-center gap-2 text-slate-500 hover:text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-sky-500 focus:ring-sky-500/25"
                />
                <span>Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sky-500 hover:text-sky-600"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm hover:scale-[1.01] transition-transform flex items-center justify-center cursor-pointer shadow-lg shadow-sky-500/10"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-slate-300 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign up prompt */}
          <p className="text-center text-xs text-slate-400 mt-8">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-bold text-sky-500 hover:underline">
              Create an account
            </Link>
          </p>

        </motion.div>
      </div>

      {/* Right Side - Visual Banner */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-700 p-12 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]" />
        
        <div className="max-w-md text-white relative z-10 space-y-6">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            NoteSphere 2.0
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading leading-tight">
            Academic resource intelligence & collaborative study.
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            Discover peer-reviewed notes, practice timed exam mock tests, chat directly with lecture PDFs, and learn with grounded AI study assistance.
          </p>

          <div className="pt-6 border-t border-white/20 grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-black">10,000+</p>
              <p className="text-xs text-white/70">Verified Notes & PYQs</p>
            </div>
            <div>
              <p className="text-2xl font-black">AI Grounded</p>
              <p className="text-xs text-white/70">With Page Citations</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;