import { Brain, TrendingUp, Target, Clock } from 'lucide-react';
import { StudySession, Subject, StudyGoal } from '../types';
import { calculateStudyStats, generateInsights, getWeeklyProgress } from '../utils/analytics';

interface DashboardProps {
  subjects: Subject[];
  sessions: StudySession[];
  goals: StudyGoal[];
}

export function Dashboard({ subjects, sessions, goals }: DashboardProps) {
  const stats = calculateStudyStats(sessions, subjects);
  const insights = generateInsights(sessions, subjects);
  const weeklyProgress = getWeeklyProgress(sessions);

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-blue-500" size={24} />
            <span className="text-3xl font-bold text-slate-900">{stats.totalHours}h</span>
          </div>
          <p className="text-slate-600 text-sm">Total Study Time</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-green-500" size={24} />
            <span className="text-3xl font-bold text-slate-900">{stats.completionRate}%</span>
          </div>
          <p className="text-slate-600 text-sm">Completion Rate</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <Brain className="text-purple-500" size={24} />
            <span className="text-3xl font-bold text-slate-900">{stats.avgFocusRating}/5</span>
          </div>
          <p className="text-slate-600 text-sm">Avg Focus Rating</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <Target className="text-orange-500" size={24} />
            <span className="text-3xl font-bold text-slate-900">{completedGoals}/{goals.length}</span>
          </div>
          <p className="text-slate-600 text-sm">Goals Completed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Weekly Progress</h3>
          <div className="space-y-3">
            {weeklyProgress.map((day, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600 w-10">{day.day}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-300"
                    style={{ width: `${Math.min((day.hours / 4) * 100, 100)}%` }}
                  >
                    {day.hours > 0 && (
                      <span className="text-xs font-medium text-white">{day.hours}h</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Study by Subject</h3>
          {stats.subjectBreakdown.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No study sessions yet</p>
          ) : (
            <div className="space-y-4">
              {stats.subjectBreakdown.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-slate-700">{item.subject}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{item.hours}h</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(item.hours / stats.totalHours) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl p-6 shadow-lg text-white">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={24} />
          <h3 className="text-xl font-bold">AI Insights</h3>
        </div>
        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
            >
              <h4 className="font-semibold mb-1">{insight.title}</h4>
              <p className="text-sm text-slate-200">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

      {activeGoals.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Active Goals</h3>
          <div className="space-y-3">
            {activeGoals.slice(0, 5).map((goal) => (
              <div key={goal.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <Target className="text-orange-500 flex-shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{goal.title}</p>
                  {goal.targetDate && (
                    <p className="text-xs text-slate-500 mt-1">
                      Due: {new Date(goal.targetDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
