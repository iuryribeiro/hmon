import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1c1c1c]">Configurações</h1>
        <p className="text-sm text-gray-600">Preferências da conta e integrações.</p>
      </div>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Em breve</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          Integrações com seguradoras e personalização da HMON ficarão aqui.
        </CardContent>
      </Card>
    </div>
  );
}
