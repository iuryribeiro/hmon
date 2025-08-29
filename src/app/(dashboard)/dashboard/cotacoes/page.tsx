import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function statusColor(s?: string) {
  switch (s) {
    case "submitted": return "bg-amber-100 text-amber-800 border-amber-200";
    case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
    case "quoted":    return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "rejected":  return "bg-red-100 text-red-800 border-red-200";
    default:          return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export default async function QuotesListPage() {
  // ✅ AGORA: await no helper
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: quotes, error } = await supabase
    .from("quotes")
    .select("id, created_at, status, type, customer_name, vehicle_plate, vehicle_model, data")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Erro ao carregar cotações: {error.message}</p>
      </div>
    );
  }

  // Assinar thumbs
  const allPaths: string[] = [];
  for (const q of quotes ?? []) {
    const up = (q as any).data?.uploads;
    if (up?.cnh) allPaths.push(up.cnh);
    if (up?.crv) allPaths.push(up.crv);
    if (up?.nf)  allPaths.push(up.nf);
  }
  let map: Record<string, string> = {};
  if (allPaths.length) {
    const { data: signed } = await supabase.storage.from("quotes").createSignedUrls(allPaths, 600);
    map = Object.fromEntries((signed ?? []).map(s => [s.path, s.signedUrl]));
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Todas as cotações</h1>

      {(!quotes || quotes.length === 0) ? (
        <p className="text-gray-600">Você ainda não possui cotações.</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {quotes!.map(q => {
            const up = (q as any).data?.uploads || {};
            const thumbs = [up.cnh && map[up.cnh], up.crv && map[up.crv], up.nf && map[up.nf]]
              .filter(Boolean) as string[];

            return (
              <Link key={q.id} href={`/dashboard/cotacoes/${q.id}`} className="block">
                <Card className="hover:shadow-md transition">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      #{String(q.id).slice(0, 8)} • {q.customer_name || "Sem nome"}
                    </CardTitle>
                    <Badge className={statusColor(q.status)}>{q.status}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">
                      {q.type?.toUpperCase()} • {q.vehicle_plate || "—"} • {q.vehicle_model || "—"}
                    </p>
                    {thumbs.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {thumbs.map((u, i) => (
                          <img key={i} src={u} className="h-20 w-full object-cover rounded-md border" alt="thumb" />
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(q.created_at!).toLocaleString("pt-BR")}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
