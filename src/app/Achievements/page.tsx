'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import { IconFidgetSpinner } from '@tabler/icons-react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import Image from 'next/image';
function Page() {
  const [bro, setBro] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [achieve, setAchieve] = useState<boolean>(false)

  useEffect(() => {
    const fetchBro = () => {
      try {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentBro) => {
          if (currentBro) setBro(currentBro);
          else setBro(null);
          setLoading(false)
        })
        return () => unsubscribe;
      } catch (err) {
        console.log(err, "Error ra elai")
        setLoading(false)
      }
    }
    fetchBro()
  }, [bro])
  const LoadingModal = () => (
    <div className="fixed h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100">
      <div className="p-6 flex items-center justify-center h-screen">
        <div className='mb-3 flex items-center justify-center h-screen'><IconFidgetSpinner className='loader' /></div>
      </div>
    </div>
  );
  return (

    <>
      {loading && LoadingModal()}
      <div className='flex items-center '>
        <div className='flex flex-col justify-center items-center'>
          <Image
            src="/consistencyKing.png"
            alt="KingMedal"
            width={200}
            height={200}
            className={achieve
              ? `shadow-2xl shadow-black rounded-full m-10 `
              : `text-white shadow-2xl shadow-black rounded-full m-10 grayscale opacity-50`
            }
          />
          <span className={`text-lg mt-4 ${achieve ? 'text-green-400' : 'text-gray-500'} transition-colors duration-500`}>
            Consistency
          </span>
        </div>


        {/* Habit Hacker Badge */}
        <div className='flex flex-col justify-center items-center'>
          <Image
            src="/consistencyKing.png"
            alt="KingMedal"
            width={200}
            height={200}
            className={achieve
              ? `shadow-2xl shadow-black rounded-full m-10 `
              : `text-white shadow-2xl shadow-black rounded-full m-10 grayscale opacity-50`
            }
          />
          <span className={`text-lg mt-4 ${achieve ? 'text-green-400' : 'text-gray-500'} transition-colors duration-500`}>
            Habit
          </span>
        </div>
        {/* Grit */}
        <div className='flex flex-col justify-center items-center'>
          <Image
            src="/consistencyKing.png"
            alt="KingMedal"
            width={200}
            height={200}
            className={achieve
              ? `shadow-2xl shadow-black rounded-full m-10 `
              : `text-white shadow-2xl shadow-black rounded-full m-10 grayscale opacity-50`
            }
          />
          <span className={`text-lg mt-4 ${achieve ? 'text-green-400' : 'text-gray-500'} transition-colors duration-500`}>
            Grit
          </span>
        </div>
        {/* SleeperShell */}
        <div className='flex flex-col justify-center items-center'>
          <Image
            src="/consistencyKing.png"
            alt="KingMedal"
            width={200}
            height={200}
            className={achieve
              ? `shadow-2xl shadow-black rounded-full m-10 `
              : `text-white shadow-2xl shadow-black rounded-full m-10 grayscale opacity-50`
            }
          />
          <span className={`text-lg mt-4 ${achieve ? 'text-green-400' : 'text-gray-500'} transition-colors duration-500`}>
            SleeperShell
          </span>
        </div>
      </div>
    </>
  )
}
export default Page;
