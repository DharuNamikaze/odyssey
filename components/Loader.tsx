import React from 'react'
import { IconFidgetSpinner } from '@tabler/icons-react'

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="flex items-center justify-center">
        <IconFidgetSpinner className="loader w-8 h-8 text-white" />
      </div>
    </div>
  )
}