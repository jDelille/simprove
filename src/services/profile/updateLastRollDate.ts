import { SupabaseClient } from "@supabase/supabase-js";

export const updateLastRolled = async (userId: string, supabase: SupabaseClient) => {
  const { error } = await supabase
    .from("users")
    .update({ last_rolled_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) throw error;
};