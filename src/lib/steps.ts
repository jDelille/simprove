import type { Tour } from "nextstepjs";

export const steps: Tour[] = [
  {
    tour: "welcomeTour",
    steps: [
      {
        icon: "👋",
        title: "Welcome to Simprove!",
        content:
          "This site is still in early development. Many features are coming soon, but here's a quick tour of the dashboard.",
        // selector: "#dashboard",
        side: "bottom",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: "📈",
        title: "Lifetime Stats",
        content:
          "Your lifetime stats at a glance. Total shots hit, sessions logged, longest carry recorded, and your most reached-for club.",
        selector: "#stats-row",
        side: "right",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: "📊",
        title: "Performance by Club",
        content:
          "Visualize your performance by club. Switch between Carry, Ball Speed, Offline, and Back Spin to see how each club stacks up.",
        selector: "#averages-graph",
        side: "right",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: "🏌️",
        title: "Swing Metrics",
        content:
          "Your key swing data broken down by club. Club path, face angle, and attack angle pulled directly from your launch monitor.",
        selector: "#swing-metrics",
        side: "right",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: "🎯",
        title: "Miss Tendency",
        content:
          "See where your shots are landing left or right of target. The slider shows your average miss pattern so you know where to focus.",
        selector: "#miss-tendency",
        side: "right",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: "📚",
        title: "Your Lesson Plan",
        content:
          "Your AI-generated training plan based on your swing data. Complete lessons to improve the areas that matter most to your game.",
        selector: "#lesson-plan",
        side: "left",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: "😄",
        title: "Your Profile Overview",
        content:
          "Get a quick view at your profile and what you've been up to recently.",
        selector: "#profile-overview",
        side: "left",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: "📥",
        title: "Import a Session",
        content:
          "Click here to import your launch monitor data and start tracking your performance.",
        selector: "#upload-btn",
        side: "bottom",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: "⛳",
        title: "Sync with GSPro Portal",
        content:
          "Click here to sync with GSPro Portal and import your rounds.",
        selector: "#sync-btn",
        side: "bottom",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: "🎉",
        title: "You're all set!",
        content:
          "That's the dashboard. Head to Sessions, Training, or your Profile to keep exploring.",
        side: "bottom",
        showControls: true,
        showSkip: false,
      },
    ],
  },
];
