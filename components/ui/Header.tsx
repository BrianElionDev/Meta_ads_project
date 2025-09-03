"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import Avatar from "./Avatar";

export default function Header() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setIsOpen(false);
  };

  return (
    <header className="w-full py-6 px-8 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50 relative z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">
          <Link href="/">Meta Ads Automation</Link>
        </h1>

        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors">
            About
          </button>

          {loading ? (
            <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Avatar src={user.image} alt={user.name || user.email} />
                <span className="text-sm">{user.name || user.email}</span>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-[9999] bg-gray-800 border border-gray-700">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                  >
                    Home
                  </Link>
                  <hr className="my-1 border-gray-600" />
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
