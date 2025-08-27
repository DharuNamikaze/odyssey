"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { setCookie, deleteCookie } from '../lib/cookies';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Get and store the ID token
        const idToken = await currentUser.getIdToken();
        setCookie('token', idToken, { maxAge: 3600 });
      } else {
        setUser(null);
        deleteCookie('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      deleteCookie('token');
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateToken = async () => {
    if (user) {
      try {
        const idToken = await user.getIdToken(true); // Force refresh
        setCookie('token', idToken, { maxAge: 3600 });
      } catch (error) {
        console.error('Token refresh error:', error);
      }
    }
  };

  const value = {
    user,
    loading,
    signOut,
    updateToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
