import Training from "@/components/training/Training";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getLessonPageData } from "@/services/lessons/getLessonPageData";

const TrainingPage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const trainingData = await getLessonPageData({
    supabase: supabase,
    userId: user.id,
  });

  const { activeLesson, lessonPlans, recommendedLessons, completedLessons } =
    trainingData;

  return (
    <div className="page">
      <div className="page-content">
        <Training
          lessonPlans={lessonPlans}
          userId={user.id}
          activeLesson={activeLesson}
          recommendedLessons={recommendedLessons}
          completedLessons={completedLessons}
        />
      </div>
    </div>
  );
};

export default TrainingPage;
