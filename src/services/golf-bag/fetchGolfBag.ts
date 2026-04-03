import { SupabaseClient } from "@supabase/supabase-js";
import { supabase as browserClient } from "@/lib/supabase/client";

export const fetchGolfBag = async (userId: string, supabaseClient: SupabaseClient = browserClient) => {
    const { data: golfBagRows, error } = await supabaseClient
        .from("club_bag")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
    
    if (error) throw new Error("Failed to fetch golf bag");

    return golfBagRows;
};