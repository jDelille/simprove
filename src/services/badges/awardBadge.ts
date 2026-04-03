import { supabase } from "@/lib/supabase/client"
import { logActivity } from "../activity/logActivity";

export async function awardBadge(
    userId: string,
    badgeKey: string,
    logMessage: {
        title: string,
        description: string
    }
) {
    const {data: badge} = await supabase
        .from("badges")
        .select("id")
        .eq("key", badgeKey)
        .single();
    
    if (!badge) {
        return;
    }

    const { data: existingBadge} = await supabase
        .from("user_badges")
        .select("id")
        .eq("user_id", userId)
        .eq("badge_id", badge.id)
        .single();
    
    if (existingBadge) {
        return;
    }

    const { error: badgeError } = await supabase
        .from("user_badges")
        .insert({ user_id: userId, badge_id: badge.id });

    if (badgeError) {
        console.error(`[awardBadge] Badge award error for badge ${badgeKey}:`, badgeError);
    }

    await logActivity({
        type: "BADGE_EARNED",
        title: logMessage.title,
        description: logMessage.description,
        entityId: badge.id,
        entityType: "badge",
        metadata: { badgeKey },
    });
}
