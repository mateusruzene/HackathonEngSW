import assert from 'node:assert';
import { db } from '../src/server/database/connection.js';
import { runMigrations } from '../src/server/database/migrations.js';
import { hackathonController } from '../src/server/controllers/hackathonController.js';
import { participanteController } from '../src/server/controllers/participanteController.js';
import { equipeController } from '../src/server/controllers/equipeController.js';
import { projetoController } from '../src/server/controllers/projetoController.js';
import { mentorController, mentoriaController } from '../src/server/controllers/mentorController.js';
import { juradoController, avaliacaoController } from '../src/server/controllers/avaliacaoController.js';
import { classificacaoController } from '../src/server/controllers/classificacaoController.js';

let passed = 0;
let total = 0;

async function test(name: string, fn: () => Promise<void>) {
  total++;
  try {
    await fn();
    console.log(`  ✅ [PASS] ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 Executando Suíte de Testes Automatizados (TypeScript)');
  console.log('======================================================\n');

  // Limpar tabelas e inicializar banco
  await runMigrations(db);
  await db('avaliacoes').del();
  await db('mentorias').del();
  await db('projetos').del();
  await db('equipe_participantes').del();
  await db('equipes').del();
  await db('participantes').del();
  await db('hackathons').del();
  await db('mentores').del();
  await db('jurados').del();

  let hId = 0;
  let p1Id = 0;
  let p2Id = 0;
  let p3Id = 0;
  let eq1Id = 0;
  let eq2Id = 0;
  let proj1Id = 0;
  let proj2Id = 0;
  let mentorId = 0;
  let jurado1Id = 0;
  let jurado2Id = 0;

  // 1. ECU 001 - Cadastrar Hackathon
  await test('ECU 001: Deve cadastrar um Hackathon com capacidade para 2 equipes', async () => {
    const h = await hackathonController.criarHackathon({
      nome: 'Hackathon Teste UFPR',
      dataInicio: '2026-09-01',
      dataTermino: '2026-09-03',
      maxEquipes: 2,
      descricao: 'Evento de Testes Automatizados'
    });
    assert.ok(h.id);
    assert.strictEqual(h.nome, 'Hackathon Teste UFPR');
    assert.strictEqual(h.maxEquipes, 2);
    hId = h.id;
  });

  // 2. ECU 002 - Cadastrar Participantes
  await test('ECU 002: Deve cadastrar participantes válidos', async () => {
    const p1 = await participanteController.cadastrarParticipante({
      nome: 'Mateus Ruzene',
      email: 'mateus@inf.ufpr.br',
      curso: 'BCC',
      grr: 'GRR20221223'
    });
    const p2 = await participanteController.cadastrarParticipante({
      nome: 'Gabriel Claudino',
      email: 'gabriel@inf.ufpr.br',
      curso: 'BCC',
      grr: 'GRR20215730'
    });
    const p3 = await participanteController.cadastrarParticipante({
      nome: 'Aluno Extra',
      email: 'extra@inf.ufpr.br',
      curso: 'BCC',
      grr: 'GRR20239999'
    });

    assert.ok(p1.id);
    assert.ok(p2.id);
    assert.ok(p3.id);
    p1Id = p1.id;
    p2Id = p2.id;
    p3Id = p3.id;
  });

  // 3. ECU 002 - Impedir duplicidade de email ou GRR
  await test('ECU 002: Deve rejeitar cadastro com GRR já existente', async () => {
    let errorOccurred = false;
    try {
      await participanteController.cadastrarParticipante({
        nome: 'Outro Nome',
        email: 'novoemail@inf.ufpr.br',
        curso: 'BCC',
        grr: 'GRR20221223' // Duplicado
      });
    } catch {
      errorOccurred = true;
    }
    assert.strictEqual(errorOccurred, true);
  });

  // 4. ECU 003 - Inscrever Equipe 1
  await test('ECU 003: Deve inscrever a Equipe 1 com 2 participantes', async () => {
    const eq = await equipeController.inscreverEquipe({
      hackathonId: hId,
      nome: 'Equipe Alfa',
      participanteIds: [p1Id, p2Id]
    });
    assert.ok(eq);
    assert.strictEqual(eq.nome, 'Equipe Alfa');
    assert.strictEqual(eq.membros.length, 2);
    eq1Id = eq.id;
  });

  // 5. ECU 003 - Impedir participante em mais de 1 equipe no mesmo hackathon
  await test('ECU 003: Deve bloquear participante já inscrito em outra equipe do mesmo hackathon', async () => {
    let errorOccurred = false;
    try {
      await equipeController.inscreverEquipe({
        hackathonId: hId,
        nome: 'Equipe Duplicada',
        participanteIds: [p1Id] // p1Id já está na Equipe Alfa
      });
    } catch (err: any) {
      errorOccurred = true;
      assert.match(err.message, /já está inscrito/);
    }
    assert.strictEqual(errorOccurred, true);
  });

  // 6. ECU 003 - Inscrever Equipe 2 (preenchendo a capacidade de 2)
  await test('ECU 003: Deve inscrever a Equipe 2 (atingindo a lotação máxima)', async () => {
    const eq = await equipeController.inscreverEquipe({
      hackathonId: hId,
      nome: 'Equipe Beta',
      participanteIds: [p3Id]
    });
    assert.ok(eq);
    eq2Id = eq.id;
  });

  // 7. ECU 003 - Bloquear inscrição quando atingido maxEquipes
  await test('ECU 003: Deve rejeitar inscrição de Equipe 3 quando evento estiver lotado', async () => {
    const p4 = await participanteController.cadastrarParticipante({
      nome: 'Aluno 4',
      email: 'aluno4@ufpr.br',
      curso: 'BCC',
      grr: 'GRR20240001'
    });

    let errorOccurred = false;
    try {
      await equipeController.inscreverEquipe({
        hackathonId: hId,
        nome: 'Equipe Gama (Excedente)',
        participanteIds: [p4.id]
      });
    } catch (err: any) {
      errorOccurred = true;
      assert.match(err.message, /capacidade máxima/);
    }
    assert.strictEqual(errorOccurred, true);
  });

  // 8. ECU 004 - Registrar Projeto para Equipe 1
  await test('ECU 004: Deve registrar projeto com sucesso para a Equipe 1', async () => {
    const proj = await projetoController.registrarProjeto({
      equipeId: eq1Id,
      titulo: 'Sistema de IA Médica',
      descricao: 'Diagnósticos clínicos automatizados utilizando redes profundas.',
      areaTematica: 'Saúde e IA'
    });
    assert.ok(proj.id);
    assert.strictEqual(proj.titulo, 'Sistema de IA Médica');
    proj1Id = proj.id;
  });

  // 9. ECU 004 - Bloquear 2º projeto para a mesma equipe
  await test('ECU 004: Deve rejeitar segundo projeto para a mesma equipe', async () => {
    let errorOccurred = false;
    try {
      await projetoController.registrarProjeto({
        equipeId: eq1Id,
        titulo: 'Segundo Projeto Proibido',
        descricao: 'Tentativa de submissão duplicada pela mesma equipe.',
        areaTematica: 'IA'
      });
    } catch (err: any) {
      errorOccurred = true;
      assert.match(err.message, /já possui/);
    }
    assert.strictEqual(errorOccurred, true);
  });

  // 10. ECU 004 - Registrar Projeto para Equipe 2
  await test('ECU 004: Deve registrar projeto para a Equipe 2', async () => {
    const proj = await projetoController.registrarProjeto({
      equipeId: eq2Id,
      titulo: 'App de Sustentabilidade',
      descricao: 'Monitoramento do consumo de água e energia no campus.',
      areaTematica: 'Sustentabilidade'
    });
    assert.ok(proj.id);
    proj2Id = proj.id;
  });

  // 11. ECU 005 - Registrar Mentoria
  await test('ECU 005: Deve cadastrar Mentor e registrar Mentoria', async () => {
    const mentor = await mentorController.cadastrarMentor({
      nome: 'Prof. Diego Addan',
      email: 'diego@inf.ufpr.br',
      especialidade: 'Engenharia de Software'
    });
    mentorId = mentor.id;

    const mentoria = await mentoriaController.registrarMentoria({
      mentorId,
      equipeId: eq1Id,
      comentarios: 'Excelente modelagem de domínio e arquitetura desacoplada.'
    });
    assert.ok(mentoria.id);
    assert.strictEqual(mentoria.equipeId, eq1Id);
  });

  // 12. ECU 006 - Cadastrar Jurados e Registrar Avaliação Válida
  await test('ECU 006: Deve cadastrar Jurados e registrar Avaliações', async () => {
    const j1 = await juradoController.cadastrarJurado({
      nome: 'Jurado A',
      email: 'juradoa@ufpr.br',
      areaAtuacao: 'Computação'
    });
    const j2 = await juradoController.cadastrarJurado({
      nome: 'Jurado B',
      email: 'juradob@ufpr.br',
      areaAtuacao: 'Design'
    });
    jurado1Id = j1.id;
    jurado2Id = j2.id;

    const av1 = await avaliacaoController.registrarAvaliacao({
      juradoId: jurado1Id,
      projetoId: proj1Id,
      nota: 9.5,
      comentarios: 'Ótima solução técnica'
    });
    const av2 = await avaliacaoController.registrarAvaliacao({
      juradoId: jurado2Id,
      projetoId: proj1Id,
      nota: 9.0,
      comentarios: 'Boa apresentação'
    });

    assert.ok(av1.id);
    assert.strictEqual(av1.nota, 9.5);
    assert.ok(av2.id);
    assert.strictEqual(av2.nota, 9.0);

    // Avaliação do Projeto 2
    await avaliacaoController.registrarAvaliacao({
      juradoId: jurado1Id,
      projetoId: proj2Id,
      nota: 8.0,
      comentarios: 'Bom projeto'
    });
  });

  // 13. ECU 006 - Validar restrição de nota entre 0.0 e 10.0
  await test('ECU 006: Deve rejeitar notas fora do intervalo [0.0, 10.0]', async () => {
    let error1 = false;
    let error2 = false;

    try {
      await avaliacaoController.registrarAvaliacao({
        juradoId: jurado1Id,
        projetoId: proj1Id,
        nota: 11.5
      });
    } catch {
      error1 = true;
    }

    try {
      await avaliacaoController.registrarAvaliacao({
        juradoId: jurado1Id,
        projetoId: proj1Id,
        nota: -1.0
      });
    } catch {
      error2 = true;
    }

    assert.strictEqual(error1, true);
    assert.strictEqual(error2, true);
  });

  // 14. ECU 007 - Determinar Classificação Final
  await test('ECU 007: Deve determinar o Ranking correto (Equipe Alfa em 1º com média 9.25 e Equipe Beta em 2º com média 8.0)', async () => {
    const ranking = await classificacaoController.determinarClassificacao(hId);
    assert.strictEqual(ranking.length, 2);

    // 1º Lugar: Equipe Alfa -> Média (9.5 + 9.0) / 2 = 9.25
    assert.strictEqual(ranking[0].posicao, 1);
    assert.strictEqual(ranking[0].nomeEquipe, 'Equipe Alfa');
    assert.strictEqual(ranking[0].notaMedia, 9.25);
    assert.strictEqual(ranking[0].totalAvaliacoes, 2);

    // 2º Lugar: Equipe Beta -> Média 8.0
    assert.strictEqual(ranking[1].posicao, 2);
    assert.strictEqual(ranking[1].nomeEquipe, 'Equipe Beta');
    assert.strictEqual(ranking[1].notaMedia, 8.0);
    assert.strictEqual(ranking[1].totalAvaliacoes, 1);
  });

  // 15. Dashboard consolidado
  await test('Dashboard: Deve retornar estatísticas e dados consolidados do Hackathon', async () => {
    const dash = await hackathonController.obterDashboard(hId);
    assert.strictEqual(dash.estatisticas.totalEquipes, 2);
    assert.strictEqual(dash.estatisticas.maxEquipes, 2);
    assert.strictEqual(dash.estatisticas.vagasRestantes, 0);
    assert.strictEqual(dash.estatisticas.totalProjetos, 2);
    assert.strictEqual(dash.estatisticas.totalMentorias, 1);
    assert.strictEqual(dash.estatisticas.totalAvaliacoes, 3);
  });

  console.log('\n======================================================');
  console.log(`📊 Resultado Final dos Testes: ${passed}/${total} Aprovados (${Math.round((passed/total)*100)}%)`);
  console.log('======================================================\n');

  if (passed === total) {
    console.log('🎉 Todos os 15 testes foram aprovados com sucesso!\n');
    process.exit(0);
  } else {
    console.error('❌ Alguns testes falharam.');
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Erro fatal nos testes:', err);
  process.exit(1);
});
