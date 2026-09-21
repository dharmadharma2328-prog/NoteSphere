import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  initialNotes, 
  initialVideos, 
  initialDiscussions, 
  initialGroups, 
  badges, 
  defaultUserProfile 
} from '../data/mockData';
import { authApi } from '../../../auth/frontend/authApi';
import { resourcesApi } from '../services/api/resourcesApi';
import { communityApi } from '../services/api/communityApi';
import { notificationsApi } from '../services/api/notificationsApi';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark'; // Dark mode default
  });

  // User State
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('notesphere_user');
    return cached ? JSON.parse(cached) : defaultUserProfile;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('notesphere_token');
  });

  // DB States
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('ns_notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });
  
  const [videos, setVideos] = useState(initialVideos);
  
  const [discussions, setDiscussions] = useState(() => {
    const saved = localStorage.getItem('ns_discussions');
    return saved ? JSON.parse(saved) : initialDiscussions;
  });
  
  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem('ns_groups');
    return saved ? JSON.parse(saved) : initialGroups;
  });

  // User Action States
  const [downloadedIds, setDownloadedIds] = useState(() => {
    const saved = localStorage.getItem('ns_downloads');
    return saved ? JSON.parse(saved) : ['note-1', 'note-2', 'note-4'];
  });

  const [savedIds, setSavedIds] = useState(() => {
    const saved = localStorage.getItem('ns_saved');
    return saved ? JSON.parse(saved) : ['note-1', 'note-3'];
  });

  // Notifications Queue
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'Download Complete', message: '"DSA Complete Guide" is now available offline.', type: 'download', read: false, date: '10 mins ago' },
    { id: 'notif-2', title: 'New Upload in AI & ML', message: 'Prof. Roy uploaded "Intro to Neural Networks".', type: 'upload', read: false, date: '1 hour ago' },
    { id: 'notif-3', title: 'Study Session Reminder', message: 'ML & AI Research Circle meeting starts in 30 mins.', type: 'group', read: true, date: '2 hours ago' }
  ]);

  // Toast System
  const [toasts, setToasts] = useState([]);

  // Pomodoro Widget State
  const [pomodoro, setPomodoro] = useState({
    timeRemaining: 25 * 60,
    isRunning: false,
    mode: 'work', // work | shortBreak | longBreak
    cyclesCompleted: 1
  });

  // Search Auto-suggestions
  const [recentSearches, setRecentSearches] = useState([
    "DSA Trees guide", "OS paging", "SQL joins sheet", "UPSC current affairs"
  ]);

  // Sync state for Service Worker Simulation & Offline
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [syncPending, setSyncPending] = useState(false);

  // Toast Helpers
  const addToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Notification Helpers
  const addNotification = ({ title, message, type }) => {
    const id = `notif-${Date.now()}`;
    const newNotif = { id, title, message, type, read: false, date: 'Just now' };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await notificationsApi.markAllRead();
    } catch (err) {
      console.warn('Notification read state sync failed:', err.message);
    }
  };

  const clearNotifications = async () => {
    setNotifications([]);
    try {
      await notificationsApi.clear();
    } catch (err) {
      console.warn('Notification clear sync failed:', err.message);
    }
  };

  // Sync theme to body element
  useEffect(() => {
    const root = window.document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Cache user and lists in localStorage
  useEffect(() => {
    localStorage.setItem('notesphere_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ns_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('ns_discussions', JSON.stringify(discussions));
  }, [discussions]);

  useEffect(() => {
    localStorage.setItem('ns_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('ns_downloads', JSON.stringify(downloadedIds));
  }, [downloadedIds]);

  useEffect(() => {
    localStorage.setItem('ns_saved', JSON.stringify(savedIds));
  }, [savedIds]);

  // Fetch Resources from Backend API
  const refreshResources = useCallback(async () => {
    try {
      const data = await resourcesApi.getAll();
      if (data && Array.isArray(data.resources)) {
        setNotes(data.resources);
        setSavedIds(data.resources.filter(resource => resource.isBookmarked).map(resource => resource.id));
        setDownloadedIds(data.resources.filter(resource => resource.isDownloaded).map(resource => resource.id));
      }
    } catch (err) {
      console.warn('Could not fetch resources from backend, using cached state:', err.message);
    }
  }, []);

  const refreshCommunity = useCallback(async () => {
    try {
      const [groupsResponse, discussionsResponse] = await Promise.all([
        communityApi.getGroups(),
        communityApi.getDiscussions()
      ]);
      if (Array.isArray(groupsResponse.groups)) setGroups(groupsResponse.groups);
      if (Array.isArray(discussionsResponse.discussions)) setDiscussions(discussionsResponse.discussions);
    } catch (err) {
      console.warn('Could not fetch community data from backend, using cached state:', err.message);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      const data = await notificationsApi.getAll();
      if (Array.isArray(data.notifications)) setNotifications(data.notifications);
    } catch (err) {
      console.warn('Could not fetch notifications from backend, using cached state:', err.message);
    }
  }, []);

  // Initialize session from API if token exists
  useEffect(() => {
    const token = localStorage.getItem('notesphere_token');
    if (token) {
      authApi.getMe()
        .then(res => {
          if (res.user) {
            setUser(res.user);
            setIsLoggedIn(true);
          }
        })
        .catch(err => {
          console.warn('Session check failed:', err.message);
          // Token expired
          localStorage.removeItem('notesphere_token');
          setIsLoggedIn(false);
        });
    }
    refreshResources();
    refreshCommunity();
    if (token) refreshNotifications();
  }, [refreshResources, refreshCommunity, refreshNotifications]);

  // Online / Offline Listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      addToast("Connection restored. Syncing resources with NoteSphere...", "success");
      refreshResources();
    };
    const handleOffline = () => {
      setIsOffline(true);
      addToast("You are offline. NoteSphere is running in Offline Mode.", "warning");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshResources]);

  // Pomodoro tick timer
  useEffect(() => {
    let interval = null;
    if (pomodoro.isRunning) {
      interval = setInterval(() => {
        setPomodoro(prev => {
          if (prev.timeRemaining <= 1) {
            clearInterval(interval);
            const newMode = prev.mode === 'work' ? 'shortBreak' : 'work';
            const cycles = prev.mode === 'work' ? prev.cyclesCompleted + 1 : prev.cyclesCompleted;
            addToast(prev.mode === 'work' ? 'Time to take a break!' : 'Break over, back to studying!', 'success');
            
            addNotification({
              title: prev.mode === 'work' ? 'Focus Interval Completed!' : 'Break Finished!',
              message: prev.mode === 'work' ? 'Great job! Rest for 5 mins.' : 'Focus for another 25 mins.',
              type: 'group'
            });

            return {
              ...prev,
              isRunning: false,
              mode: newMode,
              timeRemaining: newMode === 'work' ? 25 * 60 : 5 * 60,
              cyclesCompleted: cycles
            };
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomodoro.isRunning, pomodoro.mode]);

  // Auth Actions
  const loginUser = async (credentials) => {
    const res = await authApi.login(credentials);
    setUser(res.user);
    setIsLoggedIn(true);
    refreshResources();
    refreshNotifications();
    return res;
  };

  const signupUser = async (userData) => {
    const res = await authApi.signup(userData);
    setUser(res.user);
    setIsLoggedIn(true);
    refreshResources();
    refreshNotifications();
    return res;
  };

  const logoutUser = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    setIsLoggedIn(false);
    setUser(defaultUserProfile);
    addToast('Signed out of NoteSphere.', 'info');
  };

  // Actions
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const addNote = async (newNoteOrFormData) => {
    if (newNoteOrFormData instanceof FormData) {
      const res = await resourcesApi.create(newNoteOrFormData);
      await refreshResources();
      addToast(`Successfully published "${res.resource?.title || 'Resource'}"!`, 'success');
      addNotification({
        title: 'Material Published',
        message: 'Your resource was verified and published to NoteSphere.',
        type: 'upload'
      });
      return res.resource;
    }

    // Local fallback
    const updatedNote = {
      id: `note-${Date.now()}`,
      downloadCount: 0,
      likeCount: 0,
      rating: 5.0,
      uploadDate: new Date().toISOString().split('T')[0],
      uploader: {
        name: user.name,
        avatar: user.avatar,
        reputation: 5.0
      },
      ...newNoteOrFormData
    };
    setNotes(prev => [updatedNote, ...prev]);
    setUser(prev => ({ ...prev, uploadsCount: (prev.uploadsCount || 0) + 1 }));
    addToast(`Successfully uploaded "${newNoteOrFormData.title}"!`, 'success');
    addNotification({
      title: 'Material Uploaded',
      message: `Your resource "${newNoteOrFormData.title}" was published.`,
      type: 'upload'
    });
    return updatedNote;
  };

  const toggleLikeNote = async (noteId) => {
    // Optimistic UI update
    setNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        const liked = note.isLiked;
        return {
          ...note,
          likeCount: liked ? Math.max(0, note.likeCount - 1) : note.likeCount + 1,
          isLiked: !liked
        };
      }
      return note;
    }));

    try {
      await resourcesApi.toggleLike(noteId);
    } catch (err) {
      setNotes(prev => prev.map(note => {
        if (note.id !== noteId) return note;
        const liked = note.isLiked;
        return {
          ...note,
          likeCount: liked ? note.likeCount + 1 : Math.max(0, note.likeCount - 1),
          isLiked: !liked
        };
      }));
      console.warn('Like sync failed:', err.message);
      addToast('Like could not be synchronized.', 'warning');
    }
  };

  const toggleBookmarkNote = async (noteId) => {
    const wasSaved = savedIds.includes(noteId);
    setSavedIds(prev => {
      if (prev.includes(noteId)) {
        return prev.filter(id => id !== noteId);
      } else {
        return [...prev, noteId];
      }
    });

    setUser(prev => ({
      ...prev,
      savedCount: wasSaved ? Math.max(0, (prev.savedCount || 1) - 1) : (prev.savedCount || 0) + 1
    }));

    addToast(wasSaved ? "Removed from bookmarks" : "Saved to your bookmarks", "info");

    try {
      await resourcesApi.toggleBookmark(noteId);
    } catch (err) {
      setSavedIds(prev => wasSaved ? [...prev, noteId] : prev.filter(id => id !== noteId));
      setUser(prev => ({
        ...prev,
        savedCount: wasSaved ? (prev.savedCount || 0) + 1 : Math.max(0, (prev.savedCount || 1) - 1)
      }));
      console.warn('Bookmark sync failed:', err.message);
      addToast('Bookmark could not be synchronized.', 'warning');
    }
  };

  const downloadNote = async (noteId) => {
    const target = notes.find(n => n.id === noteId);
    if (!target) return;

    if (!downloadedIds.includes(noteId)) {
      setDownloadedIds(prev => [...prev, noteId]);
      setUser(prev => ({ ...prev, downloadsCount: (prev.downloadsCount || 0) + 1 }));
      setNotes(prev => prev.map(n => n.id === noteId ? { ...n, downloadCount: n.downloadCount + 1 } : n));
      addToast(`Downloaded "${target.title}" to offline library`, "success");
      addNotification({
        title: 'Offline Download Ready',
        message: `"${target.title}" was saved for offline reading.`,
        type: 'download'
      });

      try {
        await resourcesApi.recordDownload(noteId);
      } catch (err) {
        setDownloadedIds(prev => prev.filter(id => id !== noteId));
        setUser(prev => ({ ...prev, downloadsCount: Math.max(0, (prev.downloadsCount || 1) - 1) }));
        setNotes(prev => prev.map(n => n.id === noteId ? { ...n, downloadCount: Math.max(0, n.downloadCount - 1) } : n));
        console.warn('Download recording failed:', err.message);
        addToast('Download could not be synchronized.', 'warning');
      }
    } else {
      addToast(`"${target.title}" is already in your offline library`, "info");
    }
  };

  const removeDownloadedNote = (noteId) => {
    setDownloadedIds(prev => prev.filter(id => id !== noteId));
    setUser(prev => ({ ...prev, downloadsCount: Math.max(0, (prev.downloadsCount || 1) - 1) }));
    addToast("Removed from offline downloads", "info");
  };

  const rateNote = async (noteId, rating, review) => {
    try {
      await resourcesApi.rate(noteId, rating, review);
      addToast(`Submitted ${rating}⭐ rating. Thank you!`, 'success');
      refreshResources();
    } catch (err) {
      addToast(err.message || 'Failed to submit rating.', 'error');
    }
  };

  // Discussions actions
  const addDiscussion = async (title, description, tags) => {
    try {
      await communityApi.createDiscussion({ title, description, tags });
      await refreshCommunity();
      addToast("Discussion topic posted successfully", "success");
      return;
    } catch (err) {
      console.warn('Discussion sync failed, creating local copy:', err.message);
    }

    const newDiscussion = {
      id: `disc-${Date.now()}`,
      title,
      description,
      tags,
      upvotes: 0,
      uploader: {
        name: user.name,
        avatar: user.avatar
      },
      replies: [],
      date: new Date().toISOString().split('T')[0]
    };
    setDiscussions(prev => [newDiscussion, ...prev]);
    addToast("Discussion topic posted successfully", "success");
  };

  const upvoteDiscussion = async (discId) => {
    setDiscussions(prev => prev.map(d => {
      if (d.id === discId) {
        return { ...d, upvotes: d.upvotes + 1 };
      }
      return d;
    }));
    try {
      await communityApi.voteDiscussion(discId);
    } catch (err) {
      console.warn('Discussion vote sync failed:', err.message);
    }
    addToast("Upvoted question", "success");
  };

  const addReplyToDiscussion = async (discId, replyContent) => {
    const newReply = {
      id: `rep-${Date.now()}`,
      author: user.name,
      avatar: user.avatar,
      content: replyContent,
      date: new Date().toISOString().split('T')[0],
      upvotes: 0
    };

    setDiscussions(prev => prev.map(d => {
      if (d.id === discId) {
        return {
          ...d,
          replies: [...d.replies, newReply]
        };
      }
      return d;
    }));
    try {
      await communityApi.addReply(discId, replyContent);
    } catch (err) {
      console.warn('Discussion reply sync failed:', err.message);
    }
    addToast("Reply added to thread", "success");
  };

  // Study group actions
  const toggleJoinGroup = async (groupId) => {
    let joined = false;
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        joined = !g.isJoined;
        return {
          ...g,
          members: joined ? g.members + 1 : g.members - 1,
          isJoined: joined
        };
      }
      return g;
    }));

    try {
      await communityApi.toggleJoinGroup(groupId);
    } catch (err) {
      console.warn('Study group membership sync failed:', err.message);
    }

    addToast(joined ? "Joined study community group" : "Left study group", joined ? "success" : "info");
    if (joined) {
      addNotification({
        title: 'Group Joined',
        message: `You are now a member of the study circle.`,
        type: 'group'
      });
    }
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      user,
      setUser,
      isLoggedIn,
      setIsLoggedIn,
      loginUser,
      signupUser,
      logoutUser,
      notes,
      setNotes,
      refreshResources,
      videos,
      discussions,
      groups,
      downloadedIds,
      savedIds,
      notifications,
      markAllNotificationsRead,
      clearNotifications,
      toasts,
      addToast,
      pomodoro,
      setPomodoro,
      recentSearches,
      setRecentSearches,
      isOffline,
      setIsOffline,
      syncPending,
      setSyncPending,
      addNote,
      toggleLikeNote,
      toggleBookmarkNote,
      downloadNote,
      removeDownloadedNote,
      rateNote,
      addDiscussion,
      upvoteDiscussion,
      addReplyToDiscussion,
      toggleJoinGroup,
      badges
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
