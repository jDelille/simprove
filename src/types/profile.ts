export type Profile = {
    id: string;
    avatar_path: string;
    bio: string | null;
    created_at: string;
    email: string;
    handicap: string;
    launch_monitor: string;
    location: string;
    rank: string;
    username: string;
    display_name: string;
    is_demo_account: boolean;
    is_new_account: boolean;
    last_rolled_at: string | null;
    streak_current: number | null;
    streak_longest: number | null;
    streak_last_active_at: string | null;
    sync_token: string;
}