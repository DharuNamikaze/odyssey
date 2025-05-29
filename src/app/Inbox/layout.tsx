import React from 'react';
import Sidebar from '../../../components/sideBar';
import { NavBar } from '../../../components/NavBar';
import '../globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex bg-[#1f1f1f]">
            {/* Sidebar */}
            <div className="fixed top-0 left-0 h-screen w-64 bg-[#1f1f1f] p-2">
                <Sidebar />
            </div>
            {/* Main Content */}
            <div className="flex-1 ml-64 relative max-w-[calc(100%-16rem)]">
                {/* Top Navigation Bar */}
                <div className="fixed top-0 py-2 right-4 left-60 bg-[#1f1f1f] z-10">
                    <NavBar />
                </div>
                <div className="mt-16 pr-4 ">
                    {children}
                </div>
            </div>
        </div>
    );
}