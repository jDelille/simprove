import Activity from "@/components/activity/Activity";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchActivityById } from "@/services/activity/fetchActivityById";

type ActivityType = "round" | "session";

interface ActivityPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}

const ActivityPage = async ({ params, searchParams }: ActivityPageProps) => {
  const { id } = await params;
  const { type } = (await searchParams) as { type: ActivityType };

  if (!type) return null; // or redirect to 404

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [activity] = user?.id
    ? await Promise.all([fetchActivityById(user.id, id, type, supabase)])
    : [[], []];

  return (
    <div className="page">
      <div className="page-content">
        <Activity activity={activity} />
      </div>
    </div>
  );
};

export default ActivityPage;
