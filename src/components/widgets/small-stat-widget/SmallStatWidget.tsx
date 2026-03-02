import React from "react";
import styles from "./SmallStatWidget.module.scss";
import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa6";

type SmallStatWidgetProps = {
  title: string;
  value: string | number;
  metric: string;
  trend: "up" | "down" | "neutral";
  trendText: string;
};

const SmallStatWidget: React.FC<SmallStatWidgetProps> = (props) => {
  return (
    <div className={styles.widget}>
      <div className={styles.header}>{props.title}</div>
      <div className={styles.body}>
        <h2>{props.value}</h2> 
        <span>{props.metric}</span>
      </div>
      <div className={styles.change}>
        {props.trend === "up" && <FaArrowUp />}
        {props.trend === "down" && <FaArrowDown className={styles.down} />}
        {props.trend === "neutral" && <FaMinus className={styles.neutral} />}
        <p>{props.trendText}</p>
      </div>
    </div>
  );
};

export default SmallStatWidget;
