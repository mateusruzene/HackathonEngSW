# Relatório Explicativo Passo a Passo: Primeiro Trabalho Prático de Engenharia de Software (UFPR 2026/1)

**Integrantes da Equipe**:
- **Mateus Siqueira Ruzene** — GRR20221223
- **Gabriel Claudino de Souza** — GRR20215730

**Disciplina**: Engenharia de Software — Bacharelado em Ciência da Computação (UFPR)  
**Professor**: Prof. Diego Addan  

---

## 🎯 1. Objetivo Deste Documento

Este documento foi elaborado especialmente para explicar, de maneira clara, didática e estruturada, **tudo o que foi concebido, modelado e implementado** no Primeiro Trabalho Prático. Ele serve como guia completo para vocês entenderem a fundo cada decisão de engenharia de software e realizarem uma apresentação nota 10 para o professor Diego Addan.

---

## 📋 2. O Problema Solucionado

O Departamento de Informática da UFPR (DInf) precisava de um software para gerenciar **Hackathons Acadêmicos**. 
O sistema atende rigorosamente a todas as especificações do enunciado:
1. **Hackathon**: Criação do evento com nome, data de início, data de término, limite máximo de equipes participantes e descrição.
2. **Participantes (Estudantes)**: Cadastro de alunos com Nome, E-mail Institucional (@ufpr.br), Curso e Matrícula/GRR.
3. **Equipes**: Formação de grupos compostos por 1 ou mais participantes. O sistema valida se o hackathon não está lotado e garante que nenhum participante pertença a mais de uma equipe no mesmo evento.
4. **Projetos**: Cada equipe pode registrar **exatamente 1 projeto** (Título, Descrição e Área Temática).
5. **Mentores e Mentorias**: Cadastro de mentores e registro de orientações realizadas para as equipes (mentor responsável, equipe/projeto atendido, comentários e data/hora).
6. **Jurados e Avaliações**: Cadastro de jurados da banca examinadora e registro de avaliações (notas de 0.0 a 10.0 e parecer/comentários qualitativos). Um projeto pode receber notas de múltiplos jurados.
7. **Classificação Final / Ranking**: Cálculo automatizado da média aritmética das notas dos jurados para cada projeto, ordenando as equipes de forma decrescente com critérios de desempate.
8. **Consultas e Relatórios**: Painel consolidado com métricas de equipes, participantes, projetos, mentorias e avaliações.

---

## 🛠️ 3. O Que Foi Feito: Passo a Passo Completo

### Passo 1: Análise de Requisitos e Modelagem de Casos de Uso (ECU)
- Mapeamos os 4 atores do sistema: **Organizador**, **Participante / Líder de Equipe**, **Mentor** e **Jurado**.
- Especificamos 9 Casos de Uso completos (`ECU 001` a `ECU 009`) seguindo à risca a estrutura de tabela exigida nos exemplos do documento da disciplina:
  - *Nome, Descrição, Fluxo Básico numerado passo a passo, Fluxos Alternativos (tratamento de erros), Requisitos Especiais, Pré-condições, Pós-condições* e *Pontos de Extensão*.
- Criamos o **Diagrama de Casos de Uso UML** no padrão formal.

### Passo 2: Modelo Conceitual de Domínio (Domain Model)
- Criamos o **Diagrama de Classes Conceituais** representando as entidades do mundo real:
  - `Hackathon` (1) possui (0..maxEquipes) `Equipe`
  - `Equipe` (1) é formada por (1..*) `Participante`
  - `Equipe` (1) desenvolve (0..1) `Projeto`
  - `Mentor` (1) realiza (0..*) `Mentoria`
  - `Mentoria` (0..*) orienta (1) `Equipe`
  - `Jurado` (1) realiza (0..*) `Avaliacao`
  - `Avaliacao` (0..*) avalia (1) `Projeto`

### Passo 3: Diagramas de Sequência de Sistema (DSS)
- Criamos 7 **Diagramas de Sequência de Sistema (DSS)** para analisar a interação caixa-preta entre os atores externos e a fronteira do sistema (`:Sistema`), identificando claramente as mensagens de entrada e respostas de saída:
  - `DSS 001`: Cadastrar Hackathon (`cadastrarHackathon`)
  - `DSS 002`: Cadastrar Participante (`cadastrarParticipante`)
  - `DSS 003`: Inscrever Equipe (`inscreverEquipe`)
  - `DSS 004`: Registrar Projeto (`registrarProjeto`)
  - `DSS 005`: Registrar Mentoria (`registrarMentoria`)
  - `DSS 006`: Registrar Avaliação (`registrarAvaliacao`)
  - `DSS 007`: Determinar Classificação Final (`calcularClassificacaoFinal`)

