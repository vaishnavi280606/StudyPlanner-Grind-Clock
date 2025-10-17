import { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { Subject, StudySession } from '../types';

interface StudyTimerProps {
  subjects: Subject[];
  onSessionComplete: (session: Omit<StudySession, 'id'>) => void;
  isDarkMode: boolean;
}

export function StudyTimer({ subjects, onSessionComplete, isDarkMode }: StudyTimerProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [notes, setNotes] = useState('');
  const [focusRating, setFocusRating] = useState<number>(3);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning && startTime) {
      interval = window.setInterval(() => {
        const now = new Date();
        setElapsedSeconds(Math.floor((now.getTime() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime]);

  const handleStart = () => {
    if (!selectedSubjectId) {
      alert('Please select a subject first');
      return;
    }
    setStartTime(new Date());
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    if (!startTime || !selectedSubjectId) return;

    const endTime = new Date();
    const durationMinutes = Math.floor(elapsedSeconds / 60);

    if (durationMinutes < 1) {
      alert('Session must be at least 1 minute long');
      return;
    }

    const session: Omit<StudySession, 'id'> = {
      subjectId: selectedSubjectId,
      startTime,
      endTime,
      durationMinutes,
      focusRating,
      notes,
      completed: true,
    };

    onSessionComplete(session);

    setIsRunning(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setNotes('');
    setFocusRating(3);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`rounded-xl p-8 shadow-md border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-3 mb-6">
        <Clock className="text-amber-600" size={28} />
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Grind Timer</h2>
      </div>

      {!isRunning && !startTime && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Select Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
            >
              <option value="">Choose a subject...</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleStart}
            disabled={!selectedSubjectId}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed text-lg font-semibold"
          >
            <Play size={24} />
            Start Session
          </button>
        </div>
      )}

      {startTime && (
        <div className="space-y-6">
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: subjects.find((s) => s.id === selectedSubjectId)?.color,
                }}
              />
              <span className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {subjects.find((s) => s.id === selectedSubjectId)?.name}
              </span>
            </div>
            <div className={`text-6xl font-bold mb-6 font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {formatTime(elapsedSeconds)}
            </div>
          </div>

          <div className="flex gap-3">
            {isRunning ? (
              <button
                onClick={handlePause}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
              >
                <Pause size={20} />
                Pause
              </button>
            ) : (
              <button
                onClick={() => setIsRunning(true)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-colors font-semibold"
              >
                <Play size={20} />
                Resume
              </button>
            )}
            <button
              onClick={handleStop}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              <Square size={20} />
              Stop & Save
            </button>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Session Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'border-slate-300'}`}
              rows={3}
              placeholder="What did you grind? Any key takeaways?"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Focus Rating: {focusRating}/5
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFocusRating(rating)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    focusRating >= rating
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                      : isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
