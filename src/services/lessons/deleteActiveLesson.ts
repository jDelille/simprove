export const deleteActiveLesson = async (
  userId: string,
  supabaseClient: any,
) => {
  const { data: activeLesson, error: fetchError } = await supabaseClient
    .from("user_lessons")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (fetchError) {
    console.error("Error fetching active lesson:", fetchError);

    return {
      success: false,
      error: fetchError,
    };
  }

  if (!activeLesson) {
    return {
      success: false,
      error: "No active lesson found",
    };
  }

  // delete child drill progress
  const { error: drillsDeleteError } = await supabaseClient
    .from("user_lesson_drills")
    .delete()
    .eq("user_lesson_id", activeLesson.id);

  if (drillsDeleteError) {
    console.error(
      "Error deleting user lesson drills:",
      drillsDeleteError,
    );

    return {
      success: false,
      error: drillsDeleteError,
    };
  }

  // delete parent lesson
  const { error: lessonDeleteError } = await supabaseClient
    .from("user_lessons")
    .delete()
    .eq("id", activeLesson.id);

  if (lessonDeleteError) {
    console.error(
      "Error deleting active lesson:",
      lessonDeleteError,
    );

    return {
      success: false,
      error: lessonDeleteError,
    };
  }

  return {
    success: true,
  };
};