export const fetchLessonPlans = async (userId: string, supabaseClient: any) => {
  const { data: lessonPlans, error } = await supabaseClient
    .from("lessons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch lesson plans");

  return lessonPlans;
};
