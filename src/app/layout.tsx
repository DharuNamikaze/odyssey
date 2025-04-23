'use client'
import React, { useEffect, useState } from "react";
import "./globals.css";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [bro, setBro] = useState<null | User>(null)

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentBro) => {
      if (currentBro) {
        setBro(currentBro)
      } else {
        setBro(null)
      }
    })
    return () => unsubscribe()
  }, [])

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

        {/* {!bro && } */}
        {children}
        <div className="flex items-center justify-center w-full ">
        </div>
      </body>
    </html >
  );
}
