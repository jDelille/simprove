import { supabase } from "@/lib/supabase/client";

export async function markNotificationsRead(userId: string) {
  console.log("[markNotificationsRead] firing for userId:", userId);
  
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false)
    .select(); 

  console.log("[markNotificationsRead] updated:", data);
  console.log("[markNotificationsRead] error:", error);

  if (error) throw error;
}