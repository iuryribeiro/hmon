// src/app/api/quotes/my/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { supabase } = createSupabaseRouteClient(req);

    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    const user = authData.user;

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "auto";
    const limit = Number(searchParams.get("limit") || 10);

    // pega as suas cotações (RLS já garante membership)
    const { data: quotes, error: qErr } = await supabase
      .from("quotes")
      .select("id, created_at, status, type, customer_name, vehicle_plate, vehicle_model, data")
      .eq("created_by", user.id)
      .eq("type", type)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (qErr) {
      return NextResponse.json({ error: qErr.message }, { status: 400 });
    }

    // coletar todos os paths para criar URLs assinadas de uma vez
    const allPaths: string[] = [];
    for (const q of quotes || []) {
      const up = (q as any).data?.uploads;
      if (up?.cnh) allPaths.push(up.cnh);
      if (up?.crv) allPaths.push(up.crv);
      if (up?.nf)  allPaths.push(up.nf);
    }

    let signedMap: Record<string, string> = {};
    if (allPaths.length) {
      const { data: signed, error: sErr } = await supabase
        .storage.from("quotes")
        .createSignedUrls(allPaths, 60 * 10); // 10 min
      if (sErr) {
        return NextResponse.json({ error: sErr.message }, { status: 400 });
      }
      signedMap = Object.fromEntries(
        (signed || []).map((s) => [s.path, s.signedUrl])
      );
    }

    const items = (quotes || []).map((q) => {
      const up = (q as any).data?.uploads || {};
      return {
        id: q.id,
        created_at: q.created_at,
        status: q.status,
        type: q.type,
        customer_name: q.customer_name,
        vehicle_plate: q.vehicle_plate,
        vehicle_model: q.vehicle_model,
        uploads: {
          cnhUrl: up.cnh ? signedMap[up.cnh] : null,
          crvUrl: up.crv ? signedMap[up.crv] : null,
          nfUrl:  up.nf  ? signedMap[up.nf]  : null,
        },
      };
    });

    return NextResponse.json({ items }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
