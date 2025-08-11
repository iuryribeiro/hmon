"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Car, Home, Building2, HeartPulse, ShieldCheck, Users, Wallet,
  Settings, Bell, Menu, ChevronDown, LogOut, Shield
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Item = { label: string; href: string; icon: any };
type Group = { label: string; icon: any; children: Item[] };

const primary: Item = { label: "Visão geral", href: "/dashboard", icon: LayoutDashboard };
const cotacoes: Group = {
  label: "Cotações",
  icon: ShieldCheck,
  children: [
    { label: "Auto",         href: "/dashboard/cotacoes/auto",         icon: Car },
    { label: "Residencial",  href: "/dashboard/cotacoes/residencial",   icon: Home },
    { label: "Vida",         href: "/dashboard/cotacoes/vida",          icon: HeartPulse },
    { label: "Empresarial",  href: "/dashboard/cotacoes/empresarial",   icon: Building2 },
  ],
};
const singles: Item[] = [
  { label: "Apólices",     href: "/dashboard/apolices",     icon: ShieldCheck },
  { label: "Clientes",     href: "/dashboard/clientes",     icon: Users },
  { label: "Financeiro",   href: "/dashboard/financeiro",   icon: Wallet },
  { label: "Configurações",href: "/dashboard/configuracoes",icon: Settings },
];

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cotacoesOpen, setCotacoesOpen] = useState(true);

  const NavLink = ({ item }: { item: Item }) => {
    const active = pathname === item.href || pathname?.startsWith(item.href + "/");
    return (
      <Link
        href={item.href}
        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition
          ${active
            ? "bg-[#18697A] text-white shadow-sm"
            : "text-[#253134] hover:bg-black/5"
          }`}
        onClick={() => setSidebarOpen(false)}
      >
        <item.icon className={`h-4 w-4 ${active ? "text-white" : "text-[#18697A]"}`} />
        <span className="font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-72 flex-col border-r border-black/10 bg-white/90 backdrop-blur">
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="h-10 w-10 rounded-2xl bg-[#18697A] grid place-content-center text-white">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#553614]">hmon</span>
        </div>

        <nav className="px-3 space-y-1">
          <NavLink item={primary} />

          {/* Grupo Cotações */}
          <div className="mt-1">
            <button
              onClick={() => setCotacoesOpen((s) => !s)}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-[#253134] hover:bg-black/5"
            >
              <span className="inline-flex items-center gap-3">
                <cotacoes.icon className="h-4 w-4 text-[#18697A]" />
                <span className="font-semibold">{cotacoes.label}</span>
              </span>
              <ChevronDown className={`h-4 w-4 transition ${cotacoesOpen ? "" : "-rotate-90"}`} />
            </button>
            {cotacoesOpen && (
              <div className="mt-1 ml-3 space-y-1">
                {cotacoes.children.map((c) => (
                  <NavLink key={c.href} item={c} />
                ))}
              </div>
            )}
          </div>

          <div className="pt-1 space-y-1">
            {singles.map((s) => <NavLink key={s.href} item={s} />)}
          </div>
        </nav>

        <div className="mt-auto p-3">
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Sidebar (Mobile Drawer) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-72 flex-col border-r border-black/10 bg-white/95 backdrop-blur transition-transform lg:hidden
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="h-10 w-10 rounded-2xl bg-[#18697A] grid place-content-center text-white">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#553614]">hmon</span>
        </div>
        <nav className="px-3 pb-6 space-y-1 overflow-y-auto">
          <NavLink item={primary} />
          <div className="mt-1">
            <button
              onClick={() => setCotacoesOpen((s) => !s)}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-[#253134] hover:bg-black/5"
            >
              <span className="inline-flex items-center gap-3">
                <cotacoes.icon className="h-4 w-4 text-[#18697A]" />
                <span className="font-semibold">{cotacoes.label}</span>
              </span>
              <ChevronDown className={`h-4 w-4 transition ${cotacoesOpen ? "" : "-rotate-90"}`} />
            </button>
            {cotacoesOpen && (
              <div className="mt-1 ml-3 space-y-1">
                {cotacoes.children.map((c) => (
                  <NavLink key={c.href} item={c} />
                ))}
              </div>
            )}
          </div>
          {singles.map((s) => <NavLink key={s.href} item={s} />)}
        </nav>
      </aside>

      {/* Topbar + Conteúdo */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-black/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative max-w-md flex-1">
              <Input
                placeholder="Buscar cotações, clientes..."
                className="pl-3 pr-10 bg-white"
              />
              <Bell className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right leading-tight">
                <div className="text-sm font-medium text-[#253134]">Bem-vindo</div>
                <div className="text-xs text-gray-500">HMON</div>
              </div>
              <div className="h-9 w-9 rounded-full bg-[#F7CD3C] text-[#553614] grid place-content-center font-semibold">
                HM
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
