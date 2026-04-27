"use client";

import React, { useState } from "react";
import styles from "./RecentActivityWidget.module.scss";
import { calculateAverages } from "@/lib/shots/averages";
import moment from "moment";
import { Session } from "@/types/session";

type RecentActivityWidgetProps = {
  sessions: Session[];
};

const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({
  sessions
}) => {
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

  return (
    <div className={styles.recentSessionsWidget}>
      <div className={styles.header}>
        <p>Recent Sessions</p>
      </div>
      <div className={styles.content}>
        {sessions && sessions.length > 0 ? (
          <ul className={styles.sessionList}>
            {sessions.map((session: Session, index: number) => {
              const averages = calculateAverages(session.shots || []);
              return (
                <li key={session.id}>
                  <div className={styles.session}>
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

export default RecentActivityWidget;
