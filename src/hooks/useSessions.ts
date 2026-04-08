"use client";

import { supabase } from "@/lib/supabase/client";
import { Shot } from "@/types/shot";
import { useQuery } from "@tanstack/react-query";

export const useSessions = (userId: string | null) => {
  return useQuery({
    queryKey: ["sessions", userId],

    queryFn: async () => {
      const { data: sessionRows, error: tableError } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (tableError) {
        if (tableError.message?.includes("AbortError")) return [];

        console.error(
          "Error fetching sessions:",
          tableError.message,
          tableError.code,
        );
        throw new Error("Failed to fetch sessions");
      }

      const sessionsWithData = await Promise.all(
        sessionRows.map(async (row) => {
          if (!row.storage_path) return row;

          const { data: fileData, error: storageError } = await supabase.storage
            .from("sessions")
            .download(row.storage_path);

          if (storageError) {
            return { ...row, error: "Failed to fetch session data" };
          }

          const text = await fileData.text();
          const parsed = JSON.parse(text);

          const shotsWithSessionId = (parsed.shots || []).map((shot: Shot) => ({
            ...shot,
            session_id: row.id,
            sessionDate: row.created_at,
          }));

          return { ...row, shots: shotsWithSessionId };
        }),
      );

      return sessionsWithData;
    },

    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
