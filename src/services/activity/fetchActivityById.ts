type ActivityType = "round" | "session";

const ACTIVITY_QUERIES: Record<ActivityType, string> = {
  round: "*, round_scores (*)",
  session: "*",
};

export const fetchActivityById = async (
  userId: string,
  id: string,
  type: ActivityType,
  supabaseClient: any
) => {
  const table = type === "round" ? "rounds" : "sessions";
  const selectQuery = ACTIVITY_QUERIES[type];

  if (!selectQuery) throw new Error(`Unsupported activity type: "${type}"`);

  const { data, error } = await supabaseClient
    .from(table)
    .select(selectQuery)
    .eq("user_id", userId)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
};