'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockDB } from '@/lib/db';
import { Servico, Studio } from '@/lib/types';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronRight, 
  ArrowLeft,
  CheckCircle2,
  Phone,
  User,
  Check,
  CheckCircle
} from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';

export default function PublicBookingPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [step, setStep] = useState(1);
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState({ nome: '', whatsapp: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // In mock mode we only have one studio
    setStudio(mockDB.getStudio());
    setServicos(mockDB.getServicos());
  }, [slug]);

  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  const dates = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Find or create client
      let client = mockDB.getClientes().find(c => c.whatsapp === clientInfo.whatsapp);
      if (!client) {
         client = mockDB.addCliente({
           studio_id: studio!.id,
           nome: clientInfo.nome,
           whatsapp: clientInfo.whatsapp,
           criado_em: new Date().toISOString()
         });
      }

      const bookingDate = new Date(selectedDate!);
      const [h, m] = selectedTime!.split(':');
      bookingDate.setHours(parseInt(h), parseInt(m), 0, 0);

      mockDB.addAgendamento({
         studio_id: studio!.id,
         cliente_id: client.id,
         servico_id: selectedServico!.id,
         data: bookingDate.toISOString(),
         status: 'confirmado',
         nome_cliente: client.nome,
         whatsapp_cliente: client.whatsapp,
         nome_servico: selectedServico!.nome
      });

      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-blue-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl p-10 text-center shadow-2xl border border-blue-100 dark:border-gray-700 space-y-6"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <CheckCircle size={48} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">Agendamento Realizado!</h1>
          <p className="text-gray-500 font-medium">Sua sessão de <strong>{selectedServico?.nome}</strong> está confirmada para <strong>{format(selectedDate!, "dd/MM")} às {selectedTime}</strong>.</p>
          <div className="pt-6">
             <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-4 italic">Enviamos um lembrete para seu WhatsApp</p>
             <button 
               onClick={() => window.location.reload()}
               className="w-full bg-blue-700 dark:bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-800 dark:hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 dark:shadow-none"
             >
               Voltar ao Início
             </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!studio) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 font-sans pb-20">
      {/* Dynamic Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-blue-50 dark:border-gray-800 py-10">
         <div className="max-w-3xl mx-auto px-6 text-center space-y-4">
            <div className="w-20 h-20 bg-blue-700 dark:bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto text-3xl font-black shadow-xl shadow-blue-100 dark:shadow-none">
               {studio.nome.charAt(0)}
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tighter uppercase">{studio.nome}</h1>
            <p className="text-gray-400 dark:text-gray-500 font-medium max-w-sm mx-auto">{studio.descricao}</p>
         </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 -mt-8">
         <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-blue-50 dark:border-gray-700 space-y-10">
            
            {/* Steps Indicator */}
            <div className="flex items-center justify-center gap-2">
               {[1, 2, 3].map(s => (
                  <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-12 bg-blue-700 dark:bg-blue-600' : 'w-4 bg-gray-100 dark:bg-gray-700'}`}></div>
               ))}
            </div>

            {step === 1 && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                  <div className="space-y-1">
                     <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">O que vamos fazer hoje?</h2>
                     <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Selecione o serviço que deseja agendar.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                     {servicos.map(s => (
                        <button 
                           key={s.id}
                           onClick={() => { setSelectedServico(s); setStep(2); }}
                           className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 hover:bg-white dark:hover:bg-gray-900 transition-all text-left group"
                        >
                           <div className="space-y-0.5">
                              <p className="font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight group-hover:text-blue-700 dark:group-hover:text-blue-400">{s.nome}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 font-bold flex items-center gap-1.5">
                                 <Clock size={12} /> {s.duracao} min
                              </p>
                           </div>
                           <div className="flex items-center gap-4">
                              <span className="font-black text-gray-900 dark:text-gray-100">R$ {s.preco}</span>
                              <ChevronRight className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                           </div>
                        </button>
                     ))}
                  </div>
               </div>
            )}

            {step === 2 && (
               <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-4">
                     <button onClick={() => setStep(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><ArrowLeft size={24} className="text-gray-900 dark:text-gray-100" /></button>
                     <div className="space-y-0.5">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Escolha o horário</h2>
                        <p className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">{selectedServico?.nome}</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {dates.map((date, i) => (
                           <button 
                              key={i}
                              onClick={() => setSelectedDate(date)}
                              className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center transition-all ${isSameDay(date, selectedDate || new Date(-1)) ? 'bg-blue-700 dark:bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'}`}
                           >
                              <span className="text-[10px] font-black uppercase mb-1">{format(date, 'EEE', { locale: ptBR })}</span>
                              <span className="text-2xl font-black">{format(date, 'dd')}</span>
                           </button>
                        ))}
                     </div>

                     {selectedDate && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 animate-in fade-in zoom-in-95 duration-500">
                           {times.map(t => (
                              <button 
                                 key={t}
                                 onClick={() => { setSelectedTime(t); setStep(3); }}
                                 className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${selectedTime === t ? 'bg-blue-700 dark:bg-blue-600 text-white border-blue-700 dark:border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-200 dark:hover:border-blue-500'}`}
                              >
                                 {t}
                              </button>
                           ))}
                        </div>
                     )}
                  </div>
               </div>
            )}

            {step === 3 && (
               <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-4">
                     <button onClick={() => setStep(2)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><ArrowLeft size={24} className="text-gray-900 dark:text-gray-100" /></button>
                     <div className="space-y-0.5">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Confirme seus dados</h2>
                        <p className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">{selectedServico?.nome} • {format(selectedDate!, "dd/MM")} às {selectedTime}</p>
                     </div>
                  </div>

                  <form onSubmit={handleBooking} className="space-y-6">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Seu Nome</label>
                        <input 
                           required
                           type="text"
                           placeholder="Ex: Maria Oliveira"
                           className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none rounded-2xl py-5 px-6 font-bold transition-all text-gray-900 dark:text-gray-100"
                           value={clientInfo.nome}
                           onChange={e => setClientInfo({ ...clientInfo, nome: e.target.value })}
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Seu WhatsApp</label>
                        <input 
                           required
                           type="tel"
                           placeholder="Ex: 11999999999"
                           className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none rounded-2xl py-5 px-6 font-bold transition-all text-gray-900 dark:text-gray-100"
                           value={clientInfo.whatsapp}
                           onChange={e => setClientInfo({ ...clientInfo, whatsapp: e.target.value })}
                        />
                     </div>

                     <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl space-y-4">
                        <div className="flex items-center gap-3 text-blue-900 dark:text-blue-300 font-bold">
                           <CheckCircle2 size={20} /> <span className="text-sm">Agendamento Instantâneo</span>
                        </div>
                        <p className="text-xs text-blue-700/70 dark:text-blue-400/70 font-medium">Ao clicar em confirmar, seu horário será reservado automaticamente e você receberá uma confirmação no WhatsApp.</p>
                     </div>

                     <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-700 dark:bg-blue-600 text-white font-black py-6 rounded-2xl shadow-2xl shadow-blue-100 dark:shadow-none hover:bg-blue-800 dark:hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                        {loading ? 'Processando...' : 'Confirmar Agendamento'}
                     </button>
                  </form>
               </div>
            )}
         </div>
      </main>
    </div>
  );
}
