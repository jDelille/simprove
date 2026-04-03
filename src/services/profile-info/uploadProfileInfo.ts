import { createClient } from "@/lib/supabase/client";

type UploadProfileInfoParams = {
  userId: string;
  displayName?: string;
  username?: string;
  bio?: string;
  launchMonitor?: string;
  location?: string;
};

export async function uploadProfileInfo({
  userId,
  displayName,
  username,
  bio,
  launchMonitor,
  location,
}: UploadProfileInfoParams) {
  const updates: any = {};

      const supabase = createClient();
  

  if (displayName !== undefined) updates.display_name = displayName;
  if (username !== undefined) updates.username = username;
  if (bio !== undefined) updates.bio = bio;
  if (launchMonitor !== undefined) updates.launch_monitor = launchMonitor;
  if (location !== undefined) updates.location = location;

  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId);

  if (error) {
    throw new Error(`Error updating profile: ${error.message}`);
  }

  return true;
}
