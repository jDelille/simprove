import styles from "./UserRankWidget.module.scss";
import { Profile } from "@/types/profile";
import Avatar from "@/components/avatar/Avatar";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

type UserRankWidgetProps = {
  profile: Profile;
  userPoints: any;
};

const UserRankWidget = ({ profile, userPoints }: UserRankWidgetProps) => {

  console.log(userPoints)

  return (
    <div className={styles.userRankWidget} id="your-rank">
      <div className={styles.header}>
        <p>Your Rank</p>
        <div className={styles.timeframe}>weekly</div>
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <Avatar src={profile.avatar_path} size="small" />

          <div className={styles.text}>
            <h3>{profile.username}</h3>
            <p>{profile.rank}</p>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.pointsInfo}>
            <div className={styles.box}>
              <p>total points</p>
              <h3>{userPoints?.totalPoints}</h3>
            </div>
            <div className={styles.box}>
              <p>this week</p>
              <h3 className={styles.weeklyPoints}>+{userPoints?.weeklyPoints}</h3>
            </div>
          </div>
        </div>

        <Link href={"/leaderboard"} className={styles.leaderboardLink}>
          <p>View Leaderboard</p>
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default UserRankWidget;
