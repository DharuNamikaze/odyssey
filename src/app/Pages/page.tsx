'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Page } from './types';
import { auth } from '../../../lib/firebase';
import { IconSquareRoundedPlus } from '@tabler/icons-react';
import { onAuthStateChanged } from 'firebase/auth';
import { usePage } from '../../../context/PageContext';

export default function Pages() {
  

  // if (loading) {
  //   return <div className="flex items-center justify-center min-h-screen">
  //     <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
  //   </div>;
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Pages</h1>
        <button
          onClick={createNewPage}
          className="p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <IconSquareRoundedPlus />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <div
            key={page.id}
            onClick={() => router.push(`/Pages/${page.id}`)}
            className="p-6 border rounded-lg hover:shadow-xl hover:bg-[#2e2e2f] transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              {page.icon && <span>{page.icon}</span>}
              <h2 className="text-xl font-semibold">{page.title}</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Last updated: {new Date(page.updatedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}