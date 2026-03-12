"use client";

import React from "react";
import styles from "./Profile.module.scss";
import { AveragesGraphWidget, RecentActivityWidget } from "../widgets";
import { useUser } from "@/hooks/useUser";
import LifetimeStatsWidget from "../widgets/lifetime-stats-widget/LifetimeStatsWidget";
import TopClubsWidget from "../widgets/top-clubs-widget/TopClubsWidget";

type ProfileProps = {};
const Profile: React.FC<ProfileProps> = () => {
  const { user } = useUser();

  return (
    <div className={styles.profile}>
      <div className={styles.profileContent}>
        <div className={styles.layout}>
          <div className={styles.column}>
            <div className={styles.row}>
              <LifetimeStatsWidget />
            </div>
            <div className={styles.row}>
              <AveragesGraphWidget userId={user?.id || ""} />
            </div>
            <div className={styles.row}></div>
          </div>
          <div className={styles.column}>
            <div className={styles.row}>
              <RecentActivityWidget userId={user?.id || ""} />
            </div>
            <div className={styles.row}>
              <TopClubsWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
