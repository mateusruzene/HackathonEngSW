import { equipeRepository } from '../repositories/equipeRepository.js';
import { projetoRepository } from '../repositories/projetoRepository.js';
import { avaliacaoRepository } from '../repositories/avaliacaoRepository.js';
import { hackathonRepository } from '../repositories/hackathonRepository.js';
import { Projeto, ItemClassificacao } from '../domain/entities.js';
import { RecursoNaoEncontradoError } from '../domain/errors.js';

export class ClassificacaoController {
  async determinarClassificacao(hackathonId: number): Promise<ItemClassificacao[]> {
    const hackathon = await hackathonRepository.buscarPorId(hackathonId);
    if (!hackathon) {
      throw new RecursoNaoEncontradoError('Hackathon');
    }

    const equipes = await equipeRepository.listarPorHackathon(hackathonId);
    const itens: any[] = [];

    for (const eq of equipes) {
      // Busca o projeto oficial registrado pela equipe (ECU 004 / SD 007)
      const projeto = await projetoRepository.buscarPorEquipeId(eq.id) || eq.projeto;
      if (projeto) {
        const projEntity = new Projeto(projeto);
        const avaliacoes = await avaliacaoRepository.listarPorProjeto(projeto.id);

        // Aplicação do padrão GRASP Information Expert: a entidade Projeto calcula sua média
        const notaMedia = projEntity.calcularNotaMedia(avaliacoes);

        itens.push({
          equipeId: eq.id,
          nomeEquipe: eq.nome,
          membros: eq.membros,
          projetoId: projeto.id,
          projetoTitulo: projeto.titulo,
          areaTematica: projeto.areaTematica,
          descricaoProjeto: projeto.descricao,
          notaMedia,
          totalAvaliacoes: avaliacoes.length,
          avaliacoes
        });
      } else {
        itens.push({
          equipeId: eq.id,
          nomeEquipe: eq.nome,
          membros: eq.membros,
          projetoId: null,
          projetoTitulo: 'Nenhum projeto cadastrado',
          areaTematica: '-',
          descricaoProjeto: '',
          notaMedia: 0.0,
          totalAvaliacoes: 0,
          avaliacoes: []
        });
      }
    }

    // Ordenação decrescente: maior nota média primeiro, desempate por total de avaliações
    itens.sort((a, b) => {
      if (b.notaMedia !== a.notaMedia) {
        return b.notaMedia - a.notaMedia;
      }
      return b.totalAvaliacoes - a.totalAvaliacoes;
    });

    return itens.map((item, idx) => new ItemClassificacao({
      posicao: idx + 1,
      ...item
    }));
  }
}

export const classificacaoController = new ClassificacaoController();
