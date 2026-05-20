import Missions from "@/components/training/Missions";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getLessonPageData } from "@/services/lessons/getLessonPageData";

const MissionsPage = async () => {
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
        <Missions
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

export default MissionsPage;
