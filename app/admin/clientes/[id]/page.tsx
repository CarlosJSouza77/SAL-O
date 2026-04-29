'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockDB } from '@/lib/db';
import { Cliente, Agendamento, PacoteCliente, Servico } from '@/lib/types';
import { 
  ArrowLeft, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Plus,
  ChevronRight,
  User,
  History,
  Package,
  Sparkles,
  Edit2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ClientDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [pacotes, setPacotes] = useState<(PacoteCliente & { servico?: Servico })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ nome: '', whatsapp: '' });
  const [editingPacote, setEditingPacote] = useState<PacoteCliente | null>(null);

  useEffect(() => {
    if (!id) return;
    const c = mockDB.getCliente(id);
    if (!c) {
      router.push('/admin/clientes');
      return;
    }
    setCliente(c);
    setEditForm({ nome: c.nome, whatsapp: c.whatsapp });
    
    const allA = mockDB.getAgendamentos().filter(a => a.cliente_id === id);
    setAgendamentos(allA);
    
    const servicos = mockDB.getServicos();
    const allP = mockDB.getPacotes().filter(p => p.cliente_id === id).map(p => ({
      ...p,
      servico: servicos.find(s => s.id === p.servico_id)
    }));
    setPacotes(allP);
    
    setLoading(false);
  }, [id, router]);

  const handleUpdateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente) return;
    const updated = mockDB.updateCliente(cliente.id, editForm);
    if (updated) {
      setCliente(updated);
      setIsEditModalOpen(false);
    }
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

  if (loading || !cliente) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="space-y-4">
         <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold hover:gap-3 transition-all">
            <ArrowLeft size={20} /> Voltar para clientes
         </button>
         
         <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-blue-50 dark:border-gray-700 flex flex-col md:flex-row items-center gap-8 relative group">
            <div className="w-24 h-24 bg-blue-700 dark:bg-blue-600 text-white rounded-3xl flex items-center justify-center text-4xl font-black shadow-xl shadow-blue-100 dark:shadow-none">
               {cliente.nome.charAt(0)}
            </div>
            <div className="space-y-2 flex-1 text-center md:text-left">
               <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 justify-center md:justify-start">
                  <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tighter uppercase">{cliente.nome}</h1>
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-2 text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                    title="Editar Cliente"
                  >
                    <Edit2 size={20} />
                  </button>
               </div>
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <a href={`https://wa.me/${cliente.whatsapp}`} className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 hover:text-white dark:hover:text-emerald-100 transition-all">
                     <Phone size={16} /> WhatsApp: {cliente.whatsapp}
                  </a>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-4 py-2 rounded-xl font-bold text-sm">
                     <Calendar size={16} /> Desde {new Date(cliente.criado_em).toLocaleDateString('pt-BR')}
                  </div>
               </div>
            </div>
         </div>
      </header>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 uppercase">Editar Cliente</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleUpdateClient} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input 
                    type="text" 
                    required
                    value={editForm.nome}
                    onChange={e => setEditForm({ ...editForm, nome: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl p-4 outline-none transition-all font-bold text-gray-900 dark:text-gray-100"
                    placeholder="Nome do cliente"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">WhatsApp</label>
                  <input 
                    type="text" 
                    required
                    value={editForm.whatsapp}
                    onChange={e => setEditForm({ ...editForm, whatsapp: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl p-4 outline-none transition-all font-bold text-gray-900 dark:text-gray-100"
                    placeholder="Ex: 11999999999"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-black py-4 rounded-2xl uppercase tracking-tighter hover:bg-gray-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] bg-blue-700 text-white font-black py-4 rounded-2xl uppercase tracking-tighter shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-800 transition-all"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Package Modal */}
      <AnimatePresence>
        {editingPacote && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 uppercase">Editar Sessões</h3>
                <button onClick={() => setEditingPacote(null)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleUpdatePacote} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Restantes</label>
                    <input 
                      type="number" 
                      required
                      value={editingPacote.sessoes_restantes}
                      onChange={e => setEditingPacote({ ...editingPacote, sessoes_restantes: parseInt(e.target.value) })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl p-4 outline-none transition-all font-bold text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Total</label>
                    <input 
                      type="number" 
                      required
                      value={editingPacote.total_sessoes}
                      onChange={e => setEditingPacote({ ...editingPacote, total_sessoes: parseInt(e.target.value) })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl p-4 outline-none transition-all font-bold text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setEditingPacote(null)}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-black py-4 rounded-2xl uppercase tracking-tighter hover:bg-gray-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] bg-blue-700 text-white font-black py-4 rounded-2xl uppercase tracking-tighter shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-800 transition-all"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-blue-50 dark:border-gray-700 space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
                  <History size={24} className="text-blue-700 dark:text-blue-400" /> Histórico de Sessões
               </h2>
               <span className="text-[10px] font-black uppercase text-gray-300 dark:text-gray-600 tracking-widest">{agendamentos.length} sessoes</span>
            </div>
            
            <div className="space-y-4">
               {agendamentos.length === 0 ? (
                  <p className="text-gray-400 text-center py-10">Sem sessões anteriores.</p>
               ) : (
                  agendamentos.map(a => (
                     <div key={a.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all">
                        <div className="space-y-0.5">
                           <p className="font-bold text-gray-900 dark:text-gray-100">{a.nome_servico}</p>
                           <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                              {format(new Date(a.data), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                           </p>
                        </div>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            a.status === 'concluido' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        }`}>
                           {a.status}
                        </span>
                     </div>
                  ))
               )}
            </div>
         </div>

         <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-blue-50 dark:border-gray-700 space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
                  <Package size={24} className="text-blue-700 dark:text-blue-400" /> Pacotes Ativos
               </h2>
               <button className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"><Plus size={24} /></button>
            </div>

            <div className="space-y-4">
               {pacotes.length === 0 ? (
                  <p className="text-gray-400 text-center py-10">Nenhum pacote ativo.</p>
               ) : (
                  pacotes.map(p => (
                     <div key={p.id} className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-blue-900 dark:text-blue-100">
                           <Sparkles size={60} />
                        </div>
                        <div className="space-y-0.5 relative z-10">
                           <div className="flex justify-between items-start">
                              <p className="font-black text-blue-900 dark:text-blue-200 uppercase tracking-tighter text-lg">{p.servico?.nome}</p>
                              <button 
                                onClick={() => setEditingPacote(p)}
                                className="p-1.5 text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded-lg transition-all"
                              >
                                <Edit2 size={16} />
                              </button>
                           </div>
                           <p className="text-[10px] font-black text-blue-400 dark:text-blue-500 uppercase tracking-widest">Sessões Restantes</p>
                        </div>
                        <div className="flex items-end justify-between relative z-10">
                           <div className="flex items-baseline gap-1">
                              <span className="text-5xl font-black text-blue-700 dark:text-blue-400">{p.sessoes_restantes}</span>
                              <span className="text-xl font-black text-blue-300 dark:text-blue-600">/ {p.total_sessoes}</span>
                           </div>
                           <div className="w-1/2 h-2 bg-white dark:bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-700 dark:bg-blue-600" style={{ width: `${(p.sessoes_restantes/p.total_sessoes)*100}%` }}></div>
                           </div>
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
