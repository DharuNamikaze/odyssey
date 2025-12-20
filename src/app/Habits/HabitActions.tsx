import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Edit3, Trash2 } from 'lucide-react';
import { Habit } from './useHabits';
import ConfirmationModal from './ConfirmationModal';

interface HabitActionsProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

const HabitActions: React.FC<HabitActionsProps> = ({ habit, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = () => {
    setIsOpen(false);
    onEdit(habit);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
    setIsOpen(false);
  };

  return (
    <>
      <div className="flex gap-1">
        {/* <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-all"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button> */}

        <button
          onClick={handleEdit}
          className="rounded-lg  w-full p-2.5 text-left text-sm text-neutral-300 hover:bg-neutral-700 flex items-center gap-2 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className=" rounded-lg  w-full p-2.5 text-left text-sm text-red-400 hover:bg-neutral-700 flex items-center gap-2 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => onDelete(habit.id)}
        title="Delete Habit"
        message={`Are you sure you want to delete "${habit.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default HabitActions;
