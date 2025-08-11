"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

async function post(action: string, plan?: string) {
  const res = await fetch("/api/billing/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, plan }),
  });
  if (!res.ok) throw new Error((await res.json()).error ?? "erro");
  return res.json();
}

export function SimulateButtons() {
  const [loading, setLoading] = useState<string | null>(null);

  async function run(label: string, action: string, plan?: string) {
    setLoading(label);
    try {
      await post(action, plan);
      window.location.reload();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button
        className="bg-[#18697A] hover:bg-[#155E6D] text-white"
        disabled={loading !== null}
        onClick={() => run("basic", "activate", "basic")}
      >
        <CreditCard className="h-4 w-4 mr-2" />
        {loading === "basic" ? "Ativando..." : "Assinar Basic (simular)"}
      </Button>

      <Button
        className="bg-[#F7CD3C] text-[#553614] hover:bg-[#e7be33]"
        disabled={loading !== null}
        onClick={() => run("pro", "activate", "pro")}
      >
        <CreditCard className="h-4 w-4 mr-2" />
        {loading === "pro" ? "Ativando..." : "Assinar Pro (simular)"}
      </Button>

      <Button
        variant="outline"
        disabled={loading !== null}
        onClick={() => run("trial", "trialing")}
      >
        Colocar em Trial (simular)
      </Button>

      <Button
        variant="outline"
        disabled={loading !== null}
        onClick={() => run("pdue", "past_due")}
      >
        Marcar Past due (simular)
      </Button>

      <Button
        variant="destructive"
        disabled={loading !== null}
        onClick={() => run("cancel", "cancel")}
      >
        Cancelar assinatura (simular)
      </Button>
    </div>
  );
}
