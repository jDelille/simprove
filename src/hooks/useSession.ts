import { ShotRow } from "@/components/widgets/club-breakdown-widget/ClubBreakdownWidget";
import { calculateSessionStats } from "@/lib/session-stats/sessionStats";
import { getClubAverages } from "@/lib/shots/averages";
import { Session, Shot } from "@/types";
import { useMemo } from "react";

type Params = {
  activity: Session;
  selectedClub: string;
};

export const useSession = ({ activity, selectedClub }: Params) => {
  const filteredShots = useMemo(() => {
    if (!activity?.shots) return [];

    return selectedClub === "ALL"
      ? activity.shots
      : activity.shots.filter((s: Shot) => s.club === selectedClub);
  }, [activity?.shots, selectedClub]);

  const clubAverages = getClubAverages(filteredShots);

  const tableData: ShotRow[] = useMemo(() => {
    if (!filteredShots?.length) return [];

    return Object.entries(clubAverages).map(([club, stats]) => ({
      id: club,
      club,
      shots: stats.count.toFixed(0),
      avgCarry: stats.avgCarry,
      ballSpeed: stats.avgSpeed,
      avgOffline: stats.avgOffline,
      avgDynamicLoft: stats.avgDynamicLoft,
      avgBackSpin: stats.avgSpin,
      avgLaunch: stats.avgLaunchAngle,
      avgPeakHeight: stats.avgPeakHeight,
      avgDescent: stats.avgDescent,
    }));
  }, [filteredShots]);

   const sessionMetrics = calculateSessionStats({
      userId: activity?.user_id,
      shots: filteredShots,
      sessionLength: activity?.shots.length || 0,
    });

  return {
    tableData,
    sessionMetrics
  };
};
