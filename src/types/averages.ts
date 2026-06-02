export type Averages = {
  avgCarry: number;
  avgSpeed: number;
  avgOffline: number;
  avgSpin: number;
  avgfaceToTarget: number;
  avgDynamicLoft: number;
  avgLaunchAngle: number;
  avgPeakHeight: number;
  avgDescent: number;
  count: number;
  mostUsedClub?: string;
  mostUsedClubCount?: number;
  longestCarry?: number;
  peakBallSpeed?: number;
  clubsHit: string[];
  avgPath: number;
};