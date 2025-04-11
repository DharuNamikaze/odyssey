'use client'
import React from "react";
import { AuthProvider } from "../../context/AuthContext";
import "./globals.css";
import {
  IconHome,
  IconMessage, IconUser,
} from "@tabler/icons-react";
import { FloatingNav } from "../../components/ui/floating-nav";


export const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "About",
    link: "/about",
    icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "Contact",
    link: "/contact",
    icon: (
      <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
    ),
  },

];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Odyssey</title>
        <link rel="icon" type="image/svg" href="/Odyssey1.png" />
      </head>
      <body>
        <AuthProvider>
          <div className="relative w-full">
            <FloatingNav navItems={navItems}/>
          </div>
          {children}
        </AuthProvider>
        <div className="flex items-center justify-center w-full ">
        </div>
      </body>
    </html>
  );
}
