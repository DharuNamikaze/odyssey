'use client'
import React, { useState } from 'react';
import '../src/app/globals.css';
import { IconPlus } from '@tabler/icons-react';
import HabitModal from '../src/app/Habits/HabitModal';
import { useHabits } from '../src/app/Habits/useHabits';

const CreateButton = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<'create' | 'quit'>('create');
    const { createHabit } = useHabits();

    const handleOpen = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleSave = async (habitData: any) => {
        try {
            await createHabit(habitData);
            handleClose();
        } catch (error) {
            console.error('Error creating habit:', error);
        }
    };

    const openCreateHabit = () => {
        setModalMode('create');
        handleOpen();
    };

    const openQuitHabit = () => {
        setModalMode('quit');
        handleOpen();
    };

    return (
        <>
            {/* Floating Action Button */}
            <div className="fab-container group" role="region" aria-label="Habit actions menu">
                {/* Main Create Button */}
                <button 
                    type="button" 
                    title="Create New Habit" 
                    className="fab-main"
                    onClick={openCreateHabit}
                    aria-label="Create new habit"
                    aria-expanded="false"
                >
                    <IconPlus width={24} height={24} className="text-white" />
                </button>

                {/* Quick Actions Menu */}
                <div className="fab-menu" role="menu" aria-label="Quick habit actions">
                    {/* Create New Habit */}
                    <button
                        onClick={openCreateHabit}
                        className="fab-secondary"
                        title="Create New Habit"
                        role="menuitem"
                        aria-label="Create new habit"
                    >
                        <IconPlus width={20} height={20} className="text-white" />
                    </button>
                    
                    {/* Quit Bad Habit */}
                    <button
                        onClick={openQuitHabit}
                        className="fab-danger"
                        title="Quit Bad Habit"
                        role="menuitem"
                        aria-label="Quit bad habit"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Habit Creation Modal */}
            <HabitModal
                isOpen={isModalOpen}
                onClose={handleClose}
                onSave={handleSave}
                mode={modalMode}
            />
        </>
    );
};

export default CreateButton;