import { Shot } from "@/types/shot";

export type Averages = {
  avgCarry: number;
  avgSpeed: number;
  avgOffline: number;
  avgSpin: number;
  count: number;
  mostUsedClub?: string;
  mostUsedClubCount?: number;
  longestCarry?: number;
  peakBallSpeed?: number;
  clubsHit: string[];
  avgfaceToTarget: number;
  avgLaunchAngle: number;
  avgPeakHeight: number;
  avgDescent: number;
};

export function calculateAverages(shots: Shot[]): Averages {
  if (!shots.length) {
    return {
      avgCarry: 0,
      avgSpeed: 0,
      avgOffline: 0,
      avgSpin: 0,
      count: 0,
      mostUsedClub: undefined,
      mostUsedClubCount: undefined,
      longestCarry: undefined,
      peakBallSpeed: undefined,
      clubsHit: [],
      avgfaceToTarget: 0,
      avgLaunchAngle: 0,
      avgPeakHeight: 0,
      avgDescent: 0,
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

  const mostUsedClubName = Object.keys(mostUsedClub).reduce((a, b) =>
    mostUsedClub[a] > mostUsedClub[b] ? a : b,
  );

  const mostUsedClubCount = mostUsedClub[mostUsedClubName];

  const longestCarry = Math.max(...shots.map((shot) => shot?.carry ?? 0));

  const clubsHit = Array.from(new Set(shots.map((shot) => shot.club).filter(Boolean))) as string[];

  const totals = shots.reduce(
    (acc, shot) => {
      acc.avgCarry += shot?.carry ?? 0;
      acc.avgSpeed += shot.ballSpeed ?? 0;
      acc.avgOffline += shot?.offline ?? 0;
      acc.avgSpin += shot?.backSpin ?? 0;
      acc.count++;
      acc.mostUsedClub = mostUsedClubName;
      acc.mostUsedClubCount = mostUsedClubCount;
      acc.longestCarry = longestCarry;
      acc.peakBallSpeed = peakBallSpeed;
      acc.clubsHit = clubsHit;
      acc.avgfaceToTarget = shot.faceToTarget ?? 0;
      acc.avgLaunchAngle = shot?.vla ?? 0;
      acc.avgPeakHeight = shot.peakHeight ?? 0;
      acc.avgDecent = shot.decent ?? 0;
      return acc;
    },
    {
      avgCarry: 0,
      avgSpeed: 0,
      avgOffline: 0,
      avgSpin: 0,
      count: 0,
      mostUsedClub: mostUsedClubName,
      mostUsedClubCount: mostUsedClubCount,
      longestCarry: longestCarry,
      peakBallSpeed: peakBallSpeed,
      clubsHit: clubsHit,
      avgfaceToTarget: 0,
      avgLaunchAngle: 0,
      avgPeakHeight: 0,
      avgDecent: 0,
    },
  );

  return {
    avgCarry: totals.avgCarry / totals.count,
    avgSpeed: totals.avgSpeed / totals.count,
    avgOffline: totals.avgOffline / totals.count,
    avgSpin: totals.avgSpin / totals.count,
    count: totals.count,
    mostUsedClub: totals.mostUsedClub,
    mostUsedClubCount: totals.mostUsedClubCount,
    longestCarry: totals.longestCarry,
    peakBallSpeed: totals.peakBallSpeed,
    clubsHit: totals.clubsHit,
    avgfaceToTarget: totals.avgfaceToTarget / totals.count,
    avgLaunchAngle: totals.avgLaunchAngle / totals.count,
    avgPeakHeight: totals.avgPeakHeight / totals.count,
    avgDescent: totals.avgDecent / totals.count,
  };
}

export function getClubAverages(shots: Shot[]) {
  const clubData: Record<string, Averages> = {};

  shots.forEach((shot) => {
    if (!shot.club) return;

    if (!clubData[shot.club]) {
      clubData[shot.club] = {
        avgCarry: 0,
        avgSpeed: 0,
        avgOffline: 0,
        avgSpin: 0,
        count: 0,
        mostUsedClub: shot.club,
        mostUsedClubCount: 0,
        longestCarry: 0,
        peakBallSpeed: 0,
        clubsHit: [],
        avgfaceToTarget: 0,
        avgLaunchAngle: 0,
        avgPeakHeight: 0,
        avgDescent: 0,
      };
    }

    const club = clubData[shot.club];

    club.avgCarry += shot.carry ?? 0;
    club.avgSpeed += shot.ballSpeed ?? 0;
    club.avgOffline += shot.offline ?? 0;
    club.avgSpin += shot.backSpin ?? 0;
    club.avgfaceToTarget += shot.faceToTarget ?? 0;
    club.avgLaunchAngle += shot.vla ?? 0;
    club.avgPeakHeight += shot.peakHeight ?? 0;
    club.avgDescent += shot.decent ?? 0;
    club.count++;
  });

  Object.values(clubData).forEach((club) => {
    club.avgCarry /= club.count;
    club.avgSpeed /= club.count;
    club.avgOffline /= club.count;
    club.avgSpin /= club.count;
    club.avgfaceToTarget /= club.count;
    club.avgLaunchAngle /= club.count;
    club.avgPeakHeight /= club.count;
    club.avgDescent /= club.count;
  });

  return clubData;
}

export function calculatePercentChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / Math.abs(previous)) * 100;
}
