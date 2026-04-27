import { SupabaseClient } from "@supabase/supabase-js"
import { fetchLessonPlans } from "./fetchLessonPlans";
import { fetchActiveLesson } from "./fetchActiveLesson";
import { fetchRecommndedLessons } from "./fetchRecommendedLessons";
import { fetchCompletedLessons } from "./fetchCompletedLessons";

type Props = {
    supabase: SupabaseClient;
    userId: string;
}

export const getLessonPageData = async ({supabase, userId}: Props) => {

    const lessonPlans = await fetchLessonPlans(userId, supabase);
    const activeLesson = await fetchActiveLesson(userId, supabase);
    const recommendedLessons = await fetchRecommndedLessons(userId, supabase);
    const completedLessons = await fetchCompletedLessons(userId, supabase);

    return {
        lessonPlans,
        activeLesson,
        recommendedLessons,
        completedLessons
    };
}