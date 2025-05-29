import React from 'react';
import '../globals.css'
import ClientLayout from '../../../components/ClientLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <ClientLayout>{children}</ClientLayout>
        </div>
    );
}