export interface Hackathon {
  id: number;
  nome: string;
  dataInicio: string;
  dataTermino: string;
  maxEquipes: number;
  descricao: string;
  createdAt?: string;
}

export interface Participante {
  id: number;
  nome: string;
  email: string;
  curso: string;
  grr: string;
}

export interface Equipe {
  id: number;
  hackathonId: number;
  nome: string;
  createdAt?: string;
  membros: Participante[];
  projeto?: {
    id: number;
    equipeId: number;
    titulo: string;
    descricao: string;
    areaTematica: string;
  } | null;
}

export interface Projeto {
  id: number;
  equipeId: number;
  equipeNome?: string;
  hackathonId?: number;
  titulo: string;
  descricao: string;
  areaTematica: string;
}

export interface Mentor {
  id: number;
  nome: string;
  email: string;
  especialidade: string;
}

export interface Mentoria {
  id: number;
  mentorId: number;
  mentorNome?: string;
  mentorEspecialidade?: string;
  equipeId: number;
  equipeNome?: string;
  hackathonId?: number;
  comentarios: string;
  dataHora: string;
}

export interface Jurado {
  id: number;
  nome: string;
  email: string;
  areaAtuacao: string;
}

export interface Avaliacao {
  id: number;
  juradoId: number;
  juradoNome?: string;
  juradoArea?: string;
  projetoId: number;
  projetoTitulo?: string;
  equipeId?: number;
  equipeNome?: string;
  nota: number;
  comentarios: string;
  dataHora: string;
}

export interface ItemClassificacao {
  posicao: number;
  equipeId: number;
  nomeEquipe: string;
  membros: Participante[];
  projetoId: number | null;
  projetoTitulo: string;
  areaTematica: string;
  descricaoProjeto: string;
  notaMedia: number;
  totalAvaliacoes: number;
  avaliacoes: Avaliacao[];
}

export interface DashboardData {
  hackathon: Hackathon;
  estatisticas: {
    totalEquipes: number;
    maxEquipes: number;
    vagasRestantes: number;
    totalParticipantesInscritos: number;
    totalProjetos: number;
    totalMentorias: number;
    totalAvaliacoes: number;
  };
  equipes: Equipe[];
  projetos: Projeto[];
  mentorias: Mentoria[];
  avaliacoes: Avaliacao[];
}
