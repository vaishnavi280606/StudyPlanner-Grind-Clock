import { useState, useEffect } from 'react';
import { BookOpen, LayoutDashboard, Clock, Target, History, Zap, Moon, Sun } from 'lucide-react';
import { Subject, StudySession, StudyGoal } from './types';
import { storage } from './utils/storage';
import { Dashboard } from './components/Dashboard';
import { SubjectManager } from './components/SubjectManager';
import { StudyTimer } from './components/StudyTimer';
import { SessionHistory } from './components/SessionHistory';
import { GoalsManager } from './components/GoalsManager';
import { Reminder } from './components/Reminder';

type View = 'dashboard' | 'subjects' | 'timer' | 'history' | 'goals';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSuccessPopper, setShowSuccessPopper] = useState(false);

  useEffect(() => {
    setSubjects(storage.getSubjects());
    setSessions(storage.getSessions());
    setGoals(storage.getGoals());
  }, []);

  const handleAddSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subject,
      id: crypto.randomUUID(),
    };
    const updated = [...subjects, newSubject];
    setSubjects(updated);
    storage.saveSubjects(updated);
  };

  const handleUpdateSubject = (id: string, updates: Partial<Subject>) => {
    const updated = subjects.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setSubjects(updated);
    storage.saveSubjects(updated);
  };

  const handleDeleteSubject = (id: string) => {
    if (confirm('Delete this subject? All related sessions will remain but show as "Unknown Subject".')) {
      const updated = subjects.filter((s) => s.id !== id);
      setSubjects(updated);
      storage.saveSubjects(updated);
    }
  };

  const handleSessionComplete = (session: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...session,
      id: crypto.randomUUID(),
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    storage.saveSessions(updated);
    setShowSuccessPopper(true);
    setTimeout(() => setShowSuccessPopper(false), 4000);
  };

  const handleAddGoal = (goal: Omit<StudyGoal, 'id'>) => {
    const newGoal: StudyGoal = {
      ...goal,
      id: crypto.randomUUID(),
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    storage.saveGoals(updated);
  };

  const handleToggleGoal = (id: string) => {
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
    storage.saveGoals(updated);
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Delete this goal?')) {
      const updated = goals.filter((g) => g.id !== id);
      setGoals(updated);
      storage.saveGoals(updated);
    }
  };

  const navigation = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timer' as View, label: 'Study Timer', icon: Clock },
    { id: 'subjects' as View, label: 'Subjects', icon: BookOpen },
    { id: 'goals' as View, label: 'Goals', icon: Target },
    { id: 'history' as View, label: 'History', icon: History },
  ];

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      <nav className={`shadow-md border-b transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-xl shadow-lg">
                <Zap className="text-white" size={28} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Grind Planner</h1>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Push Your Limits</p>
              </div>
            </div>
            <div className="hidden md:flex gap-2 items-center">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
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
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-slate-700 text-yellow-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          <div className="md:hidden flex gap-2 mt-4 overflow-x-auto pb-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
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
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${isDarkMode ? 'bg-slate-700 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentView === 'dashboard' && (
          <Dashboard subjects={subjects} sessions={sessions} goals={goals} isDarkMode={isDarkMode} />
        )}
        {currentView === 'subjects' && (
          <SubjectManager
            subjects={subjects}
            onAddSubject={handleAddSubject}
            onUpdateSubject={handleUpdateSubject}
            onDeleteSubject={handleDeleteSubject}
            isDarkMode={isDarkMode}
          />
        )}
        {currentView === 'timer' && (
          <div className="max-w-2xl mx-auto">
            <StudyTimer subjects={subjects} onSessionComplete={handleSessionComplete} isDarkMode={isDarkMode} />
          </div>
        )}
        {currentView === 'history' && (
          <SessionHistory sessions={sessions} subjects={subjects} isDarkMode={isDarkMode} />
        )}
        {currentView === 'goals' && (
          <GoalsManager
            goals={goals}
            subjects={subjects}
            onAddGoal={handleAddGoal}
            onToggleGoal={handleToggleGoal}
            onDeleteGoal={handleDeleteGoal}
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

      <footer className={`border-t mt-16 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              © 2025 Grind Planner. Push your limits every day.
            </p>
            <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              <Zap size={16} />
              <span>Powered by dedication</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
