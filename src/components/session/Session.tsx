"use client";

import { useParams, useRouter } from "next/navigation";
import styles from "./Session.module.scss";
import { FaAngleLeft } from "react-icons/fa";
import { useSession } from "@/hooks/useSession";
import moment from "moment";
import { MissTendencyWidget, SmallStatWidget } from "../widgets";
import VsLastSessionWidget from "../widgets/vs-last-session-widget/VsLastSessionWidget";
import ClubBreakdownWidget, {
  ShotRow,
} from "../widgets/club-breakdown-widget/ClubBreakdownWidget";
import { useMemo, useState } from "react";
import { getClubAverages } from "@/lib/shots/averages";
import FaceAngleWidget from "../widgets/face-angle-widget/FaceAngleWidget";
import { calculateSessionStats } from "@/lib/session-stats/sessionStats";

const Session = () => {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [selectedClub, setSelectedClub] = useState<string>("ALL");
  const { data: session, isLoading, error } = useSession(sessionId);

  const filteredShots = useMemo(() => {
    if (!session?.shots) return [];

    return selectedClub === "ALL"
      ? session.shots
      : session.shots.filter((s: any) => s.club === selectedClub);
  }, [session?.shots, selectedClub]);

  const sessionDate = moment(session?.created_at).format("MMMM D, YYYY");
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
      avgBackSpin: stats.avgSpin,
      avgLaunch: stats.avgLaunchAngle,
      avgPeakHeight: stats.avgPeakHeight,
      avgDescent: stats.avgDescent,
    }));
  }, [filteredShots]);

  const sessionMetrics = calculateSessionStats({
    userId: session?.user_id,
    shots: filteredShots,
    sessionLength: session?.shots.length || 0,
  });

  // console.log(sessionMetrics);

  if(isLoading) {
    return;
  }

  return (
    <div className={styles.session}>
      <div className={styles.pageHeader}>
        <div className={styles.backBtn} onClick={() => router.back()}>
          <FaAngleLeft size={13.5} color="var(--lightgray)" />
          Back to sessions
        </div>
        <div className={styles.title}>
          <h1>{session?.session_name}</h1>
          <div className={styles.info}>
            <p>{sessionDate}</p>
            <p>{session?.shots.length || 0} shots</p>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.column}>
          <div className={styles.row + " " + styles.statsRow}>
            <SmallStatWidget
              title="Total Shots Tracked"
              value={sessionMetrics.count?.toFixed(0) || 0}
              metric="shots"
              trend="increase"
              trendText="Personal Best"
            />
            <SmallStatWidget
              title="Best Carry"
              value={sessionMetrics.longestCarry?.toFixed(1) || 0}
              metric="yds"
              trend="increase"
              trendText="Personal Best"
            />
            <SmallStatWidget
              title="Avg Offline"
              value={sessionMetrics.avgOffline?.toFixed(1) || 0}
              metric="yds"
              trend="increase"
              trendText="Personal Best"
            />
            <SmallStatWidget
              title="Peak Ball Speed"
              value={sessionMetrics.avgSpeed?.toFixed(1) || 0}
              metric="mph"
              trend="increase"
              trendText="Personal Best"
            />
          </div>
          <div className={styles.row}>
            <ClubBreakdownWidget data={tableData} />
          </div>
          <div className={styles.row}>
            <MissTendencyWidget shots={filteredShots} />
            <FaceAngleWidget clubAverages={clubAverages} />
          </div>
          <div className={styles.row}>{/* Session analysis */}</div>
        </div>
        <div className={styles.column}>
          <div className={styles.row}>
            <VsLastSessionWidget />
          </div>
          <div className={styles.row}>{/* Shot distribution */}</div>
          <div className={styles.row}>{/* Vs lifetime average */}</div>
        </div>
      </div>
    </div>
  );
};

export default Session;
