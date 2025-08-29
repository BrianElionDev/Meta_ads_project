"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Client } from "@/types/client";

export function useOnboarding() {
  const [loading, setLoading] = useState(false);

  const submitClient = async (client: Client) => {
    setLoading(true);
    const { data, error } = await supabase.from("Clients").insert([
      {
        ...client,
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
      },
    ]);
    setLoading(false);

    if (error) throw error;
    return data;
  };

  return { submitClient, loading };
}
