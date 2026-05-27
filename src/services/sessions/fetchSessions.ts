import { SupabaseClient } from "@supabase/supabase-js";
import { Shot } from "@/types/shot";
import { Session } from "@/types";
import { createClient } from "@/lib/supabase/client";

type SessionWithShots = Session & {
  shots: Shot[];
};

export const fetchSessions = async (
  userId: string,
  supabaseClient?: SupabaseClient,
): Promise<SessionWithShots[]> => {
  const supabase = supabaseClient ?? createClient();

  const { data: sessionRows, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !sessionRows) {
    console.error("Error fetching sessions:", error);
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
        await supabase.storage
          .from("sessions")
          .download(row.storage_path);

      if (storageError || !fileData) {
        console.error("Failed to fetch session data:", storageError);
        return {
          ...row,
          shots: [],
        };
      }

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