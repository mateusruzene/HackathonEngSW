import { db } from '../database/connection.js';

export interface MentoriaModel {
  id: number;
  mentorId: number;
  mentorNome?: string;
  mentorEspecialidade?: string;
  equipeId: number;
  equipeNome?: string;
  hackathonId?: number;
  comentarios: string;
  dataHora: string;
  createdAt?: string;
}

export class MentoriaRepository {
  async criar(dados: { mentorId: number; equipeId: number; comentarios: string; dataHora?: string }): Promise<MentoriaModel> {
    const [id] = await db('mentorias').insert({
      mentor_id: dados.mentorId,
      equipe_id: dados.equipeId,
      comentarios: dados.comentarios,
      data_hora: dados.dataHora || new Date().toISOString()
    });
    const created = await this.buscarPorId(id);
    return created!;
  }

  async buscarPorId(id: number): Promise<MentoriaModel | null> {
    const row = await db('mentorias')
      .join('mentores', 'mentorias.mentor_id', '=', 'mentores.id')
      .join('equipes', 'mentorias.equipe_id', '=', 'equipes.id')
      .where('mentorias.id', id)
      .select(
        'mentorias.*',
        'mentores.nome as mentor_nome',
        'mentores.especialidade as mentor_especialidade',
        'equipes.nome as equipe_nome',
        'equipes.hackathon_id'
      )
      .first();

    if (!row) return null;
    return {
      id: row.id,
      mentorId: row.mentor_id,
      mentorNome: row.mentor_nome,
      mentorEspecialidade: row.mentor_especialidade,
      equipeId: row.equipe_id,
      equipeNome: row.equipe_nome,
      hackathonId: row.hackathon_id,
      comentarios: row.comentarios,
      dataHora: row.data_hora,
      createdAt: row.created_at
    };
  }

  async listarPorHackathon(hackathonId: number): Promise<MentoriaModel[]> {
    const rows = await db('mentorias')
      .join('mentores', 'mentorias.mentor_id', '=', 'mentores.id')
      .join('equipes', 'mentorias.equipe_id', '=', 'equipes.id')
      .where('equipes.hackathon_id', hackathonId)
      .select(
        'mentorias.*',
        'mentores.nome as mentor_nome',
        'mentores.especialidade as mentor_especialidade',
        'equipes.nome as equipe_nome',
        'equipes.hackathon_id'
      )
      .orderBy('mentorias.id', 'desc');

    return rows.map((r: any) => ({
      id: r.id,
      mentorId: r.mentor_id,
      mentorNome: r.mentor_nome,
      mentorEspecialidade: r.mentor_especialidade,
      equipeId: r.equipe_id,
      equipeNome: r.equipe_nome,
      hackathonId: r.hackathon_id,
      comentarios: r.comentarios,
      dataHora: r.data_hora,
      createdAt: r.created_at
    }));
  }

  async listarTodos(): Promise<MentoriaModel[]> {
    const rows = await db('mentorias')
      .join('mentores', 'mentorias.mentor_id', '=', 'mentores.id')
      .join('equipes', 'mentorias.equipe_id', '=', 'equipes.id')
      .select(
        'mentorias.*',
        'mentores.nome as mentor_nome',
        'mentores.especialidade as mentor_especialidade',
        'equipes.nome as equipe_nome',
        'equipes.hackathon_id'
      )
      .orderBy('mentorias.id', 'desc');

    return rows.map((r: any) => ({
      id: r.id,
      mentorId: r.mentor_id,
      mentorNome: r.mentor_nome,
      mentorEspecialidade: r.mentor_especialidade,
      equipeId: r.equipe_id,
      equipeNome: r.equipe_nome,
      hackathonId: r.hackathon_id,
      comentarios: r.comentarios,
      dataHora: r.data_hora,
      createdAt: r.created_at
    }));
  }
}

export const mentoriaRepository = new MentoriaRepository();
