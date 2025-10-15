export interface Subject {
  id: string;
  name: string;
  color: string;
  difficulty: number;
  priority: number;
  targetHoursPerWeek: number;
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
  title: string;
  description: string;
  targetDate?: Date;
  completed: boolean;
  completedAt?: Date;
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
