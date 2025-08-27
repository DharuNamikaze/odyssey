'use client'
import { use, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Page } from '../types';
import EmojiPicker from 'emoji-picker-react'
import { auth } from '../../../../lib/firebase';
import { IconChevronLeft, IconTrash, IconFidgetSpinner, IconPlus } from '@tabler/icons-react';
import useDebounce from '@/lib/debounce';
import Loader from '@/components/Loader';
import Image from 'next/image';
import ProtectedRoute from '../../../../components/ProtectedRoute';

// Dynamic import to prevent SSR issues
const BlockNoteEditor = dynamic(
  () => import('../../../../components/BlockEditor'),
  {
    ssr: false,
    loading: () => (
      <>
        <Loader />
      </>
    )
  }
);

interface ParamsProps {
  params: Promise<{ id: string }>
}

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type LoadingState = 'loading' | 'ready' | 'error';

export default function PageEditor({ params }: ParamsProps) {
  // Core page state
  const [page, setPage] = useState<Page | null>(null);
  const [title, setTitle] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [error, setError] = useState<string | null>(null);

  // Auto-save state
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>('idle');

  // UI state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Refs to prevent unnecessary re-renders
  const isInitializingRef = useRef(false);
  const pageIdRef = useRef<string | null>(null);

  const router = useRouter();
  const { id } = use(params);

  // Page loading effect
  useEffect(() => {
    // Only fetch if page ID changed
    if (pageIdRef.current !== id) {
      pageIdRef.current = id;
      fetchPage(id);
    }
  }, [id]);

  const fetchPage = useCallback(async (pageId: string) => {
    if (isInitializingRef.current) return;

    try {
      isInitializingRef.current = true;
      setLoadingState('loading');
      setError(null);

      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/pages/${pageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      const { page: fetchedPage } = await response.json();

      // Update page state
      setPage(fetchedPage);
      setTitle(fetchedPage.title || '');
      setLoadingState('ready');
    } catch (error) {
      console.error('Error fetching page:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch page');
      setLoadingState('error');
    } finally {
      isInitializingRef.current = false;
    }
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    // You can add auto-save logic here
  }, []);

  const handleEditorContentChange = useCallback((content: any) => {
    // Handle content changes from the editor
    // You can add auto-save logic here
  }, []);

  const handleDeletePage = useCallback(async () => {
    if (!page) return;

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/pages/${page.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete page');
      }

      router.push('/Pages');
    } catch (error) {
      console.error('Error deleting page:', error);
      // Handle error (show toast, etc.)
    } finally {
      setShowDeleteModal(false);
    }
  }, [page, router]);

  // Render loading state
  if (loadingState === 'loading') {
    return (
      <ProtectedRoute>
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <IconFidgetSpinner className="w-8 h-8 text-white animate-spin" />
        </div>
      </ProtectedRoute>
    );
  }

  // Render error state
  if (loadingState === 'error') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Error Loading Page</h2>
            <p className="mb-4">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={() => fetchPage(id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
              <button
                onClick={() => router.push('/Pages')}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Main render
  return (
    <ProtectedRoute>
      <div className=''>
        <section>
          <Image src={"/"} height={45} width={100} alt='' />
        </section>

        <div className="min-h-screen">
          <div className="max-w-3xl mx-auto px-6 py-12">
            {/* Header with controls */}
            <div className="flex justify-end gap-3 mb-8 items-center">
              {/* Auto-save status */}
              {autoSaveStatus === 'saving' && (
                <span className="text-xs text-blue-400 animate-pulse">{"-_-"}</span>
              )}
              {autoSaveStatus === 'saved' && (
                <span className="text-xs text-green-400">{"o_o"}</span>
              )}
              {autoSaveStatus === 'error' && (
                <span className="text-xs text-red-400">Save failed</span>
              )}

              {/* Back button */}
              <button
                onClick={() => router.push('/Pages')}
                className="px-2 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                title="Back to Pages"
              >
                <IconChevronLeft />
              </button>

              {/* Delete button */}
              {page && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-2 py-2 text-sm bg-black text-white rounded-full hover:bg-red-700 transition-colors rotate-45"
                  title="Delete Page"
                >
                  <IconPlus />
                </button>
              )}
            </div>

            {/* Page content */}
            {page && loadingState === 'ready' && (
              <>
                {/* Title input */}
                <div className="mb-6">
                  <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    className="w-full text-6xl font-bold text-gray-100 bg-transparent border-none focus:outline-none placeholder-gray-400"
                    placeholder="Untitled"
                    maxLength={100}
                  />
                </div>

                {/* BlockNote editor */}
                <BlockNoteEditor
                  page={page}
                  onContentChange={handleEditorContentChange}
                  className="mb-6 -ml-14"
                />
              </>
            )}

            {/* Loading fallback */}
            {!page && loadingState === 'ready' && <Loader />}

            {/* Delete confirmation modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm mx-4">
                  <div className="flex flex-col items-center space-y-4">
                    <IconTrash className="w-12 h-12 text-red-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Delete Page?</h3>
                    <p className="text-gray-600 text-center">This action cannot be undone.</p>

                    <div className="flex gap-3 w-full">
                      <button
                        onClick={handleDeletePage}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}