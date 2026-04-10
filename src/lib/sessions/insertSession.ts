import { SupabaseClient } from "@supabase/supabase-js";
// import { supabase as browserClient } from "@/lib/supabase/client";

export const insertSession = async (
  userId: string,
  supabaseClient: SupabaseClient,
  sessionData: {
    session_name: string;
    session_date: string
    file_path: string;
  }
) => {
  const { data: dbSession, error: dbError } = await supabaseClient
    .from("sessions")
    .insert({
      user_id: userId,
      session_name: sessionData.session_name,
      session_date: sessionData.session_date,
      storage_path: sessionData.file_path,
      categories: ["all"],
    })
    .select()
    .single();

  if (dbError || !dbSession) {
    console.error("[uploadSession] DB insert error:", dbError);
    throw new Error("Session not created properly");
  }

  return { data: dbSession, error: dbError };  
};
