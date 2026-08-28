import { participanteRepository } from '../repositories/participanteRepository.js';
import { Participante } from '../domain/entities.js';
import { ValidacaoError, RecursoNaoEncontradoError } from '../domain/errors.js';
import { CadastrarParticipanteInput } from '../domain/schemas.js';

export class ParticipanteController {
  async cadastrarParticipante(dados: CadastrarParticipanteInput) {
    const p = new Participante(dados);

    const existente = await participanteRepository.buscarPorEmailOuGrr(p.email, p.grr);
    if (existente) {
      throw new ValidacaoError('Já existe um participante cadastrado com este e-mail ou GRR.');
    }

    return participanteRepository.criar({
      nome: p.nome,
      email: p.email,
      curso: p.curso,
      grr: p.grr
    });
  }

  async buscarPorId(id: number) {
    const p = await participanteRepository.buscarPorId(id);
    if (!p) throw new RecursoNaoEncontradoError('Participante');
    return p;
  }

  async listarParticipantes() {
    return participanteRepository.listar();
  }
}

export const participanteController = new ParticipanteController();
