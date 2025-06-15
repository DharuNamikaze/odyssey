'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Page } from './types';
import { auth } from '../../../lib/firebase';
import { IconPlus } from '@tabler/icons-react';
import { onAuthStateChanged } from 'firebase/auth';
import { usePage } from '../../../context/PageContext';

export default function Pages() {
  const [loading, setLoading] = useState(true);
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
        return;
      }
      fetchPages(user.uid);
    });
    return () => unsubscribe();
  }, [page, router]);

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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end gap-3 items-center text-center mb-8">
        <h1 className="text-3xl font-bold flex justify-normal">My Pages</h1>
        <div className='flex items-center justify-end gap-4'>
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
            key={p.id}
            className="p-6 border rounded-lg hover:shadow-lg hover:bg-[#2e2e2f] transition-shadow cursor-pointer flex items-center "
          >

            <div
              onClick={() => router.push(`/Pages/${p.id}`)}
              className="flex-1 cursor-pointer"
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
  );
}