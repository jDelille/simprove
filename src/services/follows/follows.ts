import { SupabaseClient } from "@supabase/supabase-js";

type FollowProps = {
  followerId: string;
  followingId: string;
  supabaseClient: SupabaseClient;
};

type CountProps = {
  userId: string;
  supabaseClient: SupabaseClient;
};

export const followUser = async ({
  followerId,
  followingId,
  supabaseClient,
}: FollowProps) => {
  if (followerId === followingId) {
    return {
      success: false,
      error: "Users cannot follow themselves.",
    };
  }

  const { data, error } = await supabaseClient
    .from("follows")
    .insert({
      follower_id: followerId,
      following_id: followingId,
    })
    .select()
    .single();

  if (error) {
    console.error(error);

    return {
      success: false,
      error,
    };
  }

  return {
    success: true,
    data,
  };
};

export const unfollowUser = async ({
  followerId,
  followingId,
  supabaseClient,
}: FollowProps) => {
  const { error } = await supabaseClient
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId);

  if (error) {
    console.error(error);

    return {
      success: false,
      error,
    };
  }

  return {
    success: true,
  };
};

export const fetchFollowerCount = async ({
  userId,
  supabaseClient,
}: CountProps) => {
  const { count, error } = await supabaseClient
    .from("follows")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("following_id", userId);

  if (error) {
    console.error(error);
    return 0;
  }

  return count ?? 0;
};

export const fetchFollowingCount = async ({
  userId,
  supabaseClient,
}: CountProps) => {
  const { count, error } = await supabaseClient
    .from("follows")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("follower_id", userId);

  if (error) {
    console.error(error);
    return 0;
  }

  return count ?? 0;
};

export const checkIsFollowing = async ({
  followerId,
  followingId,
  supabaseClient,
}: FollowProps) => {
  const { data, error } = await supabaseClient
    .from("follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return false;
  }

  return !!data;
};