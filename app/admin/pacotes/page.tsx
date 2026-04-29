'use client';

import React, { useState, useEffect } from 'react';
import { mockDB } from '@/lib/db';
import { Cliente, PacoteCliente, Servico } from '@/lib/types';
import { 
  Package, 
  Search, 
  Plus, 
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Edit2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminPackagesPage() {
  const [pacotes, setPacotes] = useState<(PacoteCliente & { cliente?: Cliente, servico?: Servico })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPacote, setEditingPacote] = useState<any | null>(null);
  const [newPacote, setNewPacote] = useState({ cliente_id: '', servico_id: '', total_sessoes: 10 });

  useEffect(() => {
    setLoading(true);
    const data = mockDB.getPacotes();
    const clientes = mockDB.getClientes();
    const servicos = mockDB.getServicos();
    
    const enriched = data.map(p => ({
      ...p,
      cliente: clientes.find(c => c.id === p.cliente_id),
      servico: servicos.find(s => s.id === p.servico_id)
    }));
    
    setPacotes(enriched);
    setLoading(false);
  }, []);

  const handleAddPacote = (e: React.FormEvent) => {
    e.preventDefault();
    const added = mockDB.addPacote({
      studio_id: 'poli-estetica',
      cliente_id: newPacote.cliente_id,
      servico_id: newPacote.servico_id,
      total_sessoes: newPacote.total_sessoes,
      sessoes_restantes: newPacote.total_sessoes,
      pago: true,
      comprado_em: new Date().toISOString()
    });
    
    const clientes = mockDB.getClientes();
    const servicos = mockDB.getServicos();
    
    setPacotes([...pacotes, {
      ...added,
      cliente: clientes.find(c => c.id === added.cliente_id),
      servico: servicos.find(s => s.id === added.servico_id)
    }]);
    setShowAddModal(false);
  };

  const handleUpdatePacote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPacote) return;
    const updated = mockDB.updatePacote(editingPacote.id, {
      total_sessoes: editingPacote.total_sessoes,
      sessoes_restantes: editingPacote.sessoes_restantes
    });
    if (updated) {
      setPacotes(pacotes.map(p => p.id === updated.id ? { ...p, ...updated } : p));
      setEditingPacote(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pacotes</h1>
          <p className="text-gray-500 font-medium">Controle de sessões e vendas de pacotes</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-700 dark:bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-800 dark:hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Vender Pacote
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
           <div className="py-20 text-center text-gray-400 dark:text-gray-500">Carregando pacotes...</div>
        ) : pacotes.length === 0 ? (
           <div className="py-20 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-blue-100 dark:border-gray-700">
              Nenhum pacote vendido ainda.
           </div>
        ) : (
          pacotes.map((p) => (
            <div key={p.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-blue-50 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-200 dark:hover:border-blue-600 transition-all">
               <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                     <Package size={28} />
                  </div>
                  <div>
                     <h3 className="font-black text-gray-900 dark:text-gray-100 text-lg uppercase tracking-tight">{p.cliente?.nome}</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">{p.servico?.nome}</p>
                     <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase mt-1">Comprado em {new Date(p.comprado_em).toLocaleDateString('pt-BR')}</p>
                  </div>
               </div>

               <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                     <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Sessões Restantes</p>
                     <div className="flex items-baseline gap-1 justify-end">
                        <span className="text-3xl font-black text-blue-700 dark:text-blue-400">{p.sessoes_restantes}</span>
                        <span className="text-sm font-bold text-gray-300 dark:text-gray-600">/ {p.total_sessoes}</span>
                     </div>
                  </div>
                  <div className="w-20 h-2 bg-gray-50 dark:bg-gray-700 rounded-full overflow-hidden hidden sm:block">
                     <div 
                        className="h-full bg-blue-700 dark:bg-blue-600" 
                        style={{ width: `${(p.sessoes_restantes / p.total_sessoes) * 100}%` }}
                     ></div>
                  </div>
                  <div className="flex gap-2">
                     <button 
                       onClick={() => setEditingPacote(p)}
                       className="p-3 bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-300 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-all shadow-sm"
                       title="Editar sessões"
                     >
                        <Edit2 size={20} />
                     </button>
                     <button 
                       onClick={() => {
                           mockDB.updatePacoteSessoes(p.id, 1);
                           setPacotes(pacotes.map(x => x.id === p.id ? { ...x, sessoes_restantes: Math.max(0, x.sessoes_restantes - 1) } : x));
                       }}
                       className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-2xl hover:bg-blue-700 dark:hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                       title="Marcar sessão realizada"
                     >
                        <TrendingUp size={20} />
                     </button>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Add Package Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               transition={{ type: 'spring', damping: 20 }}
               className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-10 shadow-2xl space-y-8"
            >
               <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Nova Venda</h2>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                     <X size={24} className="text-gray-400 dark:text-gray-500" />
                  </button>
               </div>
               
               <form onSubmit={handleAddPacote} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Cliente</label>
                    <select 
                      required
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 outline-none rounded-2xl py-4 px-4 transition-all font-bold appearance-none text-gray-900 dark:text-gray-100"
                      value={newPacote.cliente_id}
                      onChange={e => setNewPacote({ ...newPacote, cliente_id: e.target.value })}
                    >
                      <option value="">Selecione um cliente</option>
                      {mockDB.getClientes().map(c => <option key={c.id} value={c.id} className="dark:bg-gray-800">{c.nome}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Serviço</label>
                    <select 
                      required
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 outline-none rounded-2xl py-4 px-4 transition-all font-bold appearance-none text-gray-900 dark:text-gray-100"
                      value={newPacote.servico_id}
                      onChange={e => setNewPacote({ ...newPacote, servico_id: e.target.value })}
                    >
                      <option value="">Selecione o serviço</option>
                      {mockDB.getServicos().map(s => <option key={s.id} value={s.id} className="dark:bg-gray-800">{s.nome}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Quantidade de Sessões</label>
                    <input 
                      type="number"
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 outline-none rounded-2xl py-4 px-4 transition-all font-bold text-gray-900 dark:text-gray-100"
                      value={newPacote.total_sessoes}
                      onChange={e => setNewPacote({ ...newPacote, total_sessoes: parseInt(e.target.value) })}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-blue-700 dark:bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none hover:bg-blue-800 dark:hover:bg-blue-700 transition-all mt-4"
                  >
                    Confirmar Venda
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Edit Package Modal */}
      <AnimatePresence>
        {editingPacote && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-10 shadow-2xl space-y-8"
            >
               <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Editar Sessões</h2>
                  <button onClick={() => setEditingPacote(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                     <X size={24} className="text-gray-400 dark:text-gray-500" />
                  </button>
               </div>
               
               <form onSubmit={handleUpdatePacote} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Restantes</label>
                      <input 
                        type="number"
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 outline-none rounded-2xl py-4 px-4 transition-all font-bold text-gray-900 dark:text-gray-100"
                        value={editingPacote.sessoes_restantes}
                        onChange={e => setEditingPacote({ ...editingPacote, sessoes_restantes: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Total</label>
                      <input 
                        type="number"
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 outline-none rounded-2xl py-4 px-4 transition-all font-bold text-gray-900 dark:text-gray-100"
                        value={editingPacote.total_sessoes}
                        onChange={e => setEditingPacote({ ...editingPacote, total_sessoes: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setEditingPacote(null)}
                      className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-black py-4 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all mt-4"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] bg-blue-700 dark:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none hover:bg-blue-800 dark:hover:bg-blue-700 transition-all mt-4"
                    >
                      Confirmar
                    </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
