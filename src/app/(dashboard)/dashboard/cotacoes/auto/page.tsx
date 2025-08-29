"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Cleave sem SSR
const Cleave: any = dynamic(() => import("cleave.js/react"), { ssr: false });

/* =========================== */
/* Utils de máscara no módulo  */
/* =========================== */
function maskDateDDMMYYYY(raw: string) {
  let v = (raw || "").replace(/\D/g, "").slice(0, 8);
  if (v.length > 4) v = v.replace(/^(\d{2})(\d{2})(\d{1,4}).*$/, "$1/$2/$3");
  else if (v.length > 2) v = v.replace(/^(\d{2})(\d{1,2}).*$/, "$1/$2");
  return v;
}
function normalizePlaca(raw: string) {
  return (raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
}
function getValueByName(data: any, name: string) {
  if (name.includes(".")) {
    const [p, c] = name.split(".");
    return data?.[p]?.[c] ?? "";
  }
  return data?.[name] ?? "";
}
function setValueByName(prev: any, name: string, value: any) {
  if (name.includes(".")) {
    const [p, c] = name.split(".");
    return { ...prev, [p]: { ...(prev?.[p] ?? {}), [c]: value } };
  }
  return { ...prev, [name]: value };
}

/* ================================= */
/* Tipos FIPE (mesmo do seu exemplo) */
/* ================================= */
type FipeMarca = { codigo: string; nome: string };
type FipeModelo = { codigo: number; nome: string };
type FipeAno = { codigo: string; nome: string };
type FipeResultado = {
  TipoVeiculo: number;
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  SiglaCombustivel: string;
};

/* ===================================== */
/* Componentes estáveis (fora da página) */
/* ===================================== */
type Ctx = {
  formData: any;
  touched: Record<string, boolean>;
  camposDeData: string[];
  onChange: (name: string, value: any) => void;
  onTouched: (name: string) => void;
};

function FloatInput({
  ctx,
  label,
  name,
  type = "text",
  required = true,
}: {
  ctx: Ctx;
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  const val = getValueByName(ctx.formData, name);
  const isDate = ctx.camposDeData.includes(name);
  const isPlaca = name === "dadosVeiculo.placa";

  const emailInvalid =
    name === "email" &&
    ctx.touched[name] &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val || "");
  const emptyErr = required && ctx.touched[name] && !val;

  const cls = `outline-none block py-4 px-2 w-full text-base text-gray-900 bg-transparent border-0 border-b-2 ${emptyErr || emailInvalid
    ? "border-red-500 focus:border-red-600"
    : "border-gray-300 focus:border-[#18697A]"
    } focus:ring-0 peer`;

  return (
    <div className="relative z-0 w-full group">
      <input
        type={isDate ? "text" : type}
        name={name}
        id={name}
        value={val}
        onChange={(e) => {
          let v = e.target.value;
          if (isDate) v = maskDateDDMMYYYY(v);
          if (isPlaca) v = normalizePlaca(v);
          ctx.onChange(name, v); // controlado sem remount
        }}
        onBlur={() => ctx.onTouched(name)}
        placeholder=" "
        required={required}
        autoComplete={isPlaca ? "off" : undefined}
        inputMode={isDate ? "numeric" : undefined}
        className={cls}
      />
      <label
        htmlFor={name}
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-2
                 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-4
                 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>
      {emptyErr && <p className="text-red-500 text-xs mt-1">Campo obrigatório</p>}
      {emailInvalid && <p className="text-red-500 text-xs mt-1">E-mail inválido</p>}
    </div>
  );
}



function FloatSelect({
  ctx,
  label,
  name,
  options,
  required = true,
}: {
  ctx: Ctx;
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  const val = getValueByName(ctx.formData, name);
  const emptyErr = required && ctx.touched[name] && !val;

  const cls = `outline-none block py-3.5 px-2 w-full text-base text-gray-900 bg-transparent border-0 border-b-2 ${emptyErr ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-[#18697A]"
    } focus:ring-0 peer`;

  return (
    <div className="relative z-0 w-full group">
      <select
        name={name}
        id={name}
        value={val || ""}
        onChange={(e) => ctx.onChange(name, e.target.value)}
        onBlur={() => ctx.onTouched(name)}
        className={cls}
      >
        <option value="" disabled hidden />
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <label
        htmlFor={name}
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-2
                 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-4
                 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>
      {emptyErr && <p className="text-red-500 text-xs mt-1">Campo obrigatório</p>}
    </div>
  );
}

function RadioSimNao({ ctx, label, name }: { ctx: Ctx; label: string; name: string }) {
  const val = getValueByName(ctx.formData, name);
  return (
    <div className="w-full">
      <span className="block text-sm text-gray-700 font-medium mb-1">{label}</span>
      <div className="flex gap-6">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name={name}
            value="sim"
            checked={val === "sim"}
            onChange={() => ctx.onChange(name, "sim")}
            onBlur={() => ctx.onTouched(name)}
          />
          Sim
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name={name}
            value="nao"
            checked={val === "nao"}
            onChange={() => ctx.onChange(name, "nao")}
            onBlur={() => ctx.onTouched(name)}
          />
          Não
        </label>
      </div>
    </div>
  );
}

/* ================================ */
/* Página (agora só usa os estáveis) */
/* ================================ */

const steps = [
  { key: "pessoal", label: "Dados pessoais" },
  { key: "residencia", label: "Residência & perfil" },
  { key: "hist", label: "Histórico & bônus" },
  { key: "veiculo", label: "Veículo" },
] as const;

export default function CotacaoAutoPage() {
  // estado raiz
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [cpfValido, setCpfValido] = useState(true);
  const [cpfConjugeValido, setCpfConjugeValido] = useState(true);

  const [marcas, setMarcas] = useState<FipeMarca[]>([]);
  const [modelos, setModelos] = useState<FipeModelo[]>([]);
  const [anos, setAnos] = useState<FipeAno[]>([]);
  const [resultadoFipe, setResultadoFipe] = useState<FipeResultado | null>(null);
  const [marcaSelecionada, setMarcaSelecionada] = useState("");
  const [modeloSelecionado, setModeloSelecionado] = useState("");
  const [anoSelecionado, setAnoSelecionado] = useState("");
  const [fipeConfirmada, setFipeConfirmada] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const INITIAL_FORM = {
    email: "",
    celular: "",
    cpf: "",
    nomeCompleto: "",
    nrCnh: "",
    nascimento: "",
    primeiraHabilitacao: "",

    cep: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
    estadoCivil: "",
    conjugeDirige: "",
    cnhConjuge: "",
    cpfConjuge: "",
    nomeConjuge: "",
    nascimentoConjuge: "",
    habilitacaoConjuge: "",
    primeiraHabilitacaoConjuge: "",

    residencia: "",
    portao: "",
    garagemTrabalho: "",
    estudante: "",
    garagemFaculdade: "",
    usoVeiculo: "",
    finUso: "",
    visitaCliente: "",
    vezesSemana: "",

    profissao: "",
    tipoSeguro: "",
    seguradora: "",
    fimDeVigencia: "",
    nApolice: "",
    nCi: "",
    nomeSeguradora: "",
    bonus: "",
    sinistro: "",
    sinistroQtd: "",

    temFilhos: "",
    sexoFilhos: "",
    nascimentoFilhoMaisNovo: "",

    imagemCnh: null as File | null,
    imagemCnhPreview: "",

    imagemCrv: null as File | null,
    imagemCrvPreview: "",

    imagemNF: null as File | null,
    imagemNFPreview: "",

    dadosVeiculo: {
      zeroKm: "",
      faturado: "",
      previsaoSaida: "",
      placa: "",
      marca: "",
      modelo: "",
      anoFabricacao: "",
      anoModelo: "",
      renavam: "",
      alienado: "",
      cor: "",
      tipoVeiculo: "",
      segmento: "",
      numeroMotor: "",
      potencia: "",
      cilindradas: "",
      valor: "",
    },
  };

  const [formData, setFormData] = useState<any>(INITIAL_FORM);

  async function fetchRecent() {
    try {
      setLoadingRecent(true);
      const r = await fetch("/api/quotes/my?type=auto", { cache: "no-store" });
      const j = await r.json();
      setRecent(j.items || []);
    } finally {
      setLoadingRecent(false);
    }
  }

  useEffect(() => { fetchRecent(); }, []);

  // campos de data
  const camposDeData = [
    "nascimento",
    "primeiraHabilitacao",
    "nascimentoConjuge",
    "primeiraHabilitacaoConjuge",
    "nascimentoFilhoMaisNovo",
  ];

  // FIPE: carrega marcas quando entrar na etapa 3 (veículo)
  useEffect(() => {
    if (etapaAtual === 3 && marcas.length === 0) {
      fetch("https://parallelum.com.br/fipe/api/v1/carros/marcas")
        .then((r) => r.json())
        .then((data) => setMarcas(data))
        .catch(() => { });
    }
  }, [etapaAtual, marcas.length]);

  // helpers
  const marcarTocado = useCallback(
    (name: string) => setTouched((p) => ({ ...p, [name]: true })),
    []
  );

  const changeValue = useCallback((name: string, value: any) => {
    setFormData((prev: any) => setValueByName(prev, name, value));
  }, []);

  const verificarCamposObrigatorios = (): boolean => {
    const req: Record<number, string[]> = {
      0: [
        "email",
        "celular",
        "cpf",
        "nomeCompleto",
        "nascimento",
        "primeiraHabilitacao",
        "cep",
        "estadoCivil",
      ],
      1: ["residencia", "portao", "garagemTrabalho", "estudante", "usoVeiculo"],
      2: ["profissao", "tipoSeguro"],
      3: [
        "dadosVeiculo.placa",
        "dadosVeiculo.marca",
        "dadosVeiculo.modelo",
        "dadosVeiculo.anoModelo",
        "dadosVeiculo.alienado",
      ],
    };

    const campos = req[etapaAtual] ?? [];
    for (const c of campos) {
      const v = getValueByName(formData, c);
      if (!v) return false;
    }
    if (etapaAtual === 1 && formData.estudante === "sim" && !formData.garagemFaculdade) return false;
    if (etapaAtual === 2 && formData.tipoSeguro === "nao" && (!formData.seguradora || !formData.fimDeVigencia)) return false;
    if (etapaAtual === 2 && formData.sinistro === "sim" && !formData.sinistroQtd) return false;

    if (String(formData.estadoCivil).toLowerCase() === "casado" && etapaAtual === 1) {
      const c = [
        "conjugeDirige",
        "cpfConjuge",
        "nomeConjuge",
        "nascimentoConjuge",
        "habilitacaoConjuge",
        "primeiraHabilitacaoConjuge",
      ];
      for (const k of c) if (!formData[k]) return false;
      if (formData.conjugeDirige === "sim" && !formData.cnhConjuge) return false;
    }
    return true;
  };

  const setPreview = (keyFile: string, keyPreview: string, file?: File) => {
    setFormData((prev: any) => {
      if (prev[keyPreview]) URL.revokeObjectURL(prev[keyPreview]);
      return {
        ...prev,
        [keyFile]: file ?? null,
        [keyPreview]: file ? URL.createObjectURL(file) : "",
      };
    });
  };

  const buscarCep = async (cep: string) => {
    const cepLimpo = (cep || "").replace(/\D/g, "");
    if (!cepLimpo || cepLimpo.length < 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const d = await r.json();
      if (!d.erro) {
        setFormData((prev: any) => ({
          ...prev,
          logradouro: d.logradouro || "",
          bairro: d.bairro || "",
          cidade: d.localidade || "",
          estado: d.uf || "",
        }));
      } else {
        alert("CEP não encontrado.");
      }
    } catch {
      alert("Erro ao buscar CEP.");
    }
  };

  function validarCPF(cpf: string): boolean {
    cpf = (cpf || "").replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf[10]);
  }

  // FIPE handlers
  const onSelectMarca = async (codigo: string) => {
    setMarcaSelecionada(codigo);
    setModeloSelecionado("");
    setAnoSelecionado("");
    setResultadoFipe(null);
    const res = await fetch(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigo}/modelos`
    );
    const data = await res.json();
    setModelos(data.modelos);
    const nomeMarca = marcas.find((m) => m.codigo === codigo)?.nome;
    changeValue("dadosVeiculo.marca", nomeMarca || "");
  };
  const onSelectModelo = async (codModelo: string) => {
    setModeloSelecionado(codModelo);
    const res = await fetch(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelecionada}/modelos/${codModelo}/anos`
    );
    const data = await res.json();
    setAnos(data);
    const nomeModelo = modelos.find((m) => m.codigo.toString() === codModelo)?.nome;
    changeValue("dadosVeiculo.modelo", nomeModelo || "");
  };
  const onSelectAno = async (codigoAno: string) => {
    setAnoSelecionado(codigoAno);
    const res = await fetch(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelecionada}/modelos/${modeloSelecionado}/anos/${codigoAno}`
    );
    const data = await res.json();
    setResultadoFipe(data);
    changeValue("dadosVeiculo.anoModelo", data.AnoModelo?.toString?.() || "");
  };

  const buscarVeiculoPorPlaca = async () => {
    const placa = String(formData.dadosVeiculo.placa || "").toUpperCase();
    if (placa.length < 7) return alert("Digite uma placa válida.");
    alert(`(Simulação) Consulta pela placa ${placa}. Integraremos depois.`);
  };

  const avancar = () => {
    if (!verificarCamposObrigatorios()) {
      alert("Preencha todos os campos obrigatórios antes de avançar.");
      return;
    }
    setEtapaAtual((s) => Math.min(s + 1, steps.length - 1));
  };
  const voltar = () => setEtapaAtual((s) => Math.max(0, s - 1));

  const salvarCotacao = async () => {
    try {
      setSubmitting(true);
      setSubmitMsg(null);

      const fd = new FormData();
      fd.append("type", "auto");
      fd.append("payload", JSON.stringify(formData));

      if (formData.imagemCnh) fd.append("imagemCnh", formData.imagemCnh, formData.imagemCnh.name || "cnh.jpg");
      if (formData.imagemCrv) fd.append("imagemCrv", formData.imagemCrv, formData.imagemCrv.name || "crv.jpg");
      if (formData.imagemNF) fd.append("imagemNF", formData.imagemNF, formData.imagemNF.name || "nf.jpg");

      const res = await fetch("/api/quotes/auto", { method: "POST", body: fd });
      const txt = await res.text();
      let out: any = null;
      try { out = txt ? JSON.parse(txt) : null; } catch { }

      if (!res.ok) {
        setSubmitMsg(`Erro (${res.status}) ${out?.stage ? `[${out.stage}] ` : ""}${out?.error || txt || "desconhecido"}`);
        return;
      }

      setSubmitMsg(`Formulário enviado com sucesso! #${out?.id ?? "—"}`);

      // ✅ volta para a etapa 1 e zera
      setEtapaAtual(1);
      setFormData({ ...INITIAL_FORM });
      window.scrollTo({ top: 0, behavior: "smooth" });

      await fetchRecent(); // recarrega a lista abaixo
    } catch (e: any) {
      setSubmitMsg("Falha ao enviar: " + String(e?.message || e));
    } finally {
      setSubmitting(false);
    }
  };





  // ctx para os inputs estáveis
  const ctx: Ctx = {
    formData,
    touched,
    camposDeData,
    onChange: changeValue,
    onTouched: marcarTocado,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1c1c1c]">Cotação • Auto</h1>
        {submitMsg && (
          <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            {submitMsg}
          </div>
        )}
        <p className="text-sm text-gray-600">Preencha os dados e compare as seguradoras.</p>
      </div>



      {/* Stepper simples */}
      <ol className="flex items-center gap-3 overflow-x-auto pb-1">
        {steps.map((s, i) => {
          const done = i < etapaAtual;
          const active = i === etapaAtual;
          return (
            <li key={s.key} className="flex items-center">
              <div
                className={[
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm",
                  done
                    ? "bg-[#18697A] text-white"
                    : active
                      ? "bg-[#F7CD3C] text-[#553614]"
                      : "bg-white text-[#253134] border border-black/10",
                ].join(" ")}
              >
                <span
                  className={[
                    "grid h-5 w-5 place-content-center rounded-full text-xs",
                    done
                      ? "bg-white/20 text-white"
                      : active
                        ? "bg-[#553614]/10 text-[#553614]"
                        : "bg-black/5 text-[#253134]",
                  ].join(" ")}
                >
                  {i + 1}
                </span>
                <span className="whitespace-nowrap">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className="mx-2 h-px w-8 sm:w-12 bg-black/10" />}
            </li>
          );
        })}
      </ol>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">{steps[etapaAtual].label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ETAPA 1 */}
          <AnimatePresence mode="wait" initial={false}>
            {etapaAtual === 0 && (
              <motion.div
                key="etapa1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.2 }}
                className="grid gap-6 sm:grid-cols-2"
              >
                <div className="sm:col-span-2 rounded-xl bg-gradient-to-r from-[#FFF5D6] to-[#fde68a] border border-yellow-200 p-4">
                  <div className="text-sm text-[#553614]">
                    🚀 Falta pouco! Em 2 minutos você tem uma cotação personalizada.
                  </div>
                </div>

                <FloatInput ctx={ctx} label="E-mail" name="email" />

                {/* Celular (Cleave) */}
                <div className="relative z-0 w-full group">
                  <Cleave
                    name="celular"
                    value={formData.celular}
                    onChange={(e: any) => changeValue("celular", e.target.value)}
                    onBlur={() => marcarTocado("celular")}
                    options={{ delimiters: ["(", ") ", "-"], blocks: [0, 2, 5, 4], numericOnly: true }}
                    placeholder=" "
                    className={`outline-none block py-4 px-2 w-full text-base text-gray-900 bg-transparent border-0 border-b-2 ${touched["celular"] && !formData.celular
                      ? "border-red-500 focus:border-red-600"
                      : "border-gray-300 focus:border-[#18697A]"
                      } focus:ring-0 peer`}
                  />
                  <label
                    htmlFor="celular"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-2
                               peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-4
                               peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Celular
                  </label>
                  {touched["celular"] && !formData.celular && (
                    <p className="text-red-500 text-xs mt-1">Campo obrigatório</p>
                  )}
                </div>

                {/* CPF (Cleave + validação) */}
                <div className="relative z-0 w-full group">
                  <Cleave
                    name="cpf"
                    value={formData.cpf}
                    onChange={(e: any) => changeValue("cpf", e.target.value)}
                    onBlur={() => setCpfValido(validarCPF(formData.cpf))}
                    options={{ delimiters: [".", ".", "-"], blocks: [3, 3, 3, 2], numericOnly: true }}
                    placeholder=" "
                    className={`outline-none block py-4 px-2 w-full text-base text-gray-900 bg-transparent border-0 border-b-2 ${cpfValido ? "border-gray-300 focus:border-[#18697A]" : "border-red-500 focus:border-red-600"
                      } focus:ring-0 peer`}
                  />
                  <label
                    htmlFor="cpf"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-2
                               peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-4
                               peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    CPF
                  </label>
                  {!cpfValido && <span className="text-red-500 text-xs mt-1">CPF inválido</span>}
                </div>

                <FloatInput ctx={ctx} label="Nome completo" name="nomeCompleto" />
                <FloatInput ctx={ctx} label="Nº da CNH" name="nrCnh" required={false} />

                {/* Upload CNH */}
                <div className="sm:col-span-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    id="upload-cnh"
                    className="hidden"
                    onChange={(e) => setPreview("imagemCnh", "imagemCnhPreview", e.target.files?.[0] as any)}
                  />
                  <label htmlFor="upload-cnh" className="cursor-pointer text-[#18697A] font-medium">
                    Envie a imagem da CNH
                  </label>
                  {formData.imagemCnhPreview && (
                    <div className="mt-4 flex flex-col items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.imagemCnhPreview} alt="Prévia CNH" className="max-h-48 rounded-md border" />
                      <button
                        type="button"
                        onClick={() => setPreview("imagemCnh", "imagemCnhPreview")}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remover imagem
                      </button>
                    </div>
                  )}
                </div>

                <FloatInput ctx={ctx} label="Data de nascimento" name="nascimento" />
                <FloatInput ctx={ctx} label="Data da 1ª habilitação" name="primeiraHabilitacao" />

                {/* CEP (Cleave) + auto-preenchimento */}
                <div className="relative z-0 w-full group">
                  <Cleave
                    name="cep"
                    value={formData.cep}
                    onChange={(e: any) => changeValue("cep", e.target.value)}
                    onBlur={() => {
                      marcarTocado("cep");
                      buscarCep(formData.cep);
                    }}
                    options={{ delimiters: ["-"], blocks: [5, 3], numericOnly: true }}
                    placeholder=" "
                    className={`outline-none block py-4 px-2 w-full text-base text-gray-900 bg-transparent border-0 border-b-2 ${touched["cep"] && !formData.cep
                      ? "border-red-500 focus:border-red-600"
                      : "border-gray-300 focus:border-[#18697A]"
                      } focus:ring-0 peer`}
                  />
                  <label
                    htmlFor="cep"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-2
                               peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-4
                               peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    CEP da residência
                  </label>
                  {touched["cep"] && !formData.cep && (
                    <p className="text-red-500 text-xs mt-1">Campo obrigatório</p>
                  )}
                </div>

                <FloatInput ctx={ctx} label="Rua" name="logradouro" required={false} />
                <FloatInput ctx={ctx} label="Bairro" name="bairro" required={false} />
                <FloatInput ctx={ctx} label="Cidade" name="cidade" required={false} />
                <FloatInput ctx={ctx} label="Estado" name="estado" required={false} />

                <FloatSelect
                  ctx={ctx}
                  label="Estado Civil"
                  name="estadoCivil"
                  options={["Casado", "Solteiro", "Divorciado - Separado", "Viuvo/a"]}
                />

                {formData.estadoCivil === "Casado" && (
                  <>
                    <RadioSimNao ctx={ctx} label="Cônjuge dirige?" name="conjugeDirige" />
                    {formData.conjugeDirige === "sim" && (
                      <FloatInput ctx={ctx} label="CNH do Cônjuge" name="cnhConjuge" />
                    )}

                    {/* CPF cônjuge (Cleave) */}
                    <div className="relative z-0 w-full group">
                      <Cleave
                        name="cpfConjuge"
                        value={formData.cpfConjuge}
                        onChange={(e: any) => changeValue("cpfConjuge", e.target.value)}
                        onBlur={() => setCpfConjugeValido(validarCPF(formData.cpfConjuge))}
                        options={{ delimiters: [".", ".", "-"], blocks: [3, 3, 3, 2], numericOnly: true }}
                        placeholder=" "
                        className={`outline-none block py-4 px-2 w-full text-base text-gray-900 bg-transparent border-0 border-b-2 ${cpfConjugeValido ? "border-gray-300 focus:border-[#18697A]" : "border-red-500 focus:border-red-600"
                          } focus:ring-0 peer`}
                      />
                      <label
                        htmlFor="cpfConjuge"
                        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-2
                                   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-4
                                   peer-focus:scale-75 peer-focus:-translate-y-4"
                      >
                        CPF do Cônjuge
                      </label>
                      {!cpfConjugeValido && (
                        <span className="text-red-500 text-xs mt-1">CPF do cônjuge inválido</span>
                      )}
                    </div>

                    <FloatInput ctx={ctx} label="Nome do Cônjuge" name="nomeConjuge" />
                    <FloatInput ctx={ctx} label="Nascimento do Cônjuge" name="nascimentoConjuge" />
                    <FloatInput ctx={ctx} label="Validade da habilitação do cônjuge" name="habilitacaoConjuge" />
                    <FloatInput ctx={ctx} label="Primeira habilitação do cônjuge" name="primeiraHabilitacaoConjuge" />
                  </>
                )}

                <RadioSimNao ctx={ctx} label="Reside ou tem pessoas entre 18–25 anos?" name="temFilhos" />
                {formData.temFilhos === "sim" && (
                  <>
                    <FloatSelect
                      ctx={ctx}
                      label="Sexo dos residentes"
                      name="sexoFilhos"
                      options={["masculino", "feminino", "ambos"]}
                    />
                    <FloatInput
                      ctx={ctx}
                      label={formData.sexoFilhos === "ambos" ? "Nascimento do mais novo" : "Data de nascimento"}
                      name="nascimentoFilhoMaisNovo"
                    />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ETAPA 2 */}
          <AnimatePresence mode="wait" initial={false}>
            {etapaAtual === 1 && (
              <motion.div
                key="etapa2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.2 }}
                className="grid gap-6 sm:grid-cols-2"
              >
                <div className="sm:col-span-2 rounded-xl bg-blue-50 border border-blue-200 p-4 text-blue-800">
                  💡 Mais algumas informações e encontramos a melhor opção pra você.
                </div>

                <FloatSelect ctx={ctx} label="Mora em" name="residencia" options={["Apartamento", "Casa"]} />
                <FloatSelect ctx={ctx} label="Portão" name="portao" options={["Automatico", "Manual"]} />
                <RadioSimNao ctx={ctx} label="Garagem fechada no trabalho?" name="garagemTrabalho" />
                <RadioSimNao ctx={ctx} label="Estuda?" name="estudante" />
                {formData.estudante === "sim" && (
                  <RadioSimNao ctx={ctx} label="Garagem fechada na faculdade?" name="garagemFaculdade" />
                )}

                <FloatSelect
                  ctx={ctx}
                  label="Uso do veículo"
                  name="usoVeiculo"
                  options={["Particular", "Comercial", "Aplicativo"]}
                />

                {formData.usoVeiculo === "Comercial" && (
                  <>
                    <FloatInput ctx={ctx} label="Finalidade do uso" name="finUso" />
                    <RadioSimNao ctx={ctx} label="Visita Cliente?" name="visitaCliente" />
                  </>
                )}

                {formData.visitaCliente === "sim" && (
                  <FloatSelect
                    ctx={ctx}
                    label="Quantas vezes por semana?"
                    name="vezesSemana"
                    options={["1", "2", "3 ou mais"]}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ETAPA 3 */}
          <AnimatePresence mode="wait" initial={false}>
            {etapaAtual === 2 && (
              <motion.div
                key="etapa3"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.2 }}
                className="grid gap-6 sm:grid-cols-2"
              >
                <div className="sm:col-span-2 rounded-xl bg-blue-50 border border-blue-200 p-4">
                  Esses dados ajudam a melhorar o preço e a proposta.
                </div>

                <FloatInput ctx={ctx} label="Profissão" name="profissao" />
                <RadioSimNao ctx={ctx} label="Seguro novo?" name="tipoSeguro" />

                {formData.tipoSeguro === "nao" && (
                  <>
                    <FloatSelect
                      ctx={ctx}
                      label="Seguradora anterior"
                      name="seguradora"
                      options={[
                        "1 - Allianz",
                        "2 - Azul",
                        "3 - Bradesco",
                        "4 - HDI",
                        "5 - ITAÚ",
                        "6 - Porto Seguro",
                        "7 - Tókio Marine",
                        "8 - Yelum",
                        "9 - Zurich",
                        "10 - Outra",
                      ]}
                    />
                    {formData.seguradora === "10 - Outra" && (
                      <FloatInput ctx={ctx} label="Qual o nome?" name="nomeSeguradora" />
                    )}
                    <FloatInput ctx={ctx} label="Fim de vigência" name="fimDeVigencia" />
                    <FloatInput ctx={ctx} label="nº da apólice" name="nApolice" />
                    <FloatInput ctx={ctx} label="nº da CI" name="nCi" />
                    <FloatSelect
                      ctx={ctx}
                      label="Classe de bônus atual"
                      name="bonus"
                      options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
                    />
                  </>
                )}

                <RadioSimNao ctx={ctx} label="Houve sinistro?" name="sinistro" />
                {formData.sinistro === "sim" && (
                  <FloatSelect
                    ctx={ctx}
                    label="Quantidade de sinistros"
                    name="sinistroQtd"
                    options={["1", "2", "3 ou mais"]}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ETAPA 4 */}
          <AnimatePresence mode="wait" initial={false}>
            {etapaAtual === 3 && (
              <motion.div
                key="etapa4"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">Último passo! 🚀</div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <RadioSimNao ctx={ctx} label="Veículo é 0 km?" name="dadosVeiculo.zeroKm" />
                  {formData.dadosVeiculo.zeroKm === "sim" && (
                    <RadioSimNao ctx={ctx} label="Foi faturado?" name="dadosVeiculo.faturado" />
                  )}

                  {formData.dadosVeiculo.faturado === "sim" && (
                    <>
                      {/* Upload NF */}
                      <div className="sm:col-span-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          id="upload-nf"
                          className="hidden"
                          onChange={(e) => setPreview("imagemNF", "imagemNFPreview", e.target.files?.[0] as any)}
                        />
                        <label htmlFor="upload-nf" className="cursor-pointer text-[#18697A] font-medium">
                          Envie a imagem da Nota Fiscal
                        </label>
                        {formData.imagemNFPreview && (
                          <div className="mt-4 flex flex-col items-center gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={formData.imagemNFPreview} alt="NF" className="max-h-48 rounded-md border" />
                            <button
                              type="button"
                              onClick={() => setPreview("imagemNF", "imagemNFPreview")}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Remover imagem
                            </button>
                          </div>
                        )}
                      </div>
                      <FloatInput ctx={ctx} label="Previsão de saída" name="dadosVeiculo.previsaoSaida" />
                    </>
                  )}

                  {formData.dadosVeiculo.zeroKm !== "sim" && (
                    <>
                      <FloatInput ctx={ctx} label="Placa" name="dadosVeiculo.placa" />
                      <div className="flex items-end">
                        <Button variant="outline" className="rounded-lg" onClick={buscarVeiculoPorPlaca}>
                          Buscar pela placa (simulação)
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Upload CRV */}
                  <div className="sm:col-span-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      id="upload-crv"
                      className="hidden"
                      onChange={(e) => setPreview("imagemCrv", "imagemCrvPreview", e.target.files?.[0] as any)}
                    />
                    <label htmlFor="upload-crv" className="cursor-pointer text-[#18697A] font-medium">
                      Envie a imagem do CRLV (DUT)
                    </label>
                    {formData.imagemCrvPreview && (
                      <div className="mt-4 flex flex-col items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={formData.imagemCrvPreview} alt="CRV" className="max-h-48 rounded-md border" />
                        <button
                          type="button"
                          onClick={() => setPreview("imagemCrv", "imagemCrvPreview")}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remover imagem
                        </button>
                      </div>
                    )}
                  </div>

                  {/* FIPE */}
                  <div className="grid gap-6 sm:grid-cols-2 sm:col-span-2">
                    <div>
                      <Label className="mb-1 block text-sm text-gray-600">Marca</Label>
                      <select
                        value={marcaSelecionada}
                        onChange={(e) => onSelectMarca(e.target.value)}
                        className="w-full h-10 rounded-md border border-black/10 px-3 bg-white"
                      >
                        <option value="">Selecione</option>
                        {marcas.map((m) => (
                          <option key={m.codigo} value={m.codigo}>
                            {m.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    {!!marcaSelecionada && (
                      <div>
                        <Label className="mb-1 block text-sm text-gray-600">Modelo</Label>
                        <select
                          value={modeloSelecionado}
                          onChange={(e) => onSelectModelo(e.target.value)}
                          className="w-full h-10 rounded-md border border-black/10 px-3 bg-white"
                        >
                          <option value="">Selecione</option>
                          {modelos.map((m) => (
                            <option key={m.codigo} value={m.codigo}>
                              {m.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {!!modeloSelecionado && (
                      <div>
                        <Label className="mb-1 block text-sm text-gray-600">Ano</Label>
                        <select
                          value={anoSelecionado}
                          onChange={(e) => onSelectAno(e.target.value)}
                          className="w-full h-10 rounded-md border border-black/10 px-3 bg-white"
                        >
                          <option value="">Selecione</option>
                          {anos.map((a) => (
                            <option key={a.codigo} value={a.codigo}>
                              {a.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {resultadoFipe && (
                    <div className="sm:col-span-2 rounded-lg border border-black/10 p-4 bg-gray-50">
                      <div className="text-sm text-gray-800">
                        <div>
                          <span className="font-medium">Modelo:</span> {resultadoFipe.Modelo}
                        </div>
                        <div>
                          <span className="font-medium">Valor:</span> {resultadoFipe.Valor}
                        </div>
                      </div>
                      {!fipeConfirmada ? (
                        <div className="mt-4 flex gap-3">
                          <Button
                            className="bg-[#18697A] hover:bg-[#155E6D] text-white rounded-lg"
                            onClick={() => {
                              setFipeConfirmada(true);
                              changeValue("dadosVeiculo.valor", resultadoFipe.Valor);
                            }}
                          >
                            Confirmar
                          </Button>
                          <Button
                            variant="destructive"
                            className="rounded-lg"
                            onClick={() => {
                              setMarcaSelecionada("");
                              setModeloSelecionado("");
                              setAnoSelecionado("");
                              setResultadoFipe(null);
                              setFipeConfirmada(false);
                              changeValue("dadosVeiculo.marca", "");
                              changeValue("dadosVeiculo.modelo", "");
                              changeValue("dadosVeiculo.anoModelo", "");
                              changeValue("dadosVeiculo.valor", "");
                            }}
                          >
                            Não é esse
                          </Button>
                        </div>
                      ) : (
                        <p className="text-green-600 text-sm mt-2">Dados confirmados ✅</p>
                      )}
                    </div>
                  )}

                  <RadioSimNao ctx={ctx} label="Alienado/Financiado?" name="dadosVeiculo.alienado" />
                  <FloatInput ctx={ctx} label="Quem indicou?" name="quemIndicou" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navegação */}
          <div className="flex justify-between">
            <Button variant="outline" className="rounded-xl" onClick={voltar} disabled={etapaAtual === 0}>
              Voltar
            </Button>
            {etapaAtual < steps.length - 1 ? (
              <Button className="bg-[#18697A] hover:bg-[#155E6D] text-white rounded-xl" onClick={avancar}>
                Avançar
              </Button>
            ) : (
              <button
                type="button"
                onClick={salvarCotacao}
                disabled={submitting}
                className="bg-green-600 disabled:opacity-60 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition ml-auto"
              >
                {submitting ? "Enviando..." : "ENVIAR"}
              </button>

            )}
          </div>
        </CardContent>
      </Card>
      <section className="max-w-5xl mx-auto mt-12">
        <h2 className="text-2xl font-semibold mb-4">Minhas últimas cotações de Auto</h2>

        {loadingRecent && <p className="text-gray-500">Carregando…</p>}

        {!loadingRecent && recent.length === 0 && (
          <p className="text-gray-500">Você ainda não possui cotações.</p>
        )}

        {!loadingRecent && recent.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {recent.map((q) => (
              <Link
                key={q.id}
                href={`/dashboard/cotacoes/${q.id}`}
                className="rounded-xl border bg-white shadow-sm p-4 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">
                    #{String(q.id).slice(0, 8)} • {q.customer_name || "Sem nome"}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border text-gray-700">
                    {q.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {q.vehicle_plate || "—"} • {q.vehicle_model || "—"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(q.created_at).toLocaleString("pt-BR")}
                </p>

                {(q.uploads?.cnhUrl || q.uploads?.crvUrl || q.uploads?.nfUrl) && (
                  <div className="mt-3 grid grid-cols-3 gap-2 pointer-events-none">
                    {q.uploads?.cnhUrl && <img src={q.uploads.cnhUrl} alt="CNH" className="h-24 w-full object-cover rounded-md border" />}
                    {q.uploads?.crvUrl && <img src={q.uploads.crvUrl} alt="CRV" className="h-24 w-full object-cover rounded-md border" />}
                    {q.uploads?.nfUrl && <img src={q.uploads.nfUrl} alt="NF" className="h-24 w-full object-cover rounded-md border" />}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
