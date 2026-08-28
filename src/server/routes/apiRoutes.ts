import { FastifyInstance } from 'fastify';
import { hackathonController } from '../controllers/hackathonController.js';
import { participanteController } from '../controllers/participanteController.js';
import { equipeController } from '../controllers/equipeController.js';
import { projetoController } from '../controllers/projetoController.js';
import { mentorController, mentoriaController } from '../controllers/mentorController.js';
import { juradoController, avaliacaoController } from '../controllers/avaliacaoController.js';
import { classificacaoController } from '../controllers/classificacaoController.js';
import { seedData } from './seedRoute.js';
import {
  CriarHackathonSchema,
  CadastrarParticipanteSchema,
  InscreverEquipeSchema,
  RegistrarProjetoSchema,
  CadastrarMentorSchema,
  RegistrarMentoriaSchema,
  CadastrarJuradoSchema,
  RegistrarAvaliacaoSchema
} from '../domain/schemas.js';

export async function apiRoutes(fastify: FastifyInstance) {
  // Health
  fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // Seed / Demonstração UFPR
  fastify.post('/seed', async (request, reply) => {
    try {
      const resultado = await seedData();
      return reply.code(200).send(resultado);
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Erro ao carregar dados de demonstração', details: err.message });
    }
  });

  // --- HACKATHONS ---
  fastify.get('/hackathons', async () => hackathonController.listarHackathons());

  fastify.post('/hackathons', async (request, reply) => {
    const parse = CriarHackathonSchema.parse(request.body);
    const novo = await hackathonController.criarHackathon(parse);
    return reply.code(201).send(novo);
  });

  fastify.get('/hackathons/:id', async (request: any) => {
    return hackathonController.buscarPorId(Number(request.params.id));
  });

  fastify.get('/hackathons/:id/dashboard', async (request: any) => {
    return hackathonController.obterDashboard(Number(request.params.id));
  });

  // --- PARTICIPANTES ---
  fastify.get('/participantes', async () => participanteController.listarParticipantes());

  fastify.post('/participantes', async (request, reply) => {
    const parse = CadastrarParticipanteSchema.parse(request.body);
    const novo = await participanteController.cadastrarParticipante(parse);
    return reply.code(201).send(novo);
  });

  fastify.get('/participantes/:id', async (request: any) => {
    return participanteController.buscarPorId(Number(request.params.id));
  });

  // --- EQUIPES ---
  fastify.get('/equipes', async (request: any, reply) => {
    const { hackathonId } = request.query;
    if (hackathonId) {
      return equipeController.listarPorHackathon(Number(hackathonId));
    }
    return reply.code(400).send({ error: 'hackathonId é obrigatório na query de busca.' });
  });

  fastify.post('/equipes', async (request, reply) => {
    const parse = InscreverEquipeSchema.parse(request.body);
    const nova = await equipeController.inscreverEquipe(parse);
    return reply.code(201).send(nova);
  });

  fastify.get('/equipes/:id', async (request: any) => {
    return equipeController.buscarPorId(Number(request.params.id));
  });

  // --- PROJETOS ---
  fastify.get('/projetos', async (request: any) => {
    const { hackathonId } = request.query;
    if (hackathonId) {
      return projetoController.listarPorHackathon(Number(hackathonId));
    }
    return projetoController.listarTodos();
  });

  fastify.post('/projetos', async (request, reply) => {
    const parse = RegistrarProjetoSchema.parse(request.body);
    const novo = await projetoController.registrarProjeto(parse);
    return reply.code(201).send(novo);
  });

  fastify.get('/projetos/:id', async (request: any) => {
    return projetoController.buscarPorId(Number(request.params.id));
  });

  // --- MENTORES E MENTORIAS ---
  fastify.get('/mentores', async () => mentorController.listarMentores());

  fastify.post('/mentores', async (request, reply) => {
    const parse = CadastrarMentorSchema.parse(request.body);
    const novo = await mentorController.cadastrarMentor(parse);
    return reply.code(201).send(novo);
  });

  fastify.get('/mentorias', async (request: any) => {
    const { hackathonId } = request.query;
    if (hackathonId) {
      return mentoriaController.listarPorHackathon(Number(hackathonId));
    }
    return mentoriaController.listarTodas();
  });

  fastify.post('/mentorias', async (request, reply) => {
    const parse = RegistrarMentoriaSchema.parse(request.body);
    const nova = await mentoriaController.registrarMentoria(parse);
    return reply.code(201).send(nova);
  });

  // --- JURADOS E AVALIAÇÕES ---
  fastify.get('/jurados', async () => juradoController.listarJurados());

  fastify.post('/jurados', async (request, reply) => {
    const parse = CadastrarJuradoSchema.parse(request.body);
    const novo = await juradoController.cadastrarJurado(parse);
    return reply.code(201).send(novo);
  });

  fastify.get('/avaliacoes', async (request: any, reply) => {
    const { hackathonId, projetoId } = request.query;
    if (projetoId) {
      return avaliacaoController.listarPorProjeto(Number(projetoId));
    }
    if (hackathonId) {
      return avaliacaoController.listarPorHackathon(Number(hackathonId));
    }
    return reply.code(400).send({ error: 'Informe hackathonId ou projetoId na query.' });
  });

  fastify.post('/avaliacoes', async (request, reply) => {
    const parse = RegistrarAvaliacaoSchema.parse(request.body);
    const nova = await avaliacaoController.registrarAvaliacao(parse);
    return reply.code(201).send(nova);
  });

  // --- CLASSIFICAÇÃO / RANKING FINAL ---
  fastify.get('/ranking/:hackathonId', async (request: any) => {
    return classificacaoController.determinarClassificacao(Number(request.params.hackathonId));
  });
}
