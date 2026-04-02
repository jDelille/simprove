import Training from "@/components/training/Training";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchActiveLesson } from "@/services/lessons/fetchActiveLesson";
import { fetchLessonPlans } from "@/services/lessons/fetchLessonPlans";

const TrainingPage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [lessonPlans, activeLesson] = user?.id
    ? await Promise.all([
        fetchLessonPlans(user.id, supabase),
        fetchActiveLesson(user.id, supabase),
      ])
    : [[], []];

  return (
    <div className="page">
      <div className="page-content">
        <Training lessonPlans={lessonPlans} userId={user.id} activeLesson={activeLesson} />
      </div>
    </div>
  );
};

export default TrainingPage;
