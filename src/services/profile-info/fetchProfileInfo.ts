import { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase/server";

type FetchProfileInfoProps = {
  userId?: string;
  supabaseClient?: SupabaseClient;
};

export const fetchProfileInfo = async ({
  userId,
  supabaseClient,
}: FetchProfileInfoProps = {}) => {
  const supabase = supabaseClient ?? (await createSupabaseServer());

  let targetUserId = userId;
  let authUser = null;

  // fallback to logged in user
  if (!targetUserId) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        user: null,
        profile: null,
      };
    }

    authUser = user;
    targetUserId = user.id;
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", targetUserId)
    .single();

  if (profileError) {
    console.error(profileError);

    return {
      user: authUser,
      profile: null,
    };
  }

  return {
    user: authUser,
    profile,
  };
};