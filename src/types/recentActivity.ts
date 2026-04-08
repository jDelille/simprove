import { ActivityType } from "./activity";

export type RecentActivity = {
    created_at: string;
    id: string;
    description: string;
    entity_id: string;
    entity_type: string;
    title: string;
    type: ActivityType;
    user_id: string;
}