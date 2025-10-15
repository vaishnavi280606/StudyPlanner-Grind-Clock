import { useState } from 'react';
import { Target, Plus, Check, Trash2 } from 'lucide-react';
import { StudyGoal, Subject } from '../types';

interface GoalsManagerProps {
  goals: StudyGoal[];
  subjects: Subject[];
  onAddGoal: (goal: Omit<StudyGoal, 'id'>) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

export function GoalsManager({
  goals,
  subjects,
  onAddGoal,
  onToggleGoal,
  onDeleteGoal,
}: GoalsManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    targetDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddGoal({
      ...formData,
      subjectId: formData.subjectId || undefined,
      targetDate: formData.targetDate ? new Date(formData.targetDate) : undefined,
      completed: false,
    });
    setFormData({ title: '', description: '', subjectId: '', targetDate: '' });
    setIsAdding(false);
  };

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Study Goals</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus size={20} />
            Add Goal
          </button>
        )}
      </div>

      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-6 shadow-md border border-slate-200"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">New Goal</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Goal Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Complete Chapter 5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
                placeholder="Additional details about this goal..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Subject (Optional)
                </label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">General Goal</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Target Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Add Goal
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setFormData({ title: '', description: '', subjectId: '', targetDate: '' });
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {activeGoals.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Active Goals</h3>
            <div className="space-y-3">
              {activeGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-white rounded-xl p-5 shadow-md border border-slate-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleGoal(goal.id)}
                      className="mt-1 w-6 h-6 rounded-full border-2 border-slate-300 hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center justify-center flex-shrink-0"
                    >
                      <Check size={14} className="text-transparent" />
                    </button>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">{goal.title}</h4>
                      {goal.description && (
                        <p className="text-sm text-slate-600 mb-2">{goal.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        {goal.subjectId && (
                          <div className="flex items-center gap-1">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor:
                                  subjects.find((s) => s.id === goal.subjectId)?.color ||
                                  '#6b7280',
                              }}
                            />
                            <span>
                              {subjects.find((s) => s.id === goal.subjectId)?.name}
                            </span>
                          </div>
                        )}
                        {goal.targetDate && (
                          <span>
                            Due: {new Date(goal.targetDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {completedGoals.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Completed Goals</h3>
            <div className="space-y-3">
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-slate-50 rounded-xl p-5 shadow-sm border border-slate-200"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleGoal(goal.id)}
                      className="mt-1 w-6 h-6 rounded-full bg-green-500 hover:bg-green-600 transition-all flex items-center justify-center flex-shrink-0"
                    >
                      <Check size={14} className="text-white" />
                    </button>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-600 line-through mb-1">
                        {goal.title}
                      </h4>
                      {goal.completedAt && (
                        <p className="text-xs text-slate-500">
                          Completed on {new Date(goal.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {goals.length === 0 && (
          <div className="bg-white rounded-xl p-12 shadow-md border border-slate-200 text-center">
            <Target className="mx-auto text-slate-400 mb-4" size={48} />
            <p className="text-slate-600">No goals yet. Add your first goal to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
