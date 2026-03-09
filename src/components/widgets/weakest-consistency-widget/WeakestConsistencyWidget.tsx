"use client";

import React from "react";
import styles from "./WeakestConsistencyWidget.module.scss";
import { Shot } from "@/types/shot";
import { getDeviationColor, getWeakestClubs } from "@/lib/stats/weakestClubs";

type WeakestConsistencyWidgetProps = {
  shots: Shot[];
};

const WeakestConsistencyWidget: React.FC<WeakestConsistencyWidgetProps> = ({
  shots,
}) => {
  const topClubs = getWeakestClubs(shots, 5);

  const maxDeviation = Math.max(...topClubs.map((c) => c.carryStd));

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <p>Weakest Consistency</p>
      </div>
      <ul>
        {topClubs.map((c) => (
          <li key={c.club}>
            <p className={styles.club}>{c.club}</p>
            <div className={styles.bar}>
              <div
                className={styles.fill}
                style={{ width: `${(c.carryStd / maxDeviation) * 100}%`, background: getDeviationColor(c.carryStd) }}
              ></div>
            </div>
            <p className={styles.deviation}>
              ±{Math.round(c.carryStd)} <span>yds</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeakestConsistencyWidget;