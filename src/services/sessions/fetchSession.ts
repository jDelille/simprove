import { supabase as browserClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

export const fetchSession = async (
  sessionId: string,
  supabaseClient: SupabaseClient = browserClient,
) => {
  const { data: session, error } = await supabaseClient
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error) {
    console.error("fetchSession error:", error, "sessionId:", sessionId);
    throw new Error("Failed to fetch session");
  }

  if (!session.storage_path) return session;

  const { data: fileData, error: storageError } = await supabaseClient.storage
    .from("sessions")
    .download(session.storage_path);

  if (storageError) {
    console.error("fetchSession storage error:", storageError);
    return { ...session, error: "Failed to fetch session data" };
  }

  const text = await fileData.text();
  const parsed = JSON.parse(text);

  const shotsWithSessionId = (parsed.shots || []).map((shot: any) => ({
    ...shot,
    session_id: session.id,
    sessionDate: session.created_at,
  }));

  return { ...session, shots: shotsWithSessionId };
};