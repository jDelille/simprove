"use client";

import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useLessonDrills = (lessonId: string) => {
    console.log(lessonId)
  return useQuery({
    queryKey: ["lessonDrills", lessonId],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_drills")
        .select("*")
        .eq("lesson_id", lessonId)
        .order("drill_order", { ascending: true });

      if (error) {
        console.error("Error fetching lesson drills:", error);
        throw new Error("Failed to fetch lesson drills");
      }

      return data;
    },

    enabled: !!lessonId,
  });
};