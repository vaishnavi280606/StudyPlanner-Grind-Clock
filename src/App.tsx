import { useState, useEffect } from 'react';
import { BookOpen, LayoutDashboard, Clock, Target, History, Brain } from 'lucide-react';
import { Subject, StudySession, StudyGoal } from './types';
import { storage } from './utils/storage';
import { Dashboard } from './components/Dashboard';
import { SubjectManager } from './components/SubjectManager';
import { StudyTimer } from './components/StudyTimer';
import { SessionHistory } from './components/SessionHistory';
import { GoalsManager } from './components/GoalsManager';

type View = 'dashboard' | 'subjects' | 'timer' | 'history' | 'goals';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl">
                <Brain className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">StudyFlow</h1>
                <p className="text-xs text-slate-500">AI-Powered Study Planner</p>
              </div>
            </div>
            <div className="hidden md:flex gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      currentView === item.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
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
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentView === 'dashboard' && (
          <Dashboard subjects={subjects} sessions={sessions} goals={goals} />
        )}
        {currentView === 'subjects' && (
          <SubjectManager
            subjects={subjects}
            onAddSubject={handleAddSubject}
            onUpdateSubject={handleUpdateSubject}
            onDeleteSubject={handleDeleteSubject}
          />
        )}
        {currentView === 'timer' && (
          <div className="max-w-2xl mx-auto">
            <StudyTimer subjects={subjects} onSessionComplete={handleSessionComplete} />
          </div>
        )}
        {currentView === 'history' && (
          <SessionHistory sessions={sessions} subjects={subjects} />
        )}
        {currentView === 'goals' && (
          <GoalsManager
            goals={goals}
            subjects={subjects}
            onAddGoal={handleAddGoal}
            onToggleGoal={handleToggleGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-sm">
              © 2025 StudyFlow. Your personal AI-powered study companion.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Brain size={16} />
              <span>Powered by intelligent analytics</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
