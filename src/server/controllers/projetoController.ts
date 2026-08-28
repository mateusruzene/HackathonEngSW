import { projetoRepository } from '../repositories/projetoRepository.js';
import { equipeRepository } from '../repositories/equipeRepository.js';
import { Projeto } from '../domain/entities.js';
import { ProjetoJaCadastradoError, RecursoNaoEncontradoError } from '../domain/errors.js';
import { RegistrarProjetoInput } from '../domain/schemas.js';

export class ProjetoController {
  async registrarProjeto(dados: RegistrarProjetoInput) {
    const { equipeId, titulo, descricao, areaTematica } = dados;

    const equipe = await equipeRepository.buscarPorId(equipeId);
    if (!equipe) {
      throw new RecursoNaoEncontradoError('Equipe');
    }

    const projetoExistente = await projetoRepository.buscarPorEquipeId(equipeId);
    if (projetoExistente) {
      throw new ProjetoJaCadastradoError(
        `A equipe "${equipe.nome}" já possui o projeto "${projetoExistente.titulo}" registrado.`
      );
    }

    const projeto = new Projeto({ equipeId, titulo, descricao, areaTematica });
    return projetoRepository.criar({
      equipeId: projeto.equipeId,
      titulo: projeto.titulo,
      descricao: projeto.descricao,
      areaTematica: projeto.areaTematica
    });
  }

  async buscarPorId(id: number) {
    const proj = await projetoRepository.buscarPorId(id);
    if (!proj) throw new RecursoNaoEncontradoError('Projeto');
    return proj;
  }

  async buscarPorEquipeId(equipeId: number) {
    return projetoRepository.buscarPorEquipeId(equipeId);
  }

  async listarPorHackathon(hackathonId: number) {
    return projetoRepository.listarPorHackathon(hackathonId);
  }

  async listarTodos() {
    return projetoRepository.listarTodos();
  }
}

export const projetoController = new ProjetoController();
