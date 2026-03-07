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
  const { user } = useUser();
  const { data: sessions = [], isLoading } = useSessions(user?.id || "");
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

  // need this to be an object using function calulateAverages to get the most used club and peak ball speed for the latest session card
  const latestSession = sessionArray[0]?.sessions[0];
  const latestSessionAverages = latestSession
    ? calculateAverages(latestSession.shots || [])
    : undefined;

  return (
    <div className={styles.sessions}>
      <div className={styles.pageHeader}>
        <div className={styles.title}>
          <h1>Sessions</h1>
          <p>
            All imported simulator sessions - {totalNumberOfShots} shots tracked
          </p>
        </div>
      </div>
      <SortBy
        options={["Date", "Shot count"]}
        numOfSessions={sessions.length}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {/* Latest session */}
      <div
        className={styles.mostRecentSession}
        onClick={() => router.push(`/session/${latestSession?.id}`)}
      >
        <div className={styles.type}>
          <p>Most Recent Session</p>
        </div>
        <div className={styles.info}>
          <div className={styles.text}>
            <p className={styles.title}>{latestSession?.session_name}</p>
            <p className={styles.date}>
              {moment(latestSession?.session_date).format("MMM D, YYYY")}
            </p>
          </div>
          <div className={styles.mostUsedClub}>
            <p>Top club</p>
            <h3>{latestSessionAverages?.mostUsedClub || "N/A"}</h3>
            <p>{latestSessionAverages?.mostUsedClubCount || 0} shots</p>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <p>Shots</p>
            <h3>{latestSessionAverages?.count || 0}</h3>
          </div>
          <div className={styles.stat}>
            <p>Best Carry</p>
            <h3>
              {latestSessionAverages?.longestCarry?.toFixed(0) || "N/A"}{" "}
              <span>yards</span>
            </h3>
          </div>
          <div className={styles.stat}>
            <p>Best Speed</p>
            <h3>
              {latestSessionAverages?.peakBallSpeed?.toFixed(0) || "N/A"}{" "}
              <span>mph</span>
            </h3>
          </div>
          <div className={styles.stat}>
            <p>Avg Spin</p>
            <h3>
              {latestSessionAverages?.avgSpin?.toFixed(0) || "N/A"}{" "}
              <span>rpm</span>
            </h3>
          </div>
        </div>

        <ul className={styles.clubs}>
          <p>Clubs hit </p>
          {latestSessionAverages?.clubsHit.map((club) => (
            <li key={club}>{club}</li>
          ))}
        </ul>
      </div>

      {sessionArray.map((group: any) => {
        const sessionsWithoutLatest = group.sessions.filter(
          (session: any) => session.id !== latestSession.id,
        );

        if (sessionsWithoutLatest.length === 0) return null;

        return (
          <div key={group.date} className={styles.sessionGroup}>
            <h2 className={styles.groupDate}>
              {group.date} <span>{sessionsWithoutLatest.length} sessions</span>
            </h2>
            <ul className={styles.sessionsList}>
              <div className={styles.header}>
                <p>Session</p>
                <ul>
                  <li>Shots</li>
                  <li>Best Carry</li>
                  <li>Best Speed</li>
                  <li>Top Club</li>
                </ul>
              </div>
              {sessionsWithoutLatest.map((session: any) => {
                const averages = calculateAverages(session.shots || []);
                return (
                  <li key={session.id}>
                    <SessionCard session={session} averages={averages} />
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default Sessions;
