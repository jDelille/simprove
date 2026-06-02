"use client";

import { useState } from "react";
import { Profile, Session } from "@/types";
import Card from "./card/Card";
import styles from "./Activities.module.scss";
import { MdOutlineCalendarToday } from "react-icons/md";
import { FaFileImport } from "react-icons/fa";
import { IoSync } from "react-icons/io5";
import useModal from "@/hooks/useModal";
import Button from "../ui/button/Button";

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
  const { openModal, modals, closeModal } = useModal();

  const filtered = groupByMonth(
    active === "Rounds" ? [] : sessions,
    active === "Sessions" ? [] : rounds,
  );

  console.log("sessions", sessions);
  console.log("rounds", rounds);

  const controls = ["All", "Rounds", "Sessions"];

  const hasNoActivities = sessions.length === 0 && rounds.length === 0;

  if (hasNoActivities) {
    return (
      <div className={styles.noActivities}>
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
        <div className={styles.content}>
          <MdOutlineCalendarToday size={30} color="var(--lightgray)" />
          <p className={styles.title}>No activities yet</p>
          <p className={styles.description}>
            Add a range session manually, or sync automatically using the
            simprove browser extension to get both range sessions and rounds.
          </p>

          <div className={styles.row}>
            <div className={styles.box}>
              <FaFileImport size={20} color="var(--lightgray)" />
              <p className={styles.title}>Manually add activities</p>
              <p>Upload an exported csv file</p>
              <Button
                onClick={() => openModal("import")}
                variant="lessonCard"
                children="Import file"
              />
            </div>
            <div className={styles.box}>
              <IoSync size={20} color="var(--lightgray)" />
              <p className={styles.title}>Sync automatically</p>
              <p>Auto-import from GsPro</p>
              <Button
                onClick={() => openModal("sync")}
                variant="lessonCard"
                children="Get extension"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        {Object.entries(filtered).map(([month, items]) => (
          <div key={month}>
            <div className={styles.month}>
              <p>{month}</p>
              <div className={styles.line}></div>
              <p>{items.length} entries</p>
            </div>
            <ul className={styles.list}>
              {items.map((item, index) => (
                <li key={index}>
                  <Card item={item} isDemoAccount={profile.is_demo_account} />
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
