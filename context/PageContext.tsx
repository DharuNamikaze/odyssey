"use client";
import { Page } from '../src/app/Pages/types';
import React, { createContext, useContext, useState } from "react";

type PageContextType = {
  page: Page[];
  setPage: React.Dispatch<React.SetStateAction<Page[]>>;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider = ({ children }: { children: React.ReactNode }) => {

  const [page, setPage] = useState<Page[] | []>([]);
  
  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>

  );
};

export const usePage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePage must be used within an PageProvider");
  }
  return context;
};