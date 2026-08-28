# Relatório Explicativo: Primeiro Trabalho Prático de Engenharia de Software (UFPR 2026/1)

**Integrantes da Equipe**:
- **Mateus Siqueira Ruzene** — GRR20221223
- **Gabriel Claudino de Souza** — GRR20215730

**Disciplina**: Engenharia de Software — Bacharelado em Ciência da Computação (UFPR)  
**Professor**: Prof. Diego Addan  

---

## 🎯 1. Resumo Executivo da Solução

O sistema para gerenciamento de **Hackathons Acadêmicos do DInf/UFPR** foi modelado estritamente conforme a notação UML (usando Mermaid) e implementado em uma arquitetura limpa em camadas com:
1. **Modelagem Formal UML com Mermaid**: Diagrama de Casos de Uso, Modelo de Domínio, 7 DSS, Contratos de Operação (Craig Larman), Diagramas de Sequência de Projeto com GRASP, Diagrama de Classes de Projeto (DCD) e Diagrama de Pacotes.
2. **Relatório em LaTeX no Padrão SBC**: Elaborado em `ModeloLatex/main.tex` e compilado em PDF de alta resolução (`GRR20221223_GRR20215730.pdf`).
3. **Backend Node.js + Fastify + Knex.js + SQLite + TypeScript + Zod**: Persistência relacional em banco SQLite (`data/hackathon.sqlite`), entidades de domínio com validações de esquema com Zod e controladores GRASP.
4. **Frontend React + Vite + TypeScript + Zod + Tailwind CSS (`src/client`)**: Interface organizada com telas por papel de ator UML (`/organizador`, `/estudante`, `/mentor`, `/jurado`, `/ranking`).
5. **Containerização Docker**: Configuração com `Dockerfile` e `docker-compose.yml`.

---

## 🏛️ 2. Mapeamento dos Padrões GRASP no Código-Fonte

Se o professor perguntar sobre as decisões de projeto durante a avaliação:

1. **Padrão Controller (Controlador)**:
   - *Onde está:* Em `src/server/controllers/` (`HackathonController`, `EquipeController`, `ProjetoController`, `MentoriaController`, `AvaliacaoController`, `ClassificacaoController`).
   - *Explicação:* Eles recebem as requisições HTTP da camada de apresentação (rotas Fastify) e orquestram a execução dos casos de uso, sem acoplar a UI às regras de domínio.

2. **Padrão Information Expert (Especialista na Informação)**:
   - *Onde está:* No método `calcularNotaMedia(avaliacoes)` da classe `Projeto` (`src/server/domain/entities.ts`).
   - *Explicação:* Como a entidade `Projeto` detém a informação sobre suas avaliações, ela é a especialista responsável pelo cômputo da média aritmética das notas da banca.

3. **Padrão Creator (Criador)**:
   - *Onde está:* Nos controladores de caso de uso (ex: `EquipeController` instancia `Equipe`, `ProjetoController` instancia `Projeto`), delegando a persistência aos repositórios Knex.

4. **Baixo Acoplamento e Alta Coesão (Low Coupling & High Cohesion)**:
   - *Onde está:* A separação em 4 camadas lógicas isoladas (`presentation`, `application`, `domain`, `infrastructure/repositories`) garante que alterações no banco SQLite ou na UI não afetem o domínio.

---

## 💻 3. Como Executar e Demonstrar o Sistema

### 1. Iniciar o Sistema Completo
```bash
npm start
```
Abra o navegador em: **http://localhost:3000**

### 2. Teste Instantâneo no Navegador (Recomendado para a Apresentação)
- Ao abrir a página inicial, clique no botão **"Demo UFPR"** no cabeçalho.
- O banco SQLite será populado na hora com 3 equipes, projetos, mentores, avaliações e o **Pódio de 1º, 2º e 3º lugares** será renderizado imediatamente com notas e gráficos!
- Navegue pelas abas:
  - `/estudante` para demonstrar o cadastro de novos alunos, equipes e projetos;
  - `/mentor` para registrar novas mentorias;
  - `/jurado` para atribuir notas (0 a 10) e ver o ranking recalculado em tempo real!

### 3. Rodar a Bateria de Testes Automatizados
```bash
npm test
```
Executa os 15 testes de integração validando 100% das restrições de negócio (lotação máxima, 1 projeto por equipe, 1 equipe por participante, notas 0-10 e apuração da média).
