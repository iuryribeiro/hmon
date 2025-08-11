import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Shield } from "lucide-react";
import PlanSimulator from "@/components/billing/PlanSimulator";

export default async function BillingPage() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const uid = user.id;

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", uid)
    .order("current_period_end", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: isActive } = await supabase.rpc("is_subscription_active", { uid });

  const activeUntil = sub?.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString("pt-BR")
    : null;

  return (
    <main className="min-h-screen w-full bg-brand-cream">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#1C1C1C]">Assinatura</h1>
          <div className="inline-flex items-center gap-2 text-sm text-gray-700">
            <Shield className="h-4 w-4 text-[#18697A]" />
            {isActive ? (
              <span>
                Status: <span className="font-medium text-[#18697A]">Ativa</span>
                {activeUntil ? ` (até ${activeUntil})` : ""}
              </span>
            ) : (
              <span>
                Status: <span className="font-medium text-red-600">Inativa</span>
              </span>
            )}
          </div>
        </div>

        {isActive ? (
          <Card className="border border-black/10 bg-white shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Sua assinatura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-800">
              <div className="flex flex-wrap items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#18697A]" />
                Plano: <span className="font-medium">{sub?.plan_name ?? "HMON Pro"}</span>
                <Badge variant="secondary" className="ml-1">{sub?.status ?? "active"}</Badge>
              </div>
              {activeUntil && (
                <div>
                  Próxima renovação: <span className="font-medium">{activeUntil}</span>
                </div>
              )}
              <div>
                Valor:{" "}
                <span className="font-medium">
                  {sub?.price_cents != null ? `R$ ${(sub.price_cents / 100).toFixed(2)}` : "—"}
                </span>
              </div>
              <div className="pt-2">
                <Button variant="outline" disabled>Gerenciar cobrança</Button>
                <span className="ml-2 text-xs text-gray-500">(*simulação — sem provedor)</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <PlanSimulator />
        )}

        <p className="mt-8 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} hmon. Todos os direitos reservados.
        </p>
      </div>
    </main>
  );
}
