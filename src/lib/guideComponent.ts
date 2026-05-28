import Overview from "@/components/content/guide/getting-started/Overview";
import FirstSession from "@/components/content/guide/getting-started/FirstSession";
import ManualImport from "@/components/content/guide/import/ManualImport";
import SyncImport from "@/components/content/guide/import/SyncImport";
import StatsOverview from "@/components/content/guide/dashboard/StatsOverview";
import AveragesGraph from "@/components/content/guide/dashboard/AveragesGraph";


export const guideComponents: Record<string, React.ComponentType> = {
  Overview,
  FirstSession,
  ManualImport,
  SyncImport,
  StatsOverview,
  AveragesGraph,

};