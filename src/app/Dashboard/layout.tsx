import React from 'react';
import Sidebar from '../../../components/ui/Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="flex h-screen overflow-hidden text-white z-50">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {children}
            </div>
        </div>
    );
}
