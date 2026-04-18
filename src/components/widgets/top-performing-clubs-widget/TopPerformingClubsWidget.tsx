"use client";

import React, { useRef, useState } from "react";
import styles from "./TopPerformingClubsWidget.module.scss";
import { Session } from "@/types/session";

type TopPerformingClubsWidgetTypes = {
  sessions: Session[];
};

const TopPerformingClubsWidget = ({
  sessions,
}: TopPerformingClubsWidgetTypes) => {
  const listRef = useRef<HTMLUListElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!listRef.current) return;
    setIsDragging(true);
    startX.current = e.pageX - listRef.current.offsetLeft;
    scrollLeft.current = listRef.current.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !listRef.current) return;
    e.preventDefault();
    const x = e.pageX - listRef.current.offsetLeft;
    const walk = x - startX.current;
    listRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDragging = () => setIsDragging(false);

  const clubMap = sessions.reduce((acc, val) => {
    val.shots.forEach((shot) => {
      const existing = acc.get(shot.club) ?? {
        totalDistance: 0,
        totalAccuracy: 0,
        count: 0,
      };
      acc.set(shot.club, {
        totalDistance: existing.totalDistance + shot.carry,
        totalAccuracy: existing.totalAccuracy + shot.offline,
        count: existing.count + 1,
      });
    });
    return acc;
  }, new Map<string, { totalDistance: number; totalAccuracy: number; count: number }>());

  const clubs = [...clubMap.entries()]
    .map(([club, stats]) => ({
      club,
      avgDistance: stats.totalDistance / stats.count,
      avgAccuracy: stats.totalAccuracy / stats.count,
      count: stats.count,
    }))
    .sort((a, b) => Math.abs(a.avgAccuracy) - Math.abs(b.avgAccuracy));

  console.log(clubs);

  return (
    <div className={styles.topPerformingClubsWidget}>
      <div className={styles.header}>
        <p>Top Performing Clubs</p>
        <span>Last 12 Months</span>
      </div>

      <div className={styles.content}>
        <ul
          ref={listRef}
          className={`${styles.list} ${isDragging ? styles.grabbing : ""}`}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
        >
          {clubs.map((club, index) => (
            <li key={club.club}>
              <div className={styles.card}>
                <h1>{club.club}</h1>
                <p>
                  {club.avgDistance.toFixed(1)} <span>yds carry</span>
                </p>
                <p>
                  {club.avgAccuracy.toFixed(1)} <span>yds offline</span>
                </p>
              </div>
              <div className={styles.number}>{index + 1}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopPerformingClubsWidget;
