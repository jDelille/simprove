import React from "react";
import styles from "./GuideContent.module.scss";

type GuideContentProps = {
  guide: any;
};

const GuideContent = ({ guide }: GuideContentProps) => {
  console.log(guide);

  return (
    <div className={styles.guideContent}>
      <div className={styles.header}>
        <h1>{guide.label}</h1>
      </div>
      <div className={styles.content}>{guide.content}</div>
    </div>
  );
};

export default GuideContent;
