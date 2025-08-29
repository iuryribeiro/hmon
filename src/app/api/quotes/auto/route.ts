// src/app/api/quotes/auto/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { supabase } = createSupabaseRouteClient(req);

    // 1) auth
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) {
      return NextResponse.json({ stage: "auth", error: authErr?.message || "Não autenticado" }, { status: 401 });
    }
    const user = authData.user;

    // 2) form
    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return NextResponse.json({ stage: "form", error: "Esperado multipart/form-data" }, { status: 400 });
    }

    // 3) payload JSON
    const raw = form.get("payload");
    let payload: any = {};
    try {
      payload = raw ? JSON.parse(String(raw)) : {};
    } catch {
      return NextResponse.json({ stage: "payload", error: "payload inválido (JSON)" }, { status: 400 });
    }

    const type = String(form.get("type") || "auto");

    // 4) descobrir / garantir account_id
    let accountId = (form.get("account_id") as string) || null;
    if (!accountId) {
      const { data: rows, error: accErr } = await supabase
        .from("account_members")
        .select("account_id")
        .eq("user_id", user.id)
        .order("joined_at", { ascending: true })
        .limit(1);
      if (accErr) return NextResponse.json({ stage: "account_lookup", error: accErr.message }, { status: 400 });
      accountId = rows?.[0]?.account_id ?? null;
    }
    if (!accountId) {
      // opcional: autocriar conta padrão
      const { data: newAcc, error: accCreateErr } = await supabase
        .from("accounts")
        .insert({ name: `Conta de ${user.email ?? "usuário"}`, created_by: user.id })
        .select("id")
        .single();
      if (accCreateErr) {
        return NextResponse.json({ stage: "account_create", error: accCreateErr.message }, { status: 400 });
      }
      accountId = newAcc.id;
      // trigger já insere em account_members
    }

    // 5) insert da quote
    const { data: q, error: insertErr } = await supabase
      .from("quotes")
      .insert({
        account_id: accountId,
        created_by: user.id,
        type,
        status: "submitted",
        customer_name: payload?.nomeCompleto ?? null,
        customer_cpf: payload?.cpf ?? null,
        customer_email: payload?.email ?? null,
        customer_phone: payload?.celular ?? null,
        vehicle_plate: payload?.dadosVeiculo?.placa ?? null,
        vehicle_brand: payload?.dadosVeiculo?.marca ?? null,
        vehicle_model: payload?.dadosVeiculo?.modelo ?? null,
        vehicle_year: payload?.dadosVeiculo?.anoModelo ? Number(payload.dadosVeiculo.anoModelo) : null,
        data: payload,
      })
      .select("id, data")
      .single();

    if (insertErr) {
      return NextResponse.json({ stage: "insert_quote", error: insertErr.message }, { status: 400 });
    }

    const quoteId = q.id;

    // 6) uploads (opcionais)
    async function uploadIfPresent(field: string, key: string) {
      const f = form.get(key);
      if (!f || typeof f === "string") return null;
      const file = f as File;

      const filename = file.name || `${field}.jpg`;
      const ext = filename.includes(".") ? filename.split(".").pop()!.toLowerCase() : "jpg";
      const path = `${accountId}/${quoteId}/${field}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("quotes")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });
      if (upErr) throw new Error(`upload:${field}:${upErr.message}`);
      return path;
    }

    const uploads: Record<string, string> = {};
    try {
      const cnh = await uploadIfPresent("cnh", "imagemCnh");
      const crv = await uploadIfPresent("crv", "imagemCrv");
      const nf  = await uploadIfPresent("nf",  "imagemNF");
      if (cnh) uploads.cnh = cnh;
      if (crv) uploads.crv = crv;
      if (nf)  uploads.nf  = nf;
    } catch (e: any) {
      return NextResponse.json({ stage: "upload", error: String(e?.message || e) }, { status: 400 });
    }

    if (Object.keys(uploads).length) {
      const { error: updErr } = await supabase
        .from("quotes")
        .update({ data: { ...q.data, uploads } })
        .eq("id", quoteId);
      if (updErr) {
        return NextResponse.json({ stage: "update_uploads", error: updErr.message }, { status: 400 });
      }
    }

    return NextResponse.json({ ok: true, id: quoteId }, { status: 200 });
  } catch (e: any) {
    console.error("[/api/quotes/auto] 500:", e);
    return NextResponse.json({ stage: "unhandled", error: String(e?.message || e) }, { status: 500 });
  }
}
