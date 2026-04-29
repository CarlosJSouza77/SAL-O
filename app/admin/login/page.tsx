'use client';

import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-blue-700 dark:text-blue-400 font-bold">
      Carregando...
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 text-center space-y-8 border border-blue-100 dark:border-gray-700">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto transform -rotate-6">
          <span className="text-4xl font-black">BF</span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">BeautyFlow AI</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Gestão inteligente para o seu estúdio</p>
        </div>

        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 py-4 px-6 rounded-2xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-blue-200 dark:hover:border-blue-500 transition-all shadow-sm active:scale-[0.98]"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Entrar com Google
        </button>

        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest pt-4">Acesso exclusivo para profissionais</p>
      </div>
    </div>
  );
}
