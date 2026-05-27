import { createClient } from "@/lib/supabase/client";

type UploadGettingStartedCompletionsParams = {
  userId: string;
  step: number;
};

const supabase = createClient();

export async function uploadGettingStartedCompletions({
  userId,
  step,
}: UploadGettingStartedCompletionsParams) {
  const { error } = await supabase.from("getting_started_completions").insert({
    user_id: userId,
    step: step,
  });

  if (error) {
    console.error("Error uploading getting started completion:", error);
    throw error;
  }
}
