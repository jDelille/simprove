"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Avatar from "../avatar/Avatar";
import { FaLocationDot } from "react-icons/fa6";
import moment from "moment";
import { GoPencil } from "react-icons/go";
import styles from "./ProfileHeader.module.scss";
import Button from "../button/Button";
import ContentTabs from "../content-tabs/ContentTabs";

type ProfileHeaderProps = {
  userId: string;
  selectedTab?: string;
  setSelectedTab?: (tab: string) => void;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userId,
  selectedTab,
  setSelectedTab,
}) => {
  const { id } = useParams();
  const { profile } = useUser();
  const router = useRouter();

  const isUserProfile = id === userId;

  const initials = profile?.display_name
    .split(/\s+/)
    .map((word: string) => word.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div className={styles.profileHeader}>
      <div className={styles.headerContent}>
        <div className={styles.userInfo}>
          <div className={styles.avatarContainer}>
            {profile && (
              <Avatar
                src={profile?.avatar_path}
                size="large"
                initials={initials}
              />
            )}
            <div className={styles.editAvatarIcon}>
              <GoPencil size={12} />
            </div>
          </div>
          <div className={styles.text}>
            <div className={styles.name}>
              <p>{profile?.display_name}</p>
              <p className={styles.handle}>@{profile?.username}</p>
            </div>
            <p className={styles.bio}>{profile?.bio || "Add your bio here."}</p>
            <div className={styles.location}>
              <p>
                <FaLocationDot />{" "}
                {profile?.location || "Add your location here."}
              </p>
              <p>-</p>
              <p>Since {moment(profile?.created_at).format("MMM YYYY")}</p>
            </div>
          </div>
        </div>

        <div className={styles.buttons}>
          <Button children="Share Profile" variant="secondary" />
          <Button
            children="Edit Profile"
            variant="lessonCard"
            onClick={() => router.push("/settings/edit-profile")}
          />
        </div>
      </div>
      <ContentTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
    </div>
  );
};

export default ProfileHeader;
