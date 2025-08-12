"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stepper } from "@/components/wizard/Stepper";

const steps = [
  { key: "cliente", label: "Cliente" },
  { key: "veiculo", label: "Veículo" },
  { key: "coberturas", label: "Coberturas" },
  { key: "comparar", label: "Comparar" },
  { key: "resumo", label: "Resumo" },
] as const;

export default function CotacaoAutoPage() {
  const [step, setStep] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1c1c1c]">Cotação • Auto</h1>
        <p className="text-sm text-gray-600">Preencha os dados e compare as seguradoras.</p>
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
                <Input id="nome" placeholder="Ex.: Maria Silva" />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" placeholder="000.000.000-00" />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="voce@exemplo.com" />
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
                <Label htmlFor="placa">Placa</Label>
                <Input id="placa" placeholder="ABC1D23" />
              </div>
              <div>
                <Label htmlFor="marca">Marca</Label>
                <Input id="marca" placeholder="Ex.: Toyota" />
              </div>
              <div>
                <Label htmlFor="modelo">Modelo</Label>
                <Input id="modelo" placeholder="Ex.: Corolla Altis" />
              </div>
              <div>
                <Label htmlFor="ano">Ano</Label>
                <Input id="ano" placeholder="2022" />
              </div>
              <div>
                <Label htmlFor="uso">Uso do veículo</Label>
                <select id="uso" className="w-full h-10 rounded-md border border-black/10 px-3 bg-white">
                  <option>Particular</option>
                  <option>Comercial</option>
                  <option>Aplicativo</option>
                </select>
              </div>
              <div>
                <Label htmlFor="garagem">Garagem à noite?</Label>
                <select id="garagem" className="w-full h-10 rounded-md border border-black/10 px-3 bg-white">
                  <option>Sim</option>
                  <option>Não</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="franquia">Franquia</Label>
                <select id="franquia" className="w-full h-10 rounded-md border border-black/10 px-3 bg-white">
                  <option>Reduzida</option>
                  <option>Normal</option>
                  <option>Ampliada</option>
                </select>
              </div>
              <div>
                <Label htmlFor="assistencia">Assistência</Label>
                <select id="assistencia" className="w-full h-10 rounded-md border border-black/10 px-3 bg-white">
                  <option>100 km</option>
                  <option>200 km</option>
                  <option>Ilimitada</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" className="h-4 w-4" /> Carro reserva
                </label>
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
                    <th>Franquia</th>
                    <th>Prêmio</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {["Porto", "Allianz", "Azul"].map((seg) => (
                    <tr key={seg} className="[&>td]:py-3">
                      <td className="font-medium">{seg}</td>
                      <td>Completo</td>
                      <td>Normal</td>
                      <td>R$ —</td>
                      <td>
                        <Button size="sm" className="bg-[#18697A] hover:bg-[#155E6D] text-white rounded-lg">
                          Selecionar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-gray-500">* resultados simulados — integrar com motores depois.</p>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-4">
              <p className="text-sm text-gray-700">Revise os dados e emita a proposta.</p>
              <div className="rounded-xl border border-black/10 p-3 text-sm">
                <div className="font-medium">Resumo (mock)</div>
                <ul className="mt-2 list-disc list-inside text-gray-700">
                  <li>Cliente: —</li>
                  <li>Veículo: —</li>
                  <li>Plano: —</li>
                  <li>Prêmio: —</li>
                </ul>
              </div>
              <Button disabled className="w-full rounded-xl">Emitir (em breve)</Button>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              Voltar
            </Button>
            <Button
              className={step < steps.length - 1 ? "bg-[#18697A] hover:bg-[#155E6D] text-white rounded-xl" : "rounded-xl"}
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              disabled={step === steps.length - 1}
            >
              Avançar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
