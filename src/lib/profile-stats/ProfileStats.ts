import { Shot } from "@/types/shot";
import { calculateAverages } from "../shots/averages";
import { getPrimaryMiss } from "../shots/getPrimaryMiss";
import { getMissCause } from "../shots/getMissCause";
import { getFocusArea } from "../shots/getFocusArea";

type CalculateProfileStatsProps = {
  userId: string;
  shots: Shot[];
  sessionLength: number;
  club?: string;
};

export function calculateProfileStats({
  userId,
  shots,
  sessionLength,
  club,
}: CalculateProfileStatsProps) {
  const averages = calculateAverages(shots);
  console.log(averages)
  const primaryMiss = getPrimaryMiss(shots);
  const missCause = getMissCause(averages.avgfaceToTarget, averages.avgPath);
  const focusArea = getFocusArea(missCause.title);

  return {
    ...averages,
    sessionLength,
    primaryMiss,
    missCause,
    focusArea,
  };
}
