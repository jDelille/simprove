"use client";

import { useSessions } from "@/hooks/useSessions";
import SortBy from "../sort-by/SortBy";
import styles from "./Sessions.module.scss";
import { useUser } from "@/hooks/useUser";
import moment from "moment";
import SessionCard from "../session-card/SessionCard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { calculateAverages } from "@/lib/shots/averages";

type SessionGroup = {
  date: string;
  sessions: any[];
};

type GroupedSessions = Record<string, SessionGroup>;

const Sessions = () => {
  const { user, profile } = useUser();
  const { data: sessions = [], isLoading } = useSessions(profile?.id || "");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortField, setSortField] = useState<"date" | "shots">("date");
  const router = useRouter();

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

  const groupedByMonth: GroupedSessions =
    sortField === "date"
      ? sortedSessions.reduce<GroupedSessions>((group, session) => {
          const monthKey = moment(session.session_date).format("MMM YYYY");

          if (!group[monthKey]) {
            group[monthKey] = { date: monthKey, sessions: [] };
          }

          group[monthKey].sessions.push(session);
          return group;
        }, {})
      : {
          "All Sessions": {
            date: "All Sessions",
            sessions: sortedSessions,
          },
        };

  const totalNumberOfShots = sessions.reduce((total, session) => {
    return total + (session.shots?.length || 0);
  }, 0);

  const sessionArray = Object.values(groupedByMonth);

  console.log(sessionArray);

  return (
    <div className={styles.sessions}>
      <div className={styles.pageHeader}>
        <div className={styles.title}>
          <h1>Sessions</h1>
          <p>
            {sessions.length || 0} Sessions - {totalNumberOfShots} shots tracked
          </p>
        </div>
      </div>
      <SortBy
        options={["Date", "Shot count"]}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <div className={styles.sessionListContainer}>
        <ul className={styles.labels}>
          <li>Name</li>

          <div className={styles.statGroupLabels}>
            <li>Shots</li>
            <li>Max Carry</li>
            <li>Peak Ball Speed</li>
          </div>
        </ul>
        <ul className={styles.sessionList}>
          {sortedSessions.map((session: any, index: number) => {
            const averages = calculateAverages(session.shots || []);
            return (
              <li key={session.id}>
                <SessionCard session={session} averages={averages} index={index} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sessions;
