import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// opcional, mas bom para evitar cache em dev
export const dynamic = "force-dynamic";
// se estiver usando edge, troque para node: export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // checa sessão do usuário (cookie) com o client "server"
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // lê a ação e o plano
  const body = await req.json().catch(() => ({}));
  const action = body?.action as "activate" | "cancel" | "past_due" | "trialing";
  const plan = (body?.plan as "basic" | "pro") ?? "basic";

  const now = new Date();
  const end = new Date(now); end.setDate(end.getDate() + 30);

  const planMap = {
    basic: { plan_code: "hmon_basic", plan_name: "HMON Basic", price_cents: 4900, currency: "BRL" },
    pro:   { plan_code: "hmon_pro",   plan_name: "HMON Pro",   price_cents: 9900, currency: "BRL" },
  } as const;

  try {
    if (action === "cancel") {
      const { error } = await supabaseAdmin
        .from("subscriptions")
        .update({
          status: "canceled",
          canceled_at: now.toISOString(),
          cancel_at_period_end: false,
          current_period_end: now.toISOString(),
        })
        .eq("user_id", user.id);

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true, status: "canceled" });
    }

    const status =
      action === "past_due" ? "past_due" :
      action === "trialing" ? "trialing" : "active";

    // upsert para criar/atualizar a “assinatura” simulada
    const { error } = await supabaseAdmin.from("subscriptions").upsert(
      {
        user_id: user.id,
        provider: "manual",
        external_customer_id: null,
        external_subscription_id: `sim_${user.id}`, // id estável p/ onConflict
        ...planMap[plan],
        status,
        current_period_start: now.toISOString(),
        current_period_end: end.toISOString(),
        cancel_at_period_end: false,
        canceled_at: null,
      },
      { onConflict: "external_subscription_id" }
    );

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, status });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "server error" }, { status: 500 });
  }
}
