"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { MailCheck, RefreshCcw, ArrowLeft, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function CheckEmailPage() {
  const router = useRouter();
  const params = useSearchParams();
  const initialEmail = useMemo(() => params.get("email") ?? "", [params]);
  const [email, setEmail] = useState(initialEmail);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  async function resend() {
    setMsg(null);
    if (!email) return setMsg("Informe seu e-mail.");
    setSending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (error) throw error;
      setMsg("E-mail reenviado! Verifique sua caixa de entrada e o spam.");
    } catch (e: any) {
      setMsg(e?.message ?? "Não foi possível reenviar. Tente novamente.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-brand-cream grid place-items-center p-6">
      <div className="w-full max-w-md">
        <Card className="border border-black/10 shadow-xl rounded-2xl bg-white">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-[#18697A] grid place-content-center text-white">
              <MailCheck className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Confirme seu e-mail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-700">
              Enviamos um link de confirmação para <span className="font-medium">{initialEmail || "seu e-mail"}</span>.
              Clique no link para ativar sua conta.
            </p>

            <div className="grid gap-2">
              <Label htmlFor="email">Reenviar para</Label>
              <Input
                id="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {msg && (
              <div className="rounded-lg border border-black/10 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {msg}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={resend}
                disabled={sending}
                className="flex-1 bg-[#18697A] hover:bg-[#155E6D] text-white"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                {sending ? "Reenviando..." : "Reenviar e-mail"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao login
              </Button>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
              <a
                className="inline-flex items-center justify-center rounded-md border px-3 py-2 hover:bg-gray-50"
                href="https://mail.google.com" target="_blank" rel="noreferrer"
              >
                Abrir Gmail <ExternalLink className="ml-2 h-3 w-3" />
              </a>
              <a
                className="inline-flex items-center justify-center rounded-md border px-3 py-2 hover:bg-gray-50"
                href="https://outlook.live.com" target="_blank" rel="noreferrer"
              >
                Abrir Outlook <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} hmon. Todos os direitos reservados.
        </p>
      </div>
    </main>
  );
}
