import React from 'react'
import InteractiveBrain from '../../../components/InteractiveBrain'
import ProtectedRoute from '../../../components/ProtectedRoute'

export default function Profile() {
    return (
        <ProtectedRoute>
            <section className='mt-20 overflow-x-auto'>
                {/* <InteractiveBrain /> */}
                Nothing, Wait for Integration. 
            </section>
        </ProtectedRoute>
    );
}
