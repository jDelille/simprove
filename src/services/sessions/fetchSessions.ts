import { SupabaseClient } from "@supabase/supabase-js";
import { supabase as browserClient } from "@/lib/supabase/client";
import { Shot } from "@/types/shot";
import { Session } from "@/types";

type SessionWithShots = Session & {
  shots: Shot[];
};

export const fetchSessions = async (
  userId: string,
  supabaseClient: SupabaseClient = browserClient,
): Promise<SessionWithShots[]> => {
  const { data: sessionRows, error } = await supabaseClient
    .from("sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !sessionRows) {
    return [];
  }
  
  const sessionsWithData = await Promise.all(
    sessionRows.map(async (row) => {
      if (!row.storage_path) {
        return {
          ...row,
          shots: [],
        };
      }

      const { data: fileData, error: storageError } =
        await supabaseClient.storage
          .from("sessions")
          .download(row.storage_path);

      if (storageError)
        return { ...row, error: "Failed to fetch session data" };

      const text = await fileData.text();
      const parsed = JSON.parse(text);

      return {
        ...row,
        shots: (parsed.shots || []).map((shot: Shot) => ({
          ...shot,
          session_id: row.id,
          sessionDate: row.created_at,
        })),
      };
    }),
  );

  return sessionsWithData;
};
