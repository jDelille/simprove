import { supabase } from '@/lib/supabase/client'
import { ActivityType } from '@/types/activity';

type LogActivityParams = {
  type: ActivityType;
  title: string;
  description: string;
  entityId?: string;
  entityType?: string;
  metadata?: Record<string, any>;
}

export async function logActivity({
  type,
  title,
  description,
  entityId,
  entityType,
  metadata = {}
}: LogActivityParams) {

  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase
    .from('activity')
    .insert({
      user_id: userData.user.id,
      type,
      title,
      description,
      entity_id: entityId ?? null,
      entity_type: entityType ?? null,
      metadata
    })

  if (error) {
    console.error("Error logging activity:", error)
    throw error
  }
}