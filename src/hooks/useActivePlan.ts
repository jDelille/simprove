import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useActivePlan = (userId: string) => {
  return useQuery({
    queryKey: ["activePlan", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_lessons")
        .select(`
          *,
          lessons (*)
        `)
        .eq("user_id", userId)
        .eq("status", "active")
        .single();

      if (error) throw new Error("Failed to fetch active plan");
      return data;
    },
    enabled: !!userId,
  });
};