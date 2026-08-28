import { hackathonRepository } from '../repositories/hackathonRepository.js';
import { equipeRepository } from '../repositories/equipeRepository.js';
import { projetoRepository } from '../repositories/projetoRepository.js';
import { mentoriaRepository } from '../repositories/mentoriaRepository.js';
import { avaliacaoRepository } from '../repositories/avaliacaoRepository.js';
import { Hackathon } from '../domain/entities.js';
import { RecursoNaoEncontradoError } from '../domain/errors.js';
import { CriarHackathonInput } from '../domain/schemas.js';

export class HackathonController {
  async criarHackathon(dados: CriarHackathonInput) {
    const entidade = new Hackathon(dados);
    return hackathonRepository.criar({
      nome: entidade.nome,
      dataInicio: entidade.dataInicio,
      dataTermino: entidade.dataTermino,
      maxEquipes: entidade.maxEquipes,
      descricao: entidade.descricao
    });
  }

  async buscarPorId(id: number) {
    const h = await hackathonRepository.buscarPorId(id);
    if (!h) throw new RecursoNaoEncontradoError('Hackathon');
    return h;
  }

  async listarHackathons() {
    return hackathonRepository.listar();
  }

  async obterDashboard(hackathonId: number) {
    const hackathon = await this.buscarPorId(hackathonId);
    const equipes = await equipeRepository.listarPorHackathon(hackathonId);
    const projetos = await projetoRepository.listarPorHackathon(hackathonId);
    const mentorias = await mentoriaRepository.listarPorHackathon(hackathonId);
    const avaliacoes = await avaliacaoRepository.listarPorHackathon(hackathonId);

    const participanteIds = new Set<number>();
    equipes.forEach((eq) => {
      eq.membros.forEach((m) => participanteIds.add(m.id));
    });

    return {
      hackathon,
      estatisticas: {
        totalEquipes: equipes.length,
        maxEquipes: hackathon.maxEquipes,
        vagasRestantes: Math.max(0, hackathon.maxEquipes - equipes.length),
        totalParticipantesInscritos: participanteIds.size,
        totalProjetos: projetos.length,
        totalMentorias: mentorias.length,
        totalAvaliacoes: avaliacoes.length
      },
      equipes,
      projetos,
      mentorias,
      avaliacoes
    };
  }
}

export const hackathonController = new HackathonController();
