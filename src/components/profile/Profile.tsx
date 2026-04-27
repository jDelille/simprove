"use client";

import React from "react";
import { Lesson, MyClubs, Profile as ProfileType, Session } from "@/types";
import styles from "./Profile.module.scss";
import UserWidget from "./widgets/user-widget/UserWidget";
import CareerStatsWidget from "./widgets/career-stats-widget/CareerStatsWidget";
import { AveragesGraphWidget } from "../widgets";
import { RecentActivityWidget, TopPerformingClubsWidget } from "./widgets";

type ProfileProps = {
  userId: string;
  myClubs?: MyClubs[];
  sessions: Session[];
  lessons: Lesson[];
  user: ProfileType;
  userPoints: any;
  rounds: any[];
};

const Profile: React.FC<ProfileProps> = ({
  userId,
  myClubs,
  sessions,
  lessons,
  user,
  userPoints,
  rounds
}) => {
  return (
    <div className={styles.profile}>
      <div className={styles.content}>
        <div className={styles.column}>
          <div className={styles.row}>
            <UserWidget user={user} />
          </div>
          <div className={styles.row}>
            <CareerStatsWidget />
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.row}>
            <AveragesGraphWidget sessions={sessions} />
          </div>
          <div className={styles.row}>
            <RecentActivityWidget sessions={sessions}/>
          </div>
          <div className={styles.row}>
            <TopPerformingClubsWidget sessions={sessions}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
