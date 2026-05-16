import { SupabaseClient } from "@supabase/supabase-js";
import { supabase as browserClient } from "@/lib/supabase/client";
import moment from "moment";

export const uploadLeaderboard = async (
  supabaseClient: SupabaseClient = browserClient,
  pointsToAdd: number,
  userId: string,
) => {
  const periods = [
    {
      type: "weekly",
      start: moment().startOf("week").toISOString(),
      end: moment().endOf("week").toISOString(),
    },
    {
      type: "monthly",
      start: moment().startOf("month").toISOString(),
      end: moment().endOf("month").toISOString(),
    },
    {
      type: "yearly",
      start: moment().startOf("year").toISOString(),
      end: moment().endOf("year").toISOString(),
    },
  ];

  for (const period of periods) {
    const { data: existing, error: fetchError } = await supabaseClient
      .from("leaderboard")
      .select("*")
      .eq("user_id", userId)
      .eq("period_type", period.type)
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { error: updateError, data: updateData } = await supabaseClient
        .from("leaderboard")
        .update({
          points: existing.points + pointsToAdd,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select();

      if (updateError) {
        console.error(
          `Error updating ${period.type} leaderboard entry:`,
          updateError,
        );
        return { error: updateError };
      }
    } else {
      const { error: insertError } = await supabaseClient
        .from("leaderboard")
        .insert({
          user_id: userId,
          period_type: period.type,
          period_start: period.start,
          period_end: period.end,
          points: pointsToAdd,
        });

      if (insertError) {
        console.error(
          `Error inserting ${period.type} leaderboard entry:`,
          insertError,
        );
        return { error: insertError };
      }
    }
  }

  return { success: true };
};
