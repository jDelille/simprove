import React from "react";
import styles from "./RecentActivityWidget.module.scss";
import { useActivities } from "@/hooks/useActivities";
import { activityDateFormat } from "@/lib/format-date/ActivityDateFormat";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaTrophy } from "react-icons/fa";

type RecentActivityWidgetProps = {
  userId: string;
};

const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = (props) => {
  const activities = useActivities(props.userId);
  const isActivityLoading = activities.loading;

  return (
    <div className={styles.widget}>
      {!activities.activities.length && !isActivityLoading && (
        <p>No recent activity</p>
      )}
      {isActivityLoading && <p>Loading...</p>}

      <div className={styles.header}>
        <p>Recent Activity</p>
      </div>

      <ul>
        {activities.latestThreeActivities.map((activity: any) => (
          <li key={activity.id}>
            {activity.type === "SESSION_CREATED" && (
              <div className={styles.activity}>
                <div
                  className={styles.icon}
                  style={{ backgroundColor: "#E5F4EA" }}
                >
                  <MdOutlineFileUpload color="#2aaa55" size={20} />
                </div>
                <div className={styles.body}>
                  <p className={styles.title}>
                    {activity.title}{" "}
                    <span className={styles.date}>
                      {activityDateFormat(activity.created_at)} ago
                    </span>
                  </p>
                  <p className={styles.description}>{activity.description}</p>
                </div>
              </div>
            )}

            {activity.type === "BADGE_EARNED" && (
              <div className={styles.activity}>
                <div
                  className={styles.icon}
                  style={{ backgroundColor: "#FFF8E1" }}
                >
                  <FaTrophy color="#f7c04a" size={20} />
                </div>
                <div className={styles.body}>
                  <p className={styles.title}>
                    {activity.title}{" "}
                    <span className={styles.date}>
                      {activityDateFormat(activity.created_at)} ago
                    </span>
                  </p>
                  <p className={styles.description}>{activity.description}</p>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivityWidget;
