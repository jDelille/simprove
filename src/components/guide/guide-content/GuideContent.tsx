import React from "react";
import styles from "./GuideContent.module.scss";
import { guideComponents } from "@/lib/guideComponent";

type Guide = {
  label: string;
  component: keyof typeof guideComponents;
};

type GuideContentProps = {
  guide: Guide;
};

const GuideContent = ({ guide }: GuideContentProps) => {
  const Component = guideComponents[guide.component];

  if (!Component) {
    return <div className={styles.guideContent}>Missing component</div>;
  }

  console.log("guide.component:", guide.component);
  console.log("available:", Object.keys(guideComponents));

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
