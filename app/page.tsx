'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, Package, MessageCircle, ChevronRight, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-700 text-white rounded-xl flex items-center justify-center font-black shadow-lg">BF</div>
          <span className="font-black text-2xl tracking-tighter">BeautyFlow AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-bold text-gray-600">
           <a href="#features" className="hover:text-blue-700 transition-colors">Funcionalidades</a>
           <a href="#about" className="hover:text-blue-700 transition-colors">Sobre</a>
           <Link href="/admin" className="bg-blue-700 text-white px-6 py-3 rounded-full hover:bg-blue-800 transition-all shadow-lg shadow-blue-100">Área Admin</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
         
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
               initial={{ opacity: 0, x: -30 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               className="space-y-8"
            >
               <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                  <Sparkles size={14} /> Inteligência Artificial para Estética
               </div>
               <h1 className="text-6xl lg:text-7xl font-black text-gray-900 leading-[0.9] tracking-tighter">
                  Sua agenda <br />
                  <span className="text-blue-700">inteligente.</span>
               </h1>
               <p className="text-xl text-gray-500 max-w-lg leading-relaxed font-medium">
                  Organize seus agendamentos, controle pacotes de sessões e reative clientes inativos com o poder da IA. Perfeito para estúdios que buscam excelência.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/admin" className="bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95">
                     Vamos começar ? <ChevronRight size={24} />
                  </Link>
                  <Link href="/agendar/poli-estetica" className="bg-white border-2 border-blue-100 text-blue-700 px-10 py-5 rounded-2xl font-black text-lg hover:border-blue-300 transition-all flex items-center justify-center gap-3">
                     Ver demo pública
                  </Link>
               </div>
               <div className="flex items-center gap-4 pt-4 text-gray-400 font-medium">
                  <span className="flex items-center gap-2"><Check size={18} className="text-blue-600" /> Sem configurar API</span>
                  <span className="flex items-center gap-2"><Check size={18} className="text-blue-600" /> WhatsApp Direct</span>
               </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1 }}
               className="relative"
            >
               <div className="relative z-10 bg-white rounded-3xl p-4 shadow-2xl skew-y-2 border border-blue-50">
                  <img 
                    src="https://picsum.photos/seed/beauty/800/600" 
                    className="rounded-2xl grayscale-[0.2]" 
                    alt="Beauty Studio"
                  />
                  <div className="absolute -bottom-10 -left-10 bg-blue-900 text-white p-6 rounded-3xl shadow-xl space-y-4 max-w-[240px] -skew-y-2">
                     <p className="font-bold text-lg leading-tight">&ldquo;Aumentamos nossa taxa de retorno em 40% com as mensagens da IA.&rdquo;</p>
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-700"></div>
                        <p className="text-xs font-medium text-blue-200">Dra. Poliana, Studio Poli</p>
                     </div>
                  </div>
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-2 border-blue-100 rounded-full border-dashed rotate-45 -z-10 opacity-50"></div>
            </motion.div>
         </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-blue-50/50">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
               <h2 className="text-4xl font-black text-gray-900 tracking-tight">Tudo que seu estúdio precisa</h2>
               <p className="text-gray-500 font-medium text-lg">Criado especificamente para as dores reais de quem trabalha com beleza e estética.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <FeatureCard 
                  icon={Calendar} 
                  title="Agenda Online" 
                  desc="Seus clientes agendam pelo seu link exclusivo, sem você precisar responder no WhatsApp." 
               />
               <FeatureCard 
                  icon={Package} 
                  title="Controle de Pacotes" 
                  desc="Saiba exatamente quantas sessões restam de cada cliente. Chega de cadernos e planilhas." 
               />
               <FeatureCard 
                  icon={Sparkles} 
                  title="IA de Reativação" 
                  desc="Nossa IA identifica clientes inativos e gera mensagens personalizadas para você enviar." 
               />
               <FeatureCard 
                  icon={MessageCircle} 
                  title="WhatsApp Direct" 
                  desc="Confirmações e lembretes enviados diretamente para o seu WhatsApp, de forma simples." 
               />
            </div>
         </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-20 bg-gray-900 text-white text-center">
         <div className="max-w-2xl mx-auto space-y-8 px-6">
            <h2 className="text-4xl font-black tracking-tight">Pronta para profissionalizar seu estúdio?</h2>
            <p className="text-gray-400 font-medium">Junte-se a centenas de profissionais que já usam o BeautyFlow AI para crescer.</p>
            <Link href="/admin" className="inline-block bg-blue-700 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/50">
               Vamos começar ?
            </Link>
            <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center font-black">BF</div>
                  <span className="font-bold">BeautyFlow AI</span>
               </div>
               <p className="text-xs text-gray-500">© 2026 BeautyFlow AI. Todos os direitos reservados.</p>
            </div>
         </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
       <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-700 group-hover:text-white transition-colors">
          <Icon size={28} />
       </div>
       <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
       <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
