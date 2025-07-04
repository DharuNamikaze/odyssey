'use client'
import React from 'react'
import Image from 'next/image';
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
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="flex items-center justify-center">
        <IconFidgetSpinner className="loader w-8 h-8 text-white" />
      </div>
    </div>
  );
  return (

    <>
      {loading && LoadingModal()}
      <div className='grid items-center gap-5 overflow-hidden max-lg:grid-cols-2 grid-cols-6 '>

        <div className='flex flex-col justify-center items-center' >
          <span
            className={achieve
              ? `text-indigo-400 shadow-xl shadow-black rounded-full mt-5`
              : `shadow-xl shadow-black rounded-full mt-5 grayscale opacity-50`
            }
          ><Image src="/assets/consistencyKing.png" alt="consistency" height={100} width={100} /></span>
          <span className={`text-base mt-4 ${achieve ? '' : 'text-gray-500'}`}>
            Consistency
          </span>
        </div>

        <div className='flex flex-col justify-center items-center'>
          <span
            className={achieve
              ? `text-red-400 shadow-xl shadow-black rounded-full mt-5`
              : `shadow-xl shadow-black rounded-full mt-5 grayscale opacity-50`
            }
          ><Image src="/assets/brainer1.webp" alt="Brainer" width={100} height={100} /></span>
          <span className={`text-base mt-4 ${achieve ? '' : 'text-gray-500'}`}>
            Galaxy Brain
          </span>
        </div>

        {/* <div className='flex flex-col justify-center items-center'>
          <span
            className={achieve
              ? `text-red-400 shadow-xl shadow-black rounded-full mt-5 p-5`
              : `shadow-xl shadow-black rounded-full mt-5 grayscale opacity-50 p-5`
            }
          ><IconEggCracked /></span>
          <span className={`text-base mt-4 ${achieve ? '' : 'text-gray-500'}`}>
            Breaking Bad
          </span>
        </div> */}

        <div className='flex flex-col justify-center items-center'>
          <span
            className={achieve
              ? `text-red-400 shadow-xl shadow-black rounded-full mt-5`
              : `shadow-xl shadow-black rounded-full mt-5 grayscale opacity-50 w-[200]`
            }
          ><Image src="/assets/Athlete.png" height={95} width={95} alt='Athelete' /></span>
          <span className={`text-base mt-4 ${achieve ? '' : 'text-gray-500'}`}>
            Athlete
          </span>
        </div>

        {/* <div className='flex flex-col justify-center items-center'>
          <span
            className={achieve
              ? `text-red-400 shadow-xl shadow-black rounded-full mt-5 `
              : `shadow-xl shadow-black rounded-full mt-5 grayscale opacity-50`
            }
          ><IconHeart /></span>
          <span className={`text-base mt-4 ${achieve ? '' : 'text-gray-500'}`}>
            Jack Of All Trades
          </span>
        </div> */}

        <div className='flex flex-col justify-center items-center p-0'>
          <span
            className={achieve
              ? `text-yellow-400 shadow-xl shadow-black rounded-full mt-5 p-0`
              : `shadow-xl shadow-black rounded-full mt-5 grayscale opacity-50 p-0`
            }
          ><Image src="/assets/habitHackerr.png" alt='HH' height={100} width={100} className='p-0' /></span>
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
