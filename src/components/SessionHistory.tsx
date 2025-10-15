import { Calendar, Clock, Brain, FileText } from 'lucide-react';
import { StudySession, Subject } from '../types';

interface SessionHistoryProps {
  sessions: StudySession[];
  subjects: Subject[];
}

export function SessionHistory({ sessions, subjects }: SessionHistoryProps) {
  const sortedSessions = [...sessions]
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 20);

  const getSubjectName = (subjectId: string) => {
    return subjects.find((s) => s.id === subjectId)?.name || 'Unknown Subject';
  };

  const getSubjectColor = (subjectId: string) => {
    return subjects.find((s) => s.id === subjectId)?.color || '#6b7280';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Session History</h2>

      {sortedSessions.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-md border border-slate-200 text-center">
          <Calendar className="mx-auto text-slate-400 mb-4" size={48} />
          <p className="text-slate-600">No study sessions yet. Start your first session!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getSubjectColor(session.subjectId) }}
                  />
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {getSubjectName(session.subjectId)}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                      <Calendar size={14} />
                      <span>{formatDate(session.startTime)}</span>
                      <span>•</span>
                      <span>{formatTime(session.startTime)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Clock size={16} />
                    <span className="text-sm font-medium">
                      {session.durationMinutes}m
                    </span>
                  </div>
                  {session.focusRating && (
                    <div className="flex items-center gap-1 text-slate-600">
                      <Brain size={16} />
                      <span className="text-sm font-medium">{session.focusRating}/5</span>
                    </div>
                  )}
                </div>
              </div>

              {session.notes && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <FileText size={16} className="flex-shrink-0 mt-0.5" />
                    <p>{session.notes}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
