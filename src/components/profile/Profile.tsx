"use client";

import React, { useState } from "react";
import SessionConsistencyWidget from "../widgets/session-consistency-widget/SessionConsistencyWidget";
import RecentSessionsWidget from "../widgets/recent-sessions-widget/RecentSessionsWidget";
import AchievementsWidgets from "../widgets/achievements-widget/AchievementsWidgets";
import styles from "./Profile.module.scss";
import ProfileHeader from "../profile-header/ProfileHeader";
import MyBag from "../my-bag/MyBag";

type ProfileProps = {
  userId: string;
  myClubs?: any[];
};

const Profile: React.FC<ProfileProps> = ({ userId, myClubs }) => {
  const [selectedTab, setSelectedTab] = useState("Overview");

  const overViewContent = (
    <div className={styles.content}>
      <div className={styles.column}>
        <div className={styles.row}>
          <AchievementsWidgets userId={userId} />
        </div>
        <div className={styles.row}>
          <RecentSessionsWidget userId={userId} />
        </div>
      </div>
      <div className={styles.column}>
        <div className={styles.row}>
          <div className={styles.rank}>
            <div className={styles.labels}>
              <div className={styles.label}>
                <p>Bogey I</p>
                <span>Current rank</span>
              </div>
              <div className={styles.label}>
                <p>Bogey II</p>
                <span>Next rank</span>
              </div>
            </div>
            <div className={styles.progress}>
              <div className={styles.fill}></div>
            </div>
            <div className={styles.points}>
              <p>250 / 1000 pts to next rank</p>
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <SessionConsistencyWidget userId={userId} />
        </div>
      </div>
    </div>
  );

  const myBagContent = (
    <div className={styles.content}>
      <MyBag userId={userId} myClubs={myClubs} />
    </div>
  );

  return (
    <div className={styles.profile}>
      <ProfileHeader
        userId={userId}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      {selectedTab === "Overview" && overViewContent}
      {selectedTab === "My Bag" && myBagContent}
    </div>
  );
};

export default Profile;
