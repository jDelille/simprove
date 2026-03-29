"use client";

import React, { useState } from "react";
import styles from "./RecentSessionsWidget.module.scss";
import { useSessions } from "@/hooks/useSessions";
import SessionCard from "@/components/session-card/SessionCard";
import { calculateAverages } from "@/lib/shots/averages";

type RecentSessionsWidgetProps = {
  userId: string;
};

const RecentSessionsWidget: React.FC<RecentSessionsWidgetProps> = ({
  userId,
}) => {
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

  const { data: sessions } = useSessions(userId);

  console.log(sessions);

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
                  <SessionCard
                    session={session}
                    averages={averages}
                    index={index}
                    setSelectedSessions={setSelectedSessions}
                    selectedSessions={selectedSessions}
                    isProfileView
                  />
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
