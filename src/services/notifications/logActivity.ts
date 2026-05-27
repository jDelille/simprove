import { ActivityType } from '@/types/activity';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from "@/lib/supabase/client";

type LogActivityParams = {
  type: ActivityType;
  title: string;
  description: string;
  entityId?: string;
  entityType?: string;
  metadata?: Record<string, any>;
  userId?: string;
}

const supabase = createClient();

export async function logActivity({
  type,
  title,
  description,
  entityId,
  entityType,
  metadata = {},
  userId,
  supabaseClient, // ← add this
}: LogActivityParams & { supabaseClient?: SupabaseClient }) {

  const client = supabaseClient ?? supabase;
  const { data: userData } = await client.auth.getUser();

  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await client  // ← capture data
    .from('notifications')
    .insert({
      user_id: userId || userData.user.id,
      type,
      title,
      description,
      entity_id: entityId ?? null,
      entity_type: entityType ?? null,
      metadata
    })
    .select()   // ← needed to get data back
    .single();

  if (error) {
    console.error("Error logging notification:", error);
    throw error;
  }

  return { data }; // ← return it
}