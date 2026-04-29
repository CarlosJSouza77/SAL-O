'use client';

import React, { useState, useEffect } from 'react';
import { mockDB } from '@/lib/db';
import { Cliente } from '@/lib/types';
import { 
  Users, 
  Search, 
  Phone, 
  ChevronRight,
  UserPlus,
  ArrowLeft,
  X
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminClientsListPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({ nome: '', whatsapp: '' });

  useEffect(() => {
    setLoading(true);
    // Simulate async fetch
    setTimeout(() => {
      setClientes(mockDB.getClientes());
      setLoading(false);
    }, 500);
  }, []);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.nome || !newClient.whatsapp) return;
    
    const added = mockDB.addCliente({
      studio_id: 'poli-estetica',
      nome: newClient.nome,
      whatsapp: newClient.whatsapp,
      criado_em: new Date().toISOString()
    });
    
    setClientes([...clientes, added]);
    setShowAddModal(false);
    setNewClient({ nome: '', whatsapp: '' });
  };

  const filtered = clientes.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.whatsapp.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Clientes</h1>
          <p className="text-gray-500 font-medium">Gerencie sua base de clientes e históricos</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
           <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar cliente..."
                className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-2xl py-3 pl-12 pr-6 w-full sm:w-64 outline-none focus:border-blue-500 shadow-sm transition-all text-gray-900 dark:text-gray-100"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
           <button 
             onClick={() => setShowAddModal(true)}
             className="flex items-center justify-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-800 transition-all whitespace-nowrap"
           >
             <UserPlus size={20} /> Novo Cliente
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full py-20 text-center text-gray-400 dark:text-gray-500">Carregando clientes...</div>
        ) : filtered.length === 0 ? (
           <div className="col-span-full py-20 text-center text-gray-400 dark:text-gray-500">Nenhum cliente encontrado.</div>
        ) : (
          filtered.map((c) => (
            <Link 
              key={c.id}
              href={`/admin/clientes/${c.id}`}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-blue-50 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-600 transition-all group flex items-center justify-between"
            >
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-2xl flex items-center justify-center text-xl font-black">
                     {c.nome.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                     <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">{c.nome}</h3>
                     <p className="text-xs text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1">
                        <Phone size={12} /> {c.whatsapp}
                     </p>
                  </div>
               </div>
               <ChevronRight size={24} className="text-gray-200 dark:text-gray-600 group-hover:text-blue-300 dark:group-hover:text-blue-500 transition-colors" />
            </Link>
          ))
        )}
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6"
            >
               <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Cadastrar Cliente</h2>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><X size={24} className="text-gray-400 dark:text-gray-500" /></button>
               </div>
               
               <form onSubmit={handleAddClient} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Nome Completo</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ex: Maria Oliveira"
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 outline-none rounded-2xl py-4 px-4 transition-all text-gray-900 dark:text-gray-100"
                      value={newClient.nome}
                      onChange={e => setNewClient({ ...newClient, nome: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">WhatsApp</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="Ex: 11999999999"
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 outline-none rounded-2xl py-4 px-4 transition-all text-gray-900 dark:text-gray-100"
                      value={newClient.whatsapp}
                      onChange={e => setNewClient({ ...newClient, whatsapp: e.target.value })}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none hover:bg-blue-800 transition-all mt-4"
                  >
                    Salvar Cliente
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
