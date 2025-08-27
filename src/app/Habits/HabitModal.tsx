import React, { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import { Habit, CreateHabitData } from './useHabits';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: CreateHabitData) => Promise<void>;
  habit?: Habit | null;
  mode: 'create' | 'edit' | 'quit';
}

const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  habit,
  mode
}) => {
  const [formData, setFormData] = useState<CreateHabitData>({
    name: '',
    type: 'new',
    category: 'wellness',
    target: 21
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (habit && mode === 'edit') {
      setFormData({
        name: habit.name,
        type: habit.type,
        category: habit.category,
        target: habit.target
      });
    } else {
      setFormData({
        name: '',
        type: mode === 'quit' ? 'quit' : 'new',
        category: 'wellness',
        target: 21
      });
    }
  }, [habit, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      console.log('Submitting habit with data:', formData); // Debug log
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving habit:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-2xl p-6 w-full max-w-md mx-4 border border-neutral-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {mode === 'create' && (
              <>
                <Edit3 className="w-5 h-5 text-green-400" />
                Create New Habit
              </>
            )}
            {mode === 'edit' && (
              <>
                <Edit3 className="w-5 h-5 text-blue-400" />
                Edit Habit
              </>
            )}
            {mode === 'quit' && (
              <>
                <Edit3 className="w-5 h-5 text-red-400" />
                Quit Bad Habit
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Habit Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="e.g., Morning meditation"
              required
            />
          </div>

          {/* Habit Type */}
          {/* {mode === 'create' && <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Habit Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="new">New Habit</option>
              <option value="quit">Quit Bad Habit</option>
            </select>
          </div>} */}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="wellness">Wellness</option>
              <option value="learning">Learning</option>
              <option value="health">Health</option>
              <option value="skill">Skill Development</option>
              <option value="digital">Digital Wellness</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Target Days */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Target Days
            </label>
            <input
              type="number"
              value={formData.target}
              onChange={(e) => setFormData(prev => ({ ...prev, target: parseInt(e.target.value) || 1 }))}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
              min="1"
              max="365"
              required
            />
            <p className="text-xs text-neutral-400 mt-1">
              How many days do you want to maintain this habit?
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {mode === 'create' ? 'Create' : mode === 'quit' ? 'Quit' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitModal;
