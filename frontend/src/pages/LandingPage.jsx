import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, UploadCloud, Search, Download, ShieldCheck, Star, 
  ArrowRight, Users, MessageSquare, Award, Landmark, Flame 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { testimonials } from '../data/mockData';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/signup');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden font-sans">
      {/* Sticky Premium Navbar */}
      <nav className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/30 dark:border-slate-800/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-lg">
            N
          </div>
          <span className="font-heading text-lg font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">NoteSphere</span>
        </div>

        {/* Mid Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-sky-500 transition-colors">Features</a>
          <a href="#subjects" className="hover:text-sky-500 transition-colors">Subjects</a>
          <a href="#testimonials" className="hover:text-sky-500 transition-colors">Testimonials</a>
          <a href="#stats" className="hover:text-sky-500 transition-colors">Impact</a>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-sky-500 transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="rounded-xl premium-gradient text-white text-xs font-bold px-4 py-2.5 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-105 transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-sky-500/10 dark:bg-sky-500/5 blur-3xl -z-10" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl -z-10" />

        {/* Left Copywrite */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 px-3.5 py-1 text-xs font-bold mb-6 border border-sky-500/20">
            <Flame className="h-3.5 w-3.5 fill-sky-500" />
            <span>Premium Student Workspace Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight leading-[1.1] mb-6 dark:text-white">
            The ultimate academic <br />
            <span className="reveal-text">knowledge sharing</span> hub.
          </h1>

          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
            Access, download, and review curated study resources, lab manuals, and video lectures. Study together online or offline in a beautifully organized workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button 
              onClick={handleStart}
              className="flex items-center gap-2 w-full sm:w-auto justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-sm font-bold px-6 py-4 hover:scale-[1.03] transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 w-full sm:w-auto justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-sm font-bold px-6 py-4 text-slate-700 dark:text-slate-300 transition-all"
            >
              <span>Browse Notes</span>
            </button>
          </div>
        </motion.div>

        {/* Right Illustration Panels */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 w-full max-w-md relative"
        >
          {/* Glass Card 1 */}
          <div className="glass-card p-6 shadow-2xl relative z-10 hover:-translate-y-2 transition-transform duration-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">DS</div>
              <div>
                <h3 className="text-sm font-bold dark:text-white">Data Structures Quick Sheets</h3>
                <p className="text-xs text-slate-400">By Aarav Sharma • Semester 3</p>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="h-2 w-full rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-2 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-2 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200/20">
              <span className="text-xs text-slate-400">Rating: ⭐ 4.9 (1.4K downloads)</span>
              <span className="text-xs font-semibold text-sky-500">View PDF</span>
            </div>
          </div>

          {/* Floating Academic Icons */}
          <div className="absolute -top-10 -left-10 h-16 w-16 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center floating-icon border border-slate-200/30 dark:border-slate-800/30">
            <BookOpen className="h-7 w-7 text-indigo-500" />
          </div>
          <div className="absolute -bottom-6 -right-6 h-16 w-16 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center floating-icon-delayed border border-slate-200/30 dark:border-slate-800/30">
            <UploadCloud className="h-7 w-7 text-sky-500" />
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-100/50 dark:bg-slate-950/40 border-y border-slate-200/30 dark:border-slate-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-heading mb-4 dark:text-white">Designed for high-impact studying</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Everything you need to compile exam preparation guides, browse lectures, and exchange resources with peers.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { title: "Smart Resources search", desc: "Instantly filter study resources by Degree, Branch, Semester, and Subject options.", icon: Search, color: "text-sky-500 bg-sky-500/10" },
              { title: "Offline Library cache", desc: "Download materials to your personal local workspace and access them anytime, completely offline.", icon: Download, color: "text-emerald-500 bg-emerald-500/10" },
              { title: "Video Lecture guides", desc: "Watch integrated educational videos linked directly to note cheat sheets and syllabi.", icon: BookOpen, color: "text-indigo-500 bg-indigo-500/10" },
              { title: "Student Collaboration", desc: "Post study questions, write replies, upvote explanations, and join subject-wise communities.", icon: Users, color: "text-violet-500 bg-violet-500/10" }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="glass-card p-6 bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40"
                >
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-5 ${f.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold mb-2 dark:text-white">{f.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{f.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Trending Subjects Grid */}
      <section id="subjects" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-heading mb-4 dark:text-white">Popular Subject Collections</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Discover and browse verified course contents across primary academic categories.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Computer Science", docs: "4,200+ docs", icon: BookOpen },
            { name: "Data Science & AI", docs: "1,800+ docs", icon: Award },
            { name: "Electronics", docs: "950+ docs", icon: Landmark },
            { name: "Commerce", docs: "1,100+ docs", icon: Users },
            { name: "Civil & Mech", docs: "680+ docs", icon: BookOpen },
            { name: "Competitive (GATE)", docs: "1,500+ docs", icon: Star }
          ].map((subj, i) => {
            const Icon = subj.icon;
            return (
              <div 
                key={i}
                onClick={() => navigate('/login')}
                className="glass-card p-5 text-center cursor-pointer hover:border-sky-500/50 hover:shadow-sky-500/5 transition-all"
              >
                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-5 w-5 text-indigo-500" />
                </div>
                <h4 className="text-xs font-bold dark:text-white truncate">{subj.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{subj.docs}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-100/50 dark:bg-slate-950/40 border-y border-slate-200/30 dark:border-slate-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-heading mb-4 dark:text-white">Loved by Student Circles</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">See how students from NITs, IITs, and global universities manage their files with NoteSphere.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card p-6 bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40">
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs leading-relaxed italic text-slate-600 dark:text-slate-300 mb-6">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.student} className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <h5 className="text-xs font-bold dark:text-white">{t.student}</h5>
                    <p className="text-[10px] text-slate-400">{t.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Board Section */}
      <section id="stats" className="py-20 max-w-7xl mx-auto px-6 text-center">
        <div className="rounded-3xl premium-gradient p-10 md:p-16 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          
          <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-4">Grow NoteSphere with your college circle</h2>
          <p className="text-sm text-white/80 max-w-md mx-auto mb-10">Upload your handwritten class reviews, assignments, or cheat sheets today and earn badges.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { val: "25,000+", label: "Verified Study Notes" },
              { val: "8,500+", label: "E-books & Solutions" },
              { val: "50+", label: "Engineering Disciplines" },
              { val: "15K+", label: "Daily Active Students" }
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
                <p className="text-2xl sm:text-3xl font-extrabold">{stat.val}</p>
                <p className="text-[10px] text-white/70 font-semibold tracking-wider uppercase mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">N</div>
            <span className="font-heading font-bold text-base dark:text-white">NoteSphere</span>
          </div>
          <p className="text-xs text-slate-400">© 2026 NoteSphere. Made with pair-programming coding. Built for students.</p>
          <div className="flex gap-6 text-xs font-semibold text-slate-400">
            <a href="#" className="hover:text-sky-500">Privacy Policy</a>
            <a href="#" className="hover:text-sky-500">Terms of Service</a>
            <a href="#" className="hover:text-sky-500">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
