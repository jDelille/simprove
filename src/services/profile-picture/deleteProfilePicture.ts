import { SupabaseClient } from "@supabase/supabase-js";

type DeleteProfilePictureProps = {
  userId: string;
  avatarPath?: string | null;
  supabaseClient: SupabaseClient;
};

export const deleteProfilePicture = async ({
  userId,
  avatarPath,
  supabaseClient,
}: DeleteProfilePictureProps) => {
  try {
    // remove image from storage
    if (avatarPath) {
      const { error: storageError } = await supabaseClient.storage
        .from("avatars")
        .remove([avatarPath]);

      if (storageError) {
        console.error("Error deleting avatar from storage:", storageError);
      }
    }

    // remove avatar path from user
    const { error: dbError } = await supabaseClient
      .from("users")
      .update({
        avatar_path: null,
      })
      .eq("id", userId);

    if (dbError) {
      console.error("Error updating avatar_path:", dbError);

      return {
        success: false,
        error: dbError,
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    console.error("Delete profile picture failed:", err);

    return {
      success: false,
      error: err,
    };
  }
};