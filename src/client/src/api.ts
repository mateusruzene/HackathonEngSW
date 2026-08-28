import { 
  Hackathon, 
  Participante, 
  Equipe, 
  Projeto, 
  Mentor, 
  Mentoria, 
  Jurado, 
  Avaliacao, 
  ItemClassificacao, 
  DashboardData 
} from './types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...options?.headers as any
  };

  // Se houver body e for método que envia dados, garantir Content-Type
  if (options?.body) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || 'Erro na requisição ao servidor');
  }
  return data;
}

export const api = {
  // Health
  getHealth: () => request<{ status: string; timestamp: string }>('/health'),

  // Seed / Demonstração UFPR
  carregarDemo: () => request<{ mensagem: string; hackathonId: number }>('/seed', { 
    method: 'POST',
    body: JSON.stringify({}) 
  }),

  // Hackathons
  getHackathons: () => request<Hackathon[]>('/hackathons'),
  getHackathon: (id: number) => request<Hackathon>(`/hackathons/${id}`),
  getDashboard: (id: number) => request<DashboardData>(`/hackathons/${id}/dashboard`),
  criarHackathon: (dados: { nome: string; dataInicio: string; dataTermino: string; maxEquipes: number; descricao?: string }) =>
    request<Hackathon>('/hackathons', { method: 'POST', body: JSON.stringify(dados) }),

  // Participantes
  getParticipantes: () => request<Participante[]>('/participantes'),
  cadastrarParticipante: (dados: { nome: string; email: string; curso: string; grr: string }) =>
    request<Participante>('/participantes', { method: 'POST', body: JSON.stringify(dados) }),

  // Equipes
  getEquipes: (hackathonId: number) => request<Equipe[]>(`/equipes?hackathonId=${hackathonId}`),
  inscreverEquipe: (dados: { hackathonId: number; nome: string; participanteIds: number[] }) =>
    request<Equipe>('/equipes', { method: 'POST', body: JSON.stringify(dados) }),

  // Projetos
  getProjetos: (hackathonId?: number) =>
    request<Projeto[]>(hackathonId ? `/projetos?hackathonId=${hackathonId}` : '/projetos'),
  registrarProjeto: (dados: { equipeId: number; titulo: string; descricao: string; areaTematica: string }) =>
    request<Projeto>('/projetos', { method: 'POST', body: JSON.stringify(dados) }),

  // Mentores & Mentorias
  getMentores: () => request<Mentor[]>('/mentores'),
  cadastrarMentor: (dados: { nome: string; email: string; especialidade: string }) =>
    request<Mentor>('/mentores', { method: 'POST', body: JSON.stringify(dados) }),
  getMentorias: (hackathonId?: number) =>
    request<Mentoria[]>(hackathonId ? `/mentorias?hackathonId=${hackathonId}` : '/mentorias'),
  registrarMentoria: (dados: { mentorId: number; equipeId: number; comentarios: string; dataHora?: string }) =>
    request<Mentoria>('/mentorias', { method: 'POST', body: JSON.stringify(dados) }),

  // Jurados & Avaliações
  getJurados: () => request<Jurado[]>('/jurados'),
  cadastrarJurado: (dados: { nome: string; email: string; areaAtuacao: string }) =>
    request<Jurado>('/jurados', { method: 'POST', body: JSON.stringify(dados) }),
  getAvaliacoes: (hackathonId: number) => request<Avaliacao[]>(`/avaliacoes?hackathonId=${hackathonId}`),
  registrarAvaliacao: (dados: { juradoId: number; projetoId: number; nota: number; comentarios?: string }) =>
    request<Avaliacao>('/avaliacoes', { method: 'POST', body: JSON.stringify(dados) }),

  // Ranking Final
  getRanking: (hackathonId: number) => request<ItemClassificacao[]>(`/ranking/${hackathonId}`)
};
