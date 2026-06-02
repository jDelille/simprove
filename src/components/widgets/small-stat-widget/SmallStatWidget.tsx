import React from "react";
import styles from "./SmallStatWidget.module.scss";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

export type TrendDirection = "up" | "down" | "flat";

type SmallStatWidgetProps = {
  title: string;
  value: string | number;
  metric?: string;
  trend?: "increase" | "decrease" | "none" | null;
  trendText: string;
  trendColor?: string;
  isEmpty?: boolean;
  link?: string;
};

const SmallStatWidget: React.FC<SmallStatWidgetProps> = (props) => {
  return (
    <div className={styles.widget}>
      <div className={styles.header}>{props.title}</div>
      {props.isEmpty ? (
        <>
          <div className={styles.body}>
            <h2>---</h2>
          </div>
          <div className={styles.empty}>
            <span>---</span>
          </div>
        </>
      ) : (
        <>
          <div className={styles.body}>
            <h2>{props.value}</h2>
          </div>
          <div className={styles.change}>
            {!props.link && (
              <span style={{ fontWeight: 400 }}>{props.trendText}</span>
            )}
            {props.link && (
              <Link href={props.link || "#"} className={styles.link}>
                <span style={{ fontWeight: 400 }}>{props.trendText}</span>
                <FaArrowRightLong />
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SmallStatWidget;
