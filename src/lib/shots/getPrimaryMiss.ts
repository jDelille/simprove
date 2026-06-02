import { Shot } from "@/types";

export function getPrimaryMiss(shots: Shot[]) {
  const rightMisses = shots.filter((s) => (s.offline ?? 0) > 3);
  const leftMisses = shots.filter((s) => (s.offline ?? 0) < -3);

  const rightSeverity = rightMisses.reduce(
    (sum, s) => sum + Math.abs(s.offline ?? 0),
    0,
  );

  const leftSeverity = leftMisses.reduce(
    (sum, s) => sum + Math.abs(s.offline ?? 0),
    0,
  );

  const avgRightMiss =
    rightMisses.length > 0
      ? rightSeverity / rightMisses.length
      : 0;

  const avgLeftMiss =
    leftMisses.length > 0
      ? leftSeverity / leftMisses.length
      : 0;

  const rightScore = rightMisses.length + rightSeverity / 10;
  const leftScore = leftMisses.length + leftSeverity / 10;

  if (rightScore > leftScore * 1.2) {
    return {
      label: avgRightMiss > 10 ? "Push Right" : "Right",
      avgMiss: avgRightMiss,
    };
  }

  if (leftScore > rightScore * 1.2) {
    return {
      label: avgLeftMiss > 10 ? "Pull Left" : "Left",
      avgMiss: avgLeftMiss,
    };
  }

  return {
    label: "Straight",
    avgMiss: 0,
  };
}