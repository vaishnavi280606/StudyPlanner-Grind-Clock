import { Brain, Target, Clock, Calendar } from 'lucide-react';
import { StudySession, Subject, StudyGoal } from '../types';
import { calculateStudyStats, generateInsights, getWeeklyProgress, calculateDailyCompletionRate, calculateWeeklySubjectProgress } from '../utils/analytics';
import { InterestingFacts } from './InterestingFacts';

interface DashboardProps {
  subjects: Subject[];
  sessions: StudySession[];
  goals: StudyGoal[];
  isDarkMode: boolean;
}

export function Dashboard({ subjects, sessions, goals, isDarkMode }: DashboardProps) {
  const stats = calculateStudyStats(sessions, subjects);
  const insights = generateInsights(sessions, subjects);
  const weeklyProgress = getWeeklyProgress(sessions, subjects);
  const dailyStats = calculateDailyCompletionRate(sessions, subjects);
  const weeklyStats = calculateWeeklySubjectProgress(sessions, subjects);

  const regularGoals = goals.filter(g => !g.isExam);
  const activeGoals = regularGoals.filter(g => !g.completed);
  const completedGoals = regularGoals.filter(g => g.completed).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-xl p-6 shadow-md border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-amber-500" size={24} />
            <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.totalHours}h</span>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Grind Time</p>
        </div>

        <div className={`rounded-xl p-6 shadow-md border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <Calendar className="text-green-500" size={24} />
            <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{dailyStats.dailyCompletionRate}%</span>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Today's Progress</p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            {dailyStats.todayHours}h / {dailyStats.totalDailyTarget}h target
          </p>
        </div>

        <div className={`rounded-xl p-6 shadow-md border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <Brain className="text-blue-500" size={24} />
            <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.avgFocusRating}/5</span>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Avg Focus Rating</p>
        </div>

        <div className={`rounded-xl p-6 shadow-md border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <Target className="text-orange-500" size={24} />
            <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{completedGoals}/{regularGoals.length}</span>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Goals Completed</p>
        </div>
      </div>

      {/* Interesting Facts Section */}
      <InterestingFacts isDarkMode={isDarkMode} />

      {/* Weekly Progress by Day */}
      <div className={`rounded-xl p-6 shadow-md border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>This Week's Daily Progress</h3>
          <div className="text-right">
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Week of {weeklyProgress[0]?.date} - {weeklyProgress[6]?.date}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weeklyProgress.map((day, idx) => (
            <div key={idx} className="text-center">
              <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {day.day}
              </div>
              <div className={`text-xs mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                {day.date}
              </div>
              <div className={`rounded-lg p-3 border transition-all ${
                day.isToday 
                  ? isDarkMode ? 'bg-amber-900/30 border-amber-600' : 'bg-amber-50 border-amber-300'
                  : day.isFuture
                  ? isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'
                  : isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
              }`}>
                {/* Time Spent */}
                <div className={`text-lg font-bold ${
                  day.isToday 
                    ? 'text-amber-500'
                    : day.isFuture
                    ? isDarkMode ? 'text-slate-500' : 'text-slate-400'
                    : day.hours > 0
                    ? isDarkMode ? 'text-white' : 'text-slate-900'
                    : isDarkMode ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {day.isFuture ? '-' : `${day.hours}h`}
                </div>
                
                {/* Status */}
                <div className={`text-xs mt-1 ${
                  day.isToday 
                    ? 'text-amber-600'
                    : day.isFuture
                    ? isDarkMode ? 'text-slate-500' : 'text-slate-400'
                    : isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {day.isFuture ? 'Upcoming' : day.hours > 0 ? 'Studied' : 'No study'}
                </div>
                
                {day.isToday && (
                  <div className="text-xs text-amber-500 font-medium mt-1">Today</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Total this week: {weeklyProgress.reduce((sum, day) => sum + day.hours, 0)}h
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            Resets every Sunday
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-xl p-6 shadow-md border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Weekly Subject Progress</h3>
            <div className="text-right">
              <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {weeklyStats.overallWeeklyCompletion}%
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {weeklyStats.totalWeekHours}h / {weeklyStats.totalWeeklyTarget}h
              </div>
            </div>
          </div>
          {weeklyStats.subjectProgress.length === 0 ? (
            <p className={`text-center py-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>No weekly targets set or no study sessions this week</p>
          ) : (
            <div className="space-y-4">
              {weeklyStats.subjectProgress.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.subject}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {item.hoursStudied}h / {item.targetHours}h
                      </span>
                      <div className={`text-xs ${item.completionRate >= 100 ? 'text-green-500' : item.completionRate >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
                        {item.completionRate}%
                      </div>
                    </div>
                  </div>
                  <div className={`w-full rounded-full h-3 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.completionRate >= 100 ? 'bg-green-500' : 
                        item.completionRate >= 70 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{
                        width: `${Math.min(item.completionRate, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`rounded-xl p-6 shadow-md border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Today's Subject Progress</h3>
          {dailyStats.subjectProgress.length === 0 ? (
            <p className={`text-center py-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>No daily targets set or no study sessions today</p>
          ) : (
            <div className="space-y-4">
              {dailyStats.subjectProgress.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.subject}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {item.hoursStudied}h / {item.targetHours}h
                      </span>
                      <div className={`text-xs ${item.completionRate >= 100 ? 'text-green-500' : item.completionRate >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                        {item.completionRate}%
                      </div>
                    </div>
                  </div>
                  <div className={`w-full rounded-full h-3 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.completionRate >= 100 ? 'bg-green-500' : 
                        item.completionRate >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{
                        width: `${Math.min(item.completionRate, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`rounded-xl p-6 shadow-lg text-white transition-colors ${isDarkMode ? 'bg-gradient-to-br from-amber-900 to-orange-900' : 'bg-gradient-to-br from-slate-900 to-slate-700'}`}>
        <div className="flex items-center gap-2 mb-4">
          <Brain size={24} />
          <h3 className="text-xl font-bold">Insights</h3>
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
        <div className={`rounded-xl p-6 shadow-md border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Active Goals</h3>
          <div className="space-y-3">
            {activeGoals.slice(0, 5).map((goal) => (
              <div key={goal.id} className={`flex items-start gap-3 p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                <Target className="text-orange-500 flex-shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{goal.title}</p>
                  {goal.targetDate && (
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
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
