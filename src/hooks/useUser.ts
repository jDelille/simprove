"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export const useUser = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(() => {
    if (typeof window === "undefined") return null;
    const cached = localStorage.getItem("profile");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setProfile(data);
      localStorage.setItem("profile", JSON.stringify(data));
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();

      const authUser = data.session?.user ?? null;
      setUser(authUser);

      if (authUser) {
        await fetchProfile(authUser.id);
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user ?? null;
        setUser(authUser);

        if (authUser) {
          await fetchProfile(authUser.id);
        } else {
          setProfile(null);
          localStorage.removeItem("profile");
        }

        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
};