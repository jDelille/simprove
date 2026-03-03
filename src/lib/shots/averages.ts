import { Shot } from "@/types/shot";

export type Averages = {
  avgCarry: number;
  avgSpeed: number;
  avgOffline: number;
  count: number;
  mostUsedClub?: string;
  mostUsedClubCount?: number;
  longestCarry?: number;
};

export function calculateAverages(shots: Shot[]): Averages {
  if (!shots.length) {
    return {
      avgCarry: 0,
      avgSpeed: 0,
      avgOffline: 0,
      count: 0,
      mostUsedClub: undefined,
      mostUsedClubCount: undefined,
      longestCarry: undefined,

    };
  }

  const peakBallSpeed = Math.max(...shots.map((shot) => shot?.ballSpeed ?? 0));

  const mostUsedClub = shots.reduce((acc, shot) => {
    if (!shot.club) return acc;
    acc[shot.club] = (acc[shot.club] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostUsedClubName = Object.keys(mostUsedClub).reduce((a, b) =>
    mostUsedClub[a] > mostUsedClub[b] ? a : b
  );

  const mostUsedClubCount = mostUsedClub[mostUsedClubName];

  const longestCarry = Math.max(...shots.map((shot) => shot?.carry ?? 0));

  const totals = shots.reduce(
    (acc, shot) => {
      acc.avgCarry += shot?.carry ?? 0;
      acc.avgSpeed = peakBallSpeed ?? 0;
      acc.avgOffline += shot?.offline ?? 0;
      acc.count++;
      acc.mostUsedClub = mostUsedClubName;
      acc.mostUsedClubCount = mostUsedClubCount;
      acc.longestCarry = longestCarry;
      return acc;
    },
    {
      avgCarry: 0,
      avgSpeed: 0,
      avgOffline: 0,
      count: 0,
      mostUsedClub: mostUsedClubName,
      mostUsedClubCount: mostUsedClubCount,
      longestCarry: longestCarry,
    }
  );

  return {
    avgCarry: totals.avgCarry / totals.count,
    avgSpeed: totals.avgSpeed,
    avgOffline: totals.avgOffline / totals.count,
    count: totals.count,
    mostUsedClub: totals.mostUsedClub,
    mostUsedClubCount: totals.mostUsedClubCount,
    longestCarry: totals.longestCarry,
  };
}

// 🔹 Grouped averages (for charts later)
export function getClubAverages(shots: Shot[]) {
  const clubData: Record<string, Averages> = {};

  shots.forEach((shot) => {
    if (!shot.club) return;

    if (!clubData[shot.club]) {
      clubData[shot.club] = {
        avgCarry: 0,
        avgSpeed: 0,
        avgOffline: 0,
        count: 0,
      };
    }

    const club = clubData[shot.club];

    club.avgCarry += shot.carry ?? 0;
    club.avgSpeed += shot.ballSpeed ?? 0;
    club.avgOffline += shot.offline ?? 0;
    club.count++;
  });

  Object.values(clubData).forEach((club) => {
    club.avgCarry /= club.count;
    club.avgSpeed /= club.count;
    club.avgOffline /= club.count;
  });

  return clubData;
}