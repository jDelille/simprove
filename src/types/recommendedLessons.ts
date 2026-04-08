import { Lesson } from "./lesson";

export type RecommendedLessons = {
    lesson_id: string;
    lessons: Lesson[];
    reason: string;
};