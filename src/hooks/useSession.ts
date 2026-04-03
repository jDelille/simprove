"use client";

import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useSession = (sessionId: string) => {
  const supabase = createClient();

  return useQuery({
    queryKey: ["session", sessionId],

    queryFn: async () => {
      const { data: row, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (error) {
        console.error("Error fetching session:", error);
        throw new Error("Failed to fetch session");
      }

      if (!row.storage_path) return row;

      const { data: fileData, error: storageError } = await supabase.storage
        .from("sessions")
        .download(row.storage_path);

      if (storageError) {
        return { ...row, error: "Failed to fetch session data" };
      }

      const text = await fileData.text();
      const parsed = JSON.parse(text);

      const shotsWithSessionId = (parsed.shots || []).map((shot: any) => ({
        ...shot,
        session_id: row.id,
        sessionDate: row.created_at,
      }));

      return { ...row, shots: shotsWithSessionId };
    },

    enabled: !!sessionId,
  });
};
