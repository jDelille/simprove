"use client";

import { useState } from "react";
import styles from "./Leaderboard.module.scss";
import Avatar from "../avatar/Avatar";
import Link from "next/link";

type LeaderboardProps = {
  leaderboardData: any;
};

const Leaderboard = ({ leaderboardData }: LeaderboardProps) => {
  const [period, setPeriod] = useState("weekly");

  const leaderboard = leaderboardData.leaderboardData;

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

  const filteredLeaderboard = leaderboard.filter(
    (player: any) => player.period_type === period,
  );

  console.log(filteredLeaderboard);

  return (
    <div className={styles.leaderboard}>
      <div className={styles.pageHeader}>
        <div className={styles.title}>
          <h1>
            {period.charAt(0).toUpperCase() + period.slice(1)} Leaderboard
          </h1>
          <p>STILL IN DEVELOPMENT</p>
        </div>
      </div>

      <ul className={styles.leaderboardList}>
        <div className={styles.periodSelector}>
          <button
            className={period === "weekly" ? styles.active : ""}
            onClick={() => handlePeriodChange("weekly")}
          >
            Weekly
          </button>
          <button
            className={period === "monthly" ? styles.active : ""}
            onClick={() => handlePeriodChange("monthly")}
          >
            Monthly
          </button>
          <button
            className={period === "all_time" ? styles.active : ""}
            onClick={() => handlePeriodChange("all_time")}
          >
            All Time
          </button>
        </div>

        {filteredLeaderboard.map((player: any, index: number) => (
          <li key={player.id}>
            <Link
              href={`/profile/${player.users.username}`}
              className={styles.player}
            >
              <span className={styles.rank}>#{index + 1}</span>
              <Avatar src={player?.users?.avatar_path} size="small" />
              <span className={styles.user}>{player?.users?.username}</span>
              <span className={styles.points}>{player?.points} pts</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
