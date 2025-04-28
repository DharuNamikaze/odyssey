import React from 'react'
import { IconFidgetSpinner } from '@tabler/icons-react'

export default function Loading(){
  return (
    <div className="fixed h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 flex items-center justify-center h-screen">
            <div className='mb-3 flex items-center justify-center h-screen'><IconFidgetSpinner className='loader' /></div>
          </div>
        </div>
  )
}
