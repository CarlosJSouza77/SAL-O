export interface Studio {
  id: string;
  nome: string;
  slug: string;
  email: string;
  descricao?: string;
  foto_perfil?: string;
  cor_primaria?: string; // Default blue-700
}

export interface Servico {
  id: string;
  studio_id: string;
  nome: string;
  duracao: number; // em minutos
  preco: number;
}

export interface Cliente {
  id: string;
  studio_id: string;
  nome: string;
  whatsapp: string;
  criado_em: string;
  ultima_sessao?: string;
}

export interface PacoteCliente {
  id: string;
  studio_id: string;
  cliente_id: string;
  servico_id: string;
  total_sessoes: number;
  sessoes_restantes: number;
  pago: boolean;
  comprado_em: string;
}

export interface Agendamento {
  id: string;
  studio_id: string;
  cliente_id: string;
  servico_id: string;
  data: string; // ISO String
  status: 'confirmado' | 'pendente' | 'cancelado' | 'concluido';
  whatsapp_cliente: string;
  nome_cliente: string;
  nome_servico: string;
}
