"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stepper } from "@/components/wizard/Stepper";

const steps = [
  { key: "proponente", label: "Proponente" },
  { key: "perfil", label: "Perfil de risco" },
  { key: "coberturas", label: "Coberturas" },
  { key: "comparar", label: "Comparar" },
  { key: "resumo", label: "Resumo" },
] as const;

export default function CotacaoVidaPage() {
  const [step, setStep] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1c1c1c]">Cotação • Vida</h1>
        <p className="text-sm text-gray-600">Dados do proponente e coberturas.</p>
      </div>

      <Stepper steps={steps as any} current={step} />

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">{steps[step].label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="nome">Nome completo</Label>
                <Input id="nome" placeholder="Ex.: Ana Costa" />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" placeholder="000.000.000-00" />
              </div>
              <div>
                <Label htmlFor="nascimento">Data de nascimento</Label>
                <Input id="nascimento" type="date" />
              </div>
              <div>
                <Label htmlFor="sexo">Sexo</Label>
                <select id="sexo" className="w-full h-10 rounded-md border border-black/10 px-3 bg-white">
                  <option>Feminino</option>
                  <option>Masculino</option>
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="profissao">Profissão</Label>
                <Input id="profissao" placeholder="Ex.: Engenheira" />
              </div>
              <div>
                <Label htmlFor="fumante">Fumante</Label>
                <select id="fumante" className="w-full h-10 rounded-md border border-black/10 px-3 bg-white">
                  <option>Não</option>
                  <option>Sim</option>
                </select>
              </div>
              <div>
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input id="peso" placeholder="70" />
              </div>
              <div>
                <Label htmlFor="altura">Altura (cm)</Label>
                <Input id="altura" placeholder="170" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="morte">Morte (R$)</Label>
                <Input id="morte" placeholder="200.000" />
              </div>
              <div>
                <Label htmlFor="invalidez">Invalidez por acidente (R$)</Label>
                <Input id="invalidez" placeholder="100.000" />
              </div>
              <div>
                <Label htmlFor="diaria">Diária por internação</Label>
                <select id="diaria" className="w-full h-10 rounded-md border border-black/10 px-3 bg-white">
                  <option>Não</option>
                  <option>Sim</option>
                </select>
              </div>
              <div>
                <Label htmlFor="assist">Assistências</Label>
                <select id="assist" className="w-full h-10 rounded-md border border-black/10 px-3 bg-white">
                  <option>Básica</option>
                  <option>Plus</option>
                  <option>Premium</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-gray-600">
                  <tr className="[&>th]:pb-3">
                    <th>Seguradora</th>
                    <th>Plano</th>
                    <th>Capital segurado</th>
                    <th>Prêmio</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {["SulAmérica", "Icatu", "Porto Vida"].map((seg) => (
                    <tr key={seg} className="[&>td]:py-3">
                      <td className="font-medium">{seg}</td>
                      <td>Vida Individual</td>
                      <td>R$ —</td>
                      <td>R$ —/mês</td>
                      <td><Button size="sm" className="bg-[#18697A] hover:bg-[#155E6D] text-white rounded-lg">Selecionar</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-4">
              <p className="text-sm text-gray-700">Resumo e emissão.</p>
              <div className="rounded-xl border border-black/10 p-3 text-sm">
                <div className="font-medium">Resumo (mock)</div>
                <ul className="mt-2 list-disc list-inside text-gray-700">
                  <li>Proponente: —</li>
                  <li>Coberturas: —</li>
                  <li>Prêmio: —</li>
                </ul>
              </div>
              <Button disabled className="w-full rounded-xl">Emitir (em breve)</Button>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <Button variant="outline" className="rounded-xl" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Voltar
            </Button>
            <Button className={step < steps.length - 1 ? "bg-[#18697A] hover:bg-[#155E6D] text-white rounded-xl" : "rounded-xl"} onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}>
              Avançar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
