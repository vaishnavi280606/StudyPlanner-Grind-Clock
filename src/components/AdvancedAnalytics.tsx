import { useState } from 'react';
import { TrendingUp, BarChart3, PieChart, Calendar, Clock, Target, Brain, Award, Zap } from 'lucide-react';
import { StudySession, Subject } from '../types';

interface AdvancedAnalyticsProps {
  sessions: StudySession[];
  subjects: Subject[];
  isDarkMode: boolean;
}

type TimeRange = '7d' | '30d' | '90d' | 'all';
type ChartType = 'overview' | 'subjects' | 'performance' | 'trends';

export function AdvancedAnalytics({ sessions, subjects, isDarkMode }: AdvancedAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [activeChart, setActiveChart] = useState<ChartType>('overview');

  const getFilteredSessions = () => {
    if (timeRange === 'all') return sessions;
    
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return sessions.filter(s => s.startTime >= cutoff);
  };

  const filteredSessions = getFilteredSessions();

  // Calculate analytics data
  const totalHours = Math.round((filteredSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) / 60) * 10) / 10;
  
  // Calculate completion rate based on target hours per day vs actual hours spent
  const calculateCompletionRate = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 1;
    const totalTargetHours = subjects.reduce((sum, subject) => {
      return sum + (subject.target_hours_per_day || 0) * days;
    }, 0);
    
    if (totalTargetHours === 0) return 0;
    
    const completionPercentage = Math.round((totalHours / totalTargetHours) * 100);
    return Math.min(completionPercentage, 100); // Cap at 100%
  };

  const analytics = {
    totalHours,
    totalSessions: filteredSessions.length,
    avgSessionLength: filteredSessions.length > 0 
      ? Math.round((filteredSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) / filteredSessions.length) * 10) / 10
      : 0,
    completionRate: calculateCompletionRate(),
    avgFocusRating: (() => {
      const sessionsWithFocus = filteredSessions.filter(s => s.focusRating && s.durationMinutes);
      if (sessionsWithFocus.length === 0) return 0;
      
      const totalWeightedFocus = sessionsWithFocus.reduce((sum, s) => 
        sum + (s.focusRating || 0) * (s.durationMinutes || 0), 0
      );
      const totalMinutes = sessionsWithFocus.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
      
      return totalMinutes > 0 ? Math.round((totalWeightedFocus / totalMinutes) * 10) / 10 : 0;
    })(),
  };

  // Calculate subject breakdown
  const subjectBreakdown = subjects.map(subject => {
    const subjectSessions = filteredSessions.filter(s => s.subjectId === subject.id);
    const subjectMinutes = subjectSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    const avgFocus = (() => {
      const sessionsWithFocus = subjectSessions.filter(s => s.focusRating && s.durationMinutes);
      if (sessionsWithFocus.length === 0) return 0;
      
      const totalWeightedFocus = sessionsWithFocus.reduce((sum, s) => 
        sum + (s.focusRating || 0) * (s.durationMinutes || 0), 0
      );
      const totalMinutes = sessionsWithFocus.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
      
      return totalMinutes > 0 ? totalWeightedFocus / totalMinutes : 0;
    })();
    
    return {
      subject: subject.name,
      color: subject.color,
      hours: Math.round((subjectMinutes / 60) * 10) / 10,
      sessions: subjectSessions.length,
      avgFocus: Math.round(avgFocus * 10) / 10,
      percentage: analytics.totalHours > 0 ? Math.round((subjectMinutes / 60 / analytics.totalHours) * 100) : 0,
    };
  }).filter(s => s.hours > 0);

  // Calculate daily trends
  const getDailyTrends = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const trends = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      
      const daySessions = filteredSessions.filter(s => 
        s.startTime >= date && s.startTime < nextDate
      );
      
      const dayMinutes = daySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
      const dayHours = Math.round((dayMinutes / 60) * 10) / 10;
      
      trends.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        hours: dayHours,
        sessions: daySessions.length,
        avgFocus: daySessions.filter(s => s.focusRating).length > 0
          ? Math.round(daySessions.reduce((sum, s) => sum + (s.focusRating || 0), 0) / daySessions.filter(s => s.focusRating).length * 10) / 10
          : 0,
      });
    }
    
    return trends;
  };

  const dailyTrends = getDailyTrends();

  // Calculate hourly distribution
  const getHourlyDistribution = () => {
    const hourCounts = new Array(24).fill(0);
    filteredSessions.forEach(session => {
      const hour = new Date(session.startTime).getHours();
      hourCounts[hour] += session.durationMinutes || 0;
    });
    
    return hourCounts.map((minutes, hour) => ({
      hour: `${hour}:00`,
      minutes,
      hours: Math.round((minutes / 60) * 10) / 10,
    })).filter(h => h.minutes > 0);
  };

  const hourlyDistribution = getHourlyDistribution();

  const renderOverviewChart = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Hours</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {analytics.totalHours}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-green-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sessions</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {analytics.totalSessions}
              </p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-purple-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Focus</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {analytics.avgFocusRating}/5
              </p>
            </div>
            <Brain className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-orange-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completion</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {analytics.completionRate}%
              </p>
            </div>
            <Award className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Daily Trends Chart */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Daily Study Hours
        </h3>
        <div className="h-64 flex items-end justify-between space-x-1">
          {dailyTrends.map((day, index) => {
            const maxHours = Math.max(...dailyTrends.map(d => d.hours));
            const height = maxHours > 0 ? (day.hours / maxHours) * 100 : 0;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600 min-h-[4px]"
                  style={{ height: `${Math.max(height, 2)}%` }}
                  title={`${day.date}: ${day.hours}h`}
                />
                <span className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {day.date.split(' ')[1]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSubjectsChart = () => (
    <div className="space-y-6">
      {/* Subject Breakdown */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Subject Distribution
        </h3>
        <div className="space-y-4">
          {subjectBreakdown.map((subject, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {subject.subject}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {subject.hours}h
                  </span>
                  <span className={`text-sm ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ({subject.percentage}%)
                  </span>
                </div>
              </div>
              <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${subject.percentage}%`,
                    backgroundColor: subject.color 
                  }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {subject.sessions} sessions
                </span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Avg Focus: {subject.avgFocus}/5
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformanceChart = () => (
    <div className="space-y-6">
      {/* Focus Rating Trends */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Focus Rating Trends
        </h3>
        <div className="h-64 flex items-end justify-between space-x-1">
          {dailyTrends.filter(d => d.avgFocus > 0).map((day, index) => {
            const height = (day.avgFocus / 5) * 100;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-purple-500 rounded-t transition-all duration-300 hover:bg-purple-600 min-h-[4px]"
                  style={{ height: `${Math.max(height, 8)}%` }}
                  title={`${day.date}: ${day.avgFocus}/5`}
                />
                <span className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {day.date.split(' ')[1]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hourly Distribution */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Study Hours by Time of Day
        </h3>
        <div className="h-64 flex items-end justify-between space-x-1">
          {hourlyDistribution.map((hour, index) => {
            const maxHours = Math.max(...hourlyDistribution.map(h => h.hours));
            const height = maxHours > 0 ? (hour.hours / maxHours) * 100 : 0;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600 min-h-[4px]"
                  style={{ height: `${Math.max(height, 4)}%` }}
                  title={`${hour.hour}: ${hour.hours}h`}
                />
                <span className={`text-xs mt-2 transform -rotate-45 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {hour.hour.split(':')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderTrendsChart = () => (
    <div className="space-y-6">
      {/* Weekly Comparison */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Study Trends & Patterns
        </h3>
        
        {/* Trend Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Peak Performance
              </span>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {hourlyDistribution.length > 0 
                ? `Best study time: ${hourlyDistribution.reduce((max, hour) => hour.hours > max.hours ? hour : max).hour}`
                : 'No data available'
              }
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Consistency Score
              </span>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {dailyTrends.filter(d => d.hours > 0).length} of {dailyTrends.length} days active
            </p>
          </div>
        </div>

        {/* Combined Trends Chart */}
        <div className="h-64 relative">
          <div className="absolute inset-0 flex items-end justify-between space-x-1">
            {dailyTrends.map((day, index) => {
              const maxHours = Math.max(...dailyTrends.map(d => d.hours));
              const hoursHeight = maxHours > 0 ? (day.hours / maxHours) * 80 : 0;
              const focusHeight = day.avgFocus > 0 ? (day.avgFocus / 5) * 60 : 0;
              
              return (
                <div key={index} className="flex flex-col items-center flex-1 relative">
                  {/* Hours bar */}
                  <div 
                    className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600 min-h-[2px] absolute bottom-8"
                    style={{ height: `${Math.max(hoursHeight, 1)}%` }}
                    title={`${day.date}: ${day.hours}h`}
                  />
                  {/* Focus overlay */}
                  {day.avgFocus > 0 && (
                    <div 
                      className="w-1/2 bg-purple-400 rounded-t transition-all duration-300 absolute bottom-8 right-0"
                      style={{ height: `${Math.max(focusHeight, 1)}%` }}
                      title={`Focus: ${day.avgFocus}/5`}
                    />
                  )}
                  <span className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {day.date.split(' ')[1]}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="absolute top-0 right-0 flex space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Hours</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-400 rounded" />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Focus</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Advanced Analytics
        </h2>
        
        {/* Time Range Selector */}
        <div className="flex space-x-2">
          {(['7d', '30d'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Type Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {([
          { key: 'overview', label: 'Overview', icon: BarChart3 },
          { key: 'subjects', label: 'Subjects', icon: PieChart },
          { key: 'performance', label: 'Performance', icon: TrendingUp },
          { key: 'trends', label: 'Trends', icon: Calendar },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveChart(key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
              activeChart === key
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Chart Content */}
      {activeChart === 'overview' && renderOverviewChart()}
      {activeChart === 'subjects' && renderSubjectsChart()}
      {activeChart === 'performance' && renderPerformanceChart()}
      {activeChart === 'trends' && renderTrendsChart()}
    </div>
  );
}