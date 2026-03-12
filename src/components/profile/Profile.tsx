"use client";

import React from "react";
import styles from "./Profile.module.scss";
import AboutProfileWidget from "../widgets/about-profile-widget/AboutProfileWidget";
import { AveragesGraphWidget, RecentActivityWidget } from "../widgets";
import { useUser } from "@/hooks/useUser";
import LifetimeStatsWidget from "../widgets/lifetime-stats-widget/LifetimeStatsWidget";
import FavoriteClubsWidget from "../widgets/favorite-clubs-widget/FavoriteClubsWidget";
import { Average } from "next/font/google";

type ProfileProps = {};
const Profile: React.FC<ProfileProps> = () => {

  const {user} = useUser();

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
            <div className={styles.row}>
              <FavoriteClubsWidget />
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.row}>
              <AboutProfileWidget />
            </div>
            <div className={styles.row}>
              <RecentActivityWidget userId={user?.id || ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
