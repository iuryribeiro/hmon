import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1c1c1c]">Clientes</h1>
        <p className="text-sm text-gray-600">Cadastro e histórico dos seus clientes.</p>
      </div>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Em breve</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          CRM básico e importação de contatos ficará aqui.
        </CardContent>
      </Card>
    </div>
  );
}
