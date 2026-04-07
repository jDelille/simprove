"use server";

import Anthropic from "@anthropic-ai/sdk";
import { createSupabaseServer } from "@/lib/supabase/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type SessionStats = {
  avgCarry: number;
  avgSpeed: number;
  avgOffline: number;
  avgVLA: number;
  avgFaceToTarget: number;
  avgBackSpin: number;
  avgPeakHeight: number;
  totalShots: number;
  hasClubData: boolean;
};

type Lesson = {
  id: string;
  lesson_name: string;
  lesson_description: string;
  lesson_difficulty: string;
};

type Recommendation = {
  lessonId: string;
  lessonName: string;
  reason: string;
};

export async function fetchAIRecommendedLessons(
  userId: string,
  stats: SessionStats,
  lessons: Lesson[],
): Promise<Recommendation[]> {

  const prompt = `
You are a golf performance coach AI. Based on the player's recent session stats, recommend the 3 most relevant lessons from the available list.

Player stats:
- Average carry: ${stats.avgCarry.toFixed(1)} yards
- Average ball speed: ${stats.avgSpeed.toFixed(1)} mph
- Average offline: ${stats.avgOffline.toFixed(1)} yards
- Average back spin: ${stats.avgBackSpin.toFixed(0)} rpm
- Average peak height: ${stats.avgPeakHeight.toFixed(1)} ft
- Total shots tracked: ${stats.totalShots}
${
  stats.hasClubData
    ? `- Average vertical launch angle (VLA): ${stats.avgVLA.toFixed(1)}°
- Average face to target: ${stats.avgFaceToTarget.toFixed(1)}°`
    : `- Club data (VLA, AOA, face angle): not available for this session`
}

Available lessons:
${lessons
  .map(
    (l) =>
      `- ID: ${l.id} | Name: ${l.lesson_name} | Difficulty: ${l.lesson_difficulty} | Description: ${l.lesson_description}`,
  )
  .join("\n")}

Respond ONLY with a JSON array of exactly 3 objects, no extra text, no markdown:
[
  { "lessonId": "...", "lessonName": "...", "reason": "one sentence why this lesson fits this player" },
  { "lessonId": "...", "lessonName": "...", "reason": "one sentence why this lesson fits this player" },
  { "lessonId": "...", "lessonName": "...", "reason": "one sentence why this lesson fits this player" }
]
`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  let recommendations: Recommendation[] = [];

  try {
    recommendations = JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse AI response:", error, text);
    return [];
  }

  const supabase = await createSupabaseServer();

  const { error: deleteError } = await supabase
    .from("user_lesson_recommendations")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    console.error("Failed to delete existing recommendations:", deleteError);
    return [];
  }

  const { error: insertError } = await supabase
    .from("user_lesson_recommendations")
    .insert(
      recommendations.map((rec) => ({
        user_id: userId,
        lesson_id: rec.lessonId,
        reason: rec.reason,
      })),
    );

  if (insertError) {
    console.error("Failed to insert new recommendations:", insertError);
    return [];
  }

  return recommendations;
}
