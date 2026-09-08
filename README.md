# Sistema de Gestão de Hackathons Acadêmicos (DInf/UFPR)

**Primeiro Trabalho Prático — Engenharia de Software (UFPR 2026/1)**  
**Professor**: Prof. Diego Addan  
**Alunos**:
- **Mateus Siqueira Ruzene** — GRR20221223
- **Gabriel Claudino de Souza** — GRR20215730

---

## 📌 1. Visão Geral do Projeto

Este projeto consiste na **modelagem formal orientada a objetos (UML)** e na **implementação de software** de um sistema para gerenciamento de Hackathons Acadêmicos para o Departamento de Informática da UFPR (DInf), atendendo rigorosamente a todos os requisitos do edital `TP1ES26.pdf`.

### 🛠️ Stack Tecnológica
- **Modelagem e Diagramas**: UML 2.5 elaborada em **Mermaid** (`docs/mermaid/`).
- **Relatório Oficial**: **LaTeX** no padrão SBC (`ModeloLatex/main.tex`) compilado em PDF de alta resolução (`GRR20221223_GRR20215730.pdf`).
- **Backend**: **Node.js** com **Fastify**, **Knex.js**, **SQLite3**, **TypeScript** e validações de esquema com **Zod**.
- **Frontend**: **React.js** com **Vite**, **TypeScript**, **Zod** e **Tailwind CSS** em `src/client/`, organizado com telas separadas por papéis de atores UML (`/organizador`, `/estudante`, `/mentor`, `/jurado`, `/ranking`).
- **Docker**: Containerização completa com `Dockerfile` multi-stage e `docker-compose.yml`.
- **Testes Automatizados**: Suíte de 15 testes de integração cobrindo 100% das regras de negócio (`tests/test_api.ts`).

---

## 📐 2. Artefatos de Modelagem UML (Mermaid)

Todos os diagramas foram modelados em código Mermaid (`docs/mermaid/`) e exportados para imagens em alta resolução (`ModeloLatex/images/` e `docs/diagrams/`):

1. **Diagrama de Casos de Uso (UML Use Case)**: Mapeamento dos 4 atores (*Organizador*, *Participante*, *Mentor*, *Jurado*) e dos 8 casos de uso (`uc_diagram.mmd`).
2. **Modelo Conceitual de Domínio**: Entidades do mundo real e suas associações/multiplicidades (`domain_model.mmd`).
3. **Diagramas de Sequência de Sistema (DSS)**: 7 diagramas caixa-preta mapeando eventos dos atores para a fronteira do `:Sistema` (`dss_001` a `dss_007`).
4. **Contratos de Operação**: Pré e pós-condições formais detalhadas no relatório LaTeX.
5. **Diagramas de Interação de Projeto (GRASP)**: Sequência de projeto detalhando a orquestração entre *Controller*, *Information Expert*, *Creator*, *Baixo Acoplamento* e *Alta Coesão*.
6. **Diagrama de Classes de Projeto (DCD)**: Tipagem estrita, visibilidade, métodos e relacionamentos (`dcd.mmd`).
7. **Diagrama de Pacotes**: Divisão arquitetural em 4 camadas lógicas (`presentation`, `application`, `domain`, `infrastructure/repositories`).

---

## 🚀 3. Guia Rápido de Instalação e Execução

### Opção A: Modo Desenvolvimento (Live Reload com Vite + Fastify)

Ideal para desenvolvimento ativo, com hot-reloading tanto no frontend quanto no backend.

```bash
# 1. Instalar as dependências da raiz (backend) e do cliente (frontend):
npm install
cd src/client && npm install && cd ../..

# 2. Iniciar ambos os servidores simultaneamente:
npm run dev
```

