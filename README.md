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
4. **Contratos de Operação (Padrão Craig Larman)**: Pré e pós-condições formais detalhadas no relatório LaTeX.
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

Para executar os 15 testes automatizados que validam todas as regras de negócio:
```bash
npm test
```
*Saída esperada:* 15 testes aprovados com 100% de sucesso validando restrições de lotação, unicidade de participante por equipe, 1 projeto por equipe, validação de notas e ordenação correta do ranking.

---

## 📄 6. Compilação do Relatório em LaTeX (`ModeloLatex`)

Para recompilar o relatório oficial a partir do código-fonte LaTeX:
```bash
cd ModeloLatex && tectonic main.tex && cd ..
```
O PDF gerado estará disponível em `ModeloLatex/main.pdf` e na raiz como `GRR20221223_GRR20215730.pdf`.
