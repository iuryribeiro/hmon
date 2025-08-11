import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Home, HeartPulse, Building2, TrendingUp, Percent, Clock } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1c1c1c]">Visão geral</h1>
          <p className="text-sm text-gray-600">Resumo das suas cotações e atalhos rápidos.</p>
        </div>
        <Badge className="bg-[#F7CD3C] text-[#553614] hover:bg-[#e7be33]">HMON Pro</Badge>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Cotações hoje</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-3xl font-semibold">18</div>
            <TrendingUp className="h-5 w-5 text-[#18697A]" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Prêmios emitidos</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-3xl font-semibold">R$ 7.240</div>
            <Percent className="h-5 w-5 text-[#18697A]" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Taxa de conversão</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-3xl font-semibold">27%</div>
            <Clock className="h-5 w-5 text-[#18697A]" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Clientes ativos</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-3xl font-semibold">312</div>
            <TrendingUp className="h-5 w-5 text-[#18697A]" />
          </CardContent>
        </Card>
      </div>

      {/* Atalhos de cotação */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl border-black/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Car className="h-5 w-5 text-[#18697A]" /> Cotação Auto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Compare seguradoras e feche em minutos.
            </p>
            <Button asChild className="w-full bg-[#18697A] hover:bg-[#155E6D] text-white rounded-xl">
              <Link href="/dashboard/cotacoes/auto">Iniciar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-black/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Home className="h-5 w-5 text-[#553614]" /> Cotação Residencial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Proteção completa para sua casa e apartamento.
            </p>
            <Button asChild className="w-full bg-[#F7CD3C] text-[#553614] hover:bg-[#e7be33] rounded-xl">
              <Link href="/dashboard/cotacoes/residencial">Iniciar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-black/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-[#18697A]" /> Cotação Vida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">Planos sob medida para cada perfil.</p>
            <Button asChild variant="outline" className="w-full rounded-xl">
              <Link href="/dashboard/cotacoes/vida">Iniciar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-black/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#553614]" /> Cotação Empresarial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">Cobertura para o seu negócio.</p>
            <Button asChild variant="outline" className="w-full rounded-xl">
              <Link href="/dashboard/cotacoes/empresarial">Iniciar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Últimas cotações (mock) */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Últimas cotações</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-600">
              <tr className="[&>th]:pb-3">
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Seguradora</th>
                <th>Prêmio</th>
                <th>Status</th>
                <th>Atualizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                { nome: "Carlos Azevedo", tipo: "Auto", seg: "Porto", premio: "R$ 1.280", status: "Em análise", data: "hoje" },
                { nome: "Juliana Ramos", tipo: "Residencial", seg: "Allianz", premio: "R$ 680", status: "Aprovada", data: "ontem" },
                { nome: "M. Oliveira", tipo: "Vida", seg: "SulAmérica", premio: "R$ 220", status: "Pendente", data: "2 dias" },
              ].map((r, i) => (
                <tr key={i} className="[&>td]:py-3">
                  <td className="font-medium">{r.nome}</td>
                  <td>{r.tipo}</td>
                  <td>{r.seg}</td>
                  <td>{r.premio}</td>
                  <td>
                    <Badge variant={r.status === "Aprovada" ? "default" : "secondary"}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="text-gray-600">{r.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
