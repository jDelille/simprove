import { SupabaseClient } from "@supabase/supabase-js";

export const uploadSessionToStorage = async (
  supabaseClient: SupabaseClient,
  filePath: string,
  jsonString: string
): Promise<void> => {
  const { error: uploadError } = await supabaseClient.storage
    .from("sessions")
    .upload(filePath, new Blob([jsonString], { type: "application/json" }), {
      cacheControl: "no-cache",
      upsert: true,
    });

  if (uploadError) {
    console.error("[uploadSession] Storage upload error:", uploadError);
    throw uploadError;
  }
};
