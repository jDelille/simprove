"use client";

import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useLessonPlans = () => {
  return useQuery({
    queryKey: ["lessonPlans"],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching lesson plans:", error);
        throw new Error("Failed to fetch lesson plans");
      }

      return data;
    },
  });
};