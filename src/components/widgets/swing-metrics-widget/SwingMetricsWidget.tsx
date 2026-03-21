import styles from "./SwingMetricsWidget.module.scss";

const SwingMetricsWidget = () => {
  const clubs = ["DR", "5W", "7I", "PW", "SW"];

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <p>Swing Metrics</p>
        <span>Path - face - attack angle</span>
      </div>
      <div className={styles.content}>
        <ul className={styles.clubs}>
          {clubs.map((club) => (
            <li key={club}>
              <p>{club}</p>
            </li>
          ))}
        </ul>
        <div className={styles.clubDetails}>
          <ul>
            <li>
              <div className={styles.metric}>
                <p>Club Path</p>
                <span>Within range, but your open face is amplifying it</span>
              </div>
              <div className={styles.value}>
                <p>-3.2°</p>
                <div className={styles.valueLabel}>
                    <p>Over the top</p>
                </div>
              </div>
            </li>
            <li>
              <div className={styles.metric}>
                <p>Face Angle</p>
                <span>5.6° open to path — the gap that curves the ball</span>
              </div>
              <div className={styles.value}>
                <p>+2.4°</p>
                <div className={styles.valueLabel}>
                    <p>Slightly open</p>
                </div>
              </div>
            </li>
            <li>
              <div className={styles.metric}>
                <p>Attack Angle</p>
                <span>Hitting up slightly would boost distance</span>
              </div>
              <div className={styles.value}>
                <p>-1.1°</p>
                <div className={styles.valueLabel}>
                    <p>On plane</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SwingMetricsWidget;
