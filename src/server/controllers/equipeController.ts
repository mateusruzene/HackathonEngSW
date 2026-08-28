import { equipeRepository } from '../repositories/equipeRepository.js';
import { hackathonRepository } from '../repositories/hackathonRepository.js';
import { participanteRepository } from '../repositories/participanteRepository.js';
import { Hackathon, Equipe } from '../domain/entities.js';
import { 
  HackathonLotadoError, 
  ParticipanteJaInscritoError, 
  RecursoNaoEncontradoError, 
  ValidacaoError 
} from '../domain/errors.js';
import { InscreverEquipeInput } from '../domain/schemas.js';

export class EquipeController {
  async inscreverEquipe(dados: InscreverEquipeInput) {
    const { hackathonId, nome, participanteIds } = dados;

    const hDados = await hackathonRepository.buscarPorId(hackathonId);
    if (!hDados) {
      throw new RecursoNaoEncontradoError('Hackathon');
    }

    const hackathon = new Hackathon(hDados);
    const totalAtual = await equipeRepository.contarPorHackathon(hackathonId);

    // Validação de Capacidade Máxima do Hackathon (Regra de Negócio)
    if (!hackathon.podeReceberEquipe(totalAtual)) {
      throw new HackathonLotadoError(
        `O Hackathon atingiu a capacidade máxima de ${hackathon.maxEquipes} equipes.`
      );
    }

    // Validação dos Participantes
    for (const pId of participanteIds) {
      const p = await participanteRepository.buscarPorId(pId);
      if (!p) {
        throw new RecursoNaoEncontradoError(`Participante ID ${pId}`);
      }

      const jaInscrito = await equipeRepository.participanteJaInscritoNoHackathon(hackathonId, pId);
      if (jaInscrito) {
        throw new ParticipanteJaInscritoError(
          `O participante ${p.nome} (${p.grr}) já está inscrito em outra equipe neste Hackathon.`
        );
      }
    }

    const equipe = new Equipe({ hackathonId, nome });
    const id = await equipeRepository.criar({
      hackathonId: equipe.hackathonId,
      nome: equipe.nome,
      participanteIds
    });

    return equipeRepository.buscarPorId(id);
  }

  async buscarPorId(id: number) {
    const eq = await equipeRepository.buscarPorId(id);
    if (!eq) throw new RecursoNaoEncontradoError('Equipe');
    return eq;
  }

  async listarPorHackathon(hackathonId: number) {
    return equipeRepository.listarPorHackathon(hackathonId);
  }
}

export const equipeController = new EquipeController();
