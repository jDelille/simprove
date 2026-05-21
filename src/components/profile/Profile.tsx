"use client";

import React from "react";
import { Lesson, MyClubs, Profile as ProfileType, Session } from "@/types";
import styles from "./Profile.module.scss";
import UserWidget from "./widgets/user-widget/UserWidget";
import CareerStatsWidget from "./widgets/career-stats-widget/CareerStatsWidget";
import { AveragesGraphWidget } from "../widgets";
import { RecentActivityWidget, TopPerformingClubsWidget } from "./widgets";
import { Round } from "@/types/round";
import { Averages, RoundStats } from "@/lib/shots/averages";
import PlayerArchetypeWidget from "../widgets/player-archetype-widget/PlayerArchetypeWidget";
import ScoringDistributionWidget from "../widgets/scoring-distribution-widget/ScoringDistributionWidget";
import { SocialData } from "@/types/socialData";

type ProfileProps = {
  userId: string;
  myClubs?: MyClubs[];
  sessions: Session[];
  lessons: Lesson[];
  user: ProfileType;
  userPoints: any;
  rounds: Round[];
  stats: Averages & RoundStats & { totalSessions: number };
  social: SocialData;
  currentUserId: string;
};

const Profile: React.FC<ProfileProps> = ({
  userId,
  myClubs,
  sessions,
  lessons,
  user,
  userPoints,
  rounds,
  stats,
  social,
  currentUserId

}) => {
  return (
    <div className={styles.profile}>
      <div className={styles.content}>
        <div className={styles.column}>
          <div className={styles.row}>
            <UserWidget
              user={user}
              social={social}
              currentUserId={currentUserId}
            />
          </div>
          <div className={styles.row}>
            <CareerStatsWidget stats={stats} />
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.row}>
            <AveragesGraphWidget sessions={sessions} />
          </div>
          <div className={styles.row}>
            <PlayerArchetypeWidget rounds={rounds} />
            <ScoringDistributionWidget rounds={rounds} />
          </div>
          <div className={styles.row}>
            <TopPerformingClubsWidget sessions={sessions} />
          </div>
          <div className={styles.row}>
            <RecentActivityWidget sessions={sessions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
