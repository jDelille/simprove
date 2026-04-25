import { calculateProfileStats } from "@/lib/profile-stats/ProfileStats";
import {
  calculateTrend,
  formatTrend,
  groupByMonth,
  Trend,
} from "@/lib/stats/trends";
import { getWeakestClubs } from "@/lib/stats/weakestClubs";
import type { Session, Shot } from "@/types";

type Params = {
  sessions: Session[];
  gettingStartedCompletions?: any[];
  userId: string;
  shots: Shot[];
};

export const useDashboardData = ({
  sessions,
  gettingStartedCompletions,
  userId,
  shots,
}: Params) => {
  const groupedSessions = groupByMonth(sessions);
  const groupedShots = groupByMonth(shots);

  const currentMonthKey = new Date().toLocaleString("default", {
    month: "short",
    year: "numeric",
  });
  const lastMonthKey = new Date(
    new Date().setMonth(new Date().getMonth() - 1),
  ).toLocaleString("default", { month: "short", year: "numeric" });

  const sessionsThisMonth =
    groupedSessions[currentMonthKey]?.sessions.length || 0;
  const sessionsLastMonth = groupedSessions[lastMonthKey]?.sessions.length || 0;

  const sessionsTrend = calculateTrend(sessionsThisMonth, sessionsLastMonth);
  const { text: sessionsTrendText, color: sessionsTrendColor } =
    formatTrend(sessionsTrend);

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
    sessionsThisMonth,
    sessionsTrend,
    sessionsTrendText,
    sessionsTrendColor,
    hasCompletedGettingStarted
  };
};
