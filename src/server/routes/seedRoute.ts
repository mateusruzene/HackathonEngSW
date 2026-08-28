import { db } from '../database/connection.js';
import { hackathonRepository } from '../repositories/hackathonRepository.js';
import { participanteRepository } from '../repositories/participanteRepository.js';
import { equipeRepository } from '../repositories/equipeRepository.js';
import { projetoRepository } from '../repositories/projetoRepository.js';
import { mentorRepository } from '../repositories/mentorRepository.js';
import { mentoriaRepository } from '../repositories/mentoriaRepository.js';
import { juradoRepository } from '../repositories/juradoRepository.js';
import { avaliacaoRepository } from '../repositories/avaliacaoRepository.js';

export async function seedData() {
  await db('avaliacoes').del();
  await db('mentorias').del();
  await db('projetos').del();
  await db('equipe_participantes').del();
  await db('equipes').del();
  await db('participantes').del();
  await db('hackathons').del();
  await db('mentores').del();
  await db('jurados').del();

  // 1. Hackathon
  const hackathon = await hackathonRepository.criar({
    nome: 'Hackathon DInf UFPR 2026/1',
    dataInicio: '2026-09-01',
    dataTermino: '2026-09-03',
    maxEquipes: 5,
    descricao: 'Maratona acadêmica de desenvolvimento e inovação em software do Departamento de Informática da UFPR.'
  });

  // 2. Participantes
  const p1 = await participanteRepository.criar({
    nome: 'Mateus Siqueira Ruzene',
    email: 'msr22@inf.ufpr.br',
    curso: 'Ciência da Computação',
    grr: 'GRR20221223'
  });

  const p2 = await participanteRepository.criar({
    nome: 'Gabriel Claudino de Souza',
    email: 'gcs21@inf.ufpr.br',
    curso: 'Ciência da Computação',
    grr: 'GRR20215730'
  });

  const p3 = await participanteRepository.criar({
    nome: 'Ana Clara Mendes',
    email: 'acm23@inf.ufpr.br',
    curso: 'Informática Biomédica',
    grr: 'GRR20234512'
  });

  const p4 = await participanteRepository.criar({
    nome: 'Lucas Pinheiro',
    email: 'lp22@inf.ufpr.br',
    curso: 'Ciência da Computação',
    grr: 'GRR20228891'
  });

  const p5 = await participanteRepository.criar({
    nome: 'Beatriz Rocha',
    email: 'br21@inf.ufpr.br',
    curso: 'Engenharia de Software',
    grr: 'GRR20213344'
  });

  const p6 = await participanteRepository.criar({
    nome: 'Carlos Eduardo Lima',
    email: 'cel23@inf.ufpr.br',
    curso: 'Ciência da Computação',
    grr: 'GRR20231122'
  });

  // 3. Equipes
  const eq1Id = await equipeRepository.criar({
    hackathonId: hackathon.id,
    nome: 'ByteCraft UFPR',
    participanteIds: [p1.id, p2.id]
  });

  const eq2Id = await equipeRepository.criar({
    hackathonId: hackathon.id,
    nome: 'BioData Labs',
    participanteIds: [p3.id, p5.id]
  });

  const eq3Id = await equipeRepository.criar({
    hackathonId: hackathon.id,
    nome: 'DevKernel',
    participanteIds: [p4.id, p6.id]
  });

  // 4. Projetos
  const proj1 = await projetoRepository.criar({
    equipeId: eq1Id,
    titulo: 'EcoTrack UFPR - Monitoramento de Sustentabilidade no Campus',
    descricao: 'Plataforma IoT e web para coleta em tempo real e análise de métricas de eficiência energética e resíduos no campus Centro Politécnico.',
    areaTematica: 'Sustentabilidade e IoT'
  });

  const proj2 = await projetoRepository.criar({
    equipeId: eq2Id,
    titulo: 'BioPredict - Diagnóstico Assistido por IA de Patologias Raras',
    descricao: 'Sistema inteligente de apoio à decisão clínica para triagem de dados laboratoriais usando redes neurais e visão computacional.',
    areaTematica: 'Saúde e Inteligência Artificial'
  });

  const proj3 = await projetoRepository.criar({
    equipeId: eq3Id,
    titulo: 'SmartLab DInf - Agendamento e Gestão de Recursos de Hardware',
    descricao: 'Solução automatizada para reserva de bancadas e controle de acesso a servidores de alto desempenho no Departamento de Informática.',
    areaTematica: 'Cidades Inteligentes e Cloud'
  });

  // 5. Mentores
  const m1 = await mentorRepository.criar({
    nome: 'Prof. Diego Addan',
    email: 'diego.addan@inf.ufpr.br',
    especialidade: 'Engenharia de Software e Padrões GRASP'
  });

  const m2 = await mentorRepository.criar({
    nome: 'Dra. Camila Santos',
    email: 'camila.santos@ufpr.br',
    especialidade: 'Inteligência Artificial e Bioinformática'
  });

  // 6. Mentorias
  await mentoriaRepository.criar({
    mentorId: m1.id,
    equipeId: eq1Id,
    comentarios: 'Excelente modelagem em camadas e divisão de responsabilidades com GRASP. Sugerido enriquecer os endpoints com métricas em tempo real.',
    dataHora: '2026-09-02T14:30:00Z'
  });

  await mentoriaRepository.criar({
    mentorId: m2.id,
    equipeId: eq2Id,
    comentarios: 'Revisão dos hiperparâmetros do modelo preditivo e validação dos dados clínicos sintéticos com sucesso.',
    dataHora: '2026-09-02T16:00:00Z'
  });

  // 7. Jurados
  const j1 = await juradoRepository.criar({
    nome: 'Prof. Marcos Silva',
    email: 'marcos.silva@inf.ufpr.br',
    areaAtuacao: 'Sistemas Distribuídos e Redes'
  });

  const j2 = await juradoRepository.criar({
    nome: 'Profa. Letícia Albuquerque',
    email: 'leticia.a@ufpr.br',
    areaAtuacao: 'Interação Humano-Computador e UX'
  });

  const j3 = await juradoRepository.criar({
    nome: 'Dr. Fernando Costa',
    email: 'fernando.costa@tech.org',
    areaAtuacao: 'Inovação e Mercado de Tecnologia'
  });

  // 8. Avaliações
  await avaliacaoRepository.criar({
    juradoId: j1.id,
    projetoId: proj1.id,
    nota: 9.8,
    comentarios: 'Excelente domínio de arquitetura de software e alta aplicabilidade prática para o campus.',
    dataHora: '2026-09-03T17:00:00Z'
  });
  await avaliacaoRepository.criar({
    juradoId: j2.id,
    projetoId: proj1.id,
    nota: 9.5,
    comentarios: 'Interface muito intuitiva, design limpo e ótima experiência de uso.',
    dataHora: '2026-09-03T17:15:00Z'
  });
  await avaliacaoRepository.criar({
    juradoId: j3.id,
    projetoId: proj1.id,
    nota: 9.6,
    comentarios: 'Solução madura, modelo de negócio viável e pitch muito bem estruturado.',
    dataHora: '2026-09-03T17:30:00Z'
  });

  await avaliacaoRepository.criar({
    juradoId: j1.id,
    projetoId: proj2.id,
    nota: 9.2,
    comentarios: 'Ótima base algorítmica e boa integração com a camada de dados.',
    dataHora: '2026-09-03T17:05:00Z'
  });
  await avaliacaoRepository.criar({
    juradoId: j2.id,
    projetoId: proj2.id,
    nota: 9.0,
    comentarios: 'Visualização dos dados médicos clara e acessível aos profissionais de saúde.',
    dataHora: '2026-09-03T17:20:00Z'
  });
  await avaliacaoRepository.criar({
    juradoId: j3.id,
    projetoId: proj2.id,
    nota: 9.1,
    comentarios: 'Grande potencial de impacto social na área médica.',
    dataHora: '2026-09-03T17:35:00Z'
  });

  await avaliacaoRepository.criar({
    juradoId: j1.id,
    projetoId: proj3.id,
    nota: 8.6,
    comentarios: 'Boa automação dos recursos computacionais.',
    dataHora: '2026-09-03T17:10:00Z'
  });
  await avaliacaoRepository.criar({
    juradoId: j2.id,
    projetoId: proj3.id,
    nota: 8.4,
    comentarios: 'Fluxo funcional e direto ao ponto.',
    dataHora: '2026-09-03T17:25:00Z'
  });
  await avaliacaoRepository.criar({
    juradoId: j3.id,
    projetoId: proj3.id,
    nota: 8.8,
    comentarios: 'Resolve um problema real de gestão interna do departamento.',
    dataHora: '2026-09-03T17:40:00Z'
  });

  return {
    mensagem: 'Dados de demonstração da UFPR carregados com sucesso!',
    hackathonId: hackathon.id
  };
}
