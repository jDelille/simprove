import { supabase } from "@/lib/supabase/client";
import { awardUserPoints } from "../user-points/uploadUserPoints";
import { POINTS } from "@/lib/points/constants";
import { uploadLeaderboard } from "../leaderboard/uploadLeaderboard";

export async function uploadGSProRound({
  userId,
  rounds,
  allScores,
  holes,
}: {
  userId: string;
  rounds: any[];
  allScores: any[];
  holes: any[];
}) {
  const { data: insertedRounds, error } = await supabase
    .from("rounds")
    .insert(
      rounds.map((r) => ({
        user_id: userId,
        course_name: r.courseName,
        tee_type: r.teeType,
        round_type: r.roundType,
        control_type: r.controlType,
        rating: Number(r.ratingSlope?.split("/")[0]),
        slope: Number(r.ratingSlope?.split("/")[1]),
        par: Number(r.par),
        round_begin: r.roundBegin,
        hole_count: r.holeCount,
        hidden_from_stats: r.hiddenFromStatsTF,
        round_key: r.roundKey,
        total: r.total,
      })),
    )
    .select();

  if (error) throw error;

  // award user points for round upload
  await awardUserPoints(userId, supabase, POINTS.round.upload);

  // Update leaderboard with new points
  // await uploadLeaderboard(supabase, POINTS.round.upload, userId);

  const scoreInserts = insertedRounds
    .map((insertedRound) => {
      const score = allScores.find(
        (s) => s.roundKey === insertedRound.round_key,
      );
      if (!score) return null;

      return {
        round_id: insertedRound.id,
        round_key: insertedRound.round_key,
        user_id: userId,
        fairways_value: score.fairwaysValue,
        fairways_value_percent: score.fairwaysValuePercent,
        fairways_target: score.fairwaysTarget,
        fairways_target_percent: score.fairwaysTargetPercent,
        greens_value: score.greensValue,
        greens_value_percent: score.greensValuePercent,
        greens_target: score.greensTarget,
        greens_target_percent: score.greensTargetPercent,
        sand_saves_value: score.sandSavesValue,
        sand_saves_value_percent: score.sandSavesValuePercent,
        sand_saves_target: score.sandSavesTarget,
        putts_value: score.puttsValue,
        putts_target: score.puttsTarget,
        albatross: score.albatross,
        eagle: score.eagle,
        birdie: score.birdie,
        par: score.par,
        bogey: score.bogey,
        double_bogey: score.doubleBogey,
        other: score.other,
        driving_distance_longest: score.drivingDistanceLongest,
        par3_average: score.par3Average,
        par4_average: score.par4Average,
        par5_average: score.par5Average,
        round_begin: score.roundBegin,
      };
    })
    .filter(Boolean);

  if (scoreInserts.length) {
    const { error: scoreError } = await supabase
      .from("round_scores")
      .insert(scoreInserts);

    if (scoreError) throw scoreError;
  }

  const holeInserts = insertedRounds.flatMap((insertedRound) => {
    const roundKey = insertedRound.round_key;

    const roundHoles = holes.filter((h) => h.round_key === roundKey);

    console.log(holes)

    if (!roundHoles.length) return [];

    return roundHoles.map((h) => ({
      round_id: insertedRound.id,
      round_key: roundKey,
      user_id: userId,

      hole_number: h.hole_number,

      strokes: h.strokes ?? null,
      distance: h.distance ?? null,
      par: h.par ?? null,
      index: h.index ?? null,
    }));
  });

  if (holeInserts.length) {
    const { error: holeError } = await supabase
      .from("round_holes")
      .insert(holeInserts);

    if (holeError) throw holeError;
  }
}
