'use client';

import { metadata } from "./metadata";
import { SessionProvider } from "next-auth/react";
import { UserPreferencesProvider } from "../context/UserPreferencesContext";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronLeft, ChevronRight, Utensils, User, ChevronDown, ChevronUp } from "lucide-react";
import { RootLayout } from '@/components/RootLayout'

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleProfileDropdown = () => {
    if (!isSidebarCollapsed) {
      setIsProfileOpen(!isProfileOpen);
    }
  };

  const isActive = (href) => pathname === href;

  return (
    <html lang="en" className="mdl-js">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body
        suppressHydrationWarning
      >
        <SessionProvider>
          <UserPreferencesProvider>
           
          <RootLayout>{children}</RootLayout>

            <Toaster position="top-center" />
          </UserPreferencesProvider>
        </SessionProvider>
      </body>
    </html>
  );
}