import { createClient } from "@/lib/supabase/client";
import { awardBadge } from "../badges/awardBadge";

export async function uploadLessonPlan({
  userId,
  lessonId,
}: {
  userId: string;
  lessonId: string;
}) {

  const supabase = createClient();

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

  const { data: hasStartedLesson } = await supabase
    .from("getting_started_completions")
    .select("*")
    .eq("user_id", userId)
    .eq("step_id", 4)
    .single();

  if (!hasStartedLesson) {
    const { error: completionError } = await supabase
      .from("getting_started_completions")
      .insert({
        user_id: userId,
        step_id: 4,
      });

    if (completionError) {
      console.error(
        "Error inserting getting started completion:",
        completionError,
      );
    }
  }

  await awardBadge(userId, "first_lesson", {
    title: "First Lesson Started",
    description: "Started your first lesson",
  });

  const { error: drillsInsertError } = await supabase
    .from("user_lesson_drills")
    .insert(userDrillsInsert);

  if (drillsInsertError) {
    console.error("Error inserting user drills:", drillsInsertError);
    throw new Error("Failed to initialize drills");
  }

  return userLessonId;
}
