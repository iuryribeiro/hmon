// src/app/(dashboard)/cotacoes/[id]/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function statusColor(s?: string) {
  switch (s) {
    case "submitted": return "bg-amber-100 text-amber-800 border-amber-200";
    case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
    case "quoted":    return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "rejected":  return "bg-red-100 text-red-800 border-red-200";
    default:          return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

// Componente simples para exibir pares "label / valor"
// Oculta automaticamente quando value é vazio/null/undefined
function KV({ label, value }: { label: string; value?: any }) {
  const v = typeof value === "string" ? value.trim() : value;
  if (v === null || v === undefined || v === "" ) return null;
  return (
    <div className="space-y-0.5">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-sm font-medium text-gray-900">{String(value)}</div>
    </div>
  );
}

// normaliza "sim/nao" -> "Sim/Não"
const yn = (v?: string) => v ? (v.toLowerCase() === "sim" ? "Sim" : v.toLowerCase() === "nao" ? "Não" : v) : undefined;

export default async function QuoteDetailPage(
  props: { params: Promise<{ id: string }> } // Next 15: params pode ser Promise
) {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  // aguarde o params e use id como string (funciona para bigserial ou uuid)
  const { id } = await props.params;
  if (!id) {
    return (
      <div className="p-6">
        <p className="text-red-600">ID inválido.</p>
        <Link className="text-brand-teal underline" href="/dashboard/cotacoes">Voltar</Link>
      </div>
    );
  }

  const { data: q, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !q) {
    return (
      <div className="p-6">
        <p className="text-red-600">Erro ao carregar: {error?.message || "não encontrado"}</p>
        <Link className="text-brand-teal underline" href="/dashboard/cotacoes">Voltar</Link>
      </div>
    );
  }

  // JSON que você mostrou
  const d: any = q.data ?? {};
  const veic = d.dadosVeiculo ?? {};
  const createdAt = q.created_at ? new Date(q.created_at).toLocaleString("pt-BR") : "";

  // Assinar anexos, se houver
  const uploads = (d.uploads ?? {}) as { cnh?: string; crv?: string; nf?: string };
  const paths = [uploads.cnh, uploads.crv, uploads.nf].filter(Boolean) as string[];
  let urls: Record<string,string> = {};
  if (paths.length) {
    const { data: signed } = await supabase.storage.from("quotes").createSignedUrls(paths, 600);
    urls = Object.fromEntries((signed ?? []).map(s => [s.path, s.signedUrl]));
  }

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cotação #{String(q.id).slice(0, 8)}</h1>
          <p className="text-sm text-gray-500">Criada em {createdAt}</p>
        </div>
        <Badge className={statusColor(q.status)}>{q.status}</Badge>
      </div>

      {/* Resumo */}
      <Card>
        <CardHeader><CardTitle>Resumo</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <KV label="Nome" value={d.nomeCompleto} />
            <KV label="CPF" value={d.cpf} />
            <KV label="Telefone" value={d.celular} />
            <KV label="E-mail" value={d.email} />
            <KV label="Placa" value={veic.placa} />
            <KV label="Modelo" value={veic.modelo} />
            <KV label="Marca" value={veic.marca} />
            <KV label="Ano Modelo" value={veic.anoModelo} />
            <KV label="Valor FIPE" value={veic.valor} />
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader><CardTitle>Endereço</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <KV label="CEP" value={d.cep} />
            <KV label="Logradouro" value={d.logradouro} />
            <KV label="Bairro" value={d.bairro} />
            <KV label="Cidade" value={d.cidade} />
            <KV label="Estado" value={d.estado} />
            <KV label="Residência" value={d.residencia} />
            <KV label="Portão" value={d.portao} />
            <KV label="Garagem no trabalho" value={yn(d.garagemTrabalho)} />
            <KV label="Estudante" value={yn(d.estudante)} />
            <KV label="Garagem na faculdade" value={yn(d.garagemFaculdade)} />
          </div>
        </CardContent>
      </Card>

      {/* Seguro & Perfil */}
      <Card>
        <CardHeader><CardTitle>Seguro & Perfil</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <KV label="Estado civil" value={d.estadoCivil} />
            <KV label="Seguro novo?" value={yn(d.tipoSeguro)} />
            <KV label="Seguradora anterior" value={d.seguradora || d.nomeSeguradora} />
            <KV label="Bônus" value={d.bonus} />
            <KV label="Houve sinistro?" value={yn(d.sinistro)} />
            <KV label="Qtd. sinistros" value={d.sinistroQtd} />
            <KV label="Fim de vigência" value={d.fimDeVigencia} />
            <KV label="Nº apólice" value={d.nApolice} />
            <KV label="Nº CI" value={d.nCi} />
            <KV label="Uso do veículo" value={d.usoVeiculo} />
            <KV label="Visita cliente" value={yn(d.visitaCliente)} />
            <KV label="Vezes/semana" value={d.vezesSemana} />
            <KV label="Profissão" value={d.profissao} />
            <KV label="Quem indicou" value={d.quemIndicou} />
          </div>
        </CardContent>
      </Card>

      {/* CNH & Habilitação */}
      <Card>
        <CardHeader><CardTitle>CNH & Habilitação</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <KV label="Nº CNH" value={d.nrCnh} />
            <KV label="1ª habilitação" value={d.primeiraHabilitacao} />
            <KV label="Nascimento" value={d.nascimento} />
            <KV label="Cônjuge dirige?" value={yn(d.conjugeDirige)} />
            <KV label="CNH cônjuge" value={d.cnhConjuge} />
            <KV label="CPF cônjuge" value={d.cpfConjuge} />
            <KV label="Nome cônjuge" value={d.nomeConjuge} />
            <KV label="Nascimento cônjuge" value={d.nascimentoConjuge} />
            <KV label="Val. habilitação cônjuge" value={d.habilitacaoConjuge} />
            <KV label="1ª hab. cônjuge" value={d.primeiraHabilitacaoConjuge} />
            <KV label="Residentes 18–25?" value={yn(d.temFilhos)} />
            <KV label="Sexo residentes" value={d.sexoFilhos} />
            <KV label="Nasc. do mais novo" value={d.nascimentoFilhoMaisNovo} />
          </div>
        </CardContent>
      </Card>

      {/* Veículo (detalhes técnicos) */}
      <Card>
        <CardHeader><CardTitle>Veículo</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <KV label="0 KM?" value={yn(veic.zeroKm)} />
            <KV label="Faturado?" value={yn(veic.faturado)} />
            <KV label="Previsão de saída" value={veic.previsaoSaida} />
            <KV label="Renavam/Chassi" value={veic.renavam} />
            <KV label="Alienado?" value={yn(veic.alienado)} />
            <KV label="Cor" value={veic.cor} />
            <KV label="Tipo de veículo" value={veic.tipoVeiculo} />
            <KV label="Segmento" value={veic.segmento} />
            <KV label="Número do motor" value={veic.numeroMotor} />
            <KV label="Potência" value={veic.potencia} />
            <KV label="Cilindradas" value={veic.cilindradas} />
            <KV label="Ano fabricação" value={veic.anoFabricacao} />
          </div>
        </CardContent>
      </Card>

      {/* Anexos (imagens) */}
      {(uploads.cnh || uploads.crv || uploads.nf) && (
        <Card>
          <CardHeader><CardTitle>Anexos</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-3">
              {uploads.cnh && (
                <a href={urls[uploads.cnh]} target="_blank" rel="noreferrer"
                   className="block rounded-md overflow-hidden border hover:shadow">
                  <img src={urls[uploads.cnh]} alt="CNH" className="w-full h-56 object-cover" />
                </a>
              )}
              {uploads.crv && (
                <a href={urls[uploads.crv]} target="_blank" rel="noreferrer"
                   className="block rounded-md overflow-hidden border hover:shadow">
                  <img src={urls[uploads.crv]} alt="CRV" className="w-full h-56 object-cover" />
                </a>
              )}
              {uploads.nf && (
                <a href={urls[uploads.nf]} target="_blank" rel="noreferrer"
                   className="block rounded-md overflow-hidden border hover:shadow">
                  <img src={urls[uploads.nf]} alt="NF" className="w-full h-56 object-cover" />
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* JSON bruto como fallback/debug (pode remover se quiser) */}
      <Card>
        <CardHeader><CardTitle>Dados completos (JSON)</CardTitle></CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-50 rounded-md p-3 overflow-auto">
            {JSON.stringify(d, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Link href="/dashboard/cotacoes" className="text-brand-teal underline">← Voltar para todas as cotações</Link>
        <Link href="/dashboard/cotacoes/auto" className="text-brand-teal underline">Nova cotação de Auto</Link>
      </div>
    </div>
  );
}
