import { db } from '../database/connection.js';
import { ParticipanteModel } from './participanteRepository.js';

export interface EquipeModel {
  id: number;
  hackathonId: number;
  nome: string;
  createdAt?: string;
  membros: ParticipanteModel[];
  projeto?: {
    id: number;
    equipeId: number;
    titulo: string;
    descricao: string;
    areaTematica: string;
  } | null;
}

export class EquipeRepository {
  async criar(dados: { hackathonId: number; nome: string; participanteIds?: number[] }): Promise<number> {
    return db.transaction(async (trx) => {
      const [id] = await trx('equipes').insert({
        hackathon_id: dados.hackathonId,
        nome: dados.nome
      });

      if (dados.participanteIds && dados.participanteIds.length > 0) {
        const associacoes = dados.participanteIds.map((pId) => ({
          equipe_id: id,
          participante_id: pId
        }));
        await trx('equipe_participantes').insert(associacoes);
      }

      return id;
    });
  }

  async buscarPorId(id: number): Promise<EquipeModel | null> {
    const equipe = await db('equipes').where({ id }).first();
    if (!equipe) return null;

    const membros = await db('participantes')
      .join('equipe_participantes', 'participantes.id', '=', 'equipe_participantes.participante_id')
      .where('equipe_participantes.equipe_id', id)
      .select('participantes.*');

    const projeto = await db('projetos').where({ equipe_id: id }).first();

    return {
      id: equipe.id,
      hackathonId: equipe.hackathon_id,
      nome: equipe.nome,
      createdAt: equipe.created_at,
      membros: membros.map((m: any) => ({
        id: m.id,
        nome: m.nome,
        email: m.email,
        curso: m.curso,
        grr: m.grr
      })),
      projeto: projeto
        ? {
            id: projeto.id,
            equipeId: projeto.equipe_id,
            titulo: projeto.titulo,
            descricao: projeto.descricao,
            areaTematica: projeto.area_tematica
          }
        : null
    };
  }

  async listarPorHackathon(hackathonId: number): Promise<EquipeModel[]> {
    const equipes = await db('equipes').where({ hackathon_id: hackathonId }).orderBy('id', 'asc');
    const result: EquipeModel[] = [];

    for (const eq of equipes) {
      const membros = await db('participantes')
        .join('equipe_participantes', 'participantes.id', '=', 'equipe_participantes.participante_id')
        .where('equipe_participantes.equipe_id', eq.id)
        .select('participantes.*');

      const projeto = await db('projetos').where({ equipe_id: eq.id }).first();

      result.push({
        id: eq.id,
        hackathonId: eq.hackathon_id,
        nome: eq.nome,
        createdAt: eq.created_at,
        membros: membros.map((m: any) => ({
          id: m.id,
          nome: m.nome,
          email: m.email,
          curso: m.curso,
          grr: m.grr
        })),
        projeto: projeto
          ? {
              id: projeto.id,
              equipeId: eq.id,
              titulo: projeto.titulo,
              descricao: projeto.descricao,
              areaTematica: projeto.area_tematica
            }
          : null
      });
    }

    return result;
  }

  async contarPorHackathon(hackathonId: number): Promise<number> {
    const res = await db('equipes').where({ hackathon_id: hackathonId }).count('id as count').first();
    return parseInt(res?.count as string || '0', 10);
  }

  async participanteJaInscritoNoHackathon(hackathonId: number, participanteId: number): Promise<boolean> {
    const row = await db('equipes')
      .join('equipe_participantes', 'equipes.id', '=', 'equipe_participantes.equipe_id')
      .where('equipes.hackathon_id', hackathonId)
      .andWhere('equipe_participantes.participante_id', participanteId)
      .first();

    return !!row;
  }
}

export const equipeRepository = new EquipeRepository();