### Passo 4: Contratos de Operação (Padrão Craig Larman / UFPR)
- Para cada operação de sistema identificada nos DSS, redigimos contratos formais contendo:
  - **Operação**: Assinatura completa com tipos.
  - **Referências Cruzadas**: Caso de uso de origem (ECU correspondente).
  - **Pré-condições**: Estados e validações que devem ser verdadeiros antes da execução.
  - **Pós-condições**: Descrição formal das transformações no estado do sistema:
    1. *Criação de instâncias* (ex: instâncias de `Equipe`, `Projeto`, `Avaliacao`);
    2. *Formação ou quebra de associações* (ex: `h.equipes` incluiu `eq`, `eq.projeto` tornou-se `proj`, `p.avaliacoes` incluiu `av`);
    3. *Modificação de atributos* (ex: atribuição de notas, datas, títulos).

### Passo 5: Diagramas de Interação de Projeto (Padrões GRASP)
- Atribuímos responsabilidades aos objetos do software aplicando os padrões fundamentais do GRASP:
  - **Controller (Controlador)**: Classes dedicadas (`EquipeController`, `ProjetoController`, `AvaliacaoController`, `ClassificacaoController`) e a Fachada Central (`SistemaHackathonFacade`) recebem as requisições da camada de apresentação e coordenam os casos de uso.
  - **Information Expert (Especialista na Informação)**: O cálculo da média das avaliações foi atribuído à própria entidade `Projeto`, pois ela detém a lista de suas avaliações (`calcular_nota_final()`).
  - **Creator (Criador)**: Os controladores criam as instâncias de domínio e as vinculam às suas agregações e repositórios.
  - **Low Coupling & High Cohesion**: Desacoplamento através da camada de repositórios (`interfaces.py` / `memory_repo.py`).
- Geramos os **Diagramas de Sequência de Projeto** detalhando a troca de mensagens interna entre UI, Controladores, Repositórios e Entidades.

### Passo 6: Diagrama de Classes - Visão de Projeto (Design Class Diagram - DCD)
- Desenhamos o DCD completo contendo:
  - Atributos com visibilidade (`+` público, `-` privado, `#` protegido) e tipos de dados estritos;
  - Métodos com parâmetros e tipos de retorno;
  - Classes de Entidade, Controladores, Repositórios e DTOs (`ItemClassificacao`);
  - Multiplicidades e tipos de relacionamentos (associação, agregação e composição).

### Passo 7: Diagrama de Pacotes (Arquitetura do Software)
- Estruturamos o sistema em 4 camadas lógicas e bem isoladas:
  1. `presentation`: Interface CLI de terminal e Servidor Web / API REST;
  2. `application`: Controladores de caso de uso e Fachada geral;
  3. `domain`: Entidades de negócio e regras de validação;
  4. `repositories`: Persistência e consultas.

### Passo 8: Implementação Integral do Software (100% Funcional)
- Implementamos o sistema em **Python 3** orientado a objetos e fortemente tipado.
- Desenvolvemos:
  - **Interface CLI de terminal interativa** (menu colorido, fluxos passo a passo para todos os casos de uso e carregamento de demonstração);
  - **Servidor Web HTTP nativo e Dashboard Moderna** em HTML5/CSS3/JS com cards de estatísticas, pódio animado com medalhas de 1º, 2º e 3º lugares, listagem de equipes e formulários para todas as operações;
  - **16 Testes Automatizados** unitários e de integração (`tests/test_domain.py` e `tests/test_controllers.py`), cobrindo 100% das regras de negócio (capacidade máxima de equipes, unicidade de projeto por equipe, restrição de participante em equipe única por hackathon, notas válidas de 0 a 10, cálculo de médias e ordenação correta do ranking).

### Passo 9: Geração dos Diagramas e do Documento PDF Oficial
- Criamos o script `docs/generate_diagrams.py` que renderiza todos os diagramas UML em alta resolução vetorial / PNG nítido.
- Criamos o script `docs/generate_pdf.py` usando ReportLab, gerando o PDF acadêmico oficial com capa padrão UFPR / DInf, identificação dos alunos (**Mateus Siqueira Ruzene** e **Gabriel Claudino de Souza**), sumário, tabelas formatadas de ECU e Contratos, todos os diagramas inseridos e seções explicativas.
- Geramos os arquivos finais:
  - `GRR20221223_GRR20215730.pdf`
  - `GRR20221223 GRR20215730.pdf`

### Passo 10: Empacotamento para Entrega
- Compactamos todo o código-fonte, diagramas, testes e documentação nos arquivos:
  - `GRR20221223_GRR20215730.tar.gz`
  - `GRR20221223 GRR20215730.tar.gz`

---

## 💻 4. Como Executar e Demonstrar o Sistema

O sistema foi concebido para ser executado de forma simples em qualquer computador com Python 3 (macOS, Linux ou Windows):

### 1. Para Rodar os Testes Automatizados (Excelente para mostrar ao professor que tudo funciona):
```bash
python3 src/main.py --test
```
*Saída esperada:* 16 testes executados e aprovados com 100% de sucesso em milissegundos.

