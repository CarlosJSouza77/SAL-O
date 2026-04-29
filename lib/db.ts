import { Studio, Servico, Cliente, PacoteCliente, Agendamento } from './types';

// Mock Data
const MOCK_STUDIO: Studio = {
  id: 'poli-estetica',
  nome: 'Poli Estética',
  slug: 'poli-estetica',
  email: 'grafica.cjs@gmail.com', // Logged in user email for testing
  descricao: 'Especialista em Microagulhamento, Detox e Modelagem Corporal.',
  cor_primaria: '#1d4ed8' // blue-700
};

const MOCK_SERVICOS: Servico[] = [
  { id: '1', studio_id: 'poli-estetica', nome: 'Limpeza de Pele Profunda', duracao: 60, preco: 120 },
  { id: '2', studio_id: 'poli-estetica', nome: 'Drenagem Linfática', duracao: 50, preco: 90 },
  { id: '3', studio_id: 'poli-estetica', nome: 'Massagem Relaxante', duracao: 45, preco: 100 },
  { id: '4', studio_id: 'poli-estetica', nome: 'Modeladora Corporal', duracao: 60, preco: 150 },
];

const MOCK_CLIENTES: Cliente[] = [
  { id: 'c1', studio_id: 'poli-estetica', nome: 'Ana Silva', whatsapp: '11999999999', criado_em: '2024-01-10T10:00:00Z', ultima_sessao: '2024-04-15T14:00:00Z' },
  { id: 'c2', studio_id: 'poli-estetica', nome: 'Beatriz Santos', whatsapp: '11988888888', criado_em: '2024-02-05T10:00:00Z', ultima_sessao: '2024-03-20T10:00:00Z' },
  { id: 'c3', studio_id: 'poli-estetica', nome: 'Carla Lima', whatsapp: '11977777777', criado_em: '2024-03-12T10:00:00Z', ultima_sessao: '2024-04-25T16:00:00Z' },
];

// Helper to load/save from localStorage
const STORAGE_KEY = 'beautyflow_mock_data';

interface MockDB {
  studio: Studio;
  servicos: Servico[];
  clientes: Cliente[];
  pacotes: PacoteCliente[];
  agendamentos: Agendamento[];
}

function getInitialData(): MockDB {
  if (typeof window === 'undefined') return { studio: MOCK_STUDIO, servicos: MOCK_SERVICOS, clientes: MOCK_CLIENTES, pacotes: [], agendamentos: [] };
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);

  return {
    studio: MOCK_STUDIO,
    servicos: MOCK_SERVICOS,
    clientes: MOCK_CLIENTES,
    pacotes: [
      { id: 'p1', studio_id: 'poli-estetica', cliente_id: 'c1', servico_id: '2', total_sessoes: 10, sessoes_restantes: 4, pago: true, comprado_em: '2024-03-01T10:00:00Z' }
    ],
    agendamentos: [
      { id: 'a1', studio_id: 'poli-estetica', cliente_id: 'c1', servico_id: '2', data: new Date().toISOString(), status: 'confirmado', nome_cliente: 'Ana Silva', whatsapp_cliente: '11999999999', nome_servico: 'Drenagem Linfática' }
    ]
  };
}

let db = getInitialData();

function save() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }
}

export const mockDB = {
  getStudio: () => db.studio,
  getServicos: () => db.servicos,
  getClientes: () => db.clientes,
  getCliente: (id: string) => db.clientes.find(c => c.id === id),
  getPacotes: () => db.pacotes,
  getAgendamentos: () => db.agendamentos,
  
  addCliente: (c: Omit<Cliente, 'id'>) => {
    const newC = { ...c, id: Math.random().toString(36).substr(2, 9) };
    db.clientes.push(newC);
    save();
    return newC;
  },
  
  updateCliente: (id: string, updates: Partial<Cliente>) => {
    const index = db.clientes.findIndex(c => c.id === id);
    if (index !== -1) {
      db.clientes[index] = { ...db.clientes[index], ...updates };
      save();
      return db.clientes[index];
    }
    return null;
  },
  
  addAgendamento: (a: Omit<Agendamento, 'id'>) => {
    const newA = { ...a, id: Math.random().toString(36).substr(2, 9) };
    db.agendamentos.push(newA);
    
    // Update last session
    const client = db.clientes.find(c => c.id === a.cliente_id);
    if (client) client.ultima_sessao = a.data;
    
    save();
    return newA;
  },

  addPacote: (p: Omit<PacoteCliente, 'id'>) => {
    const newP = { ...p, id: Math.random().toString(36).substr(2, 9) };
    db.pacotes.push(newP);
    save();
    return newP;
  },

  updatePacote: (id: string, updates: Partial<PacoteCliente>) => {
    const p = db.pacotes.find(x => x.id === id);
    if (p) {
      Object.assign(p, updates);
      save();
      return p;
    }
    return null;
  },

  updatePacoteSessoes: (id: string, decrement: number) => {
    const p = db.pacotes.find(x => x.id === id);
    if (p) {
      p.sessoes_restantes = Math.max(0, p.sessoes_restantes - decrement);
      save();
    }
  }
};
