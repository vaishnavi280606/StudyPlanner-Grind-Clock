import { useState, useEffect } from 'react';
import { BookOpen, LayoutDashboard, Clock, Target, History, Zap, Moon, Sun, Play, Pause, BarChart3, Brain, Lightbulb, Menu, X } from 'lucide-react';
import { Subject, StudySession, StudyGoal } from './types';
import { storage } from './utils/storage';
import { Dashboard } from './components/Dashboard';
import { SubjectManager } from './components/SubjectManager';
import { StudyTimer } from './components/StudyTimer';
import { SessionHistory } from './components/SessionHistory';
import { GoalsManager } from './components/GoalsManager';
import { AdvancedAnalytics } from './components/AdvancedAnalytics';
import { AIRecommendations } from './components/AIRecommendations';
import { StudyTechniques } from './components/StudyTechniques';
import { Reminder } from './components/Reminder';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserProfile } from './components/UserProfile';
import { GoalReminderPopup } from './components/GoalReminderPopup';
import { AIChatbot } from './components/AIChatbot';

type View = 'dashboard' | 'subjects' | 'timer' | 'history' | 'goals' | 'analytics' | 'recommendations' | 'techniques';

// Timer state interface
interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  selectedSubjectId: string;
  startTime: Date | null;
  elapsedSeconds: number;
  notes: string;
  focusRating: number;
}

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSuccessPopper, setShowSuccessPopper] = useState(false);
  const [showGoalReminder, setShowGoalReminder] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Draggable timer position state
  const [timerPosition, setTimerPosition] = useState(() => {
    const saved = localStorage.getItem('grind_clock_timer_position');
    return saved ? JSON.parse(saved) : { x: window.innerWidth - 300, y: 80 }; // Default top-right position
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Persistent timer state
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    selectedSubjectId: '',
    startTime: null,
    elapsedSeconds: 0,
    notes: '',
    focusRating: 3,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedSubjects, loadedSessions, loadedGoals] = await Promise.all([
          storage.getSubjects(),
          storage.getSessions(),
          storage.getGoals()
        ]);
        
        setSubjects(loadedSubjects);
        setSessions(loadedSessions);
        setGoals(loadedGoals);
        
        // Show goal reminder on app load if there are active goals
        const activeGoals = loadedGoals.filter(g => !g.completed);
        if (activeGoals.length > 0) {
          // Delay to allow UI to render first
          setTimeout(() => setShowGoalReminder(true), 1000);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  // Show goal reminder when switching to dashboard
  useEffect(() => {
    if (currentView === 'dashboard' && goals.length > 0) {
      const activeGoals = goals.filter(g => !g.completed);
      if (activeGoals.length > 0) {
        // Check if we should show reminder (not too frequently)
        const lastReminderTime = localStorage.getItem('lastGoalReminderTime');
        const now = Date.now();
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        if (!lastReminderTime || now - parseInt(lastReminderTime) > oneHour) {
          setTimeout(() => setShowGoalReminder(true), 500);
          localStorage.setItem('lastGoalReminderTime', now.toString());
        }
      }
    }
  }, [currentView, goals]);

  // Timer effect - runs continuously when timer is active
  useEffect(() => {
    let interval: number | undefined;
    if (timerState.isRunning && !timerState.isPaused && timerState.startTime) {
      interval = window.setInterval(() => {
        const now = new Date();
        setTimerState(prev => ({
          ...prev,
          elapsedSeconds: Math.floor((now.getTime() - prev.startTime!.getTime()) / 1000)
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState.isRunning, timerState.isPaused, timerState.startTime]);

  const handleAddSubject = async (subject: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subject,
      id: crypto.randomUUID(),
    };
    const updated = [...subjects, newSubject];
    setSubjects(updated);
    await storage.saveSubjects(updated);
  };

  const handleUpdateSubject = async (id: string, updates: Partial<Subject>) => {
    const updated = subjects.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setSubjects(updated);
    await storage.saveSubjects(updated);
  };

  const handleDeleteSubject = async (id: string) => {
    if (confirm('Delete this subject? All related sessions will remain but show as "Unknown Subject".')) {
      const updated = subjects.filter((s) => s.id !== id);
      setSubjects(updated);
      await storage.saveSubjects(updated);
    }
  };

  const handleSessionComplete = async (session: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...session,
      id: crypto.randomUUID(),
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    await storage.saveSessions(updated);
    setShowSuccessPopper(true);
    setTimeout(() => setShowSuccessPopper(false), 4000);
  };

  const handleAddGoal = async (goal: Omit<StudyGoal, 'id'>) => {
    const newGoal: StudyGoal = {
      ...goal,
      id: crypto.randomUUID(),
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    await storage.saveGoals(updated);
  };

  const handleUpdateGoal = async (id: string, goalData: Omit<StudyGoal, 'id'>) => {
    const updated = goals.map((g) =>
      g.id === id
        ? {
            ...goalData,
            id,
            completed: g.completed, // Preserve completion status
            completedAt: g.completedAt, // Preserve completion date
          }
        : g
    );
    setGoals(updated);
    await storage.saveGoals(updated);
  };

  const handleToggleGoal = async (id: string) => {
    const updated = goals.map((g) =>
      g.id === id
        ? {
            ...g,
            completed: !g.completed,
            completedAt: !g.completed ? new Date() : undefined,
          }
        : g
    );
    setGoals(updated);
    await storage.saveGoals(updated);
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm('Delete this goal?')) {
      const updated = goals.filter((g) => g.id !== id);
      setGoals(updated);
      await storage.saveGoals(updated);
    }
  };

  // Timer handlers
  const handleTimerStart = (subjectId: string) => {
    setTimerState({
      isRunning: true,
      isPaused: false,
      selectedSubjectId: subjectId,
      startTime: new Date(),
      elapsedSeconds: 0,
      notes: '',
      focusRating: 3,
    });
  };

  const handleTimerPause = () => {
    setTimerState(prev => ({ 
      ...prev, 
      isPaused: true,
      isRunning: true // Keep running state true, just paused
    }));
  };

  const handleTimerResume = () => {
    if (!timerState.startTime) return;
    
    // Calculate the time that was paused and adjust start time
    const now = new Date();
    const pausedDuration = Math.floor((now.getTime() - timerState.startTime.getTime()) / 1000) - timerState.elapsedSeconds;
    const adjustedStartTime = new Date(timerState.startTime.getTime() + (pausedDuration * 1000));
    
    setTimerState(prev => ({ 
      ...prev, 
      isPaused: false,
      isRunning: true,
      startTime: adjustedStartTime
    }));
  };

  const handleTimerStop = () => {
    if (!timerState.startTime || !timerState.selectedSubjectId) return;

    const endTime = new Date();
    const durationMinutes = Math.floor(timerState.elapsedSeconds / 60);

    if (durationMinutes < 1) {
      alert('Session must be at least 1 minute long');
      return;
    }

    const session: Omit<StudySession, 'id'> = {
      subjectId: timerState.selectedSubjectId,
      startTime: timerState.startTime,
      endTime,
      durationMinutes,
      focusRating: timerState.focusRating,
      notes: timerState.notes,
      completed: true,
    };

    handleSessionComplete(session);

    // Reset timer state
    setTimerState({
      isRunning: false,
      isPaused: false,
      selectedSubjectId: '',
      startTime: null,
      elapsedSeconds: 0,
      notes: '',
      focusRating: 3,
    });
  };

  const handleTimerUpdate = (updates: Partial<TimerState>) => {
    setTimerState(prev => ({ ...prev, ...updates }));
  };

  // Drag handlers for floating timer
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = (e.target as HTMLElement).closest('.timer-widget')?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = (e.target as HTMLElement).closest('.timer-widget')?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
    }
  };

  const updatePosition = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;
    
    // Get viewport dimensions and widget size
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const widgetWidth = 280; // Approximate widget width
    const widgetHeight = 120; // Approximate widget height
    const headerHeight = 80; // Header height
    const sidebarWidth = 256; // Sidebar width
    
    // Constrain position within bounds
    const constrainedX = Math.max(
      sidebarWidth + 10, // Don't go behind sidebar
      Math.min(newX, viewportWidth - widgetWidth - 10) // Don't go beyond right edge
    );
    const constrainedY = Math.max(
      headerHeight + 10, // Don't go above header
      Math.min(newY, viewportHeight - widgetHeight - 10) // Don't go below bottom
    );
    
    setTimerPosition({ x: constrainedX, y: constrainedY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    updatePosition(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    updatePosition(touch.clientX, touch.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    // Reset to default position (top-right)
    setTimerPosition({ x: window.innerWidth - 300, y: 80 });
  };

  // Add global mouse and touch event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragOffset]);

  // Save timer position to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('grind_clock_timer_position', JSON.stringify(timerPosition));
  }, [timerPosition]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Main navigation items (shown in top bar on desktop)
  const mainNavigation = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timer' as View, label: 'Study Timer', icon: Clock },
    { id: 'subjects' as View, label: 'Subjects', icon: BookOpen },
    { id: 'goals' as View, label: 'Goals', icon: Target },
    { id: 'history' as View, label: 'History', icon: History },
  ];

  // All navigation items (shown in hamburger menu)
  const allNavigation = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timer' as View, label: 'Study Timer', icon: Clock },
    { id: 'goals' as View, label: 'Goals', icon: Target },
    { id: 'history' as View, label: 'History', icon: History },
    { id: 'subjects' as View, label: 'Subjects', icon: BookOpen },
    { id: 'analytics' as View, label: 'Analytics', icon: BarChart3 },
    { id: 'recommendations' as View, label: 'AI Insights', icon: Brain },
    { id: 'techniques' as View, label: 'Techniques', icon: Lightbulb },
  ];

  const handleNavClick = (viewId: View) => {
    setCurrentView(viewId);
  };

  return (
    <div className={`min-h-screen flex transition-colors ${isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Persistent Left Sidebar - Grind Menu */}
      <div className={`w-64 h-screen fixed left-0 top-0 shadow-lg z-30 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-64'
      } ${isDarkMode ? 'bg-slate-800 border-r border-slate-700' : 'bg-white border-r border-slate-200'}`}>
        <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-xl shadow-lg">
            <Zap className="text-white" size={28} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Grind Menu</h2>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Navigation</p>
          </div>
        </div>
            
        
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {allNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-left ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                    : isDarkMode 
                    ? 'text-slate-300 hover:bg-slate-700' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <UserProfile isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <nav className={`shadow-md border-b transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo and Text */}
            <div className="flex items-center gap-3">
              {/* Menu Toggle Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
                }`}
                title={isSidebarOpen ? 'Hide menu' : 'Show menu'}
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-xl shadow-lg">
                <Zap className="text-white" size={28} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Grind Clock</h1>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Push Your Limits</p>
              </div>
            </div>
            
            {/* Main Navigation - Desktop */}
            <div className="hidden lg:flex gap-2 items-center">
              {mainNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                        : isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-slate-700 text-yellow-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <UserProfile isDarkMode={isDarkMode} />
            </div>

            {/* Mobile Navigation */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-slate-700 text-yellow-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile Main Navigation */}
          <div className="lg:hidden flex gap-2 mt-4 overflow-x-auto pb-2">
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                      : isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-8 pb-24">
        {currentView === 'dashboard' && (
          <Dashboard subjects={subjects} sessions={sessions} goals={goals} isDarkMode={isDarkMode} />
        )}
        {currentView === 'subjects' && (
          <SubjectManager
            subjects={subjects}
            sessions={sessions}
            onAddSubject={handleAddSubject}
            onUpdateSubject={handleUpdateSubject}
            onDeleteSubject={handleDeleteSubject}
            isDarkMode={isDarkMode}
          />
        )}
        {currentView === 'timer' && (
          <div className="max-w-2xl mx-auto">
            <StudyTimer 
              subjects={subjects} 
              timerState={timerState}
              onTimerStart={handleTimerStart}
              onTimerPause={handleTimerPause}
              onTimerResume={handleTimerResume}
              onTimerStop={handleTimerStop}
              onTimerUpdate={handleTimerUpdate}
              formatTime={formatTime}
              isDarkMode={isDarkMode} 
            />
          </div>
        )}
        {currentView === 'history' && (
          <SessionHistory sessions={sessions} subjects={subjects} isDarkMode={isDarkMode} />
        )}
        {currentView === 'goals' && (
          <GoalsManager
            goals={goals}
            subjects={subjects}
            sessions={sessions}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onToggleGoal={handleToggleGoal}
            onDeleteGoal={handleDeleteGoal}
            isDarkMode={isDarkMode}
          />
        )}
        {currentView === 'analytics' && (
          <AdvancedAnalytics
            sessions={sessions}
            subjects={subjects}
            isDarkMode={isDarkMode}
          />
        )}
        {currentView === 'recommendations' && (
          <AIRecommendations
            sessions={sessions}
            subjects={subjects}
            isDarkMode={isDarkMode}
          />
        )}
        {currentView === 'techniques' && (
          <StudyTechniques
            subjects={subjects}
            sessions={sessions}
            isDarkMode={isDarkMode}
          />
        )}
      </main>

      {showSuccessPopper && (
        <div className="fixed top-20 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl animate-bounce z-50 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Zap className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Session Complete!</h3>
              <p className="text-sm text-green-50">Great work! Keep grinding!</p>
            </div>
          </div>
        </div>
      )}

      <Reminder goals={goals} isDarkMode={isDarkMode} />

      {/* Goal Reminder Popup */}
      {showGoalReminder && (
        <GoalReminderPopup
          goals={goals}
          subjects={subjects}
          isDarkMode={isDarkMode}
          onClose={() => setShowGoalReminder(false)}
        />
      )}

      {/* Draggable Floating Timer Widget - shows when timer is running and not on timer page */}
      {timerState.isRunning && currentView !== 'timer' && (
        <div 
          className="fixed z-40 timer-widget" 
          style={{ 
            left: `${timerPosition.x}px`, 
            top: `${timerPosition.y}px`,
            animation: isDragging ? 'none' : 'slideInRight 0.3s ease-out'
          }}
        >
          <div 
            className={`rounded-xl p-4 shadow-2xl border backdrop-blur-sm transition-all hover:shadow-3xl cursor-grab active:cursor-grabbing ${
              isDarkMode ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-slate-200'
            } ${isDragging ? 'shadow-3xl scale-105' : ''}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onDoubleClick={handleDoubleClick}
            title="Drag to move • Double-click to reset position"
          >
            {/* Drag Handle */}
            <div className={`flex justify-center mb-1 ${isDragging ? 'opacity-100' : 'opacity-50 hover:opacity-100'} transition-opacity`}>
              <div className={`flex gap-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                <div className="w-1 h-1 rounded-full bg-current"></div>
                <div className="w-1 h-1 rounded-full bg-current"></div>
                <div className="w-1 h-1 rounded-full bg-current"></div>
                <div className="w-1 h-1 rounded-full bg-current"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{
                    backgroundColor: subjects.find((s) => s.id === timerState.selectedSubjectId)?.color || '#f59e0b',
                  }}
                />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {subjects.find((s) => s.id === timerState.selectedSubjectId)?.name || 'Study Session'}
                </span>
              </div>
              <Clock className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} size={16} />
            </div>
            <div className={`text-2xl font-mono font-bold text-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {formatTime(timerState.elapsedSeconds)}
            </div>
            <div className="flex gap-2 mt-3 justify-center">
              {timerState.isPaused ? (
                <button
                  onClick={handleTimerResume}
                  className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-colors text-sm font-medium"
                >
                  <Play size={14} />
                  Resume
                </button>
              ) : (
                <button
                  onClick={handleTimerPause}
                  className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                >
                  <Pause size={14} />
                  Pause
                </button>
              )}
              <button
                onClick={() => setCurrentView('timer')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                View
              </button>
            </div>
          </div>
        </div>
        )}

        <footer className={`fixed bottom-0 right-0 border-t transition-all duration-300 z-20 ${
          isSidebarOpen ? 'left-64' : 'left-0'
        } ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              © 2025 Grind Clock. Push your limits every day.
            </p>
            <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              <Zap size={16} />
              <span>Powered by dedication</span>
            </div>
          </div>
        </div>
        </footer>

        {/* AI Chatbot */}
        <AIChatbot isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}

function App() {
  return (
    <ProtectedRoute>
      <AppContent />
    </ProtectedRoute>
  );
}

export default App;
