import { supabase } from "@/lib/supabase/client";

type UploadGolfBagProps = {
  userId: string;
  club_name: string;
  club_type: string;
  club_model: string;
  average_yards: number;
};

type GolfBag = {
  id: string;
  user_id: string;
  club_name: string;
  club_type: string;
  club_model: string;
  average_yards: number;
  created_at: string;
};

export async function uploadGolfBag({
  userId,
  club_name,
  club_type,
  club_model,
  average_yards,
}: UploadGolfBagProps): Promise<GolfBag> {
  const { data, error } = await supabase
    .from("club_bag")
    .insert([
      {
        user_id: userId,
        club_name,
        club_type,
        club_model,
        average_yards,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Database error:", error);
    throw error;
  }

  return data as GolfBag;
}