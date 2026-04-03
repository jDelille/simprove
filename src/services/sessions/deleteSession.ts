import { supabase } from "@/lib/supabase/client";
 
type DeleteSessionProps = {
  sessionId: string;
  storagePath: string;
};
 
export async function deleteSession({ sessionId, storagePath }: DeleteSessionProps): Promise<void> {
  // Delete from storage first
  const { error: storageError } = await supabase.storage
    .from("sessions")
    .remove([storagePath]);
 
  if (storageError) {
    console.error("Storage delete error:", storageError);
    throw storageError;
  }
 
  // Delete from DB
  const { error: dbError } = await supabase
    .from("sessions")
    .delete()
    .eq("id", sessionId);
 
  if (dbError) {
    console.error("Database delete error:", dbError);
    throw dbError;
  }
}