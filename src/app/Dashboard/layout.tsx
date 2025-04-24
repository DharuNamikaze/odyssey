import React from 'react';
import Sidebar from '../../../components/ui/Sidebar';
import { NavBar } from '../../../components/ui/NavBar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex">
            {/* Fixed Sidebar */}
            <div className="fixed inset-y-0 left-0 w-[30vh] z-50">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 ml-[30vh]">
                {/* Fixed Navbar */}
                <div className="fixed top-0 right-0 left-[30vh] z-40">
                    <NavBar />
                </div>

                {/* Page Content */}
                <main className="flex-1 mt-[64px] p-4 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}