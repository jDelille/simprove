import { createClient } from "@/lib/supabase/client";

export const fetchGolfBag = async (userId: string) => {
  const supabase = createClient();

  const { data: golfBagRows, error } = await supabase
    .from("club_bag")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch golf bag");

  return golfBagRows;
};
