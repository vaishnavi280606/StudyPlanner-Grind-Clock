import { Subject, StudySession, StudyGoal, ScheduleSlot } from '../types';

const STORAGE_KEYS = {
  SUBJECTS: 'study_planner_subjects',
  SESSIONS: 'study_planner_sessions',
  GOALS: 'study_planner_goals',
  SCHEDULE: 'study_planner_schedule',
};

// LocalStorage-only storage (no database dependency)
export const storage = {
  getSubjects: async (): Promise<Subject[]> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading subjects:', error);
      return [];
    }
  },

  saveSubjects: async (subjects: Subject[]): Promise<void> => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (error) {
      console.error('Error saving subjects:', error);
    }
  },

  getSessions: async (): Promise<StudySession[]> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (!stored) return [];
      
      const sessions = JSON.parse(stored);
      // Convert date strings back to Date objects
      return sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined,
        completedAt: session.completedAt ? new Date(session.completedAt) : undefined,
      }));
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  },

  saveSessions: async (sessions: StudySession[]): Promise<void> => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  },

  getGoals: async (): Promise<StudyGoal[]> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (!stored) return [];
      
      const goals = JSON.parse(stored);
      // Convert date strings back to Date objects
      return goals.map((goal: any) => ({
        ...goal,
        targetDate: goal.targetDate ? new Date(goal.targetDate) : undefined,
        completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
        examDate: goal.examDate ? new Date(goal.examDate) : undefined,
      }));
    } catch (error) {
      console.error('Error loading goals:', error);
      return [];
    }
  },

  saveGoals: async (goals: StudyGoal[]): Promise<void> => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  },

  getSchedule: async (): Promise<ScheduleSlot[]> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading schedule:', error);
      return [];
    }
  },

  saveSchedule: async (schedule: ScheduleSlot[]): Promise<void> => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  },

  clearAll: async (): Promise<void> => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
