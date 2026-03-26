import { Shot } from "@/types/shot";
import moment from "moment";

export type Trend = {
  current: number;
  previous: number;
  percentChange: number;
  direction: "increase" | "decrease" | "none";
};

export type GroupedSessions<T> = {
  [month: string]: {
    date: string;
    sessions: T[];
  };
};

export function calculateTrend(current: number, previous: number): Trend {
  if (previous === 0) {
    return {
      current,
      previous,
      percentChange: current > 0 ? 100 : 0,
      direction: current > 0 ? "increase" : "none",
    };
  }

  const percent = ((current - previous) / previous) * 100;

  return {
    current,
    previous,
    percentChange: Number(Math.abs(percent).toFixed(1)),
    direction: percent > 0 ? "increase" : percent < 0 ? "decrease" : "none",
  };
}

export function groupByMonth<
  T extends { sessionDate?: string | Date } | { session_date?: string },
>(items: T[]): Record<string, { date: string; sessions: T[] }> {
  return items.reduce(
    (group, item) => {
      const dateStr =
        "sessionDate" in item
          ? item.sessionDate
          : "created_at" in item
            ? item.created_at
            : undefined;
      if (!dateStr) return group;

      const monthKey = moment(dateStr).format("MMM YYYY");
      if (!group[monthKey]) group[monthKey] = { date: monthKey, sessions: [] };
      group[monthKey].sessions.push(item);
      return group;
    },
    {} as Record<string, { date: string; sessions: T[] }>,
  );
}

export function getShotsByMonth(shots: Shot[]) {
  const now = moment();
  const lastMonth = moment().subtract(1, "month");

  const shotsThisMonth = shots.filter((shot) =>
    moment(shot.sessionDate).isSame(now, "month"),
  );

  const shotsLastMonth = shots.filter((shot) =>
    moment(shot.sessionDate).isSame(lastMonth, "month"),
  );

  return {
    shotsThisMonth,
    shotsLastMonth,
  };
}

export type TrendWithColor = {
  text: string;
  color: string;
};

export const formatTrend = (trend: {
  percentChange: number;
  direction: "increase" | "decrease" | "none";
}): TrendWithColor => {
  switch (trend.direction) {
    case "increase":
      return {
        text: `${trend.percentChange}% increase from last month`,
        color: "var(--accent)",
      };
    case "decrease":
      return {
        text: `${trend.percentChange}% decrease from last month`,
        color: "#c93c32",
      };
    case "none":
    default:
      return { text: "No change from last month", color: "var(--lightgray)" };
  }
};
