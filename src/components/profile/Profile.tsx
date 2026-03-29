"use client";

import React from "react";
import styles from "./Profile.module.scss";
import { AveragesGraphWidget } from "../widgets";
import SessionConsistencyWidget from "../widgets/session-consistency-widget/SessionConsistencyWidget";
import RecentSessionsWidget from "../widgets/recent-sessions-widget/RecentSessionsWidget";

type ProfileProps = {
  userId: string;
};

const Profile: React.FC<ProfileProps> = ({ userId }) => {
  return (
    <div className={styles.profile}>
      <div className={styles.content}>
        <div className={styles.column}>
          <div className={styles.row}>
            <AveragesGraphWidget userId={userId} />
          </div>
          <div className={styles.row}>
            <RecentSessionsWidget userId={userId} />
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.row}>
            <SessionConsistencyWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
