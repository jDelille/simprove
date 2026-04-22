export const fetchLatestRound = async (userId: string, supabaseClient: any) => {
  const { data: latestRound, error } = await supabaseClient.from("rounds")
    .select(`*, round_scores (*)`)
    .eq("user_id", userId)
    .order("round_begin", { ascending: false })
    .limit(1)
    .single();

    if (error) throw error;
    return latestRound;
};
