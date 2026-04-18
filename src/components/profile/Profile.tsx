"use client";

import React, { useState } from "react";
import RecentSessionsWidget from "../widgets/recent-sessions-widget/RecentSessionsWidget";
import styles from "./Profile.module.scss";
import ProfileHeader from "../profile-header/ProfileHeader";
import MyBag from "../my-bag/MyBag";
import LifetimeAveragesWidget from "../widgets/lifetime-averages-widget/LifetimeAveragesWidget";
import UserLessonsWidget from "../widgets/user-lessons-widget/UserLessonsWidget";
import { Session } from "@/types/session";
import { Profile as ProfileTypes } from "@/types/profile";
import { MyClubs } from "@/types/myClubs";
import { Lesson } from "@/types/lesson";
import UserRankWidget from "../widgets/user-rank-widget/UserRankWidget";
import TopPerformingClubsWidget from "../widgets/top-performing-clubs-widget/TopPerformingClubsWidget";
import { AveragesGraphWidget } from "../widgets";

type ProfileProps = {
  userId: string;
  myClubs?: MyClubs[];
  sessions: Session[];
  lessons: Lesson[];
  user: ProfileTypes;
  userPoints: any;
};

const Profile: React.FC<ProfileProps> = ({
  userId,
  myClubs,
  sessions,
  lessons,
  user,
  userPoints,
}) => {
  const [selectedTab, setSelectedTab] = useState("Overview");

  const overViewContent = (
    <div className={styles.content}>
      <div className={styles.column}>
        {/* <div className={styles.row}>
          <AchievementsWidgets userId={userId} badges={badges} />
        </div> */}
        <div className={styles.row}>
          <TopPerformingClubsWidget sessions={sessions} />
        </div>
        <div className={styles.row}>
          <AveragesGraphWidget sessions={sessions} />
        </div>
        <div className={styles.row}>
          <RecentSessionsWidget sessions={sessions} />
        </div>

        <div className={styles.row}>
          <UserLessonsWidget lessons={lessons as any} />
        </div>
      </div>
      <div className={styles.column}>
        <div className={styles.row}>
          <UserRankWidget profile={user} userPoints={userPoints} />
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
        user={user}
      />

      {selectedTab === "Overview" && overViewContent}
      {selectedTab === "My Bag" && myBagContent}
    </div>
  );
};

export default Profile;
