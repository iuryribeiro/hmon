"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, UserPlus, LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AuthPage() {
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();

    const [showPassword, setShowPassword] = useState(false);
    const [mode, setMode] = useState<"login" | "signup">("login");

    // estados de formulário
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError(null);

        if (mode === "signup") {
            if (!fullName.trim()) return setFormError("Informe seu nome completo.");
            if (password !== confirm) return setFormError("As senhas não conferem.");
        }

        setLoading(true);
        try {
            if (mode === "login") {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;

                // checa assinatura
                const { data: userRes } = await supabase.auth.getUser();
                const uid = userRes.user?.id;
                if (!uid) throw new Error("Usuário não encontrado após login.");

                const { data: isActive, error: rpcError } = await supabase.rpc("is_subscription_active", { uid });
                if (rpcError) throw rpcError;

                // redireciona conforme status
                if (isActive) router.push("/dashboard");
                else router.push("/billing");
            } else {
                // signup com metadata (gatilha o handle_new_user no DB)
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName },
                        // se você usa confirmação de e-mail, pode setar:
                        // emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;

                // opcional: se confirmação de e-mail estiver ativa, avise usuário
                // aqui vamos apenas jogar para /dashboard se a sessão vier válida,
                // senão pedir para verificar o e-mail.
                const { data: sess } = await supabase.auth.getSession();
                if (sess.session) {
                    // cria sessão imediata (quando confirm email está off)
                    const { data: userRes } = await supabase.auth.getUser();
                    const uid = userRes.user?.id!;
                    const { data: isActive } = await supabase.rpc("is_subscription_active", { uid });
                    if (isActive) router.push("/dashboard");
                    else router.push("/billing");
                } else {
                    router.push(`/check-email?email=${encodeURIComponent(email)}`); // crie essa página simples orientando confirmar o e-mail
                }
            }
        } catch (err: any) {
            setFormError(err?.message ?? "Erro inesperado. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen w-full bg-brand-cream flex">
            {/* Painel esquerdo (branding) */}
            <aside className="hidden lg:flex relative w-[46%] items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,#228EA6_0%,#2FA4C5_22%,#3AAAD1_44%,#553614_56%,#FFF2DC_72%,#F7CD3C_100%)] opacity-15" />
                    <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_0%_100%,#2FA4C5_0%,transparent_60%)] opacity-20" />
                    <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_100%_0%,#F7CD3C_0%,transparent_60%)] opacity-15" />
                </div>

                <div className="relative z-10 mx-auto max-w-xl p-12">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-brand-tealDark grid place-content-center shadow-lg shadow-black/10">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold tracking-tight text-brand-brown">hmon</span>
                    </div>

                    <p className="mt-6 text-gray-800 text-lg/7">
                        Plataforma de <span className="text-[#18697A] font-semibold">multicálculo</span> de seguros com foco em
                        <span className="text-brand-brown font-semibold"> agilidade</span> e
                        <span className="text-brand-gold font-semibold"> precisão</span>.
                    </p>
                </div>
            </aside>

            {/* Painel do formulário */}
            <section className="flex-1 grid place-items-center p-6">
                <div className="w-full max-w-md">
                    {/* TOGGLE */}
                    {/* TOGGLE SUPERIOR */}
                    <div className="mb-8 flex items-center justify-end">
                        <div className="flex rounded-full bg-white px-1 p-1 shadow-sm border border-black/10">
                            {/* Entrar */}
                            <button
                                type="button"
                                onClick={() => setMode("login")}
                                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${mode === "login" ? "bg-[#18697A] text-white" : "text-[#553614] hover:text-black"
                                    }`}
                            >
                                <LogIn className={`h-4 w-4 ${mode === "login" ? "text-white" : "text-[#18697A]"}`} />
                                Entrar
                            </button>

                            {/* Criar conta */}
                            <button
                                type="button"
                                onClick={() => setMode("signup")}
                                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${mode === "signup" ? "bg-[#F7CD3C] text-[#553614]" : "text-[#553614] hover:text-black"
                                    }`}
                            >
                                <UserPlus className={`h-4 w-4 ${mode === "signup" ? "text-[#553614]" : "text-[#8F6B24]"}`} />
                                Criar conta
                            </button>
                        </div>
                    </div>


                    <Card className="border border-black/10 shadow-xl shadow-black/10 rounded-2xl bg-white">
                        <CardHeader>
                            <CardTitle className="text-xl text-gray-900">
                                {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {formError && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                        {formError}
                                    </div>
                                )}

                                {mode === "signup" && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-gray-800">Nome completo</Label>
                                        <Input
                                            id="name"
                                            placeholder="Seu nome"
                                            className="placeholder:text-gray-600 text-gray-900"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-gray-800">E-mail</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="voce@exemplo.com"
                                            className="pl-9 placeholder:text-gray-600 text-gray-900"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-gray-800">Senha</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pl-9 pr-10 placeholder:text-gray-600 text-gray-900"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            aria-label="Mostrar senha"
                                            onClick={() => setShowPassword((s) => !s)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-black/5"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4 text-gray-600" /> : <Eye className="h-4 w-4 text-gray-600" />}
                                        </button>
                                    </div>
                                </div>

                                {mode === "signup" && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="confirm" className="text-gray-800">Confirmar senha</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <Input
                                                id="confirm"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="pl-9 pr-10 placeholder:text-gray-600 text-gray-900"
                                                value={confirm}
                                                onChange={(e) => setConfirm(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                aria-label="Mostrar senha"
                                                onClick={() => setShowPassword((s) => !s)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-black/5"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4 text-gray-600" /> : <Eye className="h-4 w-4 text-gray-600" />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full h-11 rounded-xl text-base font-medium shadow-sm transition ${mode === "login"
                                            ? "bg-[#18697A] hover:bg-[#155E6D] text-white"
                                            : "bg-[#F7CD3C] text-brand-brown hover:bg-[#e7be33]"
                                        } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                                >
                                    {loading ? "Aguarde..." : (
                                        mode === "login" ? (
                                            <span className="inline-flex items-center gap-2">
                                                Entrar <ArrowRight className="h-4 w-4" />
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2">
                                                Criar conta <ArrowRight className="h-4 w-4" />
                                            </span>
                                        )
                                    )}
                                </Button>

                                {mode === "login" && (
                                    <div className="flex items-center justify-between text-sm">
                                        <a href="#" className="text-[#18697A] hover:underline">Esqueci minha senha</a>
                                        <button type="button" onClick={() => setMode("signup")} className="text-brand-brown hover:underline">
                                            Criar sua conta
                                        </button>
                                    </div>
                                )}

                                {mode === "signup" && (
                                    <div className="flex items-center justify-center text-sm">
                                        <span className="text-gray-700">Já tem conta?</span>
                                        <button type="button" onClick={() => setMode("login")} className="ml-2 text-[#18697A] hover:underline">
                                            Entrar
                                        </button>
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>

                    <p className="mt-6 text-center text-xs text-gray-600">
                        © {new Date().getFullYear()} hmon. Todos os direitos reservados.
                    </p>
                </div>
            </section>
        </main>
    );
}
