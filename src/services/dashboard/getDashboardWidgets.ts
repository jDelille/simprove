import { Session, Shot } from "@/types";

function formatCause(cause?: string) {
  switch (cause) {
    case "inside_path":
    case "outside_path":
      return "Swing Path";

    case "open_face":
    case "closed_face":
      return "Club Face";

    case "strike_quality":
      return "Strike Quality";

    default:
      return "Unknown";
  }
}

function formatFocusArea(cause?: string) {
  switch (cause) {
    case "inside_path":
    case "outside_path":
      return "Path Control";

    case "open_face":
    case "closed_face":
      return "Face Control";

    case "strike_quality":
      return "Contact Quality";

    default:
      return "Swing Fundamentals";
  }
}

function buildCauseDescription(
  cause?: string,
  profileMetrics?: {
    avgPath?: number;
    avgfaceToTarget?: number;
  },
) {
  switch (cause) {
    case "inside_path":
      return `${Math.abs(profileMetrics?.avgPath ?? 0).toFixed(1)}° from the inside`;

    case "outside_path":
      return `${Math.abs(profileMetrics?.avgPath ?? 0).toFixed(1)}° across the ball`;

    case "open_face":
      return `${Math.abs(profileMetrics?.avgfaceToTarget ?? 0).toFixed(1)}° open at impact`;

    case "closed_face":
      return `${Math.abs(profileMetrics?.avgfaceToTarget ?? 0).toFixed(1)}° closed at impact`;

    case "strike_quality":
      return "Strike inconsistency";

    case "mixed":
      return "Multiple contributing factors";

    default:
      return "Cause identified";
  }
}

function getSwingTrend(sessions: Session[]) {
  if (sessions.length < 2) {
    return {
      value: "No Trend",
      trendText: "Need more sessions",
    };
  }

  const latest = sessions[0];
  const previous = sessions[1];

  const latestAvgOffline =
    latest.shots.reduce((sum, s) => sum + Math.abs(s.offline ?? 0), 0) /
    latest.shots.length;

  const previousAvgOffline =
    previous.shots.reduce((sum, s) => sum + Math.abs(s.offline ?? 0), 0) /
    previous.shots.length;

  const improvement =
    ((previousAvgOffline - latestAvgOffline) / previousAvgOffline) * 100;

  if (improvement > 10) {
    return {
      value: "Straighter",
      trendText: `${Math.round(improvement)}% tighter shots`,
    };
  }

  if (improvement < -10) {
    return {
      value: "Wider",
      trendText: `${Math.round(Math.abs(improvement))}% wider shots`,
    };
  }

  return {
    value: "Steady",
    trendText: "Similar dispersion",
  };
};

export function getDashboardWidgets(
  takeaway: any,
  profileMetrics: any,
  shots: Shot[],
  sessions: Session[],
) {
  return {
    primaryMiss: {
      value: profileMetrics.primaryMiss ?? "Unknown",
      trendText:
        shots.length > 0
          ? `${profileMetrics.avgMiss} yds offline`
          : "No shot data",
    },

    missCause: {
      value: formatCause(takeaway?.cause),
      trendText: buildCauseDescription(
        takeaway?.cause,
        profileMetrics,
      ),
    },

    swingTrend: {
      value: getSwingTrend(sessions).value ?? "Need More Data",
      trendText: 
        sessions.length > 1
          ? getSwingTrend(sessions).trendText
          : "Complete another session",
    },

    focusArea: {
      value: formatFocusArea(takeaway?.cause),
      trendText: "View drills",
    },
  };
}