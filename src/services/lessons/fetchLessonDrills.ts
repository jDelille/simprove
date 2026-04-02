export const fetchLessonDrills = async (
  lessonId: string,
  supabaseClient: any,
) => {
  const { data: drills, error } = await supabaseClient
    .from("lesson_drills")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("drill_order", { ascending: true });


  if (error) {
    console.error("Error fetching lesson drills:", error);
    return [];
  }
  return drills;
};
