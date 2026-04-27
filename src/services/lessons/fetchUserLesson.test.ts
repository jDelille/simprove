import { fetchUserLessons } from "./fetchUserLessons";
import { it, expect } from "vitest";

it("returns empty array when Supabase returns error", async () => {
  const mockSupabase = {
    from: () => ({
      select: () => ({
        eq: async () => ({
          data: null,
          error: new Error("DB failed"),
        }),
      }),
    }),
  };

  const result = await fetchUserLessons("123", mockSupabase as any);

  expect(result).toEqual([]);
});