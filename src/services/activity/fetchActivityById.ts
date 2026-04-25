type ActivityType = "round" | "session";

const ACTIVITY_QUERIES: Record<ActivityType, string> = {
  round: "*, round_scores (*), round_holes (*)",
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

  const { data, error } = await supabaseClient
    .from(table)
    .select(selectQuery)
    .eq("user_id", userId)
    .eq("id", id)
    .single();

  if (error) throw error;

  if (type === "round") {
    return data;
  }
  
  if (!data.storage_path) {
    return { ...data, shots: [] };
  }

  const { data: fileData, error: storageError } =
    await supabaseClient.storage
      .from("sessions")
      .download(data.storage_path);

  if (storageError) {
    console.error("session storage error:", storageError);
    return { ...data, shots: [], storageError: true };
  }

  const text = await fileData.text();
  const parsed = JSON.parse(text);

  const shots = (parsed.shots || []).map((shot: any) => ({
    ...shot,
    session_id: data.id,
    sessionDate: data.created_at,
  }));

  return {
    ...data,
    shots,
  };
};