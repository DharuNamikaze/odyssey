'use client'
import { useRouter } from 'next/router';
import { usePage } from '../context/PageContext';
import { NextRequest } from 'next/server';
import { Page } from '../src/app/Pages/types';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect, } from 'react'
import { auth } from '../lib/firebase';

export default function FetchPages(req: NextRequest) {

    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { setPage } = usePage();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/');
                return;
            }
            // Load user's pages
            fetchPages(user.uid);
        });

        return () => unsubscribe();
    }, [router]);

    const fetchPages = async (userId: string) => {
        try {
            const token = await auth.currentUser?.getIdToken();
            const response = await fetch('/api/pages', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setPage(data.pages)
            setPages(data.pages);

        } catch (error) {
            console.error('Error fetching pages:', error);
        } finally {
            setLoading(false);
        }
    };

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
                setPage(data.page)

            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error creating page:', error);
            // You might want to show this error to the user through a toast or alert
        }
    };
}