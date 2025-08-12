import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApolicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1c1c1c]">Apólices</h1>
        <p className="text-sm text-gray-600">Gerencie apólices emitidas e vigências.</p>
      </div>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Em breve</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          Listagem e emissão de apólices ficará aqui.
        </CardContent>
      </Card>
    </div>
  );
}
