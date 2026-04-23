import styles from "./ActivityStatWidget.module.scss";

type ActivityStatWidgetProps = {
  title: string;
  value: string | number;
  metric?: string;
  subText: string;
};

const ActivityStatWidget = ({
  title,
  value,
  metric,
  subText,
}: ActivityStatWidgetProps) => {
  return (
    <div className={styles.statWidget}>
      <div className={styles.header}>
        <p>{title}</p>
      </div>
      <div className={styles.body}>
        <h2>
          {value}
          {metric}
        </h2>
      </div>
      <div className={styles.footer}>
        <p>{subText}</p>
      </div>
    </div>
  );
};

export default ActivityStatWidget;
