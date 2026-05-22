"use client";

import styles from "./UserWidget.module.scss";
import { Profile } from "@/types";
import Avatar from "@/components/ui/avatar/Avatar";
import moment from "moment";
import Button from "@/components/ui/button/Button";
import { getInitials } from "@/lib/getInitials";
import { useState } from "react";
import { followUser, unfollowUser } from "@/services/follows/follows";
import { supabase } from "@/lib/supabase/client";
import { SocialData } from "@/types/socialData";
import { useRouter } from "next/navigation";

type UserWidgetProps = {
  user: Profile;
  social: SocialData;
  currentUserId: string;
  leaderboardPosition: any;
};

const UserWidget = ({
  user,
  social,
  currentUserId,
  leaderboardPosition
}: UserWidgetProps) => {
  const router = useRouter();
  const initials = getInitials((user && user.display_name) || "");
  const [following, setFollowing] = useState(social.isFollowing);
  const [followers, setFollowers] = useState(social.followerCount || 0);
  
  const isOwnProfile = currentUserId === user.id;

  const handleFollowToggle = async () => {
    if (!currentUserId) return;

    console.log('here')

    // unfollow
    if (following) {
      const result = await unfollowUser({
        followerId: currentUserId,
        followingId: user.id,
        supabaseClient: supabase,
      });

      if (result.success) {
        setFollowing(false);
        setFollowers((prev: number) => prev - 1);
      }

      return;
    }

    // follow
    const result = await followUser({
      followerId: currentUserId,
      followingId: user.id,
      supabaseClient: supabase,
    });

    if (result.success) {
      setFollowing(true);
      setFollowers((prev: number) => prev + 1);
    }
  };

  console.log(leaderboardPosition)

  return (
    <div className={styles.widget}>
      <div className={styles.top}>
        <Avatar src={user.avatar_path} size="medium" initials={initials} />
        <div className={styles.text}>
          <p className={styles.username}>{user.username}</p>
          <p className={styles.date}>
            Member since {moment(user.created_at).format("MMM YYYY")}
          </p>
        </div>
        <p className={styles.userRank}>{user.rank}</p>
      </div>
      <div className={styles.social}>
        <div className={styles.stat}>
          <span>Following</span>
          <p>{social.followingCount}</p>
        </div>
        <div className={styles.stat}>
          <span>Followers</span>
          <p>{followers}</p>
        </div>
        <div className={styles.stat}>
          <span>Rank</span>
          <p className={styles.leaderboardPos}>{leaderboardPosition.position}</p>
        </div>
      </div>

      <div className={styles.rank}>
        <div className={styles.labels}>
          <p className={styles.currentRank}>Par III</p>
          <p>Par II</p>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.fill} style={{ width: "5%" }}></div>
        </div>

        <div className={styles.pointsLabel}>
          <p>1,750</p>
          <p>2,750</p>
        </div>

        <div className={styles.pointsToNext}>
          <p>450 pts to next rank</p>
        </div>
      </div>

      <div className={styles.actions}>
        {isOwnProfile ? (
          <Button children="Edit Profile" variant="lessonCard" onClick={() => router.push("/settings/edit-profile")} />
        ): (
          <>
          <Button
          children={following ? "Unfollow" : "Follow"}
          onClick={handleFollowToggle}
          variant="lessonCard"
        />
        <Button
          children={"Message"}
          onClick={() => console.log("clicked")}
          variant="secondary"
        />
        </>
        )}
      </div>
    </div>
  );
};

export default UserWidget;
