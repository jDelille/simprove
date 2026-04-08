"use client";

import { useState } from "react";
import styles from "./SettingsNavWidget.module.scss";

type SettingsNavWidgetProps = {
  selectedSection: string;
  setSelectedSection: (section: string) => void;
};

const SettingsNavWidget: React.FC<SettingsNavWidgetProps> = ({
  selectedSection,
  setSelectedSection,
}) => {
  const sections = ["Account", "Privacy"]; // "Notifications", "Preferences",

  return (
    <div className={styles.widget}>
      <ul>
        {sections.map((section) => (
          <li
            key={section}
            onClick={() => setSelectedSection(section)}
            className={selectedSection === section ? styles.active : ""}
          >
            {section}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingsNavWidget;
