"use client";

import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type Activity = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description?: string;
  created_at: string;
  storage_path?: string;
  data?: any;
};

export type ActivitiesData = {
  allActivities: Activity[];
  latestThreeActivities: Activity[];
};

export const useActivities = (userId?: string) => {
  const supabase = createClient();

  return useQuery<ActivitiesData>({
    queryKey: ["activity", userId],
    queryFn: async () => {
      const { data: activityRows, error: tableError } = await supabase
        .from("activity")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (tableError) throw tableError;

      const activitiesWithData: Activity[] = await Promise.all(
        activityRows.map(async (row: any) => {
          if (!row.storage_path) return row;

          const { data: fileData, error: storageError } = await supabase.storage
            .from("activity")
            .download(row.storage_path);

          if (storageError)
            return { ...row, error: "Failed to fetch activity data" };

          const text = await fileData.text();
          const parsed = JSON.parse(text);

          return { ...row, data: parsed };
        }),
      );

      // console.log("Fetched activities with data:", activitiesWithData);

      return {
        allActivities: activitiesWithData,
        latestThreeActivities: activitiesWithData.slice(0, 3),
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
