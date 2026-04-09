export const fetchCompletedLessons = async (
  userId: string,
  supabaseClient: any,
) => {
  const { data: completedLessons, error } = await supabaseClient
    .from("user_lessons")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "completed");

  if (error) {
    throw new Error("Failed to fetch completed lessons");
  }

  return completedLessons;
};
