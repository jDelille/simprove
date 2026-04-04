export const fetchRecentActivity = async (userId: string, supabaseClient: any ) => {
    const { data: recentActivity, error} = await supabaseClient
      .from("activity")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) throw new Error("Failed to fetch recent activity");


    return recentActivity;
};