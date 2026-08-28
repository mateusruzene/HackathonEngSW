import { db } from '../database/connection.js';

export interface ParticipanteModel {
  id: number;
  nome: string;
  email: string;
  curso: string;
  grr: string;
  createdAt?: string;
}

export class ParticipanteRepository {
  async criar(dados: { nome: string; email: string; curso: string; grr: string }): Promise<ParticipanteModel> {
    const [id] = await db('participantes').insert({
      nome: dados.nome,
      email: dados.email,
      curso: dados.curso,
      grr: dados.grr
    });
    const created = await this.buscarPorId(id);
    return created!;
  }

  async buscarPorId(id: number): Promise<ParticipanteModel | null> {
    const row = await db('participantes').where({ id }).first();
    if (!row) return null;
    return {
      id: row.id,
      nome: row.nome,
      email: row.email,
      curso: row.curso,
      grr: row.grr,
      createdAt: row.created_at
    };
  }

  async buscarPorEmailOuGrr(email: string, grr: string): Promise<ParticipanteModel | null> {
    const row = await db('participantes')
      .where('email', email)
      .orWhere('grr', grr)
      .first();
    if (!row) return null;
    return {
      id: row.id,
      nome: row.nome,
      email: row.email,
      curso: row.curso,
      grr: row.grr,
      createdAt: row.created_at
    };
  }

  async listar(): Promise<ParticipanteModel[]> {
    const rows = await db('participantes').select('*').orderBy('nome', 'asc');
    return rows.map((r: any) => ({
      id: r.id,
      nome: r.nome,
      email: r.email,
      curso: r.curso,
      grr: r.grr,
      createdAt: r.created_at
    }));
  }

  async listarPorIds(ids: number[]): Promise<ParticipanteModel[]> {
    const rows = await db('participantes').whereIn('id', ids);
    return rows.map((r: any) => ({
      id: r.id,
      nome: r.nome,
      email: r.email,
      curso: r.curso,
      grr: r.grr
    }));
  }
}

export const participanteRepository = new ParticipanteRepository();
