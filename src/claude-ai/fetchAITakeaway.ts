"use server";

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type TakeawayStats = {
  totalShots: number;

  avgPath: number;
  avgFaceToTarget: number;
  avgFaceToPath: number;

  rightMisses: number;
  leftMisses: number;

  severeRightMisses: number;
  severeLeftMisses: number;

  avgRightMiss: number;
  avgLeftMiss: number;

  worstRightMiss: number;
  worstLeftMiss: number;
};

type TakeawayResponse = {
  primaryMiss: "left" | "right" | "neutral";
  cause: string;
  insight: string;
  focus: string;
};

export async function fetchAITakeaway(
  stats: TakeawayStats
): Promise<TakeawayResponse | null> {
  const prompt = `
You are a golf coach reviewing a practice session.

Session Summary:

- Total shots: ${stats.totalShots}

- Right misses: ${stats.rightMisses}
- Left misses: ${stats.leftMisses}

- Severe right misses (>20 yards): ${stats.severeRightMisses}
- Severe left misses (>20 yards): ${stats.severeLeftMisses}

- Average right miss: ${stats.avgRightMiss.toFixed(1)} yards
- Average left miss: ${stats.avgLeftMiss.toFixed(1)} yards

- Worst right miss: ${stats.worstRightMiss.toFixed(1)} yards
- Worst left miss: ${stats.worstLeftMiss.toFixed(1)} yards

- Average path: ${stats.avgPath.toFixed(1)}°
- Average face to target: ${stats.avgFaceToTarget.toFixed(1)}°
- Average face to path: ${stats.avgFaceToPath.toFixed(1)}°

Rules:

- Determine the player's primary miss direction using miss frequency and miss severity.
- Use severe misses as a stronger signal than small misses.
- Do not identify the miss direction as neutral unless left and right misses are genuinely balanced.

- The insight must explain WHY the miss is happening.
- Do not simply describe the miss direction, dispersion, carry distance, or information the player can already see in charts.
- Explain the swing characteristic most responsible for the miss.
- Focus on the strongest contributing factor, not every factor.

- Prioritize causes in this order:
  1. Face angle
  2. Face-to-path relationship
  3. Swing path
  4. Strike quality
  5. Mixed factors

- Only identify causes supported by the provided session data.
- Do not invent swing faults that are not evident in the data.

- You may reference specific swing measurements when they help explain the cause.
- Use measurements naturally like a coach would.
- Do not mention averages, percentages, statistics, analysis, metrics, datasets, or calculations.

- Write like an experienced golf coach reviewing a player's swing.
- Use plain language.
- Keep the insight to ONE sentence.
- Keep the focus to ONE sentence.
- Use short, direct coaching language.

- Do not exaggerate.
- Do not use hype.
- Do not overpraise.

Avoid statements like:
- "You're making solid contact."
- "Your misses are leaking right."
- "You're swinging well overall."
- "Keep working on consistency."
- "Your numbers look good."

- Explain the swing fault causing the result, not the result itself.
- The insight should tell the player what is causing the miss.
- The focus should tell the player what to work on next.

Good Examples:

Insight:
"Your clubface is arriving open through impact, which is sending the ball right even when contact is solid."

Focus:
"Work on returning the clubface squarer through impact."

Insight:
"Your swing path is moving too far from the inside, which is pushing the ball right and making the larger misses harder to control."

Focus:
"Feel the club travel more down your target line through impact."

Insight:
"Your face is staying fairly controlled, but the club is approaching too much from the inside, which is creating the push pattern."

Focus:
"Focus on reducing the amount the club approaches from the inside."

Bad Examples:

Insight:
"Most of your misses are right."

Focus:
"Try to hit the ball straighter."

Insight:
"You're making solid contact but missing right."

Focus:
"Work on consistency."

Respond ONLY with valid JSON:

{
  "primaryMiss": "left",
  "cause": "inside_path",
  "insight": "...",
  "focus": "..."
}
`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    message.content[0].type === "text"
      ? message.content[0].text
      : "";

  function cleanJSON(text: string) {
    return text
      .replace(/```json\s*/g, "")
      .replace(/```/g, "")
      .trim();
  }

  try {
    return JSON.parse(cleanJSON(text));
  } catch (err) {
    console.error("Takeaway parse failed:", err, text);
    return null;
  }
}