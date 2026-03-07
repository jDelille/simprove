"use client";

import { useParams, useRouter } from "next/navigation";
import styles from "./Session.module.scss";
import { FaAngleLeft } from "react-icons/fa";
import { useSession } from "@/hooks/useSession";
import moment from "moment";
import { SmallStatWidget } from "../widgets";

const Session = () => {
  const router = useRouter();
  const params = useParams();

  const sessionId = params.id as string;

  const { data: session, isLoading, error } = useSession(sessionId);

  const sessionDate = moment(session?.created_at).format("MMMM D, YYYY");

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
          <div className={styles.row}>
            <SmallStatWidget
              title="Best Carry"
              value={100}
              metric="yds"
              trend="up"
              trendText="Personal Best"
            />
            <SmallStatWidget
              title="Best Carry"
              value={100}
              metric="yds"
              trend="up"
              trendText="Personal Best"
            />
            <SmallStatWidget
              title="Best Carry"
              value={100}
              metric="yds"
              trend="up"
              trendText="Personal Best"
            />
            <SmallStatWidget
              title="Best Carry"
              value={100}
              metric="yds"
              trend="up"
              trendText="Personal Best"
            />
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.row}>
            {/* Widget: Vs Last Session */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Session;
