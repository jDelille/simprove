export const fetchBadges = async (supabaseClient: any) => {
  const { data: badges, error } = await supabaseClient
    .from("badges")
    .select("*")
    .order("created_at", { ascending: false });

    if (error) throw new Error("Failed to fetch badges");

    return badges;
};