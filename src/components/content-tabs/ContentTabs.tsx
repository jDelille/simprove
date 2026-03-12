import React from "react";
import styles from "./ContentTabs.module.scss";

type ContentTabsProps = {
  selectedTab?: string;
  setSelectedTab?: (tab: string) => void;
};

const ContentTabs: React.FC<ContentTabsProps> = ({
  selectedTab,
  setSelectedTab,
}) => {
  const tabs = ["Overview", "Sessions", "Stats", "Badges"];

  return (
    <div className={styles.contentTabs}>
      <ul>
        {tabs.map((tab) => (
          <li
            key={tab}
            className={selectedTab === tab ? styles.active : ""}
            onClick={() => setSelectedTab?.(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContentTabs;
