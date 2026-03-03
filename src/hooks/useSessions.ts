"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export const useSessions = (userId: string) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      const { data: sessionRows, error: tableError } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", userId)
        .order("session_date", { ascending: false });

      if (tableError) {
        console.error("Error fetching sessions:", tableError);
        setSessions([]);
        setLoading(false);
        return;
      }

      const sessionsWithData = await Promise.all(
        sessionRows.map(async (row: any) => {
          if (!row.storage_path) return row; // Skip if no storage path

          const { data: fileData, error: storageError } = await supabase.storage
            .from("sessions")
            .download(row.storage_path);

          if (storageError) {
            console.error("Error downloading file:", storageError);
            return { ...row, error: "Failed to download session data" };
          }

          const text = await fileData.text();
          const parsed = JSON.parse(text);

          const shotsWithSessionId = (parsed.shots ?? []).map((shot: any) => ({
            ...shot,
            sessionId: row.id,
            sessionDate: row.session_date,
          }));

          return { ...row, shots: shotsWithSessionId };
        }),
      );
      setSessions(sessionsWithData);
      setLoading(false);
    };
    fetchSessions();
  }, [userId]);

  return { sessions, loading };
};
