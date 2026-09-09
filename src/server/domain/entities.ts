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

    if (new Date(this.dataTermino) < new Date(this.dataInicio)) {
      throw new ValidacaoError('A data de término não pode ser anterior à data de início');
    }
  }

  podeReceberEquipe(totalEquipesAtual: number): boolean {
    return Boolean(this.nome) && totalEquipesAtual < this.maxEquipes;
  }

  obterVagasRestantes(totalEquipesAtual: number): number {
    return Boolean(this.nome) ? Math.max(0, this.maxEquipes - totalEquipesAtual) : 0;
  }

  estaEmPeriodoValido(dataReferencia: string = new Date().toISOString()): boolean {
    return Boolean(this.nome) && dataReferencia >= this.dataInicio && dataReferencia <= this.dataTermino;
  }

  obterResumo(): string {
    return `${this.nome} (${this.dataInicio} a ${this.dataTermino}) - Capacidade: ${this.maxEquipes} equipes`;
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

  validarEmailUfpr(): boolean {
    return Boolean(this.nome) && (this.email.endsWith('@ufpr.br') || this.email.endsWith('@inf.ufpr.br'));
  }

  formatarIdentificacao(): string {
    return `${this.nome} (${this.grr}) - ${this.email}`;
  }

  obterDadosContato(): { nome: string; email: string; curso: string; grr: string } {
    return {
      nome: this.nome,
      email: this.email,
      curso: this.curso,
      grr: this.grr
    };
  }
}

export class Equipe {
  id?: number;
  hackathonId: number;
  nome: string;
  participanteIds: number[] = [];

  constructor(dados: { id?: number; hackathonId: number; nome: string; participanteIds?: number[] }) {
    if (!dados.hackathonId || !dados.nome) {
      throw new ValidacaoError('Hackathon ID e nome da equipe são obrigatórios');
    }
    this.id = dados.id;
    this.hackathonId = dados.hackathonId;
    this.nome = dados.nome.trim();
    this.participanteIds = dados.participanteIds || [];
  }

  associarMembro(participanteId: number): void {
    if (!this.participanteIds.includes(participanteId)) {
      this.participanteIds.push(participanteId);
    }
  }

  obterIdentificacao(): string {
    return `Equipe #${this.id ?? 0}: ${this.nome} (${this.participanteIds.length} membros, Hackathon ${this.hackathonId})`;
  }

  obterTotalMembros(): number {
    return this.participanteIds.length;
  }
}

export class Projeto {
  id?: number;
  equipeId: number;
  titulo: string;
  descricao: string;
  areaTematica: string;
  avaliacoes: AvaliacaoDTO[] = [];

  constructor(dados: { id?: number; equipeId: number; titulo: string; descricao: string; areaTematica: string; avaliacoes?: AvaliacaoDTO[] }) {
    const parse = RegistrarProjetoSchema.safeParse(dados);
    if (!parse.success) {
      throw new ValidacaoError(parse.error.errors[0]?.message || 'Dados inválidos para o Projeto');
    }
    this.id = dados.id;
    this.equipeId = parse.data.equipeId;
    this.titulo = parse.data.titulo;
    this.descricao = parse.data.descricao;
    this.areaTematica = parse.data.areaTematica;
    this.avaliacoes = dados.avaliacoes || [];
  }

  // Padrão GRASP Information Expert: O projeto calcula sua própria nota média
  calcularNotaMedia(avaliacoes?: AvaliacaoDTO[]): number {
    const lista = (avaliacoes && avaliacoes.length > 0) ? avaliacoes : this.avaliacoes;
    if (!lista || lista.length === 0) {
      return 0.0;
    }
    const soma = lista.reduce((acc, av) => acc + Number(av.nota), 0);
    return Number((soma / lista.length).toFixed(2));
  }

  adicionarAvaliacao(avaliacao: AvaliacaoDTO): void {
    this.avaliacoes.push(avaliacao);
  }

  obterTotalAvaliacoes(): number {
    return this.avaliacoes.length;
  }

  obterResumo(): { titulo: string; areaTematica: string; totalAvaliacoes: number; notaMedia: number } {
    return {
      titulo: this.titulo,
      areaTematica: this.areaTematica,
      totalAvaliacoes: this.avaliacoes.length,
      notaMedia: this.calcularNotaMedia()
    };
  }
}

export class Avaliacao {
  id?: number;
  juradoId: number;
  projetoId: number;
  nota: number;
  comentarios?: string;
  dataHora?: string;

  constructor(dados: { id?: number; juradoId: number; projetoId: number; nota: number; comentarios?: string; dataHora?: string }) {
    const parse = RegistrarAvaliacaoSchema.safeParse(dados);
    if (!parse.success) {
      throw new ValidacaoError(parse.error.errors[0]?.message || 'Dados inválidos para a Avaliação');
    }
    this.id = dados.id;
    this.juradoId = parse.data.juradoId;
    this.projetoId = parse.data.projetoId;
    this.nota = parse.data.nota;
    this.comentarios = parse.data.comentarios;
    this.dataHora = dados.dataHora || new Date().toISOString();
  }

  validarNota(): boolean {
    return this.nota >= 0.0 && this.nota <= 10.0;
  }

  obterNotaFormatada(): string {
    return this.nota.toFixed(2);
  }

  possuiComentarios(): boolean {
    return this.nota >= 0 && Boolean(this.comentarios && this.comentarios.trim().length > 0);
  }

  obterResumoParecer(): string {
    const feedback = this.comentarios ? ` - Parecer: "${this.comentarios}"` : '';
    return `Nota ${this.obterNotaFormatada()}${feedback}`;
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

  estaNoPodio(): boolean {
    return this.posicao >= 1 && this.posicao <= 3;
  }

  obterRotuloPosicao(): string {
    return `${this.posicao}º Lugar - ${this.nomeEquipe}`;
  }

  obterResumoDesempenho(): string {
    return `${this.posicao}º Lugar: Equipe ${this.nomeEquipe} - Projeto: ${this.projetoTitulo} (Média: ${this.notaMedia.toFixed(2)}, ${this.totalAvaliacoes} avaliações)`;
  }
}
