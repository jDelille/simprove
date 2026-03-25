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
import Button from "../button/Button";

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
  const isEmpty = sessions.length === 0;

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

  return (
    <div className={styles.sessions}>
      <div className={styles.pageHeader}>
        <div className={styles.title}>
          <h1>Sessions</h1>
          {sessions.length > 0 ? (
            <p>
              {sessions.length || 0} Sessions - {totalNumberOfShots} shots
              tracked
            </p>
          ) : (
            <p>No sessions tracked yet</p>
          )}
        </div>
      </div>
      <SortBy
        options={["Date", "Shot count"]}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        isEmpty={isEmpty}
      />

      <div className={styles.sessionListContainer}>
        <ul className={styles.labels}>
          <li style={isEmpty ? { color: "var(--lightgray)" } : undefined}>
            Name
          </li>

          <div
            className={styles.statGroupLabels}
            style={isEmpty ? { color: "var(--lightgray)" } : undefined}
          >
            <li>Shots</li>
            <li>Max Carry</li>
            <li>Peak Ball Speed</li>
          </div>
        </ul>
        {isEmpty && (
          <div className={styles.noSessions}>
            <h2>No sessions yet</h2>
            <p>
              Upload a session file from your launch monitor to start tracking
              shots, trends, and performance for your clubs.
            </p>
            <div className={styles.buttons}>
              <Button children="Upload Session" variant="lessonCard" />
              <Button children="See an example" variant="secondary" />
            </div>
            <div className={styles.tip}>
              <p>
                Tip:{" "}
                <span>
                  Sessions are imported as CSV exports from your launch monitor.
                  Supported devices include Trackman, Foresight, Garmin
                  Approach, and FlightScope.
                </span>
              </p>
            </div>
          </div>
        )}
        {!isEmpty && (
          <ul className={styles.sessionList}>
            {sortedSessions.map((session: any, index: number) => {
              const averages = calculateAverages(session.shots || []);
              return (
                <li key={session.id}>
                  <SessionCard
                    session={session}
                    averages={averages}
                    index={index}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sessions;
