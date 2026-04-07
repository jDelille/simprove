import styles from "./GettingStartedWidget.module.scss";

type GettingStartedWidgetProps = {
  completions?: any[];
};

const GettingStartedWidget: React.FC<GettingStartedWidgetProps> = ({
  completions,
}) => {

  const completionCount = completions ? completions.length : 0;

  const completedSteps = completions
    ? completions.map((comp) => comp.step_id)
    : [];

  const isCompleted = (stepId: number) => {
    return completedSteps.includes(stepId);
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <p>Getting Started</p>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.fill}
          style={{ width: `${(completionCount / 4) * 100}%` }}
        ></div>
      </div>

      <ul>
        <li>
          <div className={isCompleted(1) ? styles.completed : styles.number}>
            1
          </div>
          <div className={styles.text}>
            <p>Finish setting up your profile</p>
            <span>
              Complete your profile information to personalize your experience
            </span>
          </div>
        </li>
        <li>
          <div className={isCompleted(2) ? styles.completed : styles.number}>
            2
          </div>
          <div className={styles.text}>
            <p>Upload your first session</p>
            <span>
              Import your exported CSV file from GsPro or your launch monitor
            </span>
          </div>
        </li>
        <li>
          <div className={isCompleted(3) ? styles.completed : styles.number}>
            3
          </div>
          <div className={styles.text}>
            <p>Review swing metrics</p>
            <span>Click on a session to see detailed analytics</span>
          </div>
        </li>
        <li>
          <div className={isCompleted(4) ? styles.completed : styles.number}>
            4
          </div>
          <div className={styles.text}>
            <p>Start a lesson plan</p>
            <span>Targeted drills based on your miss patterns</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default GettingStartedWidget;
