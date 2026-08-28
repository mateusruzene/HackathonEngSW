import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { ZodError } from 'zod';
import { db } from './database/connection.js';
import { runMigrations } from './database/migrations.js';
import { apiRoutes } from './routes/apiRoutes.js';
import { DomainError } from './domain/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  }
});

export async function startServer() {
  try {
    // 1. Migrações do banco de dados SQLite
    await runMigrations(db);
    fastify.log.info('Banco de dados SQLite inicializado com sucesso.');

    // 2. CORS
    await fastify.register(cors, {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    });

    // 3. Tratamento Centralizado de Erros (Domínio & Zod)
    fastify.setErrorHandler((error: any, request, reply) => {
      if (error instanceof ZodError) {
        return reply.code(400).send({
          error: 'ValidationError',
          message: error.errors.map((e: any) => e.message).join(', '),
          details: error.errors
        });
      }
      if (error instanceof DomainError) {
        return reply.code(error.statusCode || 400).send({
          error: error.name,
          message: error.message
        });
      }
      request.log.error(error);
      return reply.code(error.statusCode || 500).send({
        error: 'InternalServerError',
        message: error.message || 'Ocorreu um erro interno no servidor.'
      });
    });

    // 4. Registrar rotas da API REST
    await fastify.register(apiRoutes, { prefix: '/api' });

    // 5. Servir arquivos estáticos do frontend React compilado
    const possiblePaths = [
      path.resolve(process.cwd(), 'src/client/dist'),
      path.resolve(__dirname, '../client/dist'),
      path.resolve(__dirname, '../../src/client/dist'),
      path.resolve(__dirname, '../../../src/client/dist')
    ];
    const clientDistPath = possiblePaths.find(p => fs.existsSync(p));

    if (clientDistPath) {
      fastify.log.info(`Frontend React localizado em: ${clientDistPath}`);
      await fastify.register(fastifyStatic, {
        root: clientDistPath,
        prefix: '/'
      });

      // Roteamento SPA: Qualquer rota não-API serve o index.html
      fastify.setNotFoundHandler((request, reply) => {
        if (!request.raw.url?.startsWith('/api')) {
          return reply.sendFile('index.html');
        }
        return reply.code(404).send({ error: 'NotFound', message: 'Endpoint da API não encontrado.' });
      });
    } else {
      fastify.log.warn('Diretório dist do frontend não foi encontrado. O servidor responderá apenas às rotas de /api.');
    }

    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`\n======================================================`);
    console.log(`🚀 Servidor Hackathon DInf/UFPR rodando em: http://localhost:${port}`);
    console.log(`📚 API REST disponível em: http://localhost:${port}/api`);
    console.log(`======================================================\n`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Inicialização automática
startServer();
