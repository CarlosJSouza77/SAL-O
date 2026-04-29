'use client';

import { useState } from 'react';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/app/providers';

export default function SeedPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const runSeed = async () => {
    if (!user) return setMessage('Logue primeiro para seedar.');
    setLoading(true);
    try {
      const studioId = 'studio-estetica-v1';
      const studioRef = doc(db, 'studios', studioId);
      
      await setDoc(studioRef, {
        nome: 'Poli Estética & Bem-estar',
        slug: 'poli-estetica',
        email: user.email,
        whatsapp: '5511999999999',
        horario_inicio: '09:00',
        horario_fim: '18:00',
        intervalo_min: 30,
        criado_em: new Date().toISOString(),
      });

      // Services
      const servicosCol = collection(db, 'studios', studioId, 'servicos');
      const services = [
        { nome: 'Limpeza de Pele Profunda', preco: 150, duracao_min: 60, ativo: true },
        { nome: 'Drenagem Linfática', preco: 120, duracao_min: 50, ativo: true },
        { nome: 'Microagulhamento', preco: 250, duracao_min: 90, ativo: true },
        { nome: 'Massagem Relaxante', preco: 100, duracao_min: 50, ativo: true },
      ];
      for (const s of services) {
        await addDoc(servicosCol, s);
      }

      // Packages
      const pacotesCol = collection(db, 'studios', studioId, 'pacotes');
      const packages = [
        { nome: 'Pacote 5x Limpeza de Pele', sessoes: 5, preco: 600, validade_dias: 90, ativo: true },
        { nome: 'Pacote 10x Drenagem', sessoes: 10, preco: 1000, validade_dias: 180, ativo: true },
      ];
      for (const p of packages) {
        await addDoc(pacotesCol, p);
      }

      setMessage('Seed concluído com sucesso!');
    } catch (error) {
      console.error(error);
      setMessage('Erro no seed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto text-center space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Seed Data</h1>
      <p className="text-gray-500 dark:text-gray-400">Isso criará o estúdio &apos;poli-estetica&apos; vinculado ao seu email.</p>
      <button 
        onClick={runSeed}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
      >
        {loading ? 'Rodando...' : 'Rodar Seed'}
      </button>
      {message && <p className="mt-4 text-sm font-medium text-green-600 dark:text-green-400">{message}</p>}
    </div>
  );
}
