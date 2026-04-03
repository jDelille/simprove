"use client";

import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useActiveLessonPlan = () => {
  return useQuery({
    queryKey: ["activeLessonPlan"],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("status", "active")

      if (error) {
        console.error("Error fetching lesson plans:", error);
        throw new Error("Failed to fetch lesson plans");
      }

      return data;
    },
  });
};