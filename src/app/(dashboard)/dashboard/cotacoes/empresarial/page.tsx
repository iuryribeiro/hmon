"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stepper } from "@/components/wizard/Stepper";

const steps = [
  { key: "empresa", label: "Empresa" },
  { key: "risco", label: "Risco" },
  { key: "coberturas", label: "Coberturas" },
  { key: "comparar", label: "Comparar" },
  { key: "resumo", label: "Resumo" },
] as const;

export default function CotacaoEmpresarialPage() {
  const [step, setStep] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1c1c1c]">Cotação • Empresarial</h1>
        <p className="text-sm text-gray-600">Dados da empresa e exposição ao risco.</p>
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
                <Label htmlFor="razao">Razão social</Label>
                <Input id="razao" placeholder="Ex.: HMON Tecnologia LTDA" />
              </div>
              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" placeholder="00.000.000/0001-00" />
              </div>
              <div>
                <Label htmlFor="atividade">CNAE/Atividade</Label>
                <Input id="atividade" placeholder="Ex.: Comércio varejista" />
              </div>
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" placeholder="00000-000" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="area">Área construída (m²)</Label>
                <Input id="area" placeholder="300" />
              </div>
              <div>
                <Label htmlFor="materiais">Materiais combustíveis</Label>
                <select id="materiais" className="w-full h-10 rounded-md border border-black/10 px-3 bg-white">
                  <option>Baixa carga de incêndio</option>
                  <option>Média</option>
                  <option>Alta</option>
                </select>
              </div>
              <div>
                <Label htmlFor="sprinklers">Sprinklers</Label>
                <select id="sprinklers" className="w-full h-10 rounded-md border border-black/10 px-3 bg-white">
                  <option>Sim</option>
                  <option>Não</option>
                </select>
              </div>
              <div>
                <Label htmlFor="seguranca">Segurança patrimonial</Label>
                <select id="seguranca" className="w-full h-10 rounded-md border border-black/10 px-3 bg-white">
                  <option>Monitoramento</option>
                  <option>Vigilância</option>
                  <option>Sem sistemas</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="incendio">Incêndio (R$)</Label>
                <Input id="incendio" placeholder="500.000" />
              </div>
              <div>
                <Label htmlFor="lucros">Lucros cessantes (R$)</Label>
                <Input id="lucros" placeholder="100.000" />
              </div>
              <div>
                <Label htmlFor="roubo">Roubo/Furto</Label>
                <select id="roubo" className="w-full h-10 rounded-md border border-black/10 px-3 bg-white">
                  <option>Sim</option>
                  <option>Não</option>
                </select>
              </div>
              <div>
                <Label htmlFor="rc">Responsabilidade civil</Label>
                <select id="rc" className="w-full h-10 rounded-md border border-black/10 px-3 bg-white">
                  <option>Sim</option>
                  <option>Não</option>
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
                    <th>Cobertura</th>
                    <th>Riscos</th>
                    <th>Prêmio</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {["Porto", "Allianz", "HDI"].map((seg) => (
                    <tr key={seg} className="[&>td]:py-3">
                      <td className="font-medium">{seg}</td>
                      <td>Patrimonial</td>
                      <td>Média</td>
                      <td>R$ —</td>
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
                  <li>Empresa: —</li>
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
