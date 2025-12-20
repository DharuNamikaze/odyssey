'use client';
import React, { useState, useCallback } from 'react';
import SideBar from '../../../components/SideBar';
import { NavBar } from '../../../components/NavBar';
import CreateButton from '../../../components/CreateButton';
import '../globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Memoized toggle function to prevent unnecessary re-renders
    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);

    return (
        <div className="min-h-screen flex bg-[#1f1f1f]">
            {/* Sidebar - with transition for smooth open/close */}
            <div className={`
                fixed top-0 left-0 h-screen bg-[#1f1f1f] p-2 z-20
                transition-all duration-200 ease-linear
                ${isSidebarOpen 
                    ? 'translate-x-0 w-64' 
                    : '-translate-x-full w-64'
                }
            `}>
                <SideBar onClose={toggleSidebar} />
            </div>

            {/* Overlay for mobile/smaller screens when sidebar is open */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
                    onClick={toggleSidebar}
                    aria-label="Close sidebar"
                />
            )}

            {/* Main Content */}
            <div className={`
                flex-1 relative transition-all duration-300 ease-in-out
                ${isSidebarOpen ? 'ml-64' : 'ml-0'}
                max-w-full
            `}>
                {/* Top Navigation Bar */}
                <div className={`
                    fixed top-0 py-2 right-4 bg-[#1f1f1f] z-10
                    transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? 'left-60' : 'left-4'}
                `}>
                    <NavBar onMenuToggle={toggleSidebar} />
                </div>

                {/* Page Content */}
                <div className="mt-16 pr-4 pl-4">
                    {children}
                </div>
            </div>

            {/* Floating Create Button */}
            <CreateButton />
        </div>
    );
}