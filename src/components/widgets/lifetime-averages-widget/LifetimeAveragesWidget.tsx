import { calculateProfileStats } from "@/lib/profile-stats/ProfileStats";
import styles from "./LifetimeAveragesWidget.module.scss";

type LifetimeAveragesWidgetProps = {
  sessions: any[];
  userId: string;
};

const LifetimeAveragesWidget: React.FC<LifetimeAveragesWidgetProps> = ({
  sessions,
  userId,
}) => {
  const shots = sessions.flatMap((session) => session.shots);

  const profileMetrics = calculateProfileStats({
    userId: userId,
    shots,
    sessionLength: sessions.length,
  });

  const averages = [
    {
      id: 1,
      label: "Carry",
      metric: "yds",
      value: profileMetrics.avgCarry.toFixed(1),
    },
    {
      id: 2,
      label: "Ball Speed",
      metric: "mph",
      value: profileMetrics.avgSpeed.toFixed(1),
    },
    {
      id: 3,
      label: "Avg VLA",
      metric: "deg",
      value: profileMetrics.avgLaunchAngle.toFixed(1),
    },
    {
      id: 4,
      label: "Offline",
      metric: "yds",
      value: profileMetrics.avgOffline.toFixed(1),
    },
  ];

  return (
    <div className={styles.lifetimeAveragesWidget}>
      <div className={styles.header}>
        <p>Lifetime Averages</p>
      </div>
      <div className={styles.content}>
        <ul>
          {averages.map((avg) => (
            <li key={avg.id}>
              <p>{avg.value}</p>
              <span>
                {avg.label} ({avg.metric})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LifetimeAveragesWidget;
