"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

async function simulate(action: string, plan: "basic" | "pro") {
  const res = await fetch("/api/billing/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, plan }),
  });
  if (!res.ok) {
    let msg = "Falha ao simular a assinatura.";
    try {
      const j = await res.json();
      if (j?.error) msg = j.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export default function PlanSimulator() {
  const router = useRouter();
  const [loading, setLoading] = useState<"basic" | "pro" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async (plan: "basic" | "pro") => {
    setError(null);
    setLoading(plan);
    try {
      await simulate("activate", plan);
      router.push("/dashboard"); // já entra no app após “assinar”
    } catch (e: any) {
      setError(e?.message ?? "Erro inesperado.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Plano Basic */}
      <Card className="border border-black/10 bg-white shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            HMON Basic
            <Badge className="bg-[#F7CD3C] text-[#553614] hover:bg-[#e7be33]">Popular</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-3xl font-semibold text-[#1C1C1C]">
            R$ 49<span className="text-base font-normal">/mês</span>
          </div>
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
            <li>Multicálculo até 3 seguradoras</li>
            <li>Histórico básico</li>
            <li>Suporte por e-mail</li>
          </ul>
          <Button
            className="w-full bg-[#18697A] hover:bg-[#155E6D] text-white"
            disabled={loading !== null}
            onClick={() => handleClick("basic")}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {loading === "basic" ? "Ativando..." : "Assinar agora"}
          </Button>
          <p className="text-xs text-gray-500">
            * botão de simulação — sem provedor de pagamento.
          </p>
        </CardContent>
      </Card>

      {/* Plano Pro */}
      <Card className="border border-black/10 bg-white shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>HMON Pro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-3xl font-semibold text-[#1C1C1C]">
            R$ 99<span className="text-base font-normal">/mês</span>
          </div>
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
            <li>Multicálculo ilimitado</li>
            <li>Exportação e integrações</li>
            <li>Suporte prioritário</li>
          </ul>
          <Button
            className="w-full bg-[#F7CD3C] text-[#553614] hover:bg-[#e7be33]"
            disabled={loading !== null}
            onClick={() => handleClick("pro")}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {loading === "pro" ? "Ativando..." : "Assinar agora"}
          </Button>
          <p className="text-xs text-gray-500">
            * botão de simulação — sem provedor de pagamento.
          </p>
        </CardContent>
      </Card>

      {error && (
        <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
