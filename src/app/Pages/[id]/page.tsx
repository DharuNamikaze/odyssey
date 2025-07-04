'use client'
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Page } from '../types';
import { auth } from '../../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import { IconChevronLeft, IconTrash, IconFidgetSpinner } from '@tabler/icons-react'
import useDebounce from '@/lib/debounce';

interface ParamsProps {
  params: Promise<{ id: string }> // Changed from paramId to id
}

export default function PageEditor({ params }: ParamsProps) {
  const [page, setPage] = useState<Page | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  // Removed manual saving state
  const [error, setError] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
        return;
      }
      fetchPage(id);
    });

    return () => unsubscribe();
  }, [id, router]);

  const fetchPage = async (pageId: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      console.log('Fetching page with ID:', pageId); // console uh

      const response = await fetch(`/api/pages/${pageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Response status:', response.status); // console adi

      if (!response.ok) {
        let errorMessage = 'Failed to fetch page';

        // Handle JSON parsing safely
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            const errorText = await response.text();
            errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      let data; //store pandraku response ah
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!data.page) {
        throw new Error('Page not found in response');
      }

      setPage(data.page);
      setTitle(data.page.title || '');
      setContent(data.page.content || '');
      setError(null);

    } catch (error) {
      console.error('Error fetching page:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);

      // Only redirect on certain errors
      if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        setTimeout(() => router.push('/Pages'), 2000); // Give user time to see error
      }
    } finally {
      setLoading(false);
    }
  };




  // Debounced save function using the React hook
  const debouncedSave = useDebounce(async (newTitle: string, newContent: string) => {
    if (!page) return;
    setAutoSaveStatus('saving');
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      const response = await fetch(`/api/pages`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: page.id,
          title: newTitle.trim(),
          content: newContent.trim()
        })
      });
      if (!response.ok) throw new Error('Failed to save page');
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus('idle'), 1000);
    } catch (error) {
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    }
  }, 1000); // 1 second debounce

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    debouncedSave(e.target.value, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    debouncedSave(title, e.target.value);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <IconFidgetSpinner className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
            {error.includes('not found') && (
              <p className="mt-2 text-sm">Redirecting to pages list...</p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 mb-8 items-center text-center">

          {/* Auto-save bro */}
          {autoSaveStatus === 'saving' && (
            <span className="text-xs text-blue-400 animate-pulse">o-o</span>
          )}
          {autoSaveStatus === 'saved' && (
            <span className="text-xs text-green-400 animate-pulse">{`>.<`}</span>
          )}
          {autoSaveStatus === 'error' && (
            <span className="text-xs text-red-400">Auto-save failed</span>
          )}

          <button
            onClick={() => router.push('/Pages')}
            className="px-2 rounded-full py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <IconChevronLeft />
          </button>
          {page && (
            <button
              onClick={async () => {
                if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) return;
                try {
                  setAutoSaveStatus('saving');
                  const token = await auth.currentUser?.getIdToken();
                  if (!token) throw new Error('Not authenticated');
                  const response = await fetch(`/api/pages/${page.id}`, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  if (!response.ok) throw new Error('Failed to delete page');
                  setAutoSaveStatus('saved');
                  setTimeout(() => setAutoSaveStatus('idle'), 1000);
                  router.push('/Pages');
                } catch (error) {
                  setAutoSaveStatus('error');
                  setTimeout(() => setAutoSaveStatus('idle'), 2000);
                }
              }}
              className="px-2 py-2 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              <IconTrash />
            </button>
          )}
        </div>

        {page ? (
          <>
            <div className="mb-6">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="w-full text-5xl font-bold text-gray-100 bg-transparent border-none focus:outline-none placeholder-gray-400"
                placeholder="Untitled"
                maxLength={100} // character limit
              />
            </div>

            <div>
              <textarea
                value={content}
                onChange={handleContentChange}
                className="w-full min-h-[600px] text-lg leading-relaxed text-white bg-transparent border-none focus:outline-none resize-none placeholder-gray-400"
                placeholder="Start writing..."
                maxLength={50000} // character limit
              />
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400">
            <p>Unable to load page content</p>
          </div>
        )}
      </div>
    </div>
  );
}