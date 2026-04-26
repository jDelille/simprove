import { supabase } from "@/lib/supabase/client";
 
type DeleteRoundProps = {
  roundId: string;
};
 
export async function deleteRound({ roundId }: DeleteRoundProps): Promise<void> {
  // Delete from DB
  const { error: dbError } = await supabase
    .from("rounds")
    .delete()
    .eq("id", roundId);
 
  if (dbError) {
    console.error("Database delete error:", dbError);
    throw dbError;
  }
}