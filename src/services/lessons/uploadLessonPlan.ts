import { supabase } from "@/lib/supabase/client";

export async function uploadLessonPlan({
  userId,
  lessonId,
}: {
  userId: string;
  lessonId: string;
}) {
  // 1️⃣ Create a user_lesson instance
  const { data: userLessonData, error: userLessonError } = await supabase
    .from("user_lessons")
    .insert([
      {
        user_id: userId,
        lesson_id: lessonId,
        status: "active", // can be 'active' instead of 'in-progress' if you prefer
      },
    ])
    .select("id") // get the ID back
    .single();

  if (userLessonError || !userLessonData) {
    console.error("Error creating user lesson:", userLessonError);
    throw new Error("Failed to start lesson");
  }

  const userLessonId = userLessonData.id;

  // 2️⃣ Copy the lesson drills into user_lesson_drills
  const { error: drillsError } = await supabase
    .from("user_lesson_drills")
    .insert(
      // fetch drills for this lesson
      (await supabase
        .from("lesson_drills")
        .select("id")
        .eq("lesson_id", lessonId)
        .order("drill_order", { ascending: true })
      ).data?.map((drill) => ({
        user_lesson_id: userLessonId,
        lesson_drill_id: drill.id,
        status: "locked", // default
      })) || []
    );

  if (drillsError) {
    console.error("Error copying drills:", drillsError);
    throw new Error("Failed to initialize drills");
  }

  // 3️⃣ Activate the first drill
  const firstDrill = await supabase
    .from("user_lesson_drills")
    .select("id")
    .eq("user_lesson_id", userLessonId)
    .order("lesson_drill_id", { ascending: true })
    .limit(1)
    .single();

  if (firstDrill.data) {
    await supabase
      .from("user_lesson_drills")
      .update({ status: "active" })
      .eq("id", firstDrill.data.id);
  }

  return userLessonId;
}