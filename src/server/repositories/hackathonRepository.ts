import { db } from '../database/connection.js';

export interface HackathonModel {
  id: number;
  nome: string;
  dataInicio: string;
  dataTermino: string;
  maxEquipes: number;
  descricao: string;
  createdAt?: string;
}

export class HackathonRepository {
  async criar(dados: { nome: string; dataInicio: string; dataTermino: string; maxEquipes: number; descricao?: string }): Promise<HackathonModel> {
    const [id] = await db('hackathons').insert({
      nome: dados.nome,
      data_inicio: dados.dataInicio,
      data_termino: dados.dataTermino,
      max_equipes: dados.maxEquipes,
      descricao: dados.descricao || ''
    });
    const created = await this.buscarPorId(id);
    return created!;
  }

  async buscarPorId(id: number): Promise<HackathonModel | null> {
    const row = await db('hackathons').where({ id }).first();
    if (!row) return null;
    return {
      id: row.id,
      nome: row.nome,
      dataInicio: row.data_inicio,
      dataTermino: row.data_termino,
      maxEquipes: row.max_equipes,
      descricao: row.descricao,
      createdAt: row.created_at
    };
  }

  async listar(): Promise<HackathonModel[]> {
    const rows = await db('hackathons').select('*').orderBy('id', 'desc');
    return rows.map((r: any) => ({
      id: r.id,
      nome: r.nome,
      dataInicio: r.data_inicio,
      dataTermino: r.data_termino,
      maxEquipes: r.max_equipes,
      descricao: r.descricao,
      createdAt: r.created_at
    }));
  }
}

export const hackathonRepository = new HackathonRepository();
