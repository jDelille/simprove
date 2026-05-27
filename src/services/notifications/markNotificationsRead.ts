import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function markNotificationsRead(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false)
    .select(); 

  if (error) throw error;
}