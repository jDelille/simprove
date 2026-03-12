import React from 'react'
import styles from "./AboutProfileWidget.module.scss";
type AboutProfileWidgetProps = {};

const AboutProfileWidget = (props: AboutProfileWidgetProps) => {
  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <p>About</p>
      </div>
      <div className={styles.content}>
        <ul>
            <li>
                <p className={styles.label}>Total shots</p>
                <p className={styles.value}>736</p>
            </li>
            <li>
                <p className={styles.label}>Sessions</p>
                <p className={styles.value}>28</p>
            </li>
            <li>
                <p className={styles.label}>Badges earned</p>
                <p className={styles.value}>12</p>
            </li>
        </ul>
      </div>
    </div>
  )
}

export default AboutProfileWidget