"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  LayoutDashboard, Car, Home, Building2, HeartPulse,
  ShieldCheck, Users, Wallet, Settings, Bell, Menu, ChevronDown, LogOut, Shield,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Item = { label: string; href: string; Icon: React.ComponentType<any> };
type Group = { label: string; Icon: React.ComponentType<any>; children: Item[] };

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cotacoesOpen, setCotacoesOpen] = useState(true);

  const primary: Item = { label: "Visão geral", href: "/dashboard", Icon: LayoutDashboard };
  const cotacoes: Group = {
    label: "Cotações",
    Icon: ShieldCheck,
    children: [
      { label: "Auto",        href: "/dashboard/cotacoes/auto",        Icon: Car },
      { label: "Residencial", href: "/dashboard/cotacoes/residencial",  Icon: Home },
      { label: "Vida",        href: "/dashboard/cotacoes/vida",         Icon: HeartPulse },
      { label: "Empresarial", href: "/dashboard/cotacoes/empresarial",  Icon: Building2 },
    ],
  };
  const singles: Item[] = [
    { label: "Apólices",      href: "/dashboard/apolices",      Icon: ShieldCheck },
    { label: "Clientes",      href: "/dashboard/clientes",      Icon: Users },
    { label: "Financeiro",    href: "/dashboard/financeiro",    Icon: Wallet },
    { label: "Configurações", href: "/dashboard/configuracoes", Icon: Settings },
  ];

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      router.push("/");
    }
  }, [router, supabase]);

  function NavLink({ item }: { item: Item }) {
    const active = pathname === item.href || pathname?.startsWith(item.href + "/");
    return (
      <Link
        href={item.href}
        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition
          ${active ? "bg-[#18697A] text-white shadow-sm" : "text-[#253134] hover:bg-black/5"}`}
        onClick={() => setSidebarOpen(false)}
      >
        <item.Icon className={`h-4 w-4 ${active ? "text-white" : "text-[#18697A]"}`} />
        <span className="font-medium">{item.label}</span>
      </Link>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-72 flex-col border-r border-black/10 bg-white/90 backdrop-blur">
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="h-10 w-10 rounded-2xl bg-[#18697A] grid place-content-center text-white">
            <Shield className="h-5 w-5" />
          </div>
        </div>

        <nav className="px-3 space-y-1">
          <NavLink item={primary} />

          <div className="mt-1">
            <button
              onClick={() => setCotacoesOpen((s) => !s)}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-[#253134] hover:bg-black/5"
            >
              <span className="inline-flex items-center gap-3">
                <cotacoes.Icon className="h-4 w-4 text-[#18697A]" />
                <span className="font-semibold">{cotacoes.label}</span>
              </span>
              <ChevronDown className={`h-4 w-4 transition ${cotacoesOpen ? "" : "-rotate-90"}`} />
            </button>
            {cotacoesOpen && (
              <div className="mt-1 ml-3 space-y-1">
                {cotacoes.children.map((c) => <NavLink key={c.href} item={c} />)}
              </div>
            )}
          </div>

          <div className="pt-1 space-y-1">
            {singles.map((s) => <NavLink key={s.href} item={s} />)}
          </div>
        </nav>

        <div className="mt-auto p-3">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Overlay + Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-72 flex-col border-r border-black/10 bg-white/95 backdrop-blur transition-transform lg:hidden
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* … (pode replicar o mesmo conteúdo da sidebar desktop) */}
      </aside>

      {/* Topbar + Conteúdo */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-black/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative max-w-md flex-1">
              <Input placeholder="Buscar cotações, clientes..." className="pl-3 pr-10 bg-white" />
              <Bell className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
