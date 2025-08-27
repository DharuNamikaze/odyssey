'use client'
import React from 'react'
import Image from 'next/image';
import { useState } from 'react';
import {
  IconFidgetSpinner,
  IconCrown,
  IconHeart,
  IconEggCracked,
} from '@tabler/icons-react';
import ProtectedRoute from '../../../components/ProtectedRoute';

function Page() {
  const [achieve, setAchieve] = useState<boolean>(true)

  const LoadingModal = () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="flex items-center justify-center">
        <IconFidgetSpinner className="loader w-8 h-8 text-white" />
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
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
      </div>
    </ProtectedRoute>
  );
}

export default Page;
