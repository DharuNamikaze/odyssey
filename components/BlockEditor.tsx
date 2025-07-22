'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Page } from '@/src/app/Pages/types';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import Loader from './Loader';

interface BlockNoteEditorProps {
    page: Page | null;
    onContentChange: (blocks: any[], markdown: string) => void;
    className?: string;
}

export default function BlockNoteEditor({ page, onContentChange, className = "" }: BlockNoteEditorProps) {
    const [editorInitialized, setEditorInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isInitializingRef = useRef(false);

    // Create editor instance once
    const editor = useCreateBlockNote({
        initialContent: [{
            id: 'loading',
            type: 'paragraph',
            content: 'Loading...',
        }],
    });

    // Initialize editor content when page data changes
    useEffect(() => {
        if (page && !isInitializingRef.current) {
            initializeEditorContent(page);
        }
    }, [page]);

    const initializeEditorContent = useCallback(async (pageData: Page) => {
        if (isInitializingRef.current) return;

        try {
            isInitializingRef.current = true;
            setError(null);
            setEditorInitialized(false);

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
        } finally {
            isInitializingRef.current = false;
        }
    }, [editor]);

    const handleEditorChange = useCallback(async (editorInstance: any) => {
        if (!editorInitialized) return;

        try {
            const blocks = editorInstance.document;
            const markdown = await editor.blocksToMarkdownLossy(blocks);
            onContentChange(blocks, markdown.trim());
        } catch (err) {
            console.error('Failed to convert blocks to markdown:', err);
        }
    }, [editor, onContentChange, editorInitialized]);

    const handleFocus = useCallback(() => {
        editor.focus();
    }, [editor]);

    // Show loading state
    if (!page || !editorInitialized) {
        return (
            <Loader />
        );
    }

    // Show error state
    if (error) {
        return (
            <div className={`w-full min-h-[600px] bg-red-50 rounded-xl flex items-center justify-center ${className}`}>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className={className} onClick={handleFocus}>
            <BlockNoteView
                editor={editor}
                className="w-full min-h-[600px] text-lg leading-relaxed rounded-xl bg-transparent"
                onChange={handleEditorChange}
            />
        </div>
    );
}