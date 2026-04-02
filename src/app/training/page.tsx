import Training from "@/components/training/Training";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchLessonPlans } from "@/services/lessons/fetchLessonPlans";

const TrainingPage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [lessonPlans] = user?.id
    ? await Promise.all([
        fetchLessonPlans(user.id, supabase),
      ])
    : [[], []];

  return (
    <div className="page">
      <div className="page-content">
        <Training lessonPlans={lessonPlans} />
      </div>
    </div>
  );
};

export default TrainingPage;
