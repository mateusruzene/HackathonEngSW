import { db } from '../database/connection.js';

export interface JuradoModel {
  id: number;
  nome: string;
  email: string;
  areaAtuacao: string;
  createdAt?: string;
}

export class JuradoRepository {
  async criar(dados: { nome: string; email: string; areaAtuacao: string }): Promise<JuradoModel> {
    const [id] = await db('jurados').insert({
      nome: dados.nome,
      email: dados.email,
      area_atuacao: dados.areaAtuacao
    });
    const created = await this.buscarPorId(id);
    return created!;
  }

  async buscarPorId(id: number): Promise<JuradoModel | null> {
    const row = await db('jurados').where({ id }).first();
    if (!row) return null;
    return {
      id: row.id,
      nome: row.nome,
      email: row.email,
      areaAtuacao: row.area_atuacao,
      createdAt: row.created_at
    };
  }

  async listar(): Promise<JuradoModel[]> {
    const rows = await db('jurados').select('*').orderBy('nome', 'asc');
    return rows.map((r: any) => ({
      id: r.id,
      nome: r.nome,
      email: r.email,
      areaAtuacao: r.area_atuacao,
      createdAt: r.created_at
    }));
  }
}

export const juradoRepository = new JuradoRepository();
