'use client'
import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import React from "react";
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from "react-icons/vsc";
import "./globals.css";
import Dock from "../../components/Dock";
import Home from "./page";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const items = [
    { icon: <VscHome size={18} />, label: 'Home', onClick: () => alert('Home!') },
    { icon: <VscArchive size={18} />, label: 'Acheivement', onClick: () => alert('Archive!') },
    { icon: <VscAccount size={18} />, label: 'Profile', onClick: () => alert('Profile!') },
    { icon: <VscSettingsGear size={18} />, label: 'Settings', onClick: () => alert('Settings!') },
  ];

  return (
    <html lang="en">
      <body>
        {children}
        <Dock
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </body>
    </html>
  );
}
