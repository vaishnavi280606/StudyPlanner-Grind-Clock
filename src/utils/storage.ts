import { Subject, StudySession, StudyGoal, ScheduleSlot } from '../types';
import { supabase } from './supabase';

const STORAGE_KEYS = {
  SUBJECTS: 'study_planner_subjects',
  SESSIONS: 'study_planner_sessions',
  GOALS: 'study_planner_goals',
  SCHEDULE: 'study_planner_schedule',
};

// Helper to get current user ID
const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
};

// Hybrid storage: Use database if user is authenticated, fallback to localStorage
// Data persists across sign-outs and syncs across devices
export const storage = {
  getSubjects: async (): Promise<Subject[]> => {
    const userId = await getCurrentUserId();
    
    if (userId) {
      // Get from database (primary source for authenticated users)
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching subjects:', error);
        // Fallback to localStorage
        const localData = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
        return localData ? JSON.parse(localData) : [];
      }
      
      const subjects = data?.map(subject => ({
        id: subject.id,
        name: subject.name,
        color: subject.color,
        difficulty: subject.difficulty,
        priority: subject.priority,
        targetHoursPerWeek: subject.target_hours_per_week,
        targetHoursPerDay: subject.target_hours_per_day
      })) || [];
      
      // Also cache in localStorage for offline access
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
      
      return subjects;
    } else {
      // Use localStorage for unauthenticated users
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return data ? JSON.parse(data) : [];
    }
  },

  saveSubjects: async (subjects: Subject[]) => {
    const userId = await getCurrentUserId();
    
    // Always save to localStorage first for immediate persistence
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    
    if (userId) {
      // Also save to database for cross-device sync
      // First, delete existing subjects for this user
      await supabase.from('subjects').delete().eq('user_id', userId);
      
      // Then insert new subjects
      if (subjects.length > 0) {
        const { error } = await supabase
          .from('subjects')
          .insert(subjects.map(subject => ({
            id: subject.id,
            user_id: userId,
            name: subject.name,
            color: subject.color,
            difficulty: subject.difficulty,
            priority: subject.priority,
            target_hours_per_week: subject.targetHoursPerWeek,
            target_hours_per_day: subject.targetHoursPerDay
          })));
        
        if (error) {
          console.error('Error saving subjects to database:', error);
        }
      }
    }
  },

  getSessions: async (): Promise<StudySession[]> => {
    const userId = await getCurrentUserId();
    
    if (userId) {
      // Get from database (primary source for authenticated users)
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false });
      
      if (error) {
        console.error('Error fetching sessions:', error);
        // Fallback to localStorage
        const localData = localStorage.getItem(STORAGE_KEYS.SESSIONS);
        if (!localData) return [];
        const sessions = JSON.parse(localData);
        return sessions.map((s: any) => ({
          ...s,
          startTime: new Date(s.startTime),
          endTime: s.endTime ? new Date(s.endTime) : undefined,
        }));
      }
      
      const sessions = data?.map(session => ({
        id: session.id,
        subjectId: session.subject_id,
        startTime: new Date(session.start_time),
        endTime: session.end_time ? new Date(session.end_time) : undefined,
        durationMinutes: session.duration_minutes,
        focusRating: session.focus_rating,
        notes: session.notes || '',
        completed: session.completed
      })) || [];
      
      // Also cache in localStorage for offline access
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
      
      return sessions;
    } else {
      // Use localStorage for unauthenticated users
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (!data) return [];
      const sessions = JSON.parse(data);
      return sessions.map((s: any) => ({
        ...s,
        startTime: new Date(s.startTime),
        endTime: s.endTime ? new Date(s.endTime) : undefined,
      }));
    }
  },

  saveSessions: async (sessions: StudySession[]) => {
    const userId = await getCurrentUserId();
    
    // Always save to localStorage first for immediate persistence
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    
    if (userId) {
      // Also save to database for cross-device sync
      // First, delete existing sessions for this user
      await supabase.from('study_sessions').delete().eq('user_id', userId);
      
      // Then insert new sessions
      if (sessions.length > 0) {
        const { error } = await supabase
          .from('study_sessions')
          .insert(sessions.map(session => ({
            id: session.id,
            user_id: userId,
            subject_id: session.subjectId,
            start_time: session.startTime.toISOString(),
            end_time: session.endTime?.toISOString(),
            duration_minutes: session.durationMinutes,
            focus_rating: session.focusRating,
            notes: session.notes,
            completed: session.completed
          })));
        
        if (error) {
          console.error('Error saving sessions to database:', error);
        }
      }
    }
  },

  getGoals: async (): Promise<StudyGoal[]> => {
    const userId = await getCurrentUserId();
    
    if (userId) {
      // Get from database (primary source for authenticated users)
      const { data, error } = await supabase
        .from('study_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching goals:', error);
        // Fallback to localStorage
        const localData = localStorage.getItem(STORAGE_KEYS.GOALS);
        if (!localData) return [];
        const goals = JSON.parse(localData);
        return goals.map((g: any) => ({
          ...g,
          targetDate: g.targetDate ? new Date(g.targetDate) : undefined,
          completedAt: g.completedAt ? new Date(g.completedAt) : undefined,
        }));
      }
      
      const goals = data?.map(goal => ({
        ...goal,
        subjectId: goal.subject_id,
        subjectIds: goal.subject_ids,
        targetDate: goal.target_date ? new Date(goal.target_date) : undefined,
        completedAt: goal.completed_at ? new Date(goal.completed_at) : undefined,
        examDate: goal.exam_date ? new Date(goal.exam_date) : undefined,
        examTime: goal.exam_time,
        examLocation: goal.exam_location,
        studyHoursTarget: goal.study_hours_target,
        isExam: goal.is_exam
      })) || [];
      
      // Also cache in localStorage for offline access
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      
      return goals;
    } else {
      // Use localStorage for unauthenticated users
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (!data) return [];
      const goals = JSON.parse(data);
      return goals.map((g: any) => ({
        ...g,
        targetDate: g.targetDate ? new Date(g.targetDate) : undefined,
        completedAt: g.completedAt ? new Date(g.completedAt) : undefined,
      }));
    }
  },

  saveGoals: async (goals: StudyGoal[]) => {
    const userId = await getCurrentUserId();
    
    // Always save to localStorage first for immediate persistence
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    
    if (userId) {
      // Also save to database for cross-device sync
      // First, delete existing goals for this user
      await supabase.from('study_goals').delete().eq('user_id', userId);
      
      // Then insert new goals
      if (goals.length > 0) {
        const { error } = await supabase
          .from('study_goals')
          .insert(goals.map(goal => ({
            id: goal.id,
            user_id: userId,
            subject_id: goal.subjectId,
            subject_ids: goal.subjectIds,
            title: goal.title,
            description: goal.description,
            target_date: goal.targetDate?.toISOString(),
            completed: goal.completed,
            completed_at: goal.completedAt?.toISOString(),
            is_exam: goal.isExam,
            exam_date: goal.examDate?.toISOString(),
            exam_time: goal.examTime,
            exam_location: goal.examLocation,
            study_hours_target: goal.studyHoursTarget
          })));
        
        if (error) {
          console.error('Error saving goals to database:', error);
        }
      }
    }
  },

  getSchedule: (): ScheduleSlot[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    return data ? JSON.parse(data) : [];
  },

  saveSchedule: (schedule: ScheduleSlot[]) => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  },
};
