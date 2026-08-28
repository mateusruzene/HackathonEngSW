import { db } from '../database/connection.js';

export interface ProjetoModel {
  id: number;
  equipeId: number;
  equipeNome?: string;
  hackathonId?: number;
  titulo: string;
  descricao: string;
  areaTematica: string;
  createdAt?: string;
}

export class ProjetoRepository {
  async criar(dados: { equipeId: number; titulo: string; descricao: string; areaTematica: string }): Promise<ProjetoModel> {
    const [id] = await db('projetos').insert({
      equipe_id: dados.equipeId,
      titulo: dados.titulo,
      descricao: dados.descricao,
      area_tematica: dados.areaTematica
    });
    const created = await this.buscarPorId(id);
    return created!;
  }

  async buscarPorId(id: number): Promise<ProjetoModel | null> {
    const row = await db('projetos')
      .join('equipes', 'projetos.equipe_id', '=', 'equipes.id')
      .where('projetos.id', id)
      .select('projetos.*', 'equipes.nome as equipe_nome', 'equipes.hackathon_id')
      .first();

    if (!row) return null;
    return {
      id: row.id,
      equipeId: row.equipe_id,
      equipeNome: row.equipe_nome,
      hackathonId: row.hackathon_id,
      titulo: row.titulo,
      descricao: row.descricao,
      areaTematica: row.area_tematica,
      createdAt: row.created_at
    };
  }

  async buscarPorEquipeId(equipeId: number): Promise<ProjetoModel | null> {
    const row = await db('projetos')
      .join('equipes', 'projetos.equipe_id', '=', 'equipes.id')
      .where('projetos.equipe_id', equipeId)
      .select('projetos.*', 'equipes.nome as equipe_nome', 'equipes.hackathon_id')
      .first();

    if (!row) return null;
    return {
      id: row.id,
      equipeId: row.equipe_id,
      equipeNome: row.equipe_nome,
      hackathonId: row.hackathon_id,
      titulo: row.titulo,
      descricao: row.descricao,
      areaTematica: row.area_tematica,
      createdAt: row.created_at
    };
  }

  async listarPorHackathon(hackathonId: number): Promise<ProjetoModel[]> {
    const rows = await db('projetos')
      .join('equipes', 'projetos.equipe_id', '=', 'equipes.id')
      .where('equipes.hackathon_id', hackathonId)
      .select('projetos.*', 'equipes.nome as equipe_nome', 'equipes.hackathon_id');

    return rows.map((r: any) => ({
      id: r.id,
      equipeId: r.equipe_id,
      equipeNome: r.equipe_nome,
      hackathonId: r.hackathon_id,
      titulo: r.titulo,
      descricao: r.descricao,
      areaTematica: r.area_tematica,
      createdAt: r.created_at
    }));
  }

  async listarTodos(): Promise<ProjetoModel[]> {
    const rows = await db('projetos')
      .join('equipes', 'projetos.equipe_id', '=', 'equipes.id')
      .select('projetos.*', 'equipes.nome as equipe_nome', 'equipes.hackathon_id');

    return rows.map((r: any) => ({
      id: r.id,
      equipeId: r.equipe_id,
      equipeNome: r.equipe_nome,
      hackathonId: r.hackathon_id,
      titulo: r.titulo,
      descricao: r.descricao,
      areaTematica: r.area_tematica,
      createdAt: r.created_at
    }));
  }
}

export const projetoRepository = new ProjetoRepository();
