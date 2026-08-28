import { juradoRepository } from '../repositories/juradoRepository.js';
import { avaliacaoRepository } from '../repositories/avaliacaoRepository.js';
import { projetoRepository } from '../repositories/projetoRepository.js';
import { RecursoNaoEncontradoError, NotaInvalidaError } from '../domain/errors.js';
import { CadastrarJuradoInput, RegistrarAvaliacaoInput, CadastrarJuradoSchema, RegistrarAvaliacaoSchema } from '../domain/schemas.js';

export class JuradoController {
  async cadastrarJurado(dados: CadastrarJuradoInput) {
    const parse = CadastrarJuradoSchema.parse(dados);
    return juradoRepository.criar(parse);
  }

  async buscarPorId(id: number) {
    const j = await juradoRepository.buscarPorId(id);
    if (!j) throw new RecursoNaoEncontradoError('Jurado');
    return j;
  }

  async listarJurados() {
    return juradoRepository.listar();
  }
}

export class AvaliacaoController {
  async registrarAvaliacao(dados: RegistrarAvaliacaoInput) {
    const parse = RegistrarAvaliacaoSchema.safeParse(dados);
    if (!parse.success) {
      throw new NotaInvalidaError(parse.error.errors[0]?.message || 'A nota de avaliação deve estar estritamente entre 0.0 e 10.0.');
    }

    const { juradoId, projetoId, nota, comentarios, dataHora } = parse.data;

    const jurado = await juradoRepository.buscarPorId(juradoId);
    if (!jurado) {
      throw new RecursoNaoEncontradoError('Jurado');
    }

    const projeto = await projetoRepository.buscarPorId(projetoId);
    if (!projeto) {
      throw new RecursoNaoEncontradoError('Projeto');
    }

    return avaliacaoRepository.criar({
      juradoId,
      projetoId,
      nota,
      comentarios,
      dataHora
    });
  }

  async buscarPorId(id: number) {
    const av = await avaliacaoRepository.buscarPorId(id);
    if (!av) throw new RecursoNaoEncontradoError('Avaliação');
    return av;
  }

  async listarPorProjeto(projetoId: number) {
    return avaliacaoRepository.listarPorProjeto(projetoId);
  }

  async listarPorHackathon(hackathonId: number) {
    return avaliacaoRepository.listarPorHackathon(hackathonId);
  }
}

export const juradoController = new JuradoController();
export const avaliacaoController = new AvaliacaoController();
