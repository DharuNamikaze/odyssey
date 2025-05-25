'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import {
  IconFidgetSpinner,
  IconCrown,
  IconHeart,
  IconEggCracked,
} from '@tabler/icons-react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'

function Page() {
  const [bro, setBro] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [achieve, setAchieve] = useState<boolean>(true)

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
      <div className='flex items-center gap-10 '>
        <div className='flex flex-col justify-center items-center'>
          <span
            className={achieve
              ? `text-indigo-400 shadow-xl shadow-black rounded-full mt-5 p-5`
              : `shadow-xl shadow-black rounded-full mt-5 grayscale opacity-50 p-5`
            }
          ><IconCrown /></span>
          <span className={`text-base mt-4 ${achieve ? '' : 'text-gray-500'}`}>
            Consistency
          </span>
        </div>
        <div className='flex flex-col justify-center items-center'>
          <span
            className={achieve
              ? `text-red-400 shadow-xl shadow-black rounded-full mt-5 p-5`
              : `shadow-xl shadow-black rounded-full mt-5 grayscale opacity-50 p-5`
            }
          ><IconHeart /></span>
          <span className={`text-base mt-4 ${achieve ? '' : 'text-gray-500'}`}>
            Breaking Bad
          </span>
        </div>

        <div className='flex flex-col justify-center items-center'>
          <span
            className={achieve
              ? `text-red-400 shadow-xl shadow-black rounded-full mt-5 p-5`
              : `shadow-xl shadow-black rounded-full mt-5 grayscale opacity-50 p-5`
            }
          ><IconEggCracked /></span>
          <span className={`text-base mt-4 ${achieve ? '' : 'text-gray-500'}`}>
            Breaking Bad
          </span>
        </div>

        <div className='flex flex-col justify-center items-center'>
          <span
            className={achieve
              ? `text-red-400 shadow-xl shadow-black rounded-full mt-5 p-5`
              : `shadow-xl shadow-black rounded-full mt-5 grayscale opacity-50 p-5`
            }
          ><IconHeart /></span>
          <span className={`text-base mt-4 ${achieve ? '' : 'text-gray-500'}`}>
            Deadly Sin
          </span>
        </div>

        <div className='flex flex-col justify-center items-center'>
          <span
            className={achieve
              ? `text-red-400 shadow-xl shadow-black rounded-full mt-5 p-5`
              : `shadow-xl shadow-black rounded-full mt-5 grayscale opacity-50 p-5`
            }
          ><IconHeart /></span>
          <span className={`text-base mt-4 ${achieve ? '' : 'text-gray-500'}`}>
            Jack Of All Trades
          </span>
        </div>

        <div className='flex flex-col justify-center items-center'>
          <span
            className={achieve
              ? `text-yellow-400 shadow-xl shadow-black rounded-full mt-5 p-5`
              : `shadow-xl shadow-black rounded-full mt-5 grayscale opacity-50 p-5`
            }
          ><IconHeart /></span>
          <span className={`text-base mt-4 ${achieve ? '' : 'text-gray-500'}`}>
            Habit Hacker
          </span>
        </div>


        {/* Habit Hacker Badge */}

        {/* Grit */}

        {/* SleeperShell */}

      </div>
    </>
  )
}
export default Page;
