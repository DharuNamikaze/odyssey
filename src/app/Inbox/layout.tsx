import React from 'react';
import ClientLayout from '../../../components/ClientLayout'
import '../globals.css'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <ClientLayout>{children}</ClientLayout>
        </div>
    );
}