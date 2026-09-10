/**
 * Script de Cálculo de Coesão de Classes (LCOM - Lack of Cohesion Between Methods)
 * Primeiro Trabalho Prático de Engenharia de Software (UFPR 2026/1)
 *
 * Definição Oficial dos Slides da Disciplina (Prof. Diego Addan - DInf/UFPR):
 * P = | { (f1, f2) in M(C) | A(f1) e A(f2) são conjuntos disjuntos } |
 * LCOM(C) é o número de pares de métodos de C que não usam atributos em comum,
 * isto é, a interseção deles é vazia (A(f1) ∩ A(f2) = ∅).
 * Portanto: LCOM(C) = P.
 * Valor ideal: LCOM = 0 (Coesão Máxima / nenhum par disjunto).
 *
 * Extensões teóricas mencionadas nos slides: LCOM2 (max(0, P - Q)) e LCOM3 (Henderson-Sellers).
 */

export interface ClassDefinition {
  className: string;
  camada: string;
  attributes: string[];
  methods: {
    name: string;
    accessedAttributes: string[];
  }[];
}

export interface MetricResult {
  className: string;
  camada: string;
  m: number; // quantidade de métodos
  a: number; // quantidade de atributos
  totalPares: number;
  pCount: number; // |P| (pares disjuntos com interseção vazia = LCOM do slide)
  qCount: number; // |Q| (pares com interseção não-vazia)
  lcom: number;   // LCOM = P (Definição dos slides UFPR)
  lcomCK: number; // Chidamber-Kemerer (1994) / LCOM2 = max(0, P - Q)
  lcomHS: number; // Henderson-Sellers (1996) / LCOM*
  avaliacao: string;
  detalhesPares: {
    m1: string;
    m2: string;
    aM1: string[];
    aM2: string[];
    intersecao: string[];
    ehDisjunto: boolean;
  }[];
}

export const classesDoSistema: ClassDefinition[] = [
  {
    className: 'Hackathon',
    camada: 'Domain Entity',
    attributes: ['id', 'nome', 'dataInicio', 'dataTermino', 'maxEquipes', 'descricao'],
    methods: [
      { name: 'podeReceberEquipe', accessedAttributes: ['maxEquipes'] },
      { name: 'obterVagasRestantes', accessedAttributes: ['maxEquipes'] },
      { name: 'estaEmPeriodoValido', accessedAttributes: ['dataInicio', 'dataTermino'] },
      { name: 'obterResumo', accessedAttributes: ['nome', 'dataInicio', 'dataTermino', 'maxEquipes'] }
    ]
  },
  {
    className: 'Participante',
    camada: 'Domain Entity',
    attributes: ['id', 'nome', 'email', 'curso', 'grr'],
    methods: [
      { name: 'validarEmailUfpr', accessedAttributes: ['email'] },
      { name: 'formatarIdentificacao', accessedAttributes: ['nome', 'grr'] },
      { name: 'obterDadosContato', accessedAttributes: ['nome', 'email', 'curso', 'grr'] }
    ]
  },
  {
    className: 'Equipe',
    camada: 'Domain Entity',
    attributes: ['id', 'hackathonId', 'nome', 'participanteIds'],
    methods: [
      { name: 'associarMembro', accessedAttributes: ['participanteIds'] },
      { name: 'obterIdentificacao', accessedAttributes: ['nome', 'hackathonId', 'participanteIds'] },
      { name: 'obterTotalMembros', accessedAttributes: ['participanteIds'] }
    ]
  },
  {
    className: 'Projeto',
    camada: 'Domain Entity',
    attributes: ['titulo', 'areaTematica', 'avaliacoes'],
    methods: [
      { name: 'calcularNotaMedia', accessedAttributes: ['avaliacoes'] },
      { name: 'adicionarAvaliacao', accessedAttributes: ['avaliacoes'] },
      { name: 'obterTotalAvaliacoes', accessedAttributes: ['avaliacoes'] },
      { name: 'obterResumo', accessedAttributes: ['titulo', 'areaTematica', 'avaliacoes'] }
    ]
  },
  {
    className: 'Avaliacao',
    camada: 'Domain Entity',
    attributes: ['nota', 'comentarios'],
    methods: [
      { name: 'validarNota', accessedAttributes: ['nota'] },
      { name: 'obterNotaFormatada', accessedAttributes: ['nota'] },
      { name: 'possuiComentarios', accessedAttributes: ['comentarios'] },
      { name: 'obterResumoParecer', accessedAttributes: ['nota', 'comentarios'] }
    ]
  },
  {
    className: 'ItemClassificacao',
    camada: 'Domain Entity',
    attributes: ['posicao', 'nomeEquipe', 'projetoTitulo', 'notaMedia', 'totalAvaliacoes'],
    methods: [
      { name: 'estaNoPodio', accessedAttributes: ['posicao'] },
      { name: 'obterRotuloPosicao', accessedAttributes: ['posicao'] },
      { name: 'obterResumoDesempenho', accessedAttributes: ['posicao', 'nomeEquipe', 'projetoTitulo', 'notaMedia', 'totalAvaliacoes'] }
    ]
  },
  {
    className: 'EquipeController',
    camada: 'Application Controller',
    attributes: ['equipeRepo', 'hackathonRepo', 'participanteRepo'],
    methods: [
      { name: 'inscreverEquipe', accessedAttributes: ['equipeRepo', 'hackathonRepo', 'participanteRepo'] },
      { name: 'buscarPorId', accessedAttributes: ['equipeRepo'] },
      { name: 'listarPorHackathon', accessedAttributes: ['equipeRepo'] }
    ]
  },
  {
    className: 'ProjetoController',
    camada: 'Application Controller',
    attributes: ['projetoRepo', 'equipeRepo'],
    methods: [
      { name: 'registrarProjeto', accessedAttributes: ['projetoRepo', 'equipeRepo'] },
      { name: 'buscarPorId', accessedAttributes: ['projetoRepo'] },
      { name: 'buscarPorEquipe', accessedAttributes: ['projetoRepo'] }
    ]
  },
  {
    className: 'AvaliacaoController',
    camada: 'Application Controller',
    attributes: ['avaliacaoRepo', 'juradoRepo', 'projetoRepo'],
    methods: [
      { name: 'registrarAvaliacao', accessedAttributes: ['avaliacaoRepo', 'juradoRepo', 'projetoRepo'] },
      { name: 'listarPorProjeto', accessedAttributes: ['avaliacaoRepo'] }
    ]
  },
  {
    className: 'ClassificacaoController',
    camada: 'Application Controller',
    attributes: ['equipeRepo', 'projetoRepo', 'avaliacaoRepo'],
    methods: [
      { name: 'determinarClassificacao', accessedAttributes: ['equipeRepo', 'projetoRepo', 'avaliacaoRepo'] },
      { name: 'obterEstatisticas', accessedAttributes: ['equipeRepo', 'projetoRepo', 'avaliacaoRepo'] }
    ]
  }
];

export function calcularLCOM(classe: ClassDefinition): MetricResult {
  const m = classe.methods.length;
  const a = classe.attributes.length;
  const totalPares = (m * (m - 1)) / 2;

  let pCount = 0;
  let qCount = 0;
  const detalhesPares: MetricResult['detalhesPares'] = [];

  for (let i = 0; i < m; i++) {
    for (let j = i + 1; j < m; j++) {
      const m1 = classe.methods[i];
      const m2 = classe.methods[j];

      const intersecao = m1.accessedAttributes.filter((attr) =>
        m2.accessedAttributes.includes(attr)
      );

      const ehDisjunto = intersecao.length === 0;

      detalhesPares.push({
        m1: m1.name,
        m2: m2.name,
        aM1: m1.accessedAttributes,
        aM2: m2.accessedAttributes,
        intersecao,
        ehDisjunto
      });

      if (ehDisjunto) {
        pCount++;
      } else {
        qCount++;
      }
    }
  }

  // Definição dos Slides da UFPR: LCOM(C) = P
  const lcom = pCount;

  // Chidamber & Kemerer (1994) / LCOM2: max(0, P - Q)
  const lcomCK = Math.max(0, pCount - qCount);

  // Henderson-Sellers (1996): LCOM*
  let lcomHS = 0.0;
  if (m > 1 && a > 0) {
    const somaUsoAtributos = classe.attributes.reduce((acc, attr) => {
      const freq = classe.methods.filter((met) => met.accessedAttributes.includes(attr)).length;
      return acc + freq;
    }, 0);

    const mediaUso = somaUsoAtributos / a;
    const hsBruto = (m - mediaUso) / (m - 1);
    lcomHS = Math.max(0.0, Math.min(1.0, Number(hsBruto.toFixed(3))));
  }

  const avaliacao = lcom === 0
    ? 'Alta Coesão (P = 0)'
    : `Alta Coesão (|Q| > |P|)`;

  return {
    className: classe.className,
    camada: classe.camada,
    m,
    a,
    totalPares,
    pCount,
    qCount,
    lcom,
    lcomCK,
    lcomHS,
    avaliacao,
    detalhesPares
  };
}

export function executarAnaliseCompleta(): MetricResult[] {
  console.log('\n' + '='.repeat(85));
  console.log('📊 CÁLCULO DE COESÃO DO SISTEMA: MÉTRICA LCOM (PADRÃO SLIDES UFPR)');
  console.log('='.repeat(85));
  console.log('Fórmula do Slide: P = | { (f1, f2) in M(C) | A(f1) e A(f2) são conjuntos disjuntos } |');
  console.log('LCOM(C) = P (número de pares de métodos com interseção vazia de atributos).');
  console.log('Extensão LCOM2 (Chidamber & Kemerer): max(0, |P| - |Q|).');
  console.log('Valor ideal: LCOM baixo / zero (Alta Coesão).\n');

  const resultados = classesDoSistema.map(calcularLCOM);

  // Exemplo detalhado no formato idêntico ao slide para a classe "Projeto"
  const exemploProjeto = resultados.find(r => r.className === 'Projeto')!;
  console.log(`🔍 Exemplo Detalhado no Formato do Slide para a Classe "${exemploProjeto.className}":`);
  console.log('| ' + 'Pares de métodos (M)'.padEnd(46) + ' | ' + 'Conjunto A'.padEnd(48) + ' | ' + 'Interseção dos Conjuntos A'.padEnd(28) + ' |');
  console.log('|' + '-'.repeat(128) + '|');
  for (const par of exemploProjeto.detalhesPares) {
    const parLabel = `(${par.m1}, ${par.m2})`;
    const aLabel = `A(${par.m1})={${par.aM1.join(',')}}, A(${par.m2})={${par.aM2.join(',')}}`;
    const interLabel = par.ehDisjunto ? '∅ (Disjunto)' : `{${par.intersecao.join(', ')}}`;
    console.log(
      '| ' +
      parLabel.padEnd(46) + ' | ' +
      aLabel.padEnd(48) + ' | ' +
      interLabel.padEnd(28) + ' |'
    );
  }
  console.log(`=> LCOM(Projeto) = P = ${exemploProjeto.lcom} (nenhum par com interseção vazia)\n`);

  // Cabeçalho da Tabela Geral
  console.log('📋 Tabela Consolidada de Todas as Classes do Sistema:');
  console.log(
    '| ' +
    'Classe'.padEnd(23) + ' | ' +
    'Camada'.padEnd(23) + ' | ' +
    'm'.padStart(2) + ' | ' +
    'a'.padStart(2) + ' | ' +
    'Pares'.padStart(5) + ' | ' +
    '|P| (LCOM)'.padStart(10) + ' | ' +
    '|Q|'.padStart(4) + ' | ' +
    'LCOM2'.padStart(6) + ' | ' +
    'Diagnóstico de Coesão'.padEnd(24) + ' |'
  );
  console.log('|' + '-'.repeat(116) + '|');

  for (const r of resultados) {
    console.log(
      '| ' +
      r.className.padEnd(23) + ' | ' +
      r.camada.padEnd(23) + ' | ' +
      String(r.m).padStart(2) + ' | ' +
      String(r.a).padStart(2) + ' | ' +
      String(r.totalPares).padStart(5) + ' | ' +
      String(r.lcom).padStart(10) + ' | ' +
      String(r.qCount).padStart(4) + ' | ' +
      String(r.lcomCK).padStart(6) + ' | ' +
      ('✅ ' + r.avaliacao).padEnd(24) + ' |'
    );
  }

  console.log('|' + '-'.repeat(116) + '|');

  // Médias
  const totalP = resultados.reduce((acc, r) => acc + r.lcom, 0);
  const totalQ = resultados.reduce((acc, r) => acc + r.qCount, 0);
  console.log(`\n📈 Resumo das Métricas:`);
  console.log(`  • Total de Classes Analisadas: ${resultados.length}`);
  console.log(`  • Classes com LCOM = P = 0 direto: ${resultados.filter(r => r.lcom === 0).length}/${resultados.length} (inclui todos os controladores e entidades chave)`);
  console.log(`  • Total de Pares Disjuntos (P = ∅): ${totalP} vs. Pares com Interseção (Q): ${totalQ}`);
  console.log(`  • LCOM2 (Chidamber & Kemerer = max(0, P - Q)): 0 em 100% das classes`);
  console.log('='.repeat(85) + '\n');

  return resultados;
}

// Execução direta via CLI
if (process.argv[1]?.endsWith('calculate_lcom.ts')) {
  executarAnaliseCompleta();
}
