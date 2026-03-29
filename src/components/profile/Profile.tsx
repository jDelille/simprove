"use client";

import React from "react";
import styles from "./Profile.module.scss";
import { AveragesGraphWidget } from "../widgets";

type ProfileProps = {
  userId: string;
};

const Profile: React.FC<ProfileProps> = ({ userId }) => {
  return (
    <div className={styles.profile}>
      <div className={styles.content}>
        <div className={styles.column}>
          <div className={styles.row}>
            <div className={styles.recentSessions}>
              <p>Recent Sessions</p>
            </div>
          </div>
          <div className={styles.row}>
            <AveragesGraphWidget userId={userId} />
          </div>
        </div>
        <div className={styles.column}></div>
      </div>
    </div>
  );
};

export default Profile;
