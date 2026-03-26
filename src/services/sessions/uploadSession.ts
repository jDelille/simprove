import { supabase } from "@/lib/supabase/client";
import { logActivity } from "../activity/logActivity";

type UploadSessionProps = {
  userId: string;
  jsonString: string;
  sessionName: string;
  sessionDate: string;
};

type Session = {
  id: string;
  user_id: string;
  session_name: string;
  session_date: string;
  storage_path: string;
  categories: string[];
};

export async function uploadSession({
  userId,
  jsonString,
  sessionName,
  sessionDate,
}: UploadSessionProps): Promise<Session> {
  const filePath = `sessions/${userId}/${Date.now()}.json`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("sessions")
    .upload(filePath, new Blob([jsonString], { type: "application/json" }), {
      cacheControl: "no-cache",
      upsert: true,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw uploadError;
  }

  // Insert into DB AND return inserted row
  const { data, error: dbError } = await supabase
    .from("sessions")
    .insert({
      user_id: userId,
      session_name: sessionName,
      session_date: sessionDate,
      storage_path: filePath,
      categories: ["all"],
    })
    .select()
    .single();

  // add badge here if needed, e.g. if this is the user's first session, award them the "First Swing" badge

  const { count, error: countError } = await supabase
    .from("sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) {
    console.error("Count error:", countError);
    throw countError;
  }

  if (dbError) {
    console.error("Database error:", dbError);
    throw dbError;
  }

  // Only after session insert succeeded
  if (count === 1) {
    const { data: badge, error: badgeFetchError } = await supabase
      .from("badges")
      .select("id")
      .eq("key", "first_swing")
      .single();

    if (badgeFetchError) {
      console.error("Badge fetch error:", badgeFetchError);
      throw badgeFetchError;
    }

    const { error: badgeError } = await supabase.from("user_badges").insert({
      user_id: userId,
      badge_id: badge.id,
    });

    const { error: stepError } = await supabase
      .from("getting_started_completions")
      .upsert(
        { user_id: userId, step_id: 2 },
        { onConflict: "user_id,step_id" },
      );

    if (stepError) {
      console.error("Step completion error:", stepError);
    }

    await logActivity({
      type: "BADGE_EARNED",
      title: `Awarded badge: First Swing`,
      description: `Uploaded your first session`,
      entityId: badge.id,
      entityType: "badge",
      metadata: { badgeName: "First Swing" },
    });

    if (badgeError) {
      console.error("Badge award error:", badgeError);
      throw badgeError;
    }
  }

  return data;
}
