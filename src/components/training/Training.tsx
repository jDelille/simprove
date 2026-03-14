"use client";

import styles from './Training.module.scss';

const Training = () => {
  return (
    <div className={styles.training}>
        <div className={styles.pageHeader}>
            <div className={styles.title}>
                <h1>Training Plans</h1>
                <p>Complete tasks in your next session to earn points and level up your game.</p>
            </div>
        </div>

        <div className={styles.row}>
            {/* your active plan */}
        </div>
        <div className={styles.row}>
            {/* recommended plans */}
            {/* browse plans */}
        </div>
    </div>
  )
}

export default Training