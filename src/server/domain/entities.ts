import { 
  CriarHackathonSchema, 
  CadastrarParticipanteSchema, 
  InscreverEquipeSchema, 
  RegistrarProjetoSchema, 
  RegistrarAvaliacaoSchema 
} from './schemas.js';
import { NotaInvalidaError, ValidacaoError } from './errors.js';

export interface AvaliacaoDTO {
  id?: number;
  juradoId: number;
  juradoNome?: string;
  juradoArea?: string;
  projetoId: number;
  nota: number;
  comentarios?: string;
  dataHora?: string;
}

export class Hackathon {
  id?: number;
  nome: string;
  dataInicio: string;
  dataTermino: string;
  maxEquipes: number;
  descricao: string;

  constructor(dados: { id?: number; nome: string; dataInicio: string; dataTermino: string; maxEquipes?: number; descricao?: string }) {
    const parse = CriarHackathonSchema.safeParse(dados);
    if (!parse.success) {
      throw new ValidacaoError(parse.error.errors[0]?.message || 'Dados inválidos para o Hackathon');
    }
    this.id = dados.id;
    this.nome = parse.data.nome;
    this.dataInicio = parse.data.dataInicio;
    this.dataTermino = parse.data.dataTermino;
    this.maxEquipes = parse.data.maxEquipes;
    this.descricao = parse.data.descricao;
  }

  podeReceberEquipe(totalEquipesAtual: number): boolean {
    return totalEquipesAtual < this.maxEquipes;
  }
}

export class Participante {
  id?: number;
  nome: string;
  email: string;
  curso: string;
  grr: string;

  constructor(dados: { id?: number; nome: string; email: string; curso: string; grr: string }) {
    const parse = CadastrarParticipanteSchema.safeParse(dados);
    if (!parse.success) {
      throw new ValidacaoError(parse.error.errors[0]?.message || 'Dados inválidos para o Participante');
    }
    this.id = dados.id;
    this.nome = parse.data.nome;
    this.email = parse.data.email.toLowerCase().trim();
    this.curso = parse.data.curso;
    this.grr = parse.data.grr.toUpperCase().trim();
  }
}

export class Equipe {
  id?: number;
  hackathonId: number;
  nome: string;

  constructor(dados: { id?: number; hackathonId: number; nome: string }) {
    if (!dados.hackathonId || !dados.nome) {
      throw new ValidacaoError('Hackathon ID e nome da equipe são obrigatórios');
    }
    this.id = dados.id;
    this.hackathonId = dados.hackathonId;
    this.nome = dados.nome.trim();
  }
}

export class Projeto {
  id?: number;
  equipeId: number;
  titulo: string;
  descricao: string;
  areaTematica: string;

  constructor(dados: { id?: number; equipeId: number; titulo: string; descricao: string; areaTematica: string }) {
    const parse = RegistrarProjetoSchema.safeParse(dados);
    if (!parse.success) {
      throw new ValidacaoError(parse.error.errors[0]?.message || 'Dados inválidos para o Projeto');
    }
    this.id = dados.id;
    this.equipeId = parse.data.equipeId;
    this.titulo = parse.data.titulo;
    this.descricao = parse.data.descricao;
    this.areaTematica = parse.data.areaTematica;
  }

  // Padrão GRASP Information Expert: O projeto calcula sua própria nota média
  calcularNotaMedia(avaliacoes: AvaliacaoDTO[] = []): number {
    if (!avaliacoes || avaliacoes.length === 0) {
      return 0.0;
    }
    const soma = avaliacoes.reduce((acc, av) => acc + Number(av.nota), 0);
    return Number((soma / avaliacoes.length).toFixed(2));
  }
}

export class ItemClassificacao {
  posicao: number;
  equipeId: number;
  nomeEquipe: string;
  membros?: any[];
  projetoId: number | null;
  projetoTitulo: string;
  areaTematica: string;
  descricaoProjeto: string;
  notaMedia: number;
  totalAvaliacoes: number;
  avaliacoes: AvaliacaoDTO[];

  constructor(dados: {
    posicao: number;
    equipeId: number;
    nomeEquipe: string;
    membros?: any[];
    projetoId: number | null;
    projetoTitulo: string;
    areaTematica: string;
    descricaoProjeto: string;
    notaMedia: number;
    totalAvaliacoes: number;
    avaliacoes?: AvaliacaoDTO[];
  }) {
    this.posicao = dados.posicao;
    this.equipeId = dados.equipeId;
    this.nomeEquipe = dados.nomeEquipe;
    this.membros = dados.membros || [];
    this.projetoId = dados.projetoId;
    this.projetoTitulo = dados.projetoTitulo;
    this.areaTematica = dados.areaTematica;
    this.descricaoProjeto = dados.descricaoProjeto;
    this.notaMedia = dados.notaMedia;
    this.totalAvaliacoes = dados.totalAvaliacoes;
    this.avaliacoes = dados.avaliacoes || [];
  }
}
