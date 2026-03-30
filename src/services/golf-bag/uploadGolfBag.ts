import { supabase } from "@/lib/supabase/client";

type UploadGolfBagProps = {
  userId: string;
};

type GolfBag = {
  id: string;
  user_id: string;
  club_name: string;
  club_type: string;
  average_yards: number;
  created_at: string;
};

export async function uploadGolfBag({
  userId,
}: UploadGolfBagProps): Promise<GolfBag> {
  // insert into db
  const { data, error: dbError } = await supabase
    .from("club_bag")
    .insert([
      {
        user_id: userId,
        club_name: "Callaway Epic Max LS",
        club_type: "Driver",
        average_yards: 250,
      },
    ])
    .select()
    .single();

  if (dbError) {
    console.error("Database error:", dbError);
    throw dbError;
  }

  return data as GolfBag;
}
