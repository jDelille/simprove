import { calculateTrend, formatTrend, groupByMonth } from "@/lib/stats/trends";
import type { Session, Shot } from "@/types";

type Params = {
  sessions: Session[];
  rounds: any[];
  gettingStartedCompletions?: any[];
  userId: string;
  shots: Shot[];
};

type Activity = {
  sessionDate: string;
  type: "session" | "round";
};

export const useDashboardData = ({
  sessions,
  rounds,
  gettingStartedCompletions,
  userId,
  shots,
}: Params) => {
  const sessionActivities = sessions.filter(Boolean).map((s) => ({
    type: "session" as const,
    sessionDate: s.created_at,
  }));

  const roundActivities = rounds.filter(Boolean).map((r) => ({
    type: "round" as const,
    sessionDate: r.created_at,
  }));

  const activities = [...sessionActivities, ...roundActivities];

  const grouped = groupByMonth(activities);
  const groupedShots = groupByMonth(shots);

  const now = new Date();
  const currentMonthKey = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}`;

  const last = new Date();
  last.setMonth(last.getMonth() - 1);
  const lastMonthKey = `${last.getUTCFullYear()}-${last.getUTCMonth() + 1}`;

  const activitiesThisMonth = grouped[currentMonthKey]?.sessions.length || 0;
  const activitiesLastMonth = grouped[lastMonthKey]?.sessions.length || 0;

  const activityTrend = calculateTrend(
    activitiesThisMonth,
    activitiesLastMonth,
  );
  const { text: activityTrendText, color: activityTrendColor } =
    formatTrend(activityTrend);

  const shotsThisMonth = groupedShots[currentMonthKey]?.sessions.length || 0;
  const shotsLastMonth = groupedShots[lastMonthKey]?.sessions.length || 0;

  const shotsTrend = calculateTrend(shotsThisMonth, shotsLastMonth);
  const { text: shotsTrendText, color: shotsTrendColor } =
    formatTrend(shotsTrend);

  const longestThisMonth = Math.max(
    ...(groupedShots[currentMonthKey]?.sessions.map(
      (s: Shot) => s.carry ?? 0,
    ) || [0]),
  );
  const longestLastMonth = Math.max(
    ...(groupedShots[lastMonthKey]?.sessions.map((s: Shot) => s.carry ?? 0) || [
      0,
    ]),
  );

  const carryTrend = calculateTrend(longestThisMonth, longestLastMonth);
  const { text: carryTrendText, color: carryTrendColor } =
    formatTrend(carryTrend);

  const hasCompletedGettingStarted = gettingStartedCompletions
    ? gettingStartedCompletions.length === 4
    : false;

  return {
    carryTrend,
    carryTrendText,
    carryTrendColor,
    shotsTrend,
    shotsTrendColor,
    shotsTrendText,
    hasCompletedGettingStarted,
    activitiesThisMonth,
    activitiesLastMonth,
    activityTrend,
    activityTrendText,
    activityTrendColor,
  };
};
