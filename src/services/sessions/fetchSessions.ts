import { SupabaseClient } from "@supabase/supabase-js";
import { supabase as browserClient } from "@/lib/supabase/client";

export const fetchSessions = async (userId: string, supabaseClient: SupabaseClient = browserClient) => {
  const { data: sessionRows, error } = await supabaseClient
    .from("sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch sessions");

  console.log(sessionRows)

  const sessionsWithData = await Promise.all(
    sessionRows.map(async (row) => {
      if (!row.storage_path) return row;

      const { data: fileData, error: storageError } = await supabaseClient.storage
        .from("sessions")
        .download(row.storage_path);

      if (storageError) return { ...row, error: "Failed to fetch session data" };

      const text = await fileData.text();
      const parsed = JSON.parse(text);

      return {
        ...row,
        shots: (parsed.shots || []).map((shot: any) => ({
          ...shot,
          session_id: row.id,
          sessionDate: row.created_at,
        })),
      };
    })
  );

  return sessionsWithData;
};