"use client";

import Calendar from "react-calendar";
import styles from "./SessionConsistencyWidget.module.scss";
import "react-calendar/dist/Calendar.css";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { useState } from "react";

const SessionConsistencyWidget = () => {
  const [month, setMonth] = useState(new Date(2026, 2)); // March 2026

  const sessionDates = [
    new Date(2026, 2, 3), // March 3, 2026
    new Date(2026, 2, 8),
    new Date(2026, 2, 15),
  ];

  const isSessionDate = (date: Date) => {
    return sessionDates.some(
      (sessionDate) =>
        sessionDate.getFullYear() === date.getFullYear() &&
        sessionDate.getMonth() === date.getMonth() &&
        sessionDate.getDate() === date.getDate(),
    );
  };

  return (
    <div className={styles.sessionConsistencyWidget}>
      <div className={styles.header}>
        <div className={styles.title}>
          <p>Session Consistency</p>
          <span>No sessions this month</span>
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
