export type Lesson = {
    completed_at: string | null;
    created_at: string;
    duration: string;
    id: string;
    is_ai_recommended: boolean;
    is_template: boolean;
    lesson_description: string;
    lesson_difficulty: string;
    lesson_name: string;
    notes: string;
    started_at: string;
    status: string;
    total_points: number;
    type: string;
    weeks: number;
}