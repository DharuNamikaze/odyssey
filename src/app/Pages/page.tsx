'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Page } from './types';
import { auth } from '../../../lib/firebase';
import { IconPlus, IconFidgetSpinner } from '@tabler/icons-react';
import { usePage } from '../../../context/PageContext';
import Image from 'next/image';
import ProtectedRoute from '../../../components/ProtectedRoute';
export default function Pages() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { page, setPage } = usePage();
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [click, setClick] = useState<boolean>(false);

  // Only fetch if not already in context
  useEffect(() => {
    if (page && page.length > 0) {
      setLoading(false);
      return;
    }
    // Get current user from auth context
    const user = auth.currentUser;
    if (user) {
      fetchPages(user.uid);
    }
  }, [page]);

  const fetchPages = useCallback(async (userId: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Not Authenticated");
      const response = await fetch('/api/pages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPage(data.pages);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  }, [setPage]);

  const createNewPage = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: '',
          content: '',
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create page');
      }

      const data = await response.json();

      if (data.page && data.page.id) {
        router.push(`/Pages/${data.page.id}`);
        setPage(prev => [...prev, data.page])
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error creating page:', error);
      // You might want to show this error to the user through a toast or alert
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async () => {
    setClick(prev => !click)
    if (selectedPages.length === 0) return;
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Not Authenticated enough to delete pages");

      // Optimistically update UI
      setPage(prev => prev.filter((p: Page) => !selectedPages.includes(p.id)));

      // Send batch delete request (assuming your API supports it)
      const response = await fetch("/api/pages", {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': "application/json"
        },
        body: JSON.stringify({ ids: selectedPages })
      });

      if (!response.ok) {
        throw new Error("Failed to delete pages");
      }
      setSelectedPages([]);
      setClick(prev => !click)
    } catch (error) {
      console.error("Page(s) could not be deleted", error);
      // Optionally, revert UI if error
    }
  }

  {
    loading &&
      (<div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <IconFidgetSpinner className="w-8 h-8 text-white animate-spin" />
      </div>)
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end gap-3 items-center text-center mb-8">
        <h1 className="text-3xl font-bold flex">My Pages</h1>
        <div className='flex items-center gap-4'>
          <button
            onClick={createNewPage}
            className="flex justify-end text-white rounded-2xl hover:bg-[#424242] hover:shadow-black hover:shadow-xl transition-colors"
          >
            <IconPlus />
          </button>
          <button
            onClick={deletePage}
            // disabled={selectedPages.length === 0}
            className={`text-white rounded-2xl hover:bg-red-800 hover:shadow-lg hover:shadow-black transition-colors rotate-45`}
          >
            <IconPlus />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {page && page.map((p: Page) => (
          <div
            onClick={() => router.push(`/Pages/${p.id}`)}
            key={p.id}
            className="  border rounded-3xl hover:shadow-lg hover:bg-[#2e2e2f] transition-shadow cursor-pointer flex items-center flex-col "
          >
            <span>
              <Image src="/favicon.svg" alt="alt" priority={true} height={100} width={100} />
            </span>
            <div

              className="flex-1 cursor-pointer pt-10 pb-5"
            >
              <div className="flex items-center gap-2 mb-2">
                {p.icon && <span>{p.icon}</span>}
                <h2 className="text-xl font-semibold">{p.title}</h2>
              </div>
              <p className="text-gray-600 text-sm">
                Last updated: {new Date(p.updatedAt).toLocaleDateString()}
              </p>
            </div>
            {click && <input
              title="checkbox"
              type="checkbox"
              checked={selectedPages.includes(p.id)}
              onChange={() => {
                setSelectedPages(prev =>
                  prev.includes(p.id)
                    ? prev.filter(id => id !== p.id)
                    : [...prev, p.id]
                );
              }}
              className="mr-2 flex justify-end w-6 h-6 rounded-full p-0"
            />}
          </div>
        ))}
      </div>
    </div>
    </ProtectedRoute>
  );
}