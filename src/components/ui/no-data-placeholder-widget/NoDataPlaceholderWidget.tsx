import React from "react";
import styles from "./NoDataPlaceholderWidget.module.scss";

type NoDataPlaceholderWidgetProps = {
  icon: React.ReactNode;
  title: string;
  message: string;
};

const NoDataPlaceholderWidget = ({
  icon,
  title,
  message,
}: NoDataPlaceholderWidgetProps) => {
  return (
    <div className={styles.noData}>
      {icon}
      <p className={styles.title}>{title}</p>
      <p>{message}</p>
    </div>
  );
};

export default NoDataPlaceholderWidget;
