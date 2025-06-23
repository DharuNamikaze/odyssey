'use client'
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Page } from '../types';
import { auth } from '../../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface ParamsProps {
  params: Promise<{ id: string }> // Changed from paramId to id
}

export default function PageEditor({ params }: ParamsProps) {
  const [page, setPage] = useState<Page | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  }, [id]); 

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
          title: title.trim(),
          content: content.trim()
        })
      });

      if (!response.ok) {
        let errorMessage = 'Failed to save page';
        
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

      // Show success feedback (optional)
      console.log('Page saved successfully');
      
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
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
        
        <div className="flex justify-end gap-3 mb-8">
          <button
            onClick={() => router.push('/Pages')}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            Back
          </button>
          <button
            onClick={savePage}
            disabled={saving || !page}
            className={`px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
              saving || !page ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
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