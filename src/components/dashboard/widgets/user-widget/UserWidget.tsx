"use client";

import { Profile } from "@/types";
import Avatar from "@/components/ui/avatar/Avatar";
import styles from "./UserWidget.module.scss";
import moment from "moment";
import Link from "next/link";
import { FaFire } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { IoIosTimer } from "react-icons/io";

type UserWidgetProps = {
  profile: Profile;
  latestRound: any;
  userPoints: any;
  activityCount: number;
};

const UserWidget = ({ profile, latestRound, userPoints, activityCount }: UserWidgetProps) => {

  return (
    <div className={styles.widget} id="profile-overview">
      <div className={styles.header}></div>

      <div className={styles.content}>
        <div className={styles.user}>
          <Avatar src={profile.avatar_path} size="small" />

          <div className={styles.text}>
            <h3>{profile.username}</h3>
            <p>{profile.rank}</p>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span>Total pts</span>
            <p>{userPoints?.totalPoints}</p>
          </div>
          <div className={styles.stat}>
            <span>This week</span>
            <p
              style={
                userPoints?.weeklyPoints === 0
                  ? { color: "var(--lightgray)" }
                  : {color: "var(--accent)"}
              }
            >
              {userPoints?.weeklyPoints}
            </p>
          </div>
          <div className={styles.stat}>
            <span>Activities</span>
            <p>{activityCount || 0}</p>
          </div>
        </div>

        {latestRound ? (
          <div className={styles.latestRound}>
            <p className={styles.title}>Latest Round</p>
            <p className={styles.name}>
              {latestRound.course_name}{" "}
              <span>{moment(latestRound.round_begin).format("MMM DD")}</span>
            </p>
            <p className={styles.details}>
              {latestRound.tee_type} tees · {latestRound.hole_count} holes · Par{" "}
              {latestRound.par}
            </p>
            <Link
              href={`/activities/${latestRound.id}?type=round`}
              className={styles.link}
            >
              View round <FiArrowUpRight size={12} />
            </Link>
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.title}>Latest Round</p>
            <div className={styles.message}>
                <IoIosTimer size={18}/>
                <p>Upload a round to see your latest performance here</p>
                <button>Upload round <FiArrowUpRight size={12} /></button>
            </div>
          </div>
        )}

        <div className={styles.streak}>
          <p>Your streak</p>
          <p className={styles.value}>
            {" "}
            <FaFire size={12} color="var(--dangerText)" /> 1 week
          </p>
        </div>

        <div className={styles.links}>
          <Link href={"/leaderboard"}>
            View leaderboard <FiArrowUpRight size={12} />
          </Link>
          <Link href={"/training"}>
            Training log <FiArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserWidget;
