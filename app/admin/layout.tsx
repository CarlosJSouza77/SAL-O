'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';
import { 
  Calendar, 
  Users, 
  Package, 
  Sparkles, 
  Settings, 
  LogOut,
  ChevronLeft,
  Search,
  Plus
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, router, pathname]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user && pathname !== '/admin/login') return null;
  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900 flex flex-col md:flex-row font-sans text-gray-900 dark:text-gray-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 bg-white dark:bg-gray-800 border-r border-blue-50 dark:border-gray-700 flex-col p-8 space-y-10">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 text-white rounded-xl flex items-center justify-center font-black">BF</div>
            <span className="font-black text-xl tracking-tighter">BeautyFlow</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavLink href="/admin" icon={Calendar} active={pathname === '/admin'}>Agenda</NavLink>
          <NavLink href="/admin/clientes" icon={Users} active={pathname.startsWith('/admin/clientes')}>Clientes</NavLink>
          <NavLink href="/admin/pacotes" icon={Package} active={pathname.startsWith('/admin/pacotes')}>Pacotes</NavLink>
          <NavLink href="/admin/ia" icon={Sparkles} active={pathname === '/admin/ia'}>Inteligência IA</NavLink>
        </nav>

        <div className="pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-4">
          <div className="px-4 flex items-center justify-between">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Tema</span>
            <ModeToggle />
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 p-4 rounded-2xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-400 transition-all text-sm"
          >
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, icon: Icon, children, active }: { href: string, icon: any, children: React.ReactNode, active: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
        active 
          ? 'bg-blue-700 text-white shadow-xl shadow-blue-100 dark:shadow-none scale-105' 
          : 'text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      <Icon size={22} />
      <span>{children}</span>
    </Link>
  );
}
