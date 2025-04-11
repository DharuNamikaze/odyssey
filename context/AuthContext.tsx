"use client";
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  console.log("rendered:", open);

  return (
    <AuthContext.Provider value={{ open, setOpen }}>
      {children}
    </AuthContext.Provider>

  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};