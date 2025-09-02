"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabaseClient";

export function useAuth() {
  const { data: session, status } = useSession();
  const [isValidUser, setIsValidUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const hasVerifiedRef = useRef(false);
  const [userData, setUserData] = useState<{
    id: string;
    email: string;
    name?: string;
    image?: string;
  } | null>(null);

  const verifyUser = useCallback(async () => {
    if (session?.user?.email && !isChecking && !hasVerifiedRef.current) {
      setIsChecking(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("users")
          .select("id, email, name, image")
          .eq("email", session.user.email)
          .single();

        if (error || !data) {
          console.log(
            "User not found in database, clearing session and triggering re-signin"
          );
          await signOut({ redirect: false });
          setIsValidUser(false);
          hasVerifiedRef.current = false;

          setTimeout(() => {
            signIn("google", { callbackUrl: "/dashboard" });
          }, 100);
        } else {
          console.log("User verified in database:", data);
          setIsValidUser(true);
          hasVerifiedRef.current = true;
          setUserData(data);
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        await signOut({ redirect: false });
        setIsValidUser(false);
        hasVerifiedRef.current = false;

        setTimeout(() => {
          signIn("google", { callbackUrl: "/dashboard" });
        }, 100);
      } finally {
        setIsChecking(false);
        setLoading(false);
      }
    } else if (status === "unauthenticated") {
      setIsValidUser(false);
      setLoading(false);
      hasVerifiedRef.current = false;
    }
  }, [session?.user?.email, isChecking, status]);

  useEffect(() => {
    if (status === "authenticated" && !hasVerifiedRef.current) {
      verifyUser();
    } else if (status === "unauthenticated") {
      setIsValidUser(false);
      setLoading(false);
      hasVerifiedRef.current = false;
    }
  }, [status, verifyUser]);

  const handleSignIn = async () => {
    hasVerifiedRef.current = false;
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleSignOut = async () => {
    hasVerifiedRef.current = false;
    await signOut({ callbackUrl: "/" });
  };

  const clearAllSessions = async () => {
    hasVerifiedRef.current = false;

    // Clear all local storage and session data
    localStorage.clear();
    sessionStorage.clear();

    // Clear any cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Force clear NextAuth session
    await signOut({
      callbackUrl: "/",
      redirect: false,
    });

    // Reload page to ensure complete cleanup
    window.location.href = "/";
  };

  return {
    user: isValidUser && userData ? userData : null,
    loading: status === "loading" || loading || isChecking,
    signIn: handleSignIn,
    signOut: handleSignOut,
    clearAllSessions,
    isValidUser,
    isChecking,
    debug: {
      session,
      isValidUser,
      userHasId: !!userData?.id,
    },
  };
}
