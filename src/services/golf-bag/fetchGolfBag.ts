import { createClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

const supabase = createClient();

export const fetchGolfBag = async (
  userId: string,
  supabaseClient: SupabaseClient = supabase,
) => {
  const { data: golfBagRows, error } = await supabaseClient
    .from("club_bag")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch golf bag");

  return golfBagRows;
};
