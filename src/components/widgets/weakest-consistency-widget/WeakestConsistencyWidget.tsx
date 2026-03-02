import React from 'react'
import styles from "./WeakestConsistencyWidget.module.scss";

const WeakestConsistencyWidget = () => {
  return (
    <div className={styles.widget}>
        <div className={styles.header}>
            <p>Weakest Consistency</p>
        </div>
        <ul>
            <li>
              <p className={styles.club}>SW</p>
              <div className={styles.bar}>
                <div className={styles.fill} style={{ width: "80%" }}></div>
              </div>
              <p className={styles.deviation}>
                ±14.8 <span>yds</span>
              </p>
            </li>
            <li>
              <p className={styles.club}>7I</p>
              <div className={styles.bar}>
                <div className={styles.fill} style={{ width: "80%" }}></div>
              </div>
              <p className={styles.deviation}>
                ±14.8 <span>yds</span>
              </p>
            </li>
            <li>
              <p className={styles.club}>SW</p>
              <div className={styles.bar}>
                <div className={styles.fill} style={{ width: "80%" }}></div>
              </div>
              <p className={styles.deviation}>
                ±14.8 <span>yds</span>
              </p>
            </li>
            <li>
              <p className={styles.club}>7I</p>
              <div className={styles.bar}>
                <div className={styles.fill} style={{ width: "80%" }}></div>
              </div>
              <p className={styles.deviation}>
                ±14.8 <span>yds</span>
              </p>
            </li>
            <li>
              <p className={styles.club}>7I</p>
              <div className={styles.bar}>
                <div className={styles.fill} style={{ width: "80%" }}></div>
              </div>
              <p className={styles.deviation}>
                ±14.8 <span>yds</span>
              </p>
            </li>
          </ul>
    </div>
  )
}

export default WeakestConsistencyWidget