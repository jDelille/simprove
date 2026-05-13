"use client";

import { Profile } from "@/types";
import Avatar from "@/components/ui/avatar/Avatar";
import styles from "./UserWidget.module.scss";
import moment from "moment";
import Link from "next/link";
import { FaFire } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { IoIosTimer } from "react-icons/io";
import { getInitials } from "@/lib/getInitials";
import { GiPerspectiveDiceSixFacesOne } from "react-icons/gi";
import usePopup from "@/hooks/usePopup";
import Popup from "@/components/ui/popup/Popup";
import DailyPointsGame from "../../daily-points-game/DailyPointsGame";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserWidgetProps = {
  profile: Profile;
  latestRound: any;
  userPoints: any;
  activityCount: number;
};

const UserWidget = ({
  profile,
  latestRound,
  userPoints,
  activityCount,
}: UserWidgetProps) => {
  const initials = getInitials((profile && profile.display_name) || "");
  const { popups, openPopup, closePopup } = usePopup();
  const router = useRouter();

  const getTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();

    const h = Math.floor(diff / 1000 / 60 / 60);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const [countdown, setCountdown] = useState("");

  const handleDailyPointsClick = () => {
    openPopup("dailyPoints");
  };

  const hasRolledToday = (lastRolledAt: string | null): boolean => {
    if (!lastRolledAt) return false;
    const last = new Date(lastRolledAt);
    const now = new Date();
    return (
      last.getFullYear() === now.getFullYear() &&
      last.getMonth() === now.getMonth() &&
      last.getDate() === now.getDate()
    );
  };

  useEffect(() => {
    if (!hasRolledToday(profile.last_rolled_at)) return;
    const interval = setInterval(() => {
      setCountdown(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, [profile.last_rolled_at]);

  const dailyPointsPopupBody = (
    <div className={styles.popupBody}>
      <DailyPointsGame userId={profile.id} onComplete={() => {
        router.refresh();
        closePopup("dailyPoints");
      }} />
    </div>
  );

  return (
    <div className={styles.widget} id="profile-overview">
      <div className={styles.header}></div>

      <div className={styles.content}>
        <div className={styles.user}>
          <Avatar src={profile.avatar_path} size="small" initials={initials} />

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
                  : { color: "var(--accent)" }
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
              <IoIosTimer size={18} />
              <p>Upload a round to see your latest performance here</p>
              <button>
                Upload round <FiArrowUpRight size={12} />
              </button>
            </div>
          </div>
        )}

        <div className={styles.streak}>
          <p>Your streak</p>
          <p className={styles.value}>
            <FaFire size={12} color="var(--dangerText)" /> {profile.streak_current || 0} weeks
          </p>
        </div>

        <div className={styles.dailyPoints}>
          {hasRolledToday(profile.last_rolled_at) ? (
            <div className={styles.dailyPointsDisabled}>
              <p>Daily reward</p>
              <p className={styles.countdown}>{countdown}</p>
            </div>
          ) : (
            <button onClick={handleDailyPointsClick}>
              <GiPerspectiveDiceSixFacesOne size={15} />
              Roll Daily Points
            </button>
          )}
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

      <Popup
        isOpen={popups["dailyPoints"] || false}
        title="Daily Points"
        body={dailyPointsPopupBody}
      />
    </div>
  );
};

export default UserWidget;
