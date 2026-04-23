"use client";

import { Session } from "@/types/session";
import styles from "./Activities.module.scss";
import { Profile } from "@/types/profile";
import Card from "./card/Card";
import { useState } from "react";

type ActivitiesProps = {
  sessions: Session[];
  rounds: any[];
  profile: Profile;
};

const groupByMonth = (sessions: Session[], rounds: any[]) => {
  const all = [
    ...sessions.map((s) => ({
      ...s,
      type: "session" as const,
      date: s.session_date,
    })),
    ...rounds.map((r) => ({
      ...r,
      type: "round" as const,
      date: r.round_begin,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  type ActivityItem = (typeof all)[number];

  const groups: Record<string, ActivityItem[]> = {};

  for (const item of all) {
    const key = new Date(item.date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }

  return groups;
};

const Activities = ({ sessions, rounds, profile }: ActivitiesProps) => {
  const [active, setActive] = useState<string>("All");
  const grouped = groupByMonth(sessions, rounds);

  const controls = ["All", "Rounds", "Sessions"];

  return (
    <div className={styles.activities}>
      <div className={styles.pageHeader}>
        <div className={styles.title}>
          <h1>Activities</h1>
          <p>
            {sessions.length} sessions · {rounds.length} rounds
          </p>
        </div>
        <div className={styles.controls}>
          <ul>
            {controls.map((control) => (
              <li
                key={control}
                className={active === control ? styles.active : undefined}
                onClick={() => setActive(control)}
              >
                {control}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.activitiesList}>
        {Object.entries(grouped).map(([month, items]) => (
          <div key={month}>
            <div className={styles.month}>
              <p>{month}</p>
              <div className={styles.line}></div>
              <p>{items.length} entries</p>
            </div>
            <ul className={styles.list}>
              {items.map((item, index) => (
                <li key={index}>
                  <Card item={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities;
