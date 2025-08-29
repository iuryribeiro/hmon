// src/app/api/quotes/_smoketest/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { supabase } = createSupabaseRouteClient(req);

    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) {
      return NextResponse.json({ ok: false, stage: "auth", error: authErr?.message || "no user" }, { status: 401 });
    }

    const { data: rows, error: accErr } = await supabase
      .from("account_members")
      .select("account_id")
      .eq("user_id", authData.user.id)
      .order("joined_at", { ascending: true })
      .limit(1);

    if (accErr) {
      return NextResponse.json({ ok: false, stage: "account_lookup", error: accErr.message }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      user_id: authData.user.id,
      account_id: rows?.[0]?.account_id ?? null,
      note: rows?.length ? "tem conta" : "sem conta",
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, stage: "unhandled", error: String(e?.message || e) }, { status: 500 });
  }
}
