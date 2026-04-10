import { SupabaseClient } from "@supabase/supabase-js";
// import { supabase as browserClient } from "@/lib/supabase/client";

export const handleFirstSessionOnboarding = async (
  userId: string,
  supabaseClient: SupabaseClient,
  isFirstSession: boolean,
): Promise<void> => {
  if (isFirstSession) {
    const { data: completion } = await supabaseClient
      .from("getting_started_completions")
      .select("*")
      .eq("user_id", userId)
      .eq("step_id", 2)
      .maybeSingle();

    if (!completion) {
      const { error: completionError } = await supabaseClient
        .from("getting_started_completions")
        .insert({
          user_id: userId,
          step_id: 2,
        });

      if (completionError) {
        console.error(
          "[uploadSession] Failed to mark onboarding step 2:",
          completionError,
        );
      }
    }
  }
};
