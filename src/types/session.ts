import { Shot } from "./shot";

export type Session = {
    id: string;
    categories: string[];
    created_at: string;
    session_date: string;
    session_name: string;
    shots: Shot[];
    storage_path: string;
    user_id: string;
}