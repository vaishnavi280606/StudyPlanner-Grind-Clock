export interface Subject {
  id: string;
  name: string;
  color: string;
  difficulty: number;
  priority: number;
  targetHoursPerWeek: number;
  targetHoursPerDay?: number;
}

export interface StudySession {
  id: string;
  subjectId: string;
  startTime: Date;
  endTime?: Date;
  durationMinutes?: number;
  focusRating?: number;
  notes: string;
  completed: boolean;
}

export interface StudyGoal {
  id: string;
  subjectId?: string;
  subjectIds?: string[]; // For exams with multiple subjects
  title: string;
  description: string;
  targetDate?: Date;
  completed: boolean;
  completedAt?: Date;
  isExam?: boolean;
  examDate?: Date;
  examTime?: string;
  examLocation?: string;
  studyHoursTarget?: number;
}

export interface ScheduleSlot {
  id: string;
  subjectId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface ProductivityInsight {
  type: 'peak_hours' | 'weak_subjects' | 'streak' | 'recommendation';
  title: string;
  description: string;
  data?: any;
}
