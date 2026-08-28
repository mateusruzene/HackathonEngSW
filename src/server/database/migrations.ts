import { Knex } from 'knex';

export async function runMigrations(db: Knex): Promise<void> {
  // Hackathons
  if (!(await db.schema.hasTable('hackathons'))) {
    await db.schema.createTable('hackathons', (table) => {
      table.increments('id').primary();
      table.string('nome').notNullable();
      table.string('data_inicio').notNullable();
      table.string('data_termino').notNullable();
      table.integer('max_equipes').notNullable().defaultTo(10);
      table.text('descricao');
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }

  // Participantes
  if (!(await db.schema.hasTable('participantes'))) {
    await db.schema.createTable('participantes', (table) => {
      table.increments('id').primary();
      table.string('nome').notNullable();
      table.string('email').notNullable().unique();
      table.string('curso').notNullable();
      table.string('grr').notNullable().unique();
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }

  // Equipes
  if (!(await db.schema.hasTable('equipes'))) {
    await db.schema.createTable('equipes', (table) => {
      table.increments('id').primary();
      table.integer('hackathon_id').unsigned().notNullable()
        .references('id').inTable('hackathons').onDelete('CASCADE');
      table.string('nome').notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }

  // Equipe - Participantes (Tabela associativa)
  if (!(await db.schema.hasTable('equipe_participantes'))) {
    await db.schema.createTable('equipe_participantes', (table) => {
      table.increments('id').primary();
      table.integer('equipe_id').unsigned().notNullable()
        .references('id').inTable('equipes').onDelete('CASCADE');
      table.integer('participante_id').unsigned().notNullable()
        .references('id').inTable('participantes').onDelete('CASCADE');
      table.unique(['equipe_id', 'participante_id']);
    });
  }

  // Projetos
  if (!(await db.schema.hasTable('projetos'))) {
    await db.schema.createTable('projetos', (table) => {
      table.increments('id').primary();
      table.integer('equipe_id').unsigned().notNullable().unique()
        .references('id').inTable('equipes').onDelete('CASCADE');
      table.string('titulo').notNullable();
      table.text('descricao').notNullable();
      table.string('area_tematica').notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }

  // Mentores
  if (!(await db.schema.hasTable('mentores'))) {
    await db.schema.createTable('mentores', (table) => {
      table.increments('id').primary();
      table.string('nome').notNullable();
      table.string('email').notNullable().unique();
      table.string('especialidade').notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }

  // Mentorias
  if (!(await db.schema.hasTable('mentorias'))) {
    await db.schema.createTable('mentorias', (table) => {
      table.increments('id').primary();
      table.integer('mentor_id').unsigned().notNullable()
        .references('id').inTable('mentores').onDelete('CASCADE');
      table.integer('equipe_id').unsigned().notNullable()
        .references('id').inTable('equipes').onDelete('CASCADE');
      table.text('comentarios').notNullable();
      table.string('data_hora').notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }

  // Jurados
  if (!(await db.schema.hasTable('jurados'))) {
    await db.schema.createTable('jurados', (table) => {
      table.increments('id').primary();
      table.string('nome').notNullable();
      table.string('email').notNullable().unique();
      table.string('area_atuacao').notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }

  // Avaliacoes
  if (!(await db.schema.hasTable('avaliacoes'))) {
    await db.schema.createTable('avaliacoes', (table) => {
      table.increments('id').primary();
      table.integer('jurado_id').unsigned().notNullable()
        .references('id').inTable('jurados').onDelete('CASCADE');
      table.integer('projeto_id').unsigned().notNullable()
        .references('id').inTable('projetos').onDelete('CASCADE');
      table.float('nota').notNullable();
      table.text('comentarios');
      table.string('data_hora').notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }
}
