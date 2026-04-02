export const fetchActiveLesson = async (
  userId: string,
  supabaseClient: any,
) => {
  const { data: activeLesson, error } = await supabaseClient
    .from("user_lessons")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  const lessonId = activeLesson?.lesson_id;

  const { data: lessonDetails, error: lessonError } = await supabaseClient
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  const { data: drills, error: drillsError } = await supabaseClient
    .from("lesson_drills")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("drill_order", { ascending: true });

  if (error) {
    console.error("Error fetching active lesson:", error);
  }

  return {
    activeLesson,
    lessonDetails,
    drills,
    error,
    lessonError,
    drillsError,
  };
};
