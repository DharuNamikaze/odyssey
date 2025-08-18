'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { IconMenu2 } from '@tabler/icons-react';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';

interface NavBarProps {
  onMenuToggle?: () => void;
}

export function NavBar({ onMenuToggle }: NavBarProps) {
  const [streak, setStreak] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const [imgError, setImgError] = useState(false);

  // Memoize greeting calculation to avoid recalculating on every render
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 1 && hour < 12) return 'Good Morning 🌞';
    if (hour >= 12 && hour < 16) return 'Good Afternoon ☀️';
    if (hour >= 16 && hour < 19) return 'Good Evening 🌇';
    return 'Good Night 🌝';
  }, []); // Only recalculate when component mounts

  // Memoize avatar URL to prevent unnecessary re-renders
  const avatarUrl = useMemo(() => 
    user?.photoURL || '/assets/consistencyKing.png', 
    [user?.photoURL]
  );

  // Use useCallback for event handlers to prevent unnecessary re-renders of child components
  const handleImageError = useCallback(() => {
    setImgError(true);
  }, []);

  const handleMenuToggle = useCallback(() => {
    onMenuToggle?.();
  }, [onMenuToggle]);

  // Firebase auth listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setImgError(false); // Reset image error when user changes
    });
    return unsubscribe;
  }, []);

  // Update streak based on user state
  useEffect(() => {
    setStreak(prev => user ? prev + 1 : 0);
  }, [user]);

  return (
    <nav
      className="flex bg-gradient-to-tr from-black to-neutral-800 shadow-2xl shadow-black 
      rounded-full p-4 h-[7vh] w-full items-center gap-3 z-10"
      role="navigation"
      aria-label="Main navigation"
    >
      <button 
        type="button" 
        title="Toggle menu" 
        onClick={handleMenuToggle}
        className="text-white hover:text-gray-400 transition-colors"
        aria-label="Toggle navigation menu"
      >
        <IconMenu2 />
      </button>

      <span className="text-lg text-white">{greeting}</span>

      <div className="flex items-center justify-end flex-1 gap-6 text-sm">
        <span className="cursor-pointer rounded-full text-white flex items-center gap-1">
          <span>🌟</span>
          <span>125</span>
        </span>
        
        <span className="cursor-pointer rounded-full text-white flex items-center gap-1">
          <span>{streak}</span>
          <span>🔥</span>
        </span>

        {imgError ? (
          <div 
            className="text-white bg-gray-700 p-2 rounded-full flex items-center justify-center w-[35px] h-[35px]"
            title={user?.displayName || 'User avatar'}
          >
            👤
          </div>
        ) : (
          <Image
            className="hover:bg-[#688069] cursor-pointer rounded-full transition-colors"
            src={avatarUrl}
            width={35}
            height={35}
            alt={user?.displayName || 'User avatar'}
            onError={handleImageError}
            priority={false}
            loading="lazy"
          />
        )}
      </div>
    </nav>
  );
}

export default React.memo(NavBar);