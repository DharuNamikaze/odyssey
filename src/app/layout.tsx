import React from "react";
import './globals.css'
import CreateButton from '../../components/CreateButton'
import { PageProvider } from '../../context/PageContext';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [bro, setBro] = useState<null | User>(null)

  // useEffect(() => {
  //   const auth = getAuth();
  //   const unsubscribe = onAuthStateChanged(auth, (currentBro) => {
  //     if (currentBro) {
  //       setBro(currentBro)
  //     } else {
  //       setBro(null)
  //     }
  //   })
  //   return () => unsubscribe()
  // }, [])

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
        <PageProvider>
          {children}
        </PageProvider>
        {/* <div className="flex items-center justify-center w-full ">
          {/* <div className='absolute inset-70 inset-ring-amber-600 inset-ring border-1 z-50 flex justify-between px-5 py-5 bg-amber-100 text-black rounded-4xl '>Search
            <span>❌</span>
          </div>
        </div> */}
      </body>
    </html >
  );
}
