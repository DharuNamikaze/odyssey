"use client";
import React, { useState, useEffect } from "react";
import { JSX } from "react/jsx-runtime";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, } from "motion/react";
import { cn } from "../../lib/utils";
import { IconBrandGoogleFilled, IconFidgetSpinner } from "@tabler/icons-react";
import { auth, provider, signInWithPopup } from '../../lib/firebase';
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import axios from 'axios';
import Link from "next/link";
// import { useSearchParams } from 'next/navigation';
// import { createContext, useContext } from 'react';

// import useAuth from "../../lib/Auth";


export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {

  // const { setOpen } = useAuth();

  const { scrollYProgress } = useScroll();
  // const [isNew, setIsNew] = useState(true);
  const [visible, setVisible] = useState(false);

  const LoadingModal = () => {
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <IconFidgetSpinner className="w-8 h-8 text-white animate-spin" />
    </div>
  }
  // const userStateInfo = createContext(null)

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  // const { searchParams } = useSearchParams()
  // const routerQueries = Object.fromEntries(searchParams.entries())
  // console.log(routerQueries);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push(`/Dashboard`);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleGoogleIn = async () => {
    try {
      const res = await signInWithPopup(auth, provider)
      const user = res.user;
      const userPayload = {
        Badges: [],
        CreatedAt: new Date().toISOString(),
        Email: user.email,
        Level: 1,
        LogDays: 0,
        LoginStreak: 0,
        Name: user.displayName,
        RecentLogin: new Date().toISOString(),
        Uid: user.uid,
        Aura: 0,
      };
      console.log('User Payload:', userPayload);
      await axios.post('/api/user', userPayload);
      console.log('Axios working perfectly');
      router.push(`/Dashboard`);
    } catch (error) {
      console.error("Google sign-in error error coming from floating nav:", error);
    }
  };

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current == "number") {
      const direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: 100,
        }}
        animate={{
          y: visible ? 1 : 1,
          opacity: visible ? 0 : 1,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-5 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2  items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-sm">{navItem.name}</span>
          </Link>
        ))}
        {/* () => setOpen(true) */}
        {/* useState change pannanum */}
        {/* {loading && <LoadingModal />} */}
        <button onClick={handleGoogleIn} className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white rounded-full hover:cursor-pointer">
          <IconBrandGoogleFilled />
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};