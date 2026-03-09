import { Shot } from "@/types/shot";

export type ClubConsistency = {
  club: string;
  count: number;
  avgCarry: number;
  avgOffline: number;
  avgSpin: number;
  carryStd: number;
  offlineStd: number;
  spinStd: number;
  consistencyScore: number;
};

export function getWeakestClubs(shots: Shot[], topN: number = 5): ClubConsistency[] {
  const clubMap: Record<string, Shot[]> = {};

  shots.forEach((shot) => {
    if (!shot.club) return;
    if (!clubMap[shot.club]) clubMap[shot.club] = [];
    clubMap[shot.club].push(shot);
  });

  const results: ClubConsistency[] = [];

  Object.entries(clubMap).forEach(([club, clubShots]) => {
    const count = clubShots.length;
    if (count === 0) return;

    const avgCarry = clubShots.reduce((sum, s) => sum + (s.carry ?? 0), 0) / count;
    const avgOffline = clubShots.reduce((sum, s) => sum + (s.offline ?? 0), 0) / count;
    const avgSpin = clubShots.reduce((sum, s) => sum + (s.backSpin ?? 0), 0) / count;

    const carryStd = Math.sqrt(
      clubShots.reduce((sum, s) => sum + Math.pow((s.carry ?? 0) - avgCarry, 2), 0) / count
    );
    const offlineStd = Math.sqrt(
      clubShots.reduce((sum, s) => sum + Math.pow((s.offline ?? 0) - avgOffline, 2), 0) / count
    );
    const spinStd = Math.sqrt(
      clubShots.reduce((sum, s) => sum + Math.pow((s.backSpin ?? 0) - avgSpin, 2), 0) / count
    );

    const consistencyScore = carryStd;

    results.push({
      club,
      count,
      avgCarry,
      avgOffline,
      avgSpin,
      carryStd,
      offlineStd,
      spinStd,
      consistencyScore,
    });
  });

  return results
  .sort((a, b) => b.consistencyScore - a.consistencyScore)
  .slice(0, topN);
}

export function getDeviationColor(deviation: number) {
  if (deviation <= 5) return "#4caf50"; // green
  if (deviation <= 10) return "#ffeb3b"; // yellow
  if (deviation <= 20) return "var(--secondaryAccent)"; // orange
  return "var(--lightgray)"; // red
}