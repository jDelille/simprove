import { createClient } from "@/lib/supabase/client";

type UploadGettingStartedCompletionsParams = {
  userId: string;
  step: number;
};

export async function uploadGettingStartedCompletions({
  userId,
  step,
}: UploadGettingStartedCompletionsParams) {
  const supabase = createClient();

  const { error } = await supabase.from("getting_started_completions").insert({
    user_id: userId,
    step: step,
  });

  if (error) {
    console.error("Error uploading getting started completion:", error);
    throw error;
  }
}
