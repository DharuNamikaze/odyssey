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
      const response = await fetch(`/api/pages/${pageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Page not found');
      }

      const data = await response.json();
      setPage(data.page);
      setTitle(data.page.title);
      setContent(data.page.content);
    } catch (error) {
      console.error('Error fetching page:', error);
      router.push('/Pages');
    } finally {
      setLoading(false);
    }
  };

  const savePage = async () => {
    if (!page) return;
    
    setSaving(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetch(`/api/pages`, {
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
    } catch (error) {
      console.error('Error saving page:', error);
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 space-y-4">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="w-full text-4xl font-bold bg-transparent border-none focus:outline-none"
          placeholder="Untitled"
        />
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/Pages')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back
          </button>
          <button
            onClick={savePage}
            disabled={saving}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="prose max-w-none">
        <textarea
          value={content}
          onChange={handleContentChange}
          className="w-full min-h-[500px] bg-transparent border-none focus:outline-none resize-none"
          placeholder="Start writing..."
        />
      </div>
    </div>
  );
}