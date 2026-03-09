import React from "react";
import styles from "./SmallStatWidget.module.scss";
import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa6";

type SmallStatWidgetProps = {
  title: string;
  value: string | number;
  metric: string;
  trend: "increase" | "decrease" | "none" | null;
  trendText: string;
  trendColor?: string; 
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
        {props.trend === "increase" && <FaArrowUp color={props.trendColor}/>}
        {props.trend === "decrease" && <FaArrowDown className={styles.down} color={props.trendColor} />}
        {props.trend === "none" && <FaMinus className={styles.neutral} color={props.trendColor}/>}
        <p style={{ color: props.trendColor }}>{props.trendText}</p>
      </div>
    </div>
  );
};

export default SmallStatWidget;
