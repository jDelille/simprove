"use client";

import React, { useState } from "react";
import RecentSessionsWidget from "../widgets/recent-sessions-widget/RecentSessionsWidget";
import AchievementsWidgets from "../widgets/achievements-widget/AchievementsWidgets";
import styles from "./Profile.module.scss";
import ProfileHeader from "../profile-header/ProfileHeader";
import MyBag from "../my-bag/MyBag";
import RankWidget from "../widgets/rank-widget/RankWidget";
import LifetimeAveragesWidget from "../widgets/lifetime-averages-widget/LifetimeAveragesWidget";

type ProfileProps = {
  userId: string;
  myClubs?: any[];
  badges: any;
  sessions: any[];
};

const Profile: React.FC<ProfileProps> = ({
  userId,
  myClubs,
  badges,
  sessions,
}) => {
  const [selectedTab, setSelectedTab] = useState("Overview");

  const overViewContent = (
    <div className={styles.content}>
      <div className={styles.column}>
        <div className={styles.row}>
          <AchievementsWidgets userId={userId} badges={badges} />
        </div>
        {/* <div className={styles.row}>
          <CalendarWidget />
        </div> */}
        <div className={styles.row}>
          <RecentSessionsWidget userId={userId} />
        </div>
      </div>
      <div className={styles.column}>
        <div className={styles.row}>
          <RankWidget />
        </div>
        <div className={styles.row}>
          <LifetimeAveragesWidget sessions={sessions} userId={userId} />
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
