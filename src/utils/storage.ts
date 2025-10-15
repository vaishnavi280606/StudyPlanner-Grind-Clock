import { Subject, StudySession, StudyGoal, ScheduleSlot } from '../types';

const STORAGE_KEYS = {
  SUBJECTS: 'study_planner_subjects',
  SESSIONS: 'study_planner_sessions',
  GOALS: 'study_planner_goals',
  SCHEDULE: 'study_planner_schedule',
};

export const storage = {
  getSubjects: (): Subject[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return data ? JSON.parse(data) : [];
  },

  saveSubjects: (subjects: Subject[]) => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  getSessions: (): StudySession[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!data) return [];
    const sessions = JSON.parse(data);
    return sessions.map((s: any) => ({
      ...s,
      startTime: new Date(s.startTime),
      endTime: s.endTime ? new Date(s.endTime) : undefined,
    }));
  },

  saveSessions: (sessions: StudySession[]) => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },

  getGoals: (): StudyGoal[] => {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!data) return [];
    const goals = JSON.parse(data);
    return goals.map((g: any) => ({
      ...g,
      targetDate: g.targetDate ? new Date(g.targetDate) : undefined,
      completedAt: g.completedAt ? new Date(g.completedAt) : undefined,
    }));
  },

  saveGoals: (goals: StudyGoal[]) => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },

  getSchedule: (): ScheduleSlot[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    return data ? JSON.parse(data) : [];
  },

  saveSchedule: (schedule: ScheduleSlot[]) => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  },
};
