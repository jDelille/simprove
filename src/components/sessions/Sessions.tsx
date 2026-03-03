"use client";

import { useSessions } from "@/hooks/useSessions";
import SortBy from "../sort-by/SortBy";
import styles from "./Sessions.module.scss";
import { useUser } from "@/hooks/useUser";
import moment from "moment";

const Sessions = () => {
  const { user } = useUser();
  const { sessions, loading } = useSessions(user?.id || "");

  console.log(sessions)

  const groupedByMonth = sessions.reduce((group: any, session: any) => {
    const date = moment(session.session_date).format("MMM YYYY");

    if (!group[date]) {
      group[date] = [];
    }

    group[date].push(session);
    group[date].date = date;
    return group;
  }, {});

  console.log(groupedByMonth)

  return (
    <div className={styles.sessions}>
      <SortBy options={["Date", "Shot count", "Best carry", "Ball Speed"]} />
    </div>
  );
};

export default Sessions;
