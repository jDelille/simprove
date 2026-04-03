export const fetchUserLessons = async (userId: string, supabaseClient: any) => {
  const { data: userLessons, error } = await supabaseClient
    .from("user_lessons")
    .select(
      `
        *,
        lessons (
            id,
            lesson_name,
            lesson_difficulty,
            total_points
    )
        `,
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user lessons:", error);
    return { error };
  }

  return { userLessons };
};
