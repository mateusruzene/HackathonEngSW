import { mentorRepository } from '../repositories/mentorRepository.js';
import { mentoriaRepository } from '../repositories/mentoriaRepository.js';
import { equipeRepository } from '../repositories/equipeRepository.js';
import { RecursoNaoEncontradoError } from '../domain/errors.js';
import { 
  CadastrarMentorInput, 
  RegistrarMentoriaInput, 
  CadastrarMentorSchema, 
  RegistrarMentoriaSchema 
} from '../domain/schemas.js';

export class MentorController {
  async cadastrarMentor(dados: CadastrarMentorInput) {
    const parse = CadastrarMentorSchema.parse(dados);
    return mentorRepository.criar(parse);
  }

  async buscarPorId(id: number) {
    const m = await mentorRepository.buscarPorId(id);
    if (!m) throw new RecursoNaoEncontradoError('Mentor');
    return m;
  }

  async listarMentores() {
    return mentorRepository.listar();
  }
}

export class MentoriaController {
  async registrarMentoria(dados: RegistrarMentoriaInput) {
    const parse = RegistrarMentoriaSchema.parse(dados);
    const mentor = await mentorRepository.buscarPorId(parse.mentorId);
    if (!mentor) {
      throw new RecursoNaoEncontradoError('Mentor');
    }

    const equipe = await equipeRepository.buscarPorId(parse.equipeId);
    if (!equipe) {
      throw new RecursoNaoEncontradoError('Equipe');
    }

    return mentoriaRepository.criar(parse);
  }

  async buscarPorId(id: number) {
    const men = await mentoriaRepository.buscarPorId(id);
    if (!men) throw new RecursoNaoEncontradoError('Mentoria');
    return men;
  }

  async listarPorHackathon(hackathonId: number) {
    return mentoriaRepository.listarPorHackathon(hackathonId);
  }

  async listarTodas() {
    return mentoriaRepository.listarTodos();
  }
}

export const mentorController = new MentorController();
export const mentoriaController = new MentoriaController();
