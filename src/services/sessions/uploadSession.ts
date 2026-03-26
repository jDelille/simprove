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

  // Insert into DB and return inserted row
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

  if (dbError) {
    console.error("Database error:", dbError);
    throw dbError;
  }

  // Fetch the first_swing badge
  const { data: badge } = await supabase
    .from("badges")
    .select("id")
    .eq("key", "first_swing")
    .single();

  if (badge) {
    // Check if user already has the badge
    const { data: existingBadge } = await supabase
      .from("user_badges")
      .select("id")
      .eq("user_id", userId)
      .eq("badge_id", badge.id)
      .single();

    if (!existingBadge) {
      const { error: badgeError } = await supabase.from("user_badges").insert({
        user_id: userId,
        badge_id: badge.id,
      });

      if (badgeError) {
        console.error("Badge award error:", badgeError);
        throw badgeError;
      }

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
    }
  }

  // Always log the session upload
  await logActivity({
    type: "SESSION_CREATED",
    title: `Uploaded session: ${sessionName}`,
    description: `Uploaded a new session`,
    entityId: data.id,
    entityType: "session",
    metadata: { sessionName },
  });

  return data;
}