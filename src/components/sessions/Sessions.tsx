"use client";

import { useSessions } from "@/hooks/useSessions";
import SortBy from "../sort-by/SortBy";
import styles from "./Sessions.module.scss";
import { useUser } from "@/hooks/useUser";
import moment from "moment";
import SessionCard from "../session-card/SessionCard";
import { useState } from "react";

const Sessions = () => {
  const { user } = useUser();
  const { data: sessions = [], isLoading } = useSessions(user?.id || "");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortField, setSortField] = useState<"date" | "shots">("date");

  console.log(sessions)

  const sortedSessions = [...sessions].sort((a, b) => {
    if (sortField === "date") {
      const dateA = new Date(a.session_date).getTime();
      const dateB = new Date(b.session_date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else {
      const shotsA = a.shots?.length || 0;
      const shotsB = b.shots?.length || 0;
      return sortOrder === "asc" ? shotsA - shotsB : shotsB - shotsA;
    }
  });

  const groupedByMonth =
    sortField === "date"
      ? sortedSessions.reduce((group: any, session: any) => {
          const monthKey = moment(session.session_date).format("MMM YYYY");
          if (!group[monthKey]) {
            group[monthKey] = { date: monthKey, sessions: [] };
          }
          group[monthKey].sessions.push(session);
          return group;
        }, {})
      : { "All Sessions": { date: "All Sessions", sessions: sortedSessions } };

  const sessionArray = Object.values(groupedByMonth);

  return (
    <div className={styles.sessions}>
      <SortBy
        options={["Date", "Shot count"]}
        numOfSessions={sessions.length}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {sessionArray.map((group: any) => (
        <div key={group.date} className={styles.sessionGroup}>
          <h2 className={styles.groupDate}>
            {group.date} <span>{group.sessions.length} sessions</span>
          </h2>
          <ul className={styles.sessionsList}>
            {group.sessions.map((session: any) => (
              <li key={session.id}>
                <SessionCard session={session} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Sessions;
