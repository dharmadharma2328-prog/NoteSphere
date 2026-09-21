import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../../frontend/src/context/AppContext';
import { authApi } from '../authApi';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { addToast } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please provide your registered email address.');
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
      addToast('Password reset link generated.', 'success');
    } catch (err) {
      setError(err.message || 'Unable to process request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-xl"
      >
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-sky-500 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Sign In</span>
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500 mb-4 font-bold text-xl">
          N
        </div>

        <h2 className="text-2xl font-bold font-heading dark:text-white mb-2">Reset your password</h2>
        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          Enter the email associated with your NoteSphere student or faculty account to receive instructions.
        </p>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3.5 text-xs font-semibold mb-4">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 text-emerald-800 dark:text-emerald-300 text-center space-y-3">
            <CheckCircle className="h-8 w-8 mx-auto text-emerald-500" />
            <h3 className="text-sm font-bold">Reset Instructions Dispatched</h3>
            <p className="text-xs opacity-90 leading-relaxed">
              If an account with <strong>{email}</strong> exists, instructions to choose a new password have been provided.
            </p>
            <Link 
              to="/reset-password"
              className="inline-block mt-2 text-xs font-bold text-sky-500 hover:underline"
            >
              Have a code? Proceed to Reset Password &rarr;
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="student@notesphere.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 outline-none"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm hover:scale-[1.01] transition-transform flex items-center justify-center cursor-pointer shadow-lg shadow-sky-500/10"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-slate-300 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin" />
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
