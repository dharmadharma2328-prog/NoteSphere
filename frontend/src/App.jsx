import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import MainLayout from './layouts/MainLayout';

// Pages Import
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('../../auth/frontend/pages/LoginPage'));
const SignupPage = lazy(() => import('../../auth/frontend/pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('../../auth/frontend/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../../auth/frontend/pages/ResetPasswordPage'));
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const BrowseNotes = lazy(() => import('./pages/BrowseNotes'));
const ResourceDetailPage = lazy(() => import('./pages/ResourceDetailPage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));
const AiAssistantPage = lazy(() => import('./pages/AiAssistantPage'));
const PdfChatPage = lazy(() => import('./pages/PdfChatPage'));
const ExamsPage = lazy(() => import('./pages/ExamsPage'));
const PracticeTestPage = lazy(() => import('./pages/PracticeTestPage'));
const TestRunnerPage = lazy(() => import('./pages/TestRunnerPage'));
const TestResultsPage = lazy(() => import('./pages/TestResultsPage'));
const OfflineLibrary = lazy(() => import('./pages/OfflineLibrary'));
const VideoLectures = lazy(() => import('./pages/VideoLectures'));
const StudyGroups = lazy(() => import('./pages/StudyGroups'));
const DiscussionForum = lazy(() => import('./pages/DiscussionForum'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));

// Route guards
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useApp();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  return (
    <Router>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-400 dark:bg-slate-950">Loading NoteSphere...</div>}>
        <Routes>
        {/* Public & Auth routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Dashboard layouts */}
        <Route 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/browse" element={<BrowseNotes />} />
          <Route path="/resources/:id" element={<ResourceDetailPage />} />
          <Route path="/upload" element={<UploadPage />} />
          
          {/* AI & RAG routes */}
          <Route path="/ai-assistant" element={<AiAssistantPage />} />
          <Route path="/pdf-chat" element={<PdfChatPage />} />

          {/* Exam & Mock Tests routes */}
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/exams/practice" element={<PracticeTestPage />} />
          <Route path="/exams/test/:id" element={<TestRunnerPage />} />
          <Route path="/exams/results/:attemptId" element={<TestResultsPage />} />

          <Route path="/downloads" element={<OfflineLibrary />} />
          
          {/* Reuse browse notes page with search params for saved/trending/recommendations */}
          <Route path="/saved" element={<BrowseNotes />} />
          <Route path="/trending" element={<BrowseNotes />} />
          <Route path="/recommendations" element={<BrowseNotes />} />
          
          <Route path="/videos" element={<VideoLectures />} />
          <Route path="/groups" element={<StudyGroups />} />
          <Route path="/forum" element={<DiscussionForum />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* Fallback error */}
        <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
