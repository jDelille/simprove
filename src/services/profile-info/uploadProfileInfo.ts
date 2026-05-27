import { createClient } from "@/lib/supabase/client";

type UploadProfileInfoParams = {
  userId: string;
  displayName?: string;
  username?: string;
  bio?: string;
  launchMonitor?: string;
  location?: string;
  is_new_account?: boolean;
};

const supabase = createClient();

export async function uploadProfileInfo({
  userId,
  displayName,
  username,
  bio,
  launchMonitor,
  location,
  is_new_account
}: UploadProfileInfoParams) {
  const updates: any = {};

  if (displayName !== undefined) updates.display_name = displayName;
  if (username !== undefined) updates.username = username;
  if (bio !== undefined) updates.bio = bio;
  if (launchMonitor !== undefined) updates.launch_monitor = launchMonitor;
  if (location !== undefined) updates.location = location;
  if (is_new_account !== undefined) updates.is_new_account = is_new_account;

  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId);

  if (error) {
    throw new Error(`Error updating profile: ${error.message}`);
  }

  return true;
}
