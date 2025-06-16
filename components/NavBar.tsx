'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';

export function NavBar() {
  const [streak, setStreak] = useState<number>(0);
  const [bro, setBro] = useState<User | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentBro) => {
      setBro(currentBro);
      setAvatar(currentBro?.photoURL ?? null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (bro) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  }, [bro]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour >= 1 && hour < 12) return 'Good Morning 🌞';
    if (hour >= 12 && hour < 16) return 'Good Afternoon ☀️';
    if (hour >= 16 && hour < 19) return 'Good Evening 🌇';
    return 'Good Night 🌝';
  };

  return (
    <div className='flex bg-black shadow-2xl shadow-black rounded-full p-4 h-[7vh] w-full items-center gap-10 z-10'>
      <span className="text-lg">{greeting()}</span>
      <span className='flex justify-start flex-row-reverse flex-1 gap-4 text-sm'>
        {imgError ? (
          <span className="text-white bg-gray-700 p-2 rounded-full">👤</span> // 👤 or custom alt text
        ) : (
          <Image
            className='hover:bg-[#688069] cursor-pointer rounded-full z-50'
            src={avatar || '/consistencyKing.png'}
            width={35}
            height={35}
            alt="DP"
            onError={() => setImgError(true)}
          />
        )}
        <button className='hover:bg-[#688069] cursor-pointer rounded-full p-2 text-white'>{streak}🔥</button>
        <button className='hover:bg-[#688069] cursor-pointer rounded-full p-2 text-white'>🌟 125</button>
      </span>
    </div>
  );
}

export default React.memo(NavBar);
