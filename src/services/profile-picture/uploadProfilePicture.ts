import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function uploadProfilePicture({
  userId,
  file,
}: {
  userId: string;
  file: File;
}) {
  const compressedFile = await imageCompression(file, {
    maxSizeMB: 0.5, // target size (500kb)
    maxWidthOrHeight: 512,
    useWebWorker: true,
  });

  const filePath = `profile-pictures/${userId}/${Date.now()}-${compressedFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, compressedFile);

  if (uploadError) {
    throw new Error(`Error uploading profile picture: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

  const avatarUrl = data.publicUrl;

  const { error: dbError } = await supabase
    .from("users")
    .update({ avatar_path: avatarUrl })
    .eq("id", userId);

  if (dbError) {
    throw new Error(`Error updating avatar path: ${dbError.message}`);
  }

  return avatarUrl;
}
