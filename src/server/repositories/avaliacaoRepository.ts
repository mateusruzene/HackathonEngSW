import { db } from '../database/connection.js';

export interface AvaliacaoModel {
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
  createdAt?: string;
}

export class AvaliacaoRepository {
  async criar(dados: { juradoId: number; projetoId: number; nota: number; comentarios?: string; dataHora?: string }): Promise<AvaliacaoModel> {
    const [id] = await db('avaliacoes').insert({
      jurado_id: dados.juradoId,
      projeto_id: dados.projetoId,
      nota: dados.nota,
      comentarios: dados.comentarios || '',
      data_hora: dados.dataHora || new Date().toISOString()
    });
    const created = await this.buscarPorId(id);
    return created!;
  }

  async buscarPorId(id: number): Promise<AvaliacaoModel | null> {
    const row = await db('avaliacoes')
      .join('jurados', 'avaliacoes.jurado_id', '=', 'jurados.id')
      .join('projetos', 'avaliacoes.projeto_id', '=', 'projetos.id')
      .where('avaliacoes.id', id)
      .select(
        'avaliacoes.*',
        'jurados.nome as jurado_nome',
        'jurados.area_atuacao as jurado_area',
        'projetos.titulo as projeto_titulo',
        'projetos.equipe_id'
      )
      .first();

    if (!row) return null;
    return {
      id: row.id,
      juradoId: row.jurado_id,
      juradoNome: row.jurado_nome,
      juradoArea: row.jurado_area,
      projetoId: row.projeto_id,
      projetoTitulo: row.projeto_titulo,
      equipeId: row.equipe_id,
      nota: row.nota,
      comentarios: row.comentarios,
      dataHora: row.data_hora,
      createdAt: row.created_at
    };
  }

  async listarPorProjeto(projetoId: number): Promise<AvaliacaoModel[]> {
    const rows = await db('avaliacoes')
      .join('jurados', 'avaliacoes.jurado_id', '=', 'jurados.id')
      .where('avaliacoes.projeto_id', projetoId)
      .select(
        'avaliacoes.*',
        'jurados.nome as jurado_nome',
        'jurados.area_atuacao as jurado_area'
      )
      .orderBy('avaliacoes.id', 'asc');

    return rows.map((r: any) => ({
      id: r.id,
      juradoId: r.jurado_id,
      juradoNome: r.jurado_nome,
      juradoArea: r.jurado_area,
      projetoId: r.projeto_id,
      nota: r.nota,
      comentarios: r.comentarios,
      dataHora: r.data_hora,
      createdAt: r.created_at
    }));
  }

  async listarPorHackathon(hackathonId: number): Promise<AvaliacaoModel[]> {
    const rows = await db('avaliacoes')
      .join('jurados', 'avaliacoes.jurado_id', '=', 'jurados.id')
      .join('projetos', 'avaliacoes.projeto_id', '=', 'projetos.id')
      .join('equipes', 'projetos.equipe_id', '=', 'equipes.id')
      .where('equipes.hackathon_id', hackathonId)
      .select(
        'avaliacoes.*',
        'jurados.nome as jurado_nome',
        'jurados.area_atuacao as jurado_area',
        'projetos.titulo as projeto_titulo',
        'equipes.nome as equipe_nome',
        'equipes.id as equipe_id'
      )
      .orderBy('avaliacoes.id', 'desc');

    return rows.map((r: any) => ({
      id: r.id,
      juradoId: r.jurado_id,
      juradoNome: r.jurado_nome,
      juradoArea: r.jurado_area,
      projetoId: r.projeto_id,
      projetoTitulo: r.projeto_titulo,
      equipeId: r.equipe_id,
      equipeNome: r.equipe_nome,
      nota: r.nota,
      comentarios: r.comentarios,
      dataHora: r.data_hora,
      createdAt: r.created_at
    }));
  }
}

export const avaliacaoRepository = new AvaliacaoRepository();
