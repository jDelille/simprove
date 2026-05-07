import React from "react";
import styles from "./PlayerArchetypeWidget.module.scss";

type PlayerArchetypeWidgetProps = {};

const PlayerArchetypeWidget = ({}: PlayerArchetypeWidgetProps) => {
  return (
    <div className={styles.playerArchetypeWidget}>
      <div className={styles.header}>
        <p>Player Archetype</p>
      </div>
      <div className={styles.content}>
        <p className={styles.archetypeName}>
          Greenskeeper
        </p>
        <p className={styles.archetypeDetails}>
          GIR machine. Excels at hitting greens in regulation, lives on the short grass.
        </p>

        <div className={styles.stats}>
            <div className={styles.stat}>
                <p className={styles.label}>Driving</p>
                <div className={styles.statBar}>
                    <div className={styles.statFill}></div>
                </div>
                <p className={styles.statValue}>85%</p>
            </div>
            <div className={styles.stat}>
                <p className={styles.label}>Approach</p>
                <div className={styles.statBar}>
                    <div className={styles.statFill}></div>
                </div>
                <p className={styles.statValue}>85%</p>
            </div>
            <div className={styles.stat}>
                <p className={styles.label}>Short Game</p>
                <div className={styles.statBar}>
                    <div className={styles.statFill}></div>
                </div>
                <p className={styles.statValue}>85%</p>
            </div>
            <div className={styles.stat}>
                <p className={styles.label}>Putting</p>
                <div className={styles.statBar}>
                    <div className={styles.statFill}></div>
                </div>
                <p className={styles.statValue}>85%</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerArchetypeWidget;
