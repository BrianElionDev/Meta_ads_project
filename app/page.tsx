"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Hero from "../components/ui/Hero";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { user, loading, isValidUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isValidUser && user) {
      // User has session but not in database, redirect to signin
      router.push("/auth/signin");
    }
  }, [user, loading, isValidUser, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isValidUser) {
    return null; // Will redirect to signin
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] text-center relative">
      <Hero />

      {/* Footer */}
      <div className="mt-20 text-center">
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
