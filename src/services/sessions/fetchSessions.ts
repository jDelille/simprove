import { createClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

export const fetchSessions = async (userId: string) => {
        const supabase = createClient();
  
  const { data: sessionRows, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch sessions");

  const sessionsWithData = await Promise.all(
    sessionRows.map(async (row) => {
      if (!row.storage_path) return row;

      const { data: fileData, error: storageError } = await supabase.storage
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