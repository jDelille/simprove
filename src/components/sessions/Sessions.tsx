"use client";

import { useSessions } from "@/hooks/useSessions";
import SortBy from "../sort-by/SortBy";
import styles from "./Sessions.module.scss";
import { useUser } from "@/hooks/useUser";
import moment from "moment";

const Sessions = () => {
  const { user } = useUser();
  const { sessions, loading } = useSessions(user?.id || "");

  // console.log(sessions)

  const groupedByMonth = sessions.reduce((group: any, session: any) => {
    const date = moment(session.session_date).format("MMM YYYY");

    if (!group[date]) {
      group[date] = [];
    }

    group[date].push(session);
    group[date].date = date;
    return group;
  }, {});

 
  const sessionArray = Object.values(groupedByMonth).map((group: any) => ({
    date: group.date,
    sessions: group,
  }));

  console.log(sessionArray)

  return (
    <div className={styles.sessions}>
      <SortBy options={["Date", "Shot count", "Best carry", "Ball Speed"]} />
      {sessionArray.map((group: any) => (
        <div key={group.date} className={styles.sessionGroup}>
          <h2>{group.date}</h2>
          {group.sessions.map((session: any) => (
            <div key={session.id} className={styles.sessionCard}>
              <h3>{session.session_name}</h3>
              <p>{moment(session.session_date).format("MMMM Do YYYY, h:mm:ss a")}</p>
              <p>Shots: {session.shot_count}</p>
              <p>Best carry: {session.best_carry} yards</p>
              <p>Best ball speed: {session.best_ball_speed} mph</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sessions;
