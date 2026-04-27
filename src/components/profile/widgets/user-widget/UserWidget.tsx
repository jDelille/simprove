import styles from "./UserWidget.module.scss";
import { Profile } from "@/types";
import Avatar from "@/components/ui/avatar/Avatar";
import moment from "moment";
import Button from "@/components/ui/button/Button";

type UserWidgetProps = {
  user: Profile;
};

const UserWidget = ({ user }: UserWidgetProps) => {
  return (
    <div className={styles.widget}>
      <div className={styles.top}>
        <Avatar src={user.avatar_path} size="medium" />
        <div className={styles.text}>
          <p className={styles.username}>{user.username}</p>
          <p className={styles.date}>
            Member since {moment(user.created_at).format("MMM YYYY")}
          </p>
        </div>
        <p className={styles.userRank}>{user.rank}</p>
      </div>
      <div className={styles.social}>
        <div className={styles.stat}>
          <span>Following</span>
          <p>0</p>
        </div>
        <div className={styles.stat}>
          <span>Followers</span>
          <p>0</p>
        </div>
        <div className={styles.stat}>
          <span>Rank</span>
          <p>#1</p>
        </div>
      </div>

      <div className={styles.rank}>
        <div className={styles.labels}>
          <p className={styles.currentRank}>Par III</p>
          <p>Par II</p>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.fill} style={{ width: "5%" }}></div>
        </div>

        <div className={styles.pointsLabel}>
          <p>1,750</p>
          <p>2,750</p>
        </div>

        <div className={styles.pointsToNext}>
          <p>450 pts to next rank</p>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          children={"Follow"}
          onClick={() => console.log("clicked")}
          variant="lessonCard"
        />
        <Button
          children={"Message"}
          onClick={() => console.log("clicked")}
          variant="secondary"
        />
      </div>
    </div>
  );
};

export default UserWidget;
