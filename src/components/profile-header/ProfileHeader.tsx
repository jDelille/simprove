"use client";

import React, { useState } from "react";
import styles from "./ProfileHeader.module.scss";
import Avatar from "../avatar/Avatar";
import Button from "../button/Button";
import ContentTabs from "../content-tabs/ContentTabs";

type ProfileHeaderProps = {};

const ProfileHeader: React.FC<ProfileHeaderProps> = () => {

  const [selectedTab, setSelectedTab] = useState("Overview");

  

  const followers = [
    { name: "Alice", color: "#49de80" },
    { name: "Bob", color: "#fa7516" },
    { name: "Charlie", color: "#3b82f5" },
    { name: "Diana", color: "#ebb207" },
  ];

  return (
    <div className={styles.profileHeader}>
      <div className={styles.headerContent}>
        <div className={styles.avatarContainer}>
          <Avatar />
        </div>
        <div className={styles.userInfo}>
          <p className={styles.name}>Username</p>
          <div className={styles.handle}>
            <p>@username</p>
            <p>-</p>
            <p>Member since 2026</p>
          </div>
          <div className={styles.bio}>
            <p>Bio goes here...</p>
          </div>
           <div className={styles.followers}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {followers.slice(0, 4).map((f, i) => (
                <div
                  key={f.name}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: f.color,
                    border: `2px solid var(--bg)`,
                    marginLeft: i > 0 ? -6 : 0, 
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "white",
                    zIndex: 4 - i,
                    position: "relative",
                  }}
                >
                  {f.name[0].toUpperCase()}
                </div>
              ))}
              <p className={styles.followersCount}>
                396 followers - 12 following
              </p>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <Button variant="primary" children="Follow" />
          <Button variant="secondary" children="Share" />
        </div>
      </div>
      <div className={styles.tabsContainer}>
        <ContentTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>
    </div>
  );
};

export default ProfileHeader;


         