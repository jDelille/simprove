import React from "react";
import styles from "./GuideContent.module.scss";
import { guideComponents } from "@/lib/guideComponent";

type GuideContentProps = {
  guide: any;
};

const GuideContent = ({ guide }: GuideContentProps) => {
  const Component = guideComponents[guide.component];

  if (!Component) {
    return <div className={styles.guideContent}>Missing component</div>;
  }

  return (
    <div className={styles.guideContent}>
      <div className={styles.header}>
        <h1>{guide.label}</h1>
      </div>
      <div className={styles.content}>
        <Component />
      </div>
    </div>
  );
};

export default GuideContent;