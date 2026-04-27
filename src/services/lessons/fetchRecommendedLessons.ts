export const fetchRecommndedLessons = async (
  userId: string,
  supabaseClient: any,
) => {
  const { data: recommendedLessons, error } = await supabaseClient
    .from("user_lesson_recommendations")
    .select(
      `
            lesson_id,
            reason,
            lessons (
            *
            )
            `,
    )
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return [];
  }

  return recommendedLessons;
};
