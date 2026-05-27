import React from "react";
import Overview from "@/components/content/guide/getting-started/Overview";
import FirstSession from "@/components/content/guide/getting-started/FirstSession";
import ManualImport from "@/components/content/guide/import/ManualImport";
import SyncImport from "@/components/content/guide/import/SyncImport";
import StatsOverview from "@/components/content/guide/dashboard/StatsOverview";
import AveragesGraph from "@/components/content/guide/dashboard/AveragesGraph";

export interface GuideLink {
  label: string;
  slug: string;
  content: React.ReactNode;
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
      { label: "Overview", slug: "overview", content: <Overview /> },
      {
        label: "Recording Your First Session",
        slug: "first-session",
        content: <FirstSession />,
      },
    ],
  },
  {
    section: "How to Import",
    slug: "import",
    links: [
      {
        label: "Manual Import",
        slug: "manual-import",
        content: <ManualImport />,
      },
      { label: "Sync Import", slug: "sync-import", content: <SyncImport /> },
    ],
  },
  // {
  //   section: "Dashboard",
  //   slug: "dashboard",
  //   links: [
  //     {
  //       label: "Stats Overview",
  //       slug: "stats-overview",
  //       content: <StatsOverview />,
  //     },
  //     {
  //       label: "Averages Graph",
  //       slug: "averages-graph",
  //       content: <AveragesGraph />,
  //     },
  //     { label: "Swing Metrics", slug: "swing-metrics" },
  //     { label: "Miss Tendency", slug: "miss-tendency" },
  //   ],
  // },
];
