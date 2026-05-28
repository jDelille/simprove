export interface GuideLink {
  label: string;
  slug: string;
  component: string;
}

export interface GuideSection {
  section: string;
  slug: string;
  links: GuideLink[];
}

export const guides: GuideSection[] = [
  {
    section: "Getting Started",
    slug: "getting-started",
    links: [
      { label: "Overview", slug: "overview", component: "Overview" },
      { label: "Recording Your First Session", slug: "first-session", component: "FirstSession" },
    ],
  },
  {
    section: "How to Import",
    slug: "import",
    links: [
      { label: "Manual Import", slug: "manual-import", component: "ManualImport" },
      { label: "Sync Import", slug: "sync-import", component: "SyncImport" },
    ],
  },
  // {
  //   section: "Dashboard",
  //   slug: "dashboard",
  //   links: [
  //     { label: "Stats Overview", slug: "stats-overview", component: "StatsOverview" },
  //     { label: "Averages Graph", slug: "averages-graph", component: "AveragesGraph" },
  //     { label: "Swing Metrics", slug: "swing-metrics", component: "SwingMetrics" },
  //     { label: "Miss Tendency", slug: "miss-tendency", component: "MissTendency" },
  //   ],
  // },
];