"use client";

import React, { useState } from "react";
import styles from "./RecentSessionsWidget.module.scss";
import { useSessions } from "@/hooks/useSessions";
import { calculateAverages } from "@/lib/shots/averages";
import moment from "moment";
import { MdGolfCourse } from "react-icons/md";

type RecentSessionsWidgetProps = {
  userId: string;
};

const RecentSessionsWidget: React.FC<RecentSessionsWidgetProps> = ({
  userId,
}) => {
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

  const { data: sessions } = useSessions(userId);

  // console.log(sessions);

  return (
    <div className={styles.recentSessionsWidget}>
      <div className={styles.header}>
        <p>Recent Sessions</p>
      </div>
      <div className={styles.content}>
        {sessions && sessions.length > 0 ? (
          <ul className={styles.sessionList}>
            {sessions.map((session: any, index: number) => {
              const averages = calculateAverages(session.shots || []);
              return (
                <li key={session.id}>
                  <div className={styles.session}>
                    <div className={styles.icon}>
                      <MdGolfCourse color="var(--greenText)" size={20} />

                    </div>

                    <div className={styles.top}>
                      <p className={styles.name}>
                        {session.session_name}{" "}
                        <span>{moment(session.created_at).fromNow()}</span>
                      </p>
                      <div className={styles.sessionInfo}>
                        <p>{moment(session.created_at).format("MMM DD")} -</p>
                        <p>{session.shots?.length} shots -</p>
                        <p>8 clubs</p>
                      </div>
                    </div>
                    <div className={styles.bottom}>
                      <div className={styles.averages}>
                        <p>
                          <strong>{averages.avgCarry.toFixed(1)}</strong> carry
                        </p>
                        <p>
                          <strong>{averages.avgSpeed.toFixed(1)}</strong> mph
                        </p>
                        <p>
                          <strong>{averages.avgOffline.toFixed(1)}</strong> yds
                          off
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No recent sessions found.</p>
        )}
      </div>
    </div>
  );
};

export default RecentSessionsWidget;
