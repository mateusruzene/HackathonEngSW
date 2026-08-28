import { equipeRepository } from '../repositories/equipeRepository.js';
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
      if (eq.projeto) {
        const projEntity = new Projeto(eq.projeto);
        const avaliacoes = await avaliacaoRepository.listarPorProjeto(eq.projeto.id);

        // Aplicação do padrão GRASP Information Expert: a entidade Projeto calcula sua média
        const notaMedia = projEntity.calcularNotaMedia(avaliacoes);

        itens.push({
          equipeId: eq.id,
          nomeEquipe: eq.nome,
          membros: eq.membros,
          projetoId: eq.projeto.id,
          projetoTitulo: eq.projeto.titulo,
          areaTematica: eq.projeto.areaTematica,
          descricaoProjeto: eq.projeto.descricao,
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
