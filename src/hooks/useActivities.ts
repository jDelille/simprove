"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export const useActivities = (userId?: string) => {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchActivities = async () => {
            setLoading(true);

            // Check current auth session
            const { data: authData } = await supabase.auth.getUser();
            if (!authData.user) {
                setLoading(false);
                return;
            }

            // Fetch activities
            const { data, error } = await supabase
                .from("activity")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching activities:", error);
                setActivities([]);
            } else {
                setActivities(data ?? []);
            }

            setLoading(false);
        };

        fetchActivities();
    }, [userId]);

    return { activities, loading, latestThreeActivities: activities.slice(0, 3) };
};