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

export default function RootLayout({ children }) {
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
        className="flex flex-col lg:flex-row min-h-screen bg-gray-100 overflow-x-hidden"
        suppressHydrationWarning
      >
        <SessionProvider>
          <UserPreferencesProvider>
            {/* Sidebar */}
            <aside
              className={`fixed lg:static inset-y-0 left-0 z-50 bg-blue-500 text-white transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              } ${isSidebarCollapsed ? "w-16" : "w-64"}`}
            >
              <div className="flex items-center justify-between p-4 border-b border-blue-400">
                {!isSidebarCollapsed && (
                  <Link href="/" className="font-bold text-lg">
                    Chill Guy With Meals
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleCollapse}
                    className="hidden lg:block p-1 rounded-full hover:bg-blue-600 transition-colors"
                    aria-label={
                      isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                    }
                  >
                    {isSidebarCollapsed ? (
                      <ChevronRight className="h-5 w-5" />
                    ) : (
                      <ChevronLeft className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={toggleSidebar}
                    className="lg:hidden"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <nav
                className={`flex flex-col p-4 space-y-2 ${
                  isSidebarCollapsed ? "items-center" : ""
                }`}
              >
                <Link
                  href="/mealplan"
                  className={`py-2 px-4 rounded-lg transition-colors flex items-center gap-2 ${
                    isSidebarCollapsed ? "justify-center" : ""
                  } ${isActive("/mealplan") ? "bg-blue-700" : "hover:bg-blue-600"}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Utensils className="h-5 w-5" />
                  {!isSidebarCollapsed && <span>Meal Plan</span>}
                </Link>
                <Link
                  href="/recipes"
                  className={`py-2 px-4 rounded-lg transition-colors flex items-center gap-2 ${
                    isSidebarCollapsed ? "justify-center" : ""
                  } ${isActive("/recipes") ? "bg-blue-700" : "hover:bg-blue-600"}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Utensils className="h-5 w-5" />
                  {!isSidebarCollapsed && <span>Recipes</span>}
                </Link>
                <Link
                  href="/subscriptions"
                  className={`py-2 px-4 rounded-lg transition-colors flex items-center gap-2 ${
                    isSidebarCollapsed ? "justify-center" : ""
                  } ${isActive("/subscriptions") ? "bg-blue-700" : "hover:bg-blue-600"}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Utensils className="h-5 w-5" />
                  {!isSidebarCollapsed && <span>Subscriptions</span>}
                </Link>
                {/* Profile Section with Dropdown */}
                <div className="flex flex-col">
                  <button
                    onClick={toggleProfileDropdown}
                    className={`py-2 px-4 rounded-lg transition-colors flex items-center gap-2 w-full ${
                      isSidebarCollapsed ? "justify-center" : ""
                    } ${
                      pathname.startsWith("/profile") ? "bg-blue-700" : "hover:bg-blue-600"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    {!isSidebarCollapsed && (
                      <>
                        <span className="font-semibold flex-1 text-left">Profile</span>
                        {isProfileOpen ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </>
                    )}
                  </button>
                  {/* Dropdown Menu */}
                  {isProfileOpen && !isSidebarCollapsed && (
                    <div className="flex flex-col pl-6 space-y-1 mt-1">
                      <Link
                        href="/profile"
                        className={`py-1 px-2 rounded-lg transition-colors flex items-center gap-2 ${
                          isActive("/profile") ? "bg-blue-700" : "hover:bg-blue-600"
                        }`}
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Basic Info</span>
                      </Link>
                      <Link
                        href="/profile/meal-settings"
                        className={`py-1 px-2 rounded-lg transition-colors flex items-center gap-2 ${
                          isActive("/profile/meal-settings") ? "bg-blue-700" : "hover:bg-blue-600"
                        }`}
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <Utensils className="h-4 w-4" />
                        <span>Meal Settings</span>
                      </Link>
                      <Link
                        href="/profile/diet"
                        className={`py-1 px-2 rounded-lg transition-colors flex items-center gap-2 ${
                          isActive("/profile/diet") ? "bg-blue-700" : "hover:bg-blue-600"
                        }`}
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <Utensils className="h-4 w-4" />
                        <span>Primary Diet</span>
                      </Link>
                      <Link
                        href="/profile/exclusions"
                        className={`py-1 px-2 rounded-lg transition-colors flex items-center gap-2 ${
                          isActive("/profile/exclusions") ? "bg-blue-700" : "hover:bg-blue-600"
                        }`}
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <Utensils className="h-4 w-4" />
                        <span>Food Exclusions</span>
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </aside>

            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={toggleSidebar}
              />
            )}

            {/* Main content */}
            <div
              className={`flex-1 flex flex-col w-full transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
              }`}
            >
              <div className="lg:hidden p-4 bg-blue-500 text-white flex items-center justify-between">
                <Link href="/" className="font-bold">
                  Chill Guy With Meals
                </Link>
                <button onClick={toggleSidebar} aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </button>
              </div>
              <main className="flex-1 max-w-5xl mx-auto p-6 lg:p-8 w-full">
                {children}
              </main>
            </div>

            <Toaster position="top-center" />
          </UserPreferencesProvider>
        </SessionProvider>
      </body>
    </html>
  );
}