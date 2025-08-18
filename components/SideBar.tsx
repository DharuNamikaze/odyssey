'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
    IconEdit,
    IconNotes,
    IconFidgetSpinner,
    IconLayoutDashboard,
    IconAward,
    IconCannabis,
    IconBrain,
    IconX
} from '@tabler/icons-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getAuth, signOut } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { usePage } from '../context/PageContext';
import { Page } from '../src/app/Pages/types';

interface SideBarProps {
    onClose?: () => void;
}

export function SideBar({ onClose }: SideBarProps) {
    const { page, setPage } = usePage();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const router = useRouter();

    // Memoized filtered pages based on search query
    const filteredPages = useMemo(() => {
        if (!searchQuery.trim() || !page) return page;
        return page.filter((p: Page) => p.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [page, searchQuery]);

    // Memoized navigation items
    const navigationItems = useMemo(() => [
        { href: "/Dashboard", icon: IconLayoutDashboard, label: "Dashboard", color: "text-indigo-500" },
        { href: "/Achievements", icon: IconAward, label: "Achievements", color: "text-yellow-300" },
        { href: "/Habits", icon: IconCannabis, label: "Habits", color: "text-red-400" },
        { href: "/GritEngine", icon: IconBrain, label: "Grit Engine", color: "text-pink-400" }
    ], []);

    const handleSignOut = useCallback(async () => {
        try {
            setLoading(true);
            const auth = getAuth();
            await signOut(auth);
            console.log("User signed out successfully");
            router.push("/");
        } catch (error) {
            console.error("Sign out error:", error);
        } finally {
            setLoading(false);
        }
    }, [router]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    // Combined auth effect - more efficient than separate effects
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            if (currentUser) {
                try {
                    const token = await currentUser.getIdToken();
                    const response = await fetch('/api/pages', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setPage(data.pages);
                    }
                } catch (err) {
                    console.error('Failed to fetch pages:', err);
                }
            }
        });

        return unsubscribe;
    }, [setPage]);

    const LoadingModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4">
                <IconFidgetSpinner className="w-8 h-8 text-white animate-spin" />
                <span className="text-white text-sm">Loading...</span>
            </div>
        </div>
    );

    return (
        <>
            {loading && <LoadingModal />}
            <nav className="text-xs bg-gradient-to-tr from-black to-zinc-900 p-3 flex flex-col h-full w-full rounded-lg z-30 space-y-5">
                {/* Header with close button */}
                <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <div className="flex items-center gap-2">
                        <strong className="text-white truncate">{user?.displayName || 'User'}</strong>
                        <Link href="/Pages" className="hover:text-gray-300 ">
                            <IconEdit className="w-4 h-4" />
                        </Link>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-gray-400 hover:text-white "
                        aria-label="Close sidebar"
                    >
                        <IconX className="w-4 h-4" />
                    </button>
                </div>

                {/* Menu Section */}
                <section className="space-y-2">
                    <h3 className="text-blue-400 font-medium">Menu</h3>
                    <input
                        className="w-full rounded-lg p-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 focus:border-blue-400 focus:outline-none "
                        placeholder="Search pages..."
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        aria-label="Search pages"
                    />
                    <Link href="/Inbox" className="block">
                        <div className="rounded-lg p-2 hover:bg-gray-700 text-white  cursor-pointer">
                            Inbox
                        </div>
                    </Link>
                    <Link href="/" className="block">
                        <div className="rounded-lg p-2 hover:bg-gray-700 text-white  cursor-pointer">
                            Odyssey AI
                        </div>
                    </Link>
                </section>

                {/* Personal Section */}
                <section className="space-y-2">
                    <h3 className="text-blue-400 font-medium">Personal</h3>
                    {navigationItems.map(({ href, icon: Icon, label, color }) => (
                        <Link key={href} href={href} className="block">
                            <div className="rounded-lg p-2 hover:bg-gray-700 text-white flex items-center gap-2  cursor-pointer">
                                <Icon className={`w-4 h-4 ${color}`} />
                                <span>{label}</span>
                            </div>
                        </Link>
                    ))}
                </section>

                {/* Favorites Section */}
                <section className="space-y-2">
                    <h3 className="text-blue-400 font-medium">Favorites</h3>
                    <div className="text-gray-500 text-sm p-2">No favorites yet</div>
                </section>

                {/* Private Pages Section */}
                <section className="flex-1 flex flex-col space-y-2 min-h-0">
                    <h3 className="text-blue-400 font-medium">Private Pages</h3>
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-600 space-y-1">
                        {filteredPages && filteredPages.length > 0 ? (
                            filteredPages.map((pageItem: Page) => (
                                <Link key={pageItem.id} href={`/Pages/${pageItem.id}`} className="block">
                                    <div className="flex items-center gap-2 w-full rounded-lg p-2 hover:bg-gray-700 text-white  cursor-pointer group">
                                        <IconNotes className="w-4 h-4 text-gray-400 group-hover:text-white  flex-shrink-0" />
                                        <span className="truncate text-sm">{pageItem.title}</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-gray-500 text-sm p-2">
                                {searchQuery ? 'No pages found' : 'No pages yet'}
                            </div>
                        )}
                    </div>
                </section>

                {/* Logout Button */}
                <button
                    className="rounded-lg p-2 bg-red-900 hover:bg-red-800 text-white  font-medium"
                    onClick={handleSignOut}
                    disabled={loading}
                >
      
                </button>
            </nav>
        </>
    );
}

export default React.memo(SideBar);