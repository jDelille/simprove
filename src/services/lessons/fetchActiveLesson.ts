export const fetchActiveLesson = async (
  userId: string,
  supabaseClient: any,
) => {
  // Fetch the active user lesson
  const { data: activeLesson, error } = await supabaseClient
    .from("user_lessons")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();
  if (error) {
    console.error("Error fetching active lesson:", error);
    return { error };
  }

  if (!activeLesson) {
    return {
      activeLesson: null,
      lessonDetails: null,
      drills: [],
      summary: { total: 0, completed: 0, active: 0, pending: 0 },
      error: null,
      lessonError: null,
      drillsError: null,
    };
  }

  const lessonId = activeLesson?.lesson_id;

  // Fetch lesson details
  const { data: lessonDetails, error: lessonError } = await supabaseClient
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (lessonError) {
    console.error("Error fetching lesson details:", lessonError);
  }

  // Fetch drills with user progress
  const { data: drillsData, error: drillsError } = await supabaseClient
    .from("lesson_drills")
    .select(
      `
      *,
      user_lesson_drills (
        id,
        status,
        progress_value,
        score,
        completed_at
      )
    `,
    )
    .eq("lesson_id", lessonId)
    .order("drill_order", { ascending: true });

  if (drillsError) {
    console.error("Error fetching lesson drills:", drillsError);
  }

  // Map drills with user progress
  const drills = drillsData.map((drill: any) => {
    const userProgress = drill.user_lesson_drills?.[0] || null;

    return {
      id: drill.id,
      drill_name: drill.drill_name,
      drill_order: drill.drill_order,
      drill_description: drill.drill_description,
      metric: drill.metric,
      target_value: drill.target_value,
      required_successful_shots: drill.required_successful_shots,
      points: drill.points,
      // User progress
      status: userProgress?.status || "pending",
      progress_value: userProgress?.progress_value || 0,
      score: userProgress?.score || 0,
      completed_at: userProgress?.completed_at || null,
    };
  });

  // Create a summary of drill statuses
  const summary = drills.reduce(
    (acc: any, drill: any) => {
      acc.total += 1;
      acc[drill.status] = (acc[drill.status] || 0) + 1;
      return acc;
    },
    { total: 0, completed: 0, active: 0, pending: 0 },
  );

  return {
    activeLesson,
    lessonDetails,
    drills,
    summary,
    error,
    lessonError,
    drillsError,
  };
};
