"use client";
import React from "react";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { UserPreferencesProvider } from "@/context/UserPreferencesContext";
export function Providers({ children }) {
    return (
        <SessionProvider>
            <UserPreferencesProvider>
                <Toaster position="top-center" reverseOrder={false} />
                {children}
            </UserPreferencesProvider>
        </SessionProvider>
    );
}