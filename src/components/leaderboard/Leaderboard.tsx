"use client";

import { useEffect, useState } from "react";
import styles from "./Leaderboard.module.scss";
import Avatar from "../ui/avatar/Avatar";
import { getInitials } from "@/lib/getInitials";
import { HiMiniTrophy } from "react-icons/hi2";
import { FaCrown } from "react-icons/fa";

type LeaderboardProps = {
  leaderboardData: any;
};

const Leaderboard = ({ leaderboardData }: LeaderboardProps) => {
  const [period, setPeriod] = useState("weekly");
  const [mounted, setMounted] = useState(false);

  const leaderboard = leaderboardData.leaderboardData;
  const trophyColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
  const ordinals = ["1st", "2nd", "3rd"];

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

  const filteredLeaderboard = leaderboard
    .filter((player: any) => player.period_type === period)
    .sort((a: any, b: any) => b.points - a.points);
  const periods = ["weekly"];

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const getRank = (index: number, leaderboard: any[]) => {
  const actualIndex = index + 3;
  const points = leaderboard[actualIndex].points;
  
  // find the first occurrence of this points value
  const firstIndex = leaderboard.findIndex(p => p.points === points);
  const isTied = leaderboard.filter(p => p.points === points).length > 1;
  
  const rank = firstIndex + 1;
  return isTied ? `T${rank}` : `#${rank}`;
};

  return (
    <div className={styles.leaderboard}>
      <div className={styles.pageHeader}>
        <div className={styles.title}>
          <h1>Leaderboard</h1>
          <p>Ranked by total points</p>
        </div>
        <ul className={styles.leaderboardList}>
          {periods.map((p) => (
            <li
              key={p}
              className={period === p ? styles.active : ""}
              onClick={() => handlePeriodChange(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.content}>
        <div className={styles.podium}>
          {filteredLeaderboard.slice(0, 3).map((player: any, index: number) => (
            <div
              key={player.id}
              className={`${styles.podiumBlockContainer} ${mounted ? styles.mounted : ""}`}
            >
              {index === 0 && (
                <FaCrown size={18} color="#FFD700" className={styles.crown} />
              )}

              <div className={styles.userWrapper}>
                <Avatar
                  src={player.avatar_path}
                  size="medium"
                  initials={getInitials(player.display_name)}
                />
                <p>{player.username}</p>
                <p className={styles.rank}>{ordinals[index]}</p>
              </div>

              <div className={styles.podiumBlock}>
                <HiMiniTrophy size={20} color={trophyColors[index]} />
                <p>{player.points}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.leaderboardList}>
          {filteredLeaderboard.slice(3).map((player: any, index: number) => (
            <div key={index} className={styles.leaderboardItem}>
              <p className={styles.rank}>{getRank(index, filteredLeaderboard)}</p>
              <p className={styles.username}>{player.username}</p>
              <p className={styles.points}>{player.points}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
