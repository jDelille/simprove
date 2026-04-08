export type User = {
  id: string;
  email?: string | null; // allow undefined or null
  phone?: string | null;
  app_metadata?: any;
  user_metadata?: any;
  created_at?: string;
  last_sign_in_at?: string;
}