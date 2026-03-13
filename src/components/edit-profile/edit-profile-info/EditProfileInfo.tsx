"use client";

import React, { useState, useEffect } from "react";
import styles from "./EditProfileInfo.module.scss";
import { Profile } from "@/types/profile";
import Button from "@/components/button/Button";
import { uploadProfileInfo } from "@/services/profile-info/uploadProfileInfo";

type EditProfileInfoProps = {
  profile: Profile;
};

const EditProfileInfo: React.FC<EditProfileInfoProps> = ({ profile }) => {
  const [form, setForm] = useState({
    displayName: "",
    username: "",
    bio: "",
    location: "",
    launchMonitor: "",
  });

  useEffect(() => {
    if (!profile) return;

    setForm({
      displayName: profile.display_name || "",
      username: profile.username || "",
      bio: profile.bio || "",
      location: profile.location || "",
      launchMonitor: profile.launch_monitor || "",
    });
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    await uploadProfileInfo({
      userId: profile?.id,
      displayName: form.displayName,
      username: form.username,
      bio: form.bio,
      location: form.location,
      launchMonitor: form.launchMonitor,
    });
  };

  return (
    <div className={styles.editProfileInfo}>
      <div className={styles.header}>
        <p>Profile Info</p>
      </div>

      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Display name</label>
            <input
              type="text"
              id="name"
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="launchMonitor">Launch Monitor</label>
            <input
              type="text"
              id="launchMonitor"
              name="launchMonitor"
              value={form.launchMonitor}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.row}>
          <Button variant="primary" onClick={handleSave}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileInfo;