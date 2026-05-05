export const fetchNotifications = async (userId: string, supabaseClient: any ) => {
    const { data: notifications, error} = await supabaseClient
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw new Error("Failed to fetch recent activity");


    return notifications;
};