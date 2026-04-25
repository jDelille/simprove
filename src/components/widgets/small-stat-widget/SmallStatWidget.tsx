import React from "react";
import styles from "./SmallStatWidget.module.scss";
import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa6";
import { MdArrowOutward } from "react-icons/md";

export type TrendDirection = "up" | "down" | "flat";

type SmallStatWidgetProps = {
  title: string;
  value: string | number;
  metric: string;
  trend: "increase" | "decrease" | "none" | null;
  trendText: string;
  trendColor?: string;
  isEmpty?: boolean;
};

const SmallStatWidget: React.FC<SmallStatWidgetProps> = (props) => {
  const [percent, ...rest] = props.trendText.split(" ");
  const changeText = rest.join(" ");

  return (
    <div className={styles.widget}>
      <div className={styles.header}>{props.title}</div>
      {props.isEmpty ? (
        <>
          <div className={styles.body}>
            <span>No shots yet</span>
          </div>
          <div className={styles.empty}>
            <span>Upload a session to begin</span>
          </div>
        </>
      ) : (
        <>
          <div className={styles.body}>
            <h2>{props.value}</h2>
            <span>{props.metric}</span>
          </div>
          <div className={styles.change}>
            <p style={{ color: props.trendColor }} className={styles.percent}>
              {percent}{" "}
              <span style={{ color: "var(--lightgray)", fontWeight: 400 }}>
                {changeText}
              </span>
            </p>

            {props.trend !== null && (
              <div className={styles.changeIcon}>
                {props.trend === "increase" && (
                  <MdArrowOutward
                    className={styles.up}
                    color={props.trendColor}
                    size={20}
                  />
                )}
                {props.trend === "decrease" && (
                  <MdArrowOutward
                    className={styles.down}
                    color={props.trendColor}
                    size={20}
                  />
                )}
                {props.trend === "none" && (
                  <FaMinus
                    className={styles.neutral}
                    color={props.trendColor}
                  />
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SmallStatWidget;
