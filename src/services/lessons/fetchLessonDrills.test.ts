import { it, expect } from "vitest";
import { fetchLessonDrills } from "./fetchLessonDrills";

it("returns empty array when Supabase returns error", async () => {
  const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => ({
          data: null,
          error: new Error("DB failed"),
        }),
      }),
    }),
  }),
};

  const result = await fetchLessonDrills("123", mockSupabase as any);

  expect(result).toEqual([]);
});