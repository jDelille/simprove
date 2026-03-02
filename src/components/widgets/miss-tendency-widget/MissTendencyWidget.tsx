import React from 'react'
import styles from './MissTendencyWidget.module.scss';
import { HiOutlineArrowNarrowLeft, HiOutlineArrowNarrowRight } from 'react-icons/hi';

const MissTendencyWidget = () => {
  return (
    <div className={styles.widget}>
        <div className={styles.header}>
            <p>Miss Tendency</p>
        </div>
        <ul className={styles.clubs}>
            <li>DR</li>
            <li>DR</li>
            <li>DR</li>
            <li>DR</li>
            <li>DR</li>
          </ul>
          <div className={styles.missLineContainer}>
            <div className={styles.missLine}></div>
            <div className={styles.labels}>
              <p>
                <HiOutlineArrowNarrowLeft />
                Left miss
              </p>
              <p>
                <HiOutlineArrowNarrowRight />
                Right miss
              </p>
            </div>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <h3>+8.2</h3>
              <p>Offline (yds)</p>
            </div>
            <div className={styles.stat}>
              <h3>+2.4°</h3>
              <p>Face to Target</p>
            </div>
            <div className={styles.stat}>
              <h3>-1.8°</h3>
              <p>Swing Path</p>
            </div>
          </div>
          <div className={styles.message}>
            <p>
              Consistent <strong>right miss (8.2 yds avg)</strong> . Face is <strong>open (+2.4°)</strong> — try a
              slightly stronger grip or earlier forearm rotation.
            </p>
          </div>
    </div>
  )
}

export default MissTendencyWidget