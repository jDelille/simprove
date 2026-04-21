import { createSupabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { pendingRounds } from "@/lib/gspro/store";

// Handles preflight CORS request (browser sends this FIRST)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// Your actual API call
export async function POST(req: Request) {
  const supabase = await createSupabaseServer();

  try {
    const body = await req.json();
    pendingRounds.push(body);
    console.log("body", body)


    return NextResponse.json(
      { success: true },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (err) {
    console.error("Ingest error:", err);

    return NextResponse.json(
      { success: false },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}


export async function GET() {
  return NextResponse.json(pendingRounds);
}

// console.log("\n================ GSPRO INCOMING ================\n");

// console.log("Rounds count:", data?.Rounds?.length ?? 0);

// console.log("\n--- ROUNDS ---\n");
// console.dir(data?.Rounds_Rounds);

// console.log("\n--- ROUND DATA ---\n");
// console.log(data?.RoundScores);

// console.log("\n================================================\n");


    // const { data, error } = await supabase
    //   .from("rounds")
    //   .insert({
    //     user_id: user.id, // 👈 auth.uid() (PRIMARY)
    //     app_user_id: body.userId, // optional secondary

    //     round_key: body.roundKey,
    //     course_name: body.courseName,
    //     tee_type: body.teeType,
    //     round_type: body.roundType,
    //     control_type: body.controlType,

    //     rating: Number(body.ratingSlope?.split("/")[0]),
    //     slope: Number(body.ratingSlope?.split("/")[1]),
    //     par: Number(body.par),

    //     round_begin: body.roundBegin,
    //     hole_count: body.holeCount,
    //     hidden_from_stats: body.hiddenFromStatsTF,
    //   })
    //   .select();
