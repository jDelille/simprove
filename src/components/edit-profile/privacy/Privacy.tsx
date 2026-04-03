import React from "react";
import styles from "./Privacy.module.scss";

const Privacy = () => {
  const privacyOptions = [
    {
      id: 1,
      label: "Public profile",
      description: "Anyone can see your profile and activity",
      value: true,
    },
    {
      id: 2,
      label: "Show session stats",
      description:
        "Allow others to see your session statistics on your profile",
      value: true,
    },
    {
      id: 3,
      label: "Show on leaderboard",
      description: "Allow your profile to appear on the global leaderboard",
      value: true,
    },
    {
      id: 4,
      label: "Show badges",
      description:
        "Allow others to see the badges you've earned on your profile",
      value: true,
    },
  ];

  return (
    <div className={styles.privacy}>
      <div className={styles.header}>
        <p>Profile visibility</p>
        <span>Control what other users can see on your public profile</span>
      </div>
      <div className={styles.content}>
        <ul>
          {privacyOptions.map((option) => (
            <li key={option.id} className={styles.option}>
              <div className={styles.optionHeader}>
                <p>{option.label}</p>
                <span className={styles.optionDescription}>
                  {option.description}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Privacy;
