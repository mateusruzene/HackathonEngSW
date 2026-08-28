import { db } from '../database/connection.js';

export interface MentorModel {
  id: number;
  nome: string;
  email: string;
  especialidade: string;
  createdAt?: string;
}

export class MentorRepository {
  async criar(dados: { nome: string; email: string; especialidade: string }): Promise<MentorModel> {
    const [id] = await db('mentores').insert({
      nome: dados.nome,
      email: dados.email,
      especialidade: dados.especialidade
    });
    const created = await this.buscarPorId(id);
    return created!;
  }

  async buscarPorId(id: number): Promise<MentorModel | null> {
    const row = await db('mentores').where({ id }).first();
    if (!row) return null;
    return {
      id: row.id,
      nome: row.nome,
      email: row.email,
      especialidade: row.especialidade,
      createdAt: row.created_at
    };
  }

  async listar(): Promise<MentorModel[]> {
    const rows = await db('mentores').select('*').orderBy('nome', 'asc');
    return rows.map((r: any) => ({
      id: r.id,
      nome: r.nome,
      email: r.email,
      especialidade: r.especialidade,
      createdAt: r.created_at
    }));
  }
}

export const mentorRepository = new MentorRepository();