### 2. Para Executar a Demonstração Automatizada:
```bash
python3 src/main.py --demo
```
*Saída esperada:* Carrega o Hackathon UFPR, equipes, participantes, notas de jurados e imprime o relatório completo e o ranking final no terminal.

### 3. Para Abrir a Interface Gráfica Web:
```bash
python3 src/main.py --web --port 8080
```
Abra o navegador em `http://localhost:8080`.  
Na interface web, você poderá:
- Clicar em **"Recarregar Demonstração"** para ver os dados do DInf pré-carregados;
- Ver o **Pódio de 1º, 2º e 3º lugares** e a tabela dinâmica de classificação;
- Usar as abas para cadastrar novos participantes, novas equipes, novos projetos, registrar mentorias e avaliar projetos com notas de jurados em tempo real!

### 4. Para Abrir a Interface CLI no Terminal:
```bash
python3 src/main.py --cli
```
Menu interativo completo com opções numeradas de 1 a 9 e opção `D` para carregar dados de demonstração.

---

## 🎓 5. Guia Rápido para a Apresentação com o Professor

Se o professor perguntar:

1. **"Onde está o padrão GRASP Controller no seu projeto?"**
   - *Resposta:* "Está na camada `application` com as classes `EquipeController`, `ProjetoController`, `AvaliacaoController`, `ClassificacaoController` e a fachada `SistemaHackathonFacade`. Elas recebem os eventos da UI (CLI ou Web) e orquestram a execução dos casos de uso, sem acoplar a interface às regras de negócio."

2. **"Onde está o padrão Information Expert?"**
   - *Resposta:* "Está, por exemplo, no método `calcular_nota_final()` da classe `Projeto` (`src/domain/models.py`). Como a classe `Projeto` detém a lista de suas próprias avaliações, ela é a especialista na informação para calcular a média aritmética das notas atribuídas pelos jurados."

3. **"Como foi garantida a regra de que cada equipe só pode ter um projeto?"**
   - *Resposta:* "Tanto no modelo de domínio (`Equipe.associar_projeto()`) quanto no controlador (`ProjetoController.registrar_projeto()`), existe uma verificação de pré-condição que dispara a exceção `ProjetoJaCadastradoException` caso a equipe já possua um projeto associado."

4. **"Como vocês garantiram que o Hackathon não ultrapassa o limite de equipes?"**
   - *Resposta:* "No caso de uso de inscrição de equipe (`EquipeController.inscrever_equipe`), o sistema consulta a capacidade do Hackathon (`Hackathon.pode_receber_equipe()`). Se o total de equipes inscritas atingir o `max_equipes`, é lançada a exceção `HackathonLotadoException`."

5. **"Como o sistema calcula o ranking?"**
   - *Resposta:* "O `ClassificacaoController` recupera todos os projetos do Hackathon, solicita a cada um o cômputo de sua nota média, e ordena a lista de forma decrescente pela nota média e pelo total de avaliações, montando instâncias de `ItemClassificacao` com as posições 1º, 2º, 3º..."

---

## 📁 6. Estrutura de Arquivos do Projeto

```
t1/
├── src/
│   ├── domain/                  # Entidades (Hackathon, Equipe, Projeto, Participante, etc.) e Exceções
│   │   ├── models.py
│   │   ├── exceptions.py
│   │   └── __init__.py
│   ├── repositories/            # Interfaces e Repositórios em Memória
│   │   ├── memory_repo.py
│   │   └── __init__.py
│   ├── application/             # Controladores GRASP e Fachada do Sistema
│   │   ├── controllers.py
│   │   └── __init__.py
│   ├── presentation/            # CLI Interativa e Servidor Web HTTP / REST
│   │   ├── cli.py
│   │   ├── web_server.py
│   │   └── __init__.py
│   ├── static/                  # Dashboard Web (HTML5, CSS3 moderno, JavaScript)
│   │   ├── index.html
│   │   ├── style.css
│   │   └── app.js
│   └── main.py                  # Ponto de entrada (--cli, --web, --test, --demo)
├── tests/                       # Suite de 16 Testes Automatizados
│   ├── test_domain.py
│   ├── test_controllers.py
│   └── __init__.py
├── docs/                        # Scripts de geração de diagramas e PDF
│   ├── diagrams/                # 14 diagramas UML gerados em alta resolução
│   ├── generate_diagrams.py
│   └── generate_pdf.py
├── GRR20221223_GRR20215730.pdf  # Documento PDF acadêmico oficial pronto para entrega
├── GRR20221223 GRR20215730.pdf  # Cópia no formato alternativo
├── GRR20221223_GRR20215730.tar.gz # Arquivo compactado com fontes pronto para entrega
├── README.md                    # Documentação geral do repositório
└── EXPLICACAO_DO_TRABALHO.md   # Este documento explicativo
```
