import { supabase } from "@/lib/supabase/client";

export async function uploadLessonPlan({
  userId,
  lessonId,
}: {
  userId: string;
  lessonId: string;
}) {
  const { data: userLessonData, error: userLessonError } = await supabase
    .from("user_lessons")
    .insert([{ user_id: userId, lesson_id: lessonId, status: "active" }])
    .select("id")
    .single();

  if (userLessonError || !userLessonData) {
    console.error("Error creating user lesson:", userLessonError);
    throw new Error("Failed to start lesson");
  }

  const userLessonId = userLessonData.id;

  const { data: lessonDrills, error: lessonDrillsError } = await supabase
    .from("lesson_drills")
    .select("id")
    .eq("lesson_id", lessonId)
    .order("drill_order", { ascending: true });

  if (lessonDrillsError || !lessonDrills || lessonDrills.length === 0) {
    console.error("Error fetching lesson drills:", lessonDrillsError);
    throw new Error("Failed to fetch lesson drills");
  }

  const userDrillsInsert = lessonDrills.map((drill, index) => ({
    user_lesson_id: userLessonId,
    lesson_drill_id: drill.id,
    status: index === 0 ? "active" : "locked",
  }));

  const { error: drillsInsertError } = await supabase
    .from("user_lesson_drills")
    .insert(userDrillsInsert);

  if (drillsInsertError) {
    console.error("Error inserting user drills:", drillsInsertError);
    throw new Error("Failed to initialize drills");
  }

  return userLessonId;
}
