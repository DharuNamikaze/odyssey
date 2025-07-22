'use client'

import { use, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Page } from '../types';
import { auth } from '../../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { IconChevronLeft, IconTrash, IconFidgetSpinner, IconPlus } from '@tabler/icons-react';
import useDebounce from '@/lib/debounce';
import Loader from '@/components/Loader';

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

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
  
  // Editor state
  const [editorInitialized, setEditorInitialized] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>('idle');
  
  // UI state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Refs to prevent unnecessary re-renders
  const isInitializingRef = useRef(false);
  const pageIdRef = useRef<string | null>(null);

  const router = useRouter();
  const { id } = use(params);

  // Create editor instance once
  const editor = useCreateBlockNote({
    initialContent: [{
      id: 'loading',
      type: 'paragraph',
      content: 'Loading...',
    }],
  });

  // Authentication and page loading effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
        return;
      }
      
      // Only fetch if page ID changed
      if (pageIdRef.current !== id) {
        pageIdRef.current = id;
        fetchPage(id);
      }
    });

    return () => unsubscribe();
  }, [id, router]);

  const fetchPage = useCallback(async (pageId: string) => {
    if (isInitializingRef.current) return;
    
    try {
      isInitializingRef.current = true;
      setLoadingState('loading');
      setError(null);
      setEditorInitialized(false);

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

      // Initialize editor content
      await initializeEditorContent(fetchedPage);
      
      setLoadingState('ready');
    } catch (err: any) {
      console.error('Error fetching page:', err);
      setError(err.message || 'Failed to load page');
      setLoadingState('error');
      
      // Auto-redirect on 404
      if (err.message.includes('not found') || err.message.includes('404')) {
        setTimeout(() => router.push('/Pages'), 2000);
      }
    } finally {
      isInitializingRef.current = false;
    }
  }, [router]);

  const initializeEditorContent = useCallback(async (pageData: Page) => {
    try {
      let initialBlocks;

      // Use existing blocks if available
      if (pageData.blocks && Array.isArray(pageData.blocks) && pageData.blocks.length > 0) {
        initialBlocks = pageData.blocks;
      } else if (pageData.content) {
        // Parse markdown content to blocks
        try {
          initialBlocks = await editor.tryParseMarkdownToBlocks(pageData.content);
        } catch (parseError) {
          console.warn('Failed to parse markdown:', parseError);
          initialBlocks = [{
            id: 'content-fallback',
            type: 'paragraph',
            content: pageData.content,
          }];
        }
      } else {
        // Default empty content
        initialBlocks = [{
          id: 'empty',
          type: 'paragraph',
          content: '',
        }];
      }

      // Replace editor content
      await editor.replaceBlocks(editor.document, initialBlocks);
      setEditorInitialized(true);
    } catch (err) {
      console.error('Failed to initialize editor:', err);
      setError('Failed to initialize editor');
    }
  }, [editor]);

  // Debounced save functions
  const debouncedTitleSave = useDebounce(async (newTitle: string) => {
    if (!page || !newTitle.trim()) return;
    await savePageData({ title: newTitle.trim() });
  }, 1000);

  const debouncedContentSave = useDebounce(async (blocks: any[]) => {
    if (!page || !blocks) return;
    
    try {
      const markdown = await editor.blocksToMarkdownLossy(blocks);
      await savePageData({ 
        content: markdown.trim(), 
        blocks: blocks 
      });
    } catch (err) {
      console.error('Failed to convert blocks to markdown:', err);
    }
  }, 800);

  const savePageData = async (updates: Partial<{ title: string; content: string; blocks: any[] }>) => {
    if (!page) return;

    try {
      setAutoSaveStatus('saving');
      
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/pages', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: page.id,
          title: updates.title || title,
          ...updates
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus('idle'), 1500);
    } catch (error) {
      console.error('Save error:', error);
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    }
  };

  // Event handlers
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedTitleSave(newTitle);
  };

  const handleEditorChange = useCallback((editorInstance: any) => {
    const blocks = editorInstance.document;
    debouncedContentSave(blocks);
  }, [debouncedContentSave]);

  const handleDeletePage = async () => {
    if (!page) return;

    try {
      setAutoSaveStatus('saving');
      
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/pages/${page.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete page');
      }

      router.push('/Pages');
      router.refresh();
    } catch (error: any) {
      console.error('Delete error:', error);
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Render loading state
  if (loadingState === 'loading') {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <IconFidgetSpinner className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  // Render error state
  if (loadingState === 'error') {
    return (
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
    );
  }

  // Main render
  return (
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
        {page && editorInitialized && (
          <>
            {/* Title input */}
            <div className="mb-6">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="w-full text-5xl font-bold text-gray-100 bg-transparent border-none focus:outline-none placeholder-gray-400"
                placeholder="Untitled"
                maxLength={100}
              />
            </div>

            {/* BlockNote editor */}
            <div className="mb-6">
              <BlockNoteView
                editor={editor}
                className="w-full min-h-[600px] text-lg leading-relaxed rounded-xl border-4 border-cyan-200 bg-transparent"
                onChange={handleEditorChange}
              />
            </div>
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
  );
}