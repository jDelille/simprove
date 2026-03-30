"use client";

import Calendar from "react-calendar";
import styles from "./SessionConsistencyWidget.module.scss";
import "react-calendar/dist/Calendar.css";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { useState } from "react";
import { useSessions } from "@/hooks/useSessions";

type SessionConsistencyWidgetProps = {
  userId: string;
};

const SessionConsistencyWidget: React.FC<SessionConsistencyWidgetProps> = ({
  userId,
}) => {
  const [month, setMonth] = useState(new Date(2026, 2)); // March 2026
  const { data: sessions } = useSessions(userId);

  const sessionDates = (sessions || []).map((s: any) => {
    const d = new Date(s.created_at);
    // store as "YYYY-MM-DD" string
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  });

  const currentMonth = month.getMonth();
  const currentYear = month.getFullYear();

  const isSessionDate = (date: Date) =>
    sessionDates.includes(
      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
    );

  // Count how many sessions are in the current month
  const sessionsThisMonth = (sessions || []).filter((s: any) => {
    const d = new Date(s.created_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  // Set the text
  const sessionCountText =
    sessionsThisMonth === 0
      ? "No sessions this month"
      : `${sessionsThisMonth} session${sessionsThisMonth > 1 ? "s" : ""} this month`;

  return (
    <div className={styles.sessionConsistencyWidget}>
      <div className={styles.header}>
        <div className={styles.title}>
          <p>Session Uploads</p>
          <span>{sessionCountText}</span>
        </div>
        <div className={styles.month}>
          <div
            className={styles.icon}
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1))
            }
          >
            <MdOutlineKeyboardArrowLeft size={20} color="var(--lightgray)" />
          </div>
          <p>{month.toLocaleString("default", { month: "short" })} 2026</p>
          <div
            className={styles.icon}
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1))
            }
          >
            <MdOutlineKeyboardArrowRight size={20} color="var(--lightgray)" />
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <Calendar
          className={styles.calendar}
          showNavigation={false}
          tileClassName={({ date, view }) =>
            view === "month" && isSessionDate(date) ? styles.sessionDay : null
          }
        />
      </div>
    </div>
  );
};

export default SessionConsistencyWidget;
