"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { Client } from "@/types/client";
import { useAuth } from "./useAuth";

export function useOnboarding() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const submitClient = async (client: Client) => {
    console.log("Onboarding hook - User object:", user);
    console.log("Onboarding hook - User ID:", user?.id);

    if (!user?.id) {
      throw new Error("User not authenticated or user ID not available");
    }

    setLoading(true);
    try {
      const { data, error } = await createClient()
        .from("Clients")
        .insert([
          {
            ...client,
            user_id: user.id, // Include the authenticated user's ID
            created_at: new Date().toISOString(),
            last_modified: new Date().toISOString(),
          },
        ]);

      if (error) throw error;
      return data;
    } finally {
      setLoading(false);
    }
  };

  return { submitClient, loading, user };
}
