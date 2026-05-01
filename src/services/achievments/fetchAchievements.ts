export const fetchAchievements = async (supabaseClient: any) => {
  const { data: achievements, error } = await supabaseClient
    .from("achievements")
    .select("*")
    .order("created_at", { ascending: false });

    if (error) throw new Error("Failed to fetch achievements");

    return achievements;
};