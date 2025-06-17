'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Page } from '../types';
import { auth } from '../../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function PageEditor({ params }: { params: { id: string } }) {
  const [page, setPage] = useState<Page | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
        return;
      }
      fetchPage(params.id);
    });

    return () => unsubscribe();
  }, [params.id]);

  const fetchPage = async (pageId: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/pages/${pageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch page');
      }

      const data = await response.json();
      if (!data.page) {
        throw new Error('Page not found');
      }

      setPage(data.page);
      setTitle(data.page.title);
      setContent(data.page.content);
      setError(null);
    } catch (error) {
      console.error('Error fetching page:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      router.push('/Pages');
    } finally {
      setLoading(false);
    }
  };

  const savePage = async () => {
    if (!page) return;

    setSaving(true);
    setError(null);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/pages`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: page.id,
          title,
          content
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save page');
      }

      // Optional: Show success message
    } catch (error) {
      console.error('Error saving page:', error);
      setError(error instanceof Error ? error.message : 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-3 mb-8 ">
          <button
            onClick={() => router.push('/Pages')}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            Back
          </button>
          <button
            onClick={savePage}
            disabled={saving}
            className={`px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full text-5xl font-bold text-gray-100 bg-transparent border-none focus:outline-none placeholder-gray-400"
            placeholder="Untitled"
          />
        </div>

        {/* Content */}
        <div>
          <textarea
            value={content}
            onChange={handleContentChange}
            className="w-full min-h-[600px] text-lg leading-relaxed text-white bg-transparent border-none focus:outline-none resize-none placeholder-gray-400"
            placeholder="Start writing..."
          />
        </div>
      </div>
    </div>);
}