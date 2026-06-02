import { Averages } from "@/types/averages";
import { Round } from "@/types/round";
import { RoundStats } from "@/types/roundStats";
import { Shot } from "@/types/shot";

export function calculateAverages(shots: Shot[]): Averages {
  if (!shots.length) {
    return {
      avgCarry: 0,
      avgSpeed: 0,
      avgOffline: 0,
      avgSpin: 0,
      avgfaceToTarget: 0,
      avgLaunchAngle: 0,
      avgPeakHeight: 0,
      avgDescent: 0,
      avgDynamicLoft: 0,
      avgPath: 0,
      count: 0,
      mostUsedClub: undefined,
      mostUsedClubCount: undefined,
      longestCarry: undefined,
      peakBallSpeed: undefined,
      clubsHit: [],
    };
  }

  const peakBallSpeed = Math.max(...shots.map((shot) => shot?.ballSpeed ?? 0));

  const mostUsedClub = shots.reduce(
    (acc, shot) => {
      if (!shot.club) return acc;
      acc[shot.club] = (acc[shot.club] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const mostUsedClubName = Object.keys(mostUsedClub).length
    ? Object.keys(mostUsedClub).reduce((a, b) =>
        mostUsedClub[a] > mostUsedClub[b] ? a : b,
      )
    : undefined;

  const mostUsedClubCount = mostUsedClubName
    ? mostUsedClub[mostUsedClubName]
    : undefined;

  const longestCarry = Math.max(...shots.map((shot) => shot?.carry ?? 0));

  const clubsHit = Array.from(
    new Set(shots.map((shot) => shot.club).filter(Boolean)),
  ) as string[];

  const totals = shots.reduce(
    (acc, shot) => {
      acc.avgCarry += shot?.carry ?? 0;
      acc.avgSpeed += shot.ballSpeed ?? 0;
      acc.avgOffline += shot?.offline ?? 0;
      acc.avgDynamicLoft += shot?.dynamicloft ?? 0;
      acc.avgSpin += shot?.backSpin ?? 0;
      acc.avgfaceToTarget += shot.faceToTarget ?? 0;
      acc.avgLaunchAngle += shot?.vla ?? 0;
      acc.avgPeakHeight += shot.peakHeight ?? 0;
      acc.avgDecent += shot.decent ?? 0;
      acc.avgPath += shot.path ?? 0;
      acc.count++;

      return acc;
    },
    {
      avgCarry: 0,
      avgSpeed: 0,
      avgOffline: 0,
      avgDynamicLoft: 0,
      avgSpin: 0,
      avgfaceToTarget: 0,
      avgLaunchAngle: 0,
      avgPeakHeight: 0,
      avgDecent: 0,
      count: 0,
      mostUsedClub: mostUsedClubName,
      mostUsedClubCount: mostUsedClubCount,
      longestCarry: longestCarry,
      peakBallSpeed: peakBallSpeed,
      clubsHit: clubsHit,
      avgPath: 0,
    },
  );

  return {
    avgCarry: totals.avgCarry / totals.count,
    avgSpeed: totals.avgSpeed / totals.count,
    avgOffline: totals.avgOffline / totals.count,
    avgDynamicLoft: totals.avgDynamicLoft / totals.count,
    avgSpin: totals.avgSpin / totals.count,
    avgfaceToTarget: totals.avgfaceToTarget / totals.count,
    avgLaunchAngle: totals.avgLaunchAngle / totals.count,
    avgPeakHeight: totals.avgPeakHeight / totals.count,
    avgDescent: totals.avgDecent / totals.count,
    avgPath: totals.avgPath / totals.count,
    count: totals.count,
    mostUsedClub: totals.mostUsedClub,
    mostUsedClubCount: totals.mostUsedClubCount,
    longestCarry: totals.longestCarry,
    peakBallSpeed: totals.peakBallSpeed,
    clubsHit: totals.clubsHit,
  };
}

export function getClubAverages(shots: Shot[]) {
  const grouped = shots.reduce(
    (acc, shot) => {
      if (!shot.club) return acc;
      acc[shot.club] = acc[shot.club] ?? [];
      acc[shot.club].push(shot);
      return acc;
    },
    {} as Record<string, Shot[]>,
  );

  return Object.fromEntries(
    Object.entries(grouped).map(([club, shots]) => [
      club,
      calculateAverages(shots),
    ]),
  );
}



export function calculateRoundStats(rounds: Round[]): RoundStats {
  if (!rounds.length) {
    return {
      totalRounds: 0,
      bestScore: undefined,
      avgGIR: 0,
      avgFIR: 0,
      avgPutts: 0,
      longestDrive: undefined,
    };
  }

  const validRounds = rounds.filter((r) => !r.hidden_from_stats);
  const scores = validRounds.flatMap((r) => r.round_scores);

  const totals = rounds
    .map((r) => Number(r.total))
    .filter((t) => !isNaN(t) && t > 0);

  const bestScore = totals.length ? Math.min(...totals) : undefined;

  const longestDrive = scores.length
    ? Math.max(...scores.map((s) => s.driving_distance_longest))
    : undefined;

  const avgGIR = scores.length
    ? scores.reduce((acc, s) => acc + s.greens_value / s.greens_target, 0) /
      scores.length
    : 0;

  const avgFIR = scores.length
    ? scores.reduce((acc, s) => acc + s.fairways_value / s.fairways_target, 0) /
      scores.length
    : 0;

  const avgPutts = scores.length
    ? scores.reduce((acc, s) => acc + s.putts_value, 0) / scores.length
    : 0;

  return {
    totalRounds: validRounds.length,
    bestScore,
    avgGIR,
    avgFIR,
    avgPutts,
    longestDrive,
  };
}
