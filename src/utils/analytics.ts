import { StudySession, Subject, ProductivityInsight } from '../types';

export const calculateStudyStats = (sessions: StudySession[], subjects: Subject[]) => {
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

  const completedSessions = sessions.filter(s => s.completed).length;
  const completionRate = sessions.length > 0
    ? Math.round((completedSessions / sessions.length) * 100)
    : 0;

  const avgFocusRating = sessions.filter(s => s.focusRating).length > 0
    ? Math.round(
        sessions
          .filter(s => s.focusRating)
          .reduce((sum, s) => sum + (s.focusRating || 0), 0) /
        sessions.filter(s => s.focusRating).length * 10
      ) / 10
    : 0;

  const subjectBreakdown = subjects.map(subject => {
    const subjectSessions = sessions.filter(s => s.subjectId === subject.id);
    const subjectMinutes = subjectSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    return {
      subject: subject.name,
      color: subject.color,
      hours: Math.round((subjectMinutes / 60) * 10) / 10,
      sessions: subjectSessions.length,
    };
  }).filter(s => s.hours > 0);

  return {
    totalHours,
    totalSessions: sessions.length,
    completionRate,
    avgFocusRating,
    subjectBreakdown,
  };
};

export const generateInsights = (
  sessions: StudySession[],
  subjects: Subject[]
): ProductivityInsight[] => {
  const insights: ProductivityInsight[] = [];

  if (sessions.length === 0) {
    insights.push({
      type: 'recommendation',
      title: 'Start Your Study Journey',
      description: 'Add your subjects and start your first study session to get personalized insights.',
    });
    return insights;
  }

  const hourCounts = new Array(24).fill(0);
  sessions.forEach(session => {
    const hour = new Date(session.startTime).getHours();
    hourCounts[hour]++;
  });

  const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
  if (sessions.length >= 5) {
    insights.push({
      type: 'peak_hours',
      title: 'Peak Productivity Hour',
      description: `You're most productive at ${peakHour}:00. Consider scheduling important subjects during this time.`,
      data: { hour: peakHour },
    });
  }

  const recentSessions = sessions.slice(-7);
  const consecutiveDays = new Set(
    recentSessions.map(s => new Date(s.startTime).toDateString())
  ).size;

  if (consecutiveDays >= 3) {
    insights.push({
      type: 'streak',
      title: `${consecutiveDays}-Day Streak!`,
      description: `You've studied for ${consecutiveDays} days. Keep the momentum going!`,
      data: { days: consecutiveDays },
    });
  }

  const subjectPerformance = subjects.map(subject => {
    const subjectSessions = sessions.filter(s => s.subjectId === subject.id);
    const avgFocus = subjectSessions.filter(s => s.focusRating).length > 0
      ? subjectSessions.reduce((sum, s) => sum + (s.focusRating || 0), 0) /
        subjectSessions.filter(s => s.focusRating).length
      : 0;
    return { subject, avgFocus, sessionCount: subjectSessions.length };
  });

  const weakSubject = subjectPerformance
    .filter(s => s.sessionCount >= 2)
    .sort((a, b) => a.avgFocus - b.avgFocus)[0];

  if (weakSubject && weakSubject.avgFocus < 3) {
    insights.push({
      type: 'weak_subjects',
      title: 'Focus Improvement Needed',
      description: `Your focus rating for ${weakSubject.subject.name} is below average. Try shorter sessions or different study techniques.`,
      data: { subject: weakSubject.subject.name },
    });
  }

  const now = new Date();
  const thisWeek = sessions.filter(s => {
    const sessionDate = new Date(s.startTime);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return sessionDate >= weekAgo;
  });

  subjects.forEach(subject => {
    const subjectWeekSessions = thisWeek.filter(s => s.subjectId === subject.id);
    const weekMinutes = subjectWeekSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    const weekHours = weekMinutes / 60;

    if (weekHours < subject.targetHoursPerWeek * 0.7 && subject.targetHoursPerWeek > 0) {
      insights.push({
        type: 'recommendation',
        title: `Behind Schedule: ${subject.name}`,
        description: `You've studied ${Math.round(weekHours * 10) / 10}h this week. Target is ${subject.targetHoursPerWeek}h. Consider adding more sessions.`,
        data: { subject: subject.name, current: weekHours, target: subject.targetHoursPerWeek },
      });
    }
  });

  return insights;
};

export const getWeeklyProgress = (sessions: StudySession[]) => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyData = days.map((day, index) => {
    const targetDate = new Date(weekAgo);
    targetDate.setDate(weekAgo.getDate() + index);

    const daySessions = sessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      return sessionDate.toDateString() === targetDate.toDateString();
    });

    const minutes = daySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

    return {
      day,
      hours: Math.round((minutes / 60) * 10) / 10,
    };
  });

  return dailyData;
};