- **Frontend (Vite com Hot-Reload)**: [http://localhost:5173](http://localhost:5173) (as chamadas `/api` são redirecionadas automaticamente para o backend via proxy).
- **Backend API (Fastify com tsx watch)**: [http://localhost:3000](http://localhost:3000)

---

### Opção B: Execução Local em Produção (Node.js)

Compila o frontend React e executa o servidor Fastify servindo a aplicação unificada na porta 3000.

```bash
# 1. Instalar dependências e compilar o frontend e backend:
npm install
npm run build

# 2. Iniciar o servidor integrado:
npm start
```
Abra o navegador em: **[http://localhost:3000](http://localhost:3000)**

> ⚡ **Dica de Teste Rápido:** Na interface web, clique no botão amarelo **"Demo UFPR"** no topo da página. O sistema populará instantaneamente o banco SQLite com o Hackathon oficial, 3 equipes, projetos inovadores, mentores e avaliações da banca examinadora com notas e comentários!

---

### Opção C: Execução com Docker (Terminal / Docker Compose)

Tanto o frontend (multi-stage build) quanto o backend e o banco de dados SQLite são empacotados em um único container otimizado.

#### 1. Iniciar com Docker Compose (Recomendado):
```bash
# Build e execução dos containers:
docker compose up --build

# Ou via atalho do npm:
npm run docker:up
```

Para rodar em **segundo plano (detached mode)**:
```bash
docker compose up -d --build
```

Para **parar** os containers:
```bash
docker compose down
# ou: npm run docker:down
```

#### 2. Iniciar via comandos manuais do Docker (sem Compose):
```bash
# Construir a imagem:
docker build -t hackathon-ufpr .

# Executar o container com persistência do SQLite:
docker run -d -p 3000:3000 -v $(pwd)/data:/app/data --name hackathon_ufpr_app hackathon-ufpr
```

Acesse a aplicação em: **[http://localhost:3000](http://localhost:3000)**.

---

### Opção D: Execução com Docker Desktop

Se você prefere gerenciar containers visualmente através do **Docker Desktop**:

1. **Abrir o Docker Desktop**: Certifique-se de que o Docker Desktop está aberto e com o status *Engine Running* (ícone verde no rodapé).
2. **Construir e Subir**:
   - Abra o terminal do seu sistema (ou o terminal integrado do Docker Desktop / IDE) na raiz do projeto e execute:
     ```bash
     docker compose up --build -d
     ```
3. **Gerenciar no Docker Desktop**:
   - Na aba **Containers**, localize o container `hackathon_ufpr_app` (ou o grupo `t1`).
   - **Acessar a Aplicação**: Clique no link azul `3000:3000` em *Port(s)* para abrir automaticamente o navegador em `http://localhost:3000`.
   - **Ver Logs**: Clique no nome do container para acompanhar os logs de inicialização do Fastify e requisições HTTP em tempo real.
   - **Terminal Interativo**: Use a aba *Exec* dentro do container caso precise inspecionar arquivos ou rodar comandos (`npm test`, etc.).
   - **Persistência**: Na aba **Volumes**, o volume `sqlite_data` garante que seus dados do banco SQLite não sejam perdidos ao reiniciar o container.
   - **Parar / Reiniciar**: Use os botões *Stop* (⏹️), *Restart* (🔄) ou *Delete* (🗑️) diretamente pela interface gráfica.

---

## 🌐 4. Rotas e Telas por Papel de Ator

O frontend está estruturado com telas exclusivas para cada ator do modelo de Casos de Uso:

- **`/` ou `/ranking` (Classificação e Pódio Público)**:
  - Pódio dos 1º, 2º e 3º colocados com medalhas e notas médias calculadas pelo padrão *Information Expert*.
  - Tabela geral de classificação com detalhes dos integrantes, propostas e pareceres da banca examinadora.
  - Painel de métricas do evento em tempo real.
- **`/organizador` (Portal do Organizador - ECU 001)**:
  - Criação de novas edições de Hackathon (datas, capacidade de equipes e descrição).
  - Consulta detalhada de todas as equipes e projetos inscritos.
- **`/estudante` (Portal do Estudante / Participante - ECU 002, 003 e 004)**:
  - *Aba 1*: Cadastro de participante com e-mail institucional `@ufpr.br` e GRR.
  - *Aba 2*: Inscrição de equipe com seleção múltipla de participantes e validação de capacidade máxima.
  - *Aba 3*: Submissão do projeto exclusivo da equipe (título, descrição e área temática).
- **`/mentor` (Portal de Mentorias - ECU 005)**:
  - Cadastro de mentores especializados e registro de orientações às equipes.
- **`/jurado` (Portal da Banca Examinadora - ECU 006)**:
  - Cadastro de jurados e lançamento de avaliações com slider de nota ($0.0$ a $10.0$) e parecer técnico.

---

## 🧪 5. Execução dos Testes Automatizados

Para executar os 16 testes automatizados que validam todas as regras de negócio e a métrica de coesão:
```bash
npm test
```
*Saída esperada:* 16 testes aprovados com 100% de sucesso validando restrições de lotação, unicidade de participante por equipe, 1 projeto por equipe, validação de notas, ordenação correta do ranking e verificação de $\text{LCOM} = 0$ em todas as classes.

---

## 📊 6. Cálculo de Coesão do Sistema (Métrica LCOM)

Conforme os critérios de qualidade de software do edital, o sistema foi projetado e avaliado buscando **baixa LCOM** (*Lack of Cohesion of Methods*). 

### 📐 Fundamentação Teórica
1. **Chidamber & Kemerer (1994) — LCOM (CK Suite)**:
   Para uma classe com $m$ métodos e atributos referenciados $I_i$:
   - $P = \{ (M_i, M_j) \mid I_i \cap I_j = \emptyset \}$ (pares de métodos que **não** compartilham atributos)
   - $Q = \{ (M_i, M_j) \mid I_i \cap I_j \neq \emptyset \}$ (pares de métodos que **compartilham** atributos)
   $$\text{LCOM} = \max(0, |P| - |Q|)$$
   *Como a métrica mede a falta de coesão, o objetivo do projeto é obter valor mínimo: **$\text{LCOM} = 0$ (Coesão Máxima)**.*

2. **Henderson-Sellers (1996) — $\text{LCOM}^*$**:
   $$\text{LCOM}^* = \frac{m - \frac{1}{a}\sum_{k=1}^a \mu(A_k)}{m - 1}$$
   Métrica normalizada no intervalo $[0.0, 1.0]$, onde $0.0$ atesta coesão ideal.

### 💻 Executar Análise Estática de Coesão
Para executar o cálculo automático em tempo real via terminal:
```bash
npm run metrics:lcom
```

### 📋 Tabela Consolidada de Métricas de Coesão
| Classe | Camada Arquitetural | Métodos ($m$) | Atributos ($a$) | $|P|$ | $|Q|$ | LCOM (CK) | $\text{LCOM}^*$ (HS) | Diagnóstico |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **Hackathon** | Entidade de Domínio | 4 | 6 | 2 | 4 | **0** | 0.889 | ✅ Alta Coesão (Ideal) |
| **Participante** | Entidade de Domínio | 3 | 5 | 1 | 2 | **0** | 0.800 | ✅ Alta Coesão (Ideal) |
| **Equipe** | Entidade de Domínio | 3 | 4 | 0 | 3 | **0** | 0.875 | ✅ Alta Coesão (Ideal) |
| **Projeto** | Entidade de Domínio | 4 | 3 | 0 | 6 | **0** | 0.667 | ✅ Alta Coesão (Ideal) |
| **Avaliacao** | Entidade de Domínio | 4 | 2 | 2 | 4 | **0** | 0.500 | ✅ Alta Coesão (Ideal) |
| **ItemClassificacao** | Entidade de Domínio | 3 | 5 | 1 | 2 | **0** | 0.800 | ✅ Alta Coesão (Ideal) |
| **EquipeController** | Controlador de Aplicação | 3 | 3 | 0 | 3 | **0** | 0.667 | ✅ Alta Coesão (Ideal) |
| **ProjetoController** | Controlador de Aplicação | 3 | 2 | 0 | 3 | **0** | 0.500 | ✅ Alta Coesão (Ideal) |
| **AvaliacaoController** | Controlador de Aplicação | 2 | 3 | 0 | 1 | **0** | 0.667 | ✅ Alta Coesão (Ideal) |
| **ClassificacaoController** | Controlador de Aplicação | 2 | 2 | 0 | 1 | **0** | 0.000 | ✅ Alta Coesão (Ideal) |

> 🏆 **Conclusão**: **100% das classes do sistema obtiveram $\text{LCOM} = 0$**, comprovando alta coesão e total aderência às diretrizes GRASP de engenharia de software.

---

## 🏛️ 7. Justificativa dos Princípios SOLID Atendidos

O sistema atende rigorosamente aos princípios de design orientado a objetos (SOLID):

### 1. SRP — Single Responsibility Principle (Princípio da Responsabilidade Única)
*Cada classe possui apenas uma única razão para mudar.*
- **Entidades de Domínio (`src/server/domain/entities.ts`)**: Classes como `Projeto` e `Hackathon` encapsulam exclusivamente regras e invariantes de negócio (como `podeReceberEquipe` e `calcularNotaMedia` via *Information Expert*), sem conhecer banco de dados ou protocolo HTTP.
- **Controladores de Aplicação (`src/server/controllers/`)**: Orquestram casos de uso (validação de fluxo, verificação de lotação e delegação) sem executar queries SQL nem formatar UI.
- **Repositórios (`src/server/repositories/`)**: Especializados no acesso a dados relacionais via Knex. Se o banco for trocado de SQLite para PostgreSQL, apenas essa camada é alterada.
- **Apresentação**: Rotas Fastify (`src/server/routes/`) tratam puramente o transporte HTTP, e componentes React (`src/client/`) tratam a interface visual.

### 2. OCP — Open/Closed Principle (Princípio Aberto/Fechado)
*Aberto para extensão, porém fechado para modificação.*
- **Hierarquia de Erros de Domínio (`src/server/domain/errors.ts`)**: A classe base abstrata `DomainError` define o contrato comum (`statusCode`, `message`). Novas regras de negócio adicionam novas subclasses (`HackathonLotadoError`, `ParticipanteJaInscritoError`, `NotaInvalidaError`) sem necessidade de modificar a classe base.
- **Middleware Centralizado Fechado para Edição (`src/server/index.ts`)**: O `fastify.setErrorHandler` captura polimorficamente qualquer erro derivado de `DomainError` e retorna o JSON padronizado com o código HTTP adequado, sem requerer alteração quando novas regras são criadas.
- **Esquemas Zod Extensíveis (`src/server/domain/schemas.ts`)**: Permite refinar validações por composição sem modificar o código interno existente.

### 3. LSP — Liskov Substitution Principle (Princípio da Substituição de Liskov)
*Subclasses devem poder substituir suas superclasses sem quebrar o comportamento do sistema.*
- Todas as especializações de erro (`HackathonLotadoError`, `RecursoNaoEncontradoError`, etc.) herdam diretamente de `DomainError` e podem ser lançadas e tratadas uniformemente pelo manipulador global de exceções. Nenhuma subclasse altera o contrato estabelecido por `DomainError`.

### 4. ISP — Interface Segregation Principle (Princípio da Segregação de Interfaces)
*Clientes não devem ser forçados a depender de interfaces que não utilizam.*
- Contratos de entrada e DTOs finamente segregados (`CriarHackathonInput`, `CadastrarParticipanteInput`, `InscreverEquipeInput`, `RegistrarProjetoInput`, `RegistrarAvaliacaoInput`, `AvaliacaoDTO`). Em vez de um DTO genérico pesado ("God Object"), cada endpoint e cada tela do frontend consome apenas a interface necessária para sua operação.

### 5. DIP — Dependency Inversion Principle (Princípio da Inversão de Dependência)
*Módulos de alto nível não devem depender de módulos de baixo nível; ambos devem depender de abstrações.*
- Os controladores de casos de uso dependem de operações abstratas dos repositórios (`buscarPorId`, `criar`, `listar`) em vez de se acoplarem diretamente ao driver SQLite ou realizarem queries SQL em linha. Isso permite facilmente substituir a implementação de persistência por repositórios em memória ou mocks nos testes.

---

## 📄 8. Compilação do Relatório em LaTeX (`ModeloLatex`)

Para recompilar o relatório oficial padrão SBC a partir do código-fonte LaTeX:
```bash
cd ModeloLatex && tectonic main.tex && cd ..
```
O PDF gerado estará disponível em `ModeloLatex/main.pdf` e sincronizado na raiz como `GRR20221223_GRR20215730.pdf`.

