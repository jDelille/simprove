"use client";

import React from "react";
import styles from "./Profile.module.scss";
import AboutProfileWidget from "../widgets/about-profile-widget/AboutProfileWidget";
import { RecentActivityWidget } from "../widgets";
import { useUser } from "@/hooks/useUser";

type ProfileProps = {};
const Profile: React.FC<ProfileProps> = () => {

  const {user} = useUser();

  return (
    <div className={styles.profile}>
      <div className={styles.profileContent}>
        <div className={styles.layout}>
          <div className={styles.column}></div>
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
