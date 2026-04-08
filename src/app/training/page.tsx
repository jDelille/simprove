import Training from "@/components/training/Training";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchActiveLesson } from "@/services/lessons/fetchActiveLesson";
import { fetchLessonPlans } from "@/services/lessons/fetchLessonPlans";
import { fetchRecommndedLessons } from "@/services/lessons/fetchRecommendedLessons";

const TrainingPage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; 
  }

  const [lessonPlans, activeLessonData, recommendedLessons] = await Promise.all([
    fetchLessonPlans(user.id, supabase),
    fetchActiveLesson(user.id, supabase),
    fetchRecommndedLessons(user.id, supabase),
  ]);

  const activeLesson = activeLessonData ?? undefined;

  return (
    <div className="page">
      <div className="page-content">
        <Training
          lessonPlans={lessonPlans}
          userId={user.id}
          activeLesson={activeLesson}
          recommendedLessons={recommendedLessons}
        />
      </div>
    </div>
  );
};

export default TrainingPage;