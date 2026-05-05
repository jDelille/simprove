export type Notification = {
  id: string;
  created_at: string;
  entity_id: string;
  entity_type: string;
  metadata: {
    achievementKey: string;
  };
  title: string;
  type: string;
  user_id: string;
  is_read: boolean;
  description: string;
};
