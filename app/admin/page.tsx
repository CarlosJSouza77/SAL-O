'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { mockDB } from '@/lib/db';
import { Cliente, Agendamento } from '@/lib/types';
import { format, startOfDay, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Phone,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [stats, setStats] = useState({ hoje: 0, concluidos: 0, novos: 0 });

  useEffect(() => {
    const all = mockDB.getAgendamentos();
    const filtered = all.filter(a => isSameDay(new Date(a.data), selectedDate));
    setAgendamentos(filtered);

    // Calc simple stats for today
    const active = all.filter(a => isSameDay(new Date(a.data), new Date()));
    setStats({
      hoje: active.length,
      concluidos: active.filter(a => a.status === 'concluido').length,
      novos: mockDB.getClientes().filter(c => isSameDay(new Date(c.criado_em), new Date())).length
    });
  }, [selectedDate]);

  const changeStatus = (id: string, status: Agendamento['status']) => {
    const all = mockDB.getAgendamentos();
    const item = all.find(a => a.id === id);
    if (item) {
      item.status = status;
      // In a real app we'd save to DB
      setAgendamentos([...all.filter(a => isSameDay(new Date(a.data), selectedDate))]);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Agendamentos Hoje" value={stats.hoje} icon={CalendarIcon} color="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" />
        <StatCard title="Concluídos" value={stats.concluidos} icon={CheckCircle2} color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" />
        <StatCard title="Novos Clientes" value={stats.novos} icon={Users} color="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Calendar Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-blue-50 dark:border-gray-700">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Calendário</h2>
                <div className="flex gap-1">
                   <button onClick={() => setSelectedDate(addDays(selectedDate, -1))} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors text-gray-400"><ChevronLeft size={20} /></button>
                   <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors text-gray-400"><ChevronRight size={20} /></button>
                </div>
             </div>
             
             <div className="space-y-2">
                <div className="text-center py-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                   <p className="text-xs font-black text-blue-400 uppercase tracking-widest">{format(selectedDate, 'MMMM', { locale: ptBR })}</p>
                   <p className="text-4xl font-black text-blue-700 dark:text-blue-400">{format(selectedDate, 'dd')}</p>
                   <p className="text-sm font-bold text-blue-900/60 dark:text-blue-200/60">{format(selectedDate, 'EEEE', { locale: ptBR })}</p>
                </div>
             </div>
          </div>
          
          <button className="w-full bg-gray-900 dark:bg-blue-700 text-white p-6 rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
             <Plus size={24} /> Novo Agendamento
          </button>
        </div>

        {/* Agenda Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Agendamentos</h2>
            <div className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-blue-50 dark:border-gray-700">
               {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </div>
          </div>

          <div className="space-y-4">
             {agendamentos.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center border-2 border-dashed border-blue-100 dark:border-gray-700 text-gray-400">
                   <p className="font-bold">Nenhum agendamento para este dia.</p>
                </div>
             ) : (
                agendamentos.map((item) => (
                   <motion.div 
                     layout
                     key={item.id}
                     className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-blue-50 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-6 group hover:border-blue-200 dark:hover:border-blue-800 transition-all"
                   >
                      <div className="flex items-center gap-6 w-full">
                         <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl flex flex-col items-center justify-center border border-gray-100 dark:border-gray-600 group-hover:bg-blue-700 group-hover:text-white transition-all">
                            <Clock size={20} className="mb-0.5" />
                            <span className="text-xs font-black">{format(new Date(item.data), 'HH:mm')}</span>
                         </div>
                         <div className="space-y-1">
                            <h3 className="font-black text-gray-900 dark:text-gray-100 text-lg leading-tight">{item.nome_cliente}</h3>
                            <p className="text-sm text-blue-700 dark:text-blue-400 font-bold flex items-center gap-1.5">
                               <Sparkles size={14} /> {item.nome_servico}
                            </p>
                            <div className="flex items-center gap-3 pt-1">
                               <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                  item.status === 'confirmado' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                  item.status === 'concluido' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                                  'bg-gray-100 dark:bg-gray-700 text-gray-500'
                               }`}>
                                  {item.status}
                               </span>
                               <a href={`https://wa.me/${item.whatsapp_cliente}`} target="_blank" className="text-emerald-500 hover:text-emerald-600">
                                  <Phone size={14} />
                               </a>
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex gap-2 w-full sm:w-auto">
                         {item.status !== 'concluido' && (
                           <button 
                             onClick={() => changeStatus(item.id, 'concluido')}
                             className="flex-1 sm:flex-none px-6 py-3 bg-emerald-50 text-emerald-700 font-black text-xs rounded-2xl hover:bg-emerald-700 hover:text-white transition-all"
                           >
                             Concluir
                           </button>
                         )}
                         <a 
                           href={`https://wa.me/${item.whatsapp_cliente.replace(/\D/g, '')}`}
                           target="_blank"
                           className="flex-1 sm:flex-none p-3 bg-gray-50 hover:bg-blue-100 text-blue-700 rounded-2xl transition-all flex items-center justify-center"
                         >
                            <MessageCircle size={20} />
                         </a>
                      </div>
                   </motion.div>
                ))
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-blue-50 dark:border-gray-700 flex items-center gap-6">
       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon size={24} />
       </div>
       <div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-black text-gray-900 dark:text-gray-100">{value}</p>
       </div>
    </div>
  );
}
