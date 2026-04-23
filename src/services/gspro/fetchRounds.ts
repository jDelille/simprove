export const fetchRounds = async (userId: string, supabaseClient: any) => {
  const { data: rounds, error } = await supabaseClient.from("rounds")
    .select(`*, round_scores (*)`)
    .eq("user_id", userId)
    .order("round_begin", { ascending: false })

    if (error) throw error;
    return rounds;
};
