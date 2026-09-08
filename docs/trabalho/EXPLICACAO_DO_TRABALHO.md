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
Executa os 16 testes de integração validando 100% das restrições de negócio e atestando $\text{LCOM} = 0$ em todas as classes.

### 4. Executar o Cálculo Formal de Coesão (LCOM)
```bash
npm run metrics:lcom
```
Gera a tabela analítica demonstrando formalmente que todas as 10 classes do sistema possuem $\text{LCOM} = 0$ (Chidamber & Kemerer) e $\text{LCOM}^*$ médio de $0.636$ (Henderson-Sellers).

---

## 📊 4. Como Responder sobre o Cálculo de Coesão (LCOM) na Avaliação

Se o professor perguntar: *"Como vocês mediram a coesão do sistema e por que buscaram baixa LCOM?"*

1. **Conceito de LCOM (*Lack of Cohesion of Methods*)**:
   - Responda que LCOM avalia a **falta de coesão** analisando pares de métodos da classe e os atributos que eles acessam em comum (métrica de Chidamber & Kemerer, 1994).
   - $P$ são os pares de métodos que **não** compartilham atributos; $Q$ são os pares que **compartilham** atributos.
   - A fórmula é: $\text{LCOM} = \max(0, |P| - |Q|)$.
   - Portanto, **quanto menor o LCOM, maior a coesão**. Quando os métodos operam sobre os mesmos atributos da classe, $|Q| \ge |P|$, resultando no valor ótimo de **$\text{LCOM} = 0$**.

2. **Onde está implementado no projeto?**:
   - Refatoramos as entidades de domínio (`Hackathon`, `Participante`, `Equipe`, `Projeto`, `Avaliacao`, `ItemClassificacao`) e os controladores para que cada método atue com propósito coeso sobre os atributos da classe.
   - Criamos o script automatizado `scripts/calculate_lcom.ts` (`npm run metrics:lcom`), que varre as classes e calcula $m$, $a$, $|P|$, $|Q|$, $LCOM$ e $LCOM^*$ (Henderson-Sellers).
   - O teste de regressão contínua em `tests/test_api.ts` garante que nenhuma classe do sistema tenha $\text{LCOM} > 0$.

---

## 🏛️ 5. Como Responder sobre os Princípios SOLID Atendidos

Se o professor perguntar: *"Quais princípios SOLID o sistema atende e onde eles estão no código?"*

1. **SRP (Single Responsibility Principle — Responsabilidade Única)**:
   - *Onde está:* Separação estrita em 4 camadas lógicas:
     - `entities.ts` cuida apenas de regras e invariantes de negócio;
     - `schemas.ts` cuida apenas da validação sintática dos dados;
     - `controllers/` orquestram fluxos de casos de uso sem SQL e sem UI;
     - `repositories/` cuidam exclusivamente de banco SQLite e Knex;
     - `apiRoutes.ts` cuida exclusivamente de transporte HTTP.
   - *Argumento:* Mudar o banco de dados de SQLite para PostgreSQL afeta **apenas** os Repositórios, sem alterar uma única linha dos Controladores ou Entidades.

2. **OCP (Open/Closed Principle — Aberto/Fechado)**:
   - *Onde está:* Na hierarquia de erros em `src/server/domain/errors.ts` e no middleware central em `src/server/index.ts`.
   - *Argumento:* A classe abstrata `DomainError` é aberta para extensão (novos erros como `HackathonLotadoError`, `ParticipanteJaInscritoError`, `NotaInvalidaError` herdam dela), mas o manipulador de erros do Fastify (`setErrorHandler`) está **fechado para modificação** — ele processa polimorficamente qualquer erro de domínio sem precisar ser editado.

3. **LSP (Liskov Substitution Principle — Substituição de Liskov)**:
   - *Onde está:* No uso polimórfico de `DomainError`.
   - *Argumento:* Qualquer subclasse de erro pode substituir `DomainError` mantendo o contrato de `statusCode` e `message`, permitindo que os controladores lancem erros especializados e a aplicação os processe de forma transparente e uniforme.

4. **ISP (Interface Segregation Principle — Segregação de Interfaces)**:
   - *Onde está:* Em `src/server/domain/schemas.ts`.
   - *Argumento:* Em vez de um "God DTO" genérico, criamos interfaces finamente segregadas para cada caso de uso (`CriarHackathonInput`, `CadastrarParticipanteInput`, `InscreverEquipeInput`, etc.). O frontend consome apenas os campos necessários para cada tela de ator (`/organizador`, `/estudante`, `/mentor`, `/jurado`).

5. **DIP (Dependency Inversion Principle — Inversão de Dependência)**:
   - *Onde está:* Na relação entre Controllers e Repositórios.
   - *Argumento:* Os controladores de alto nível dependem de operações abstratas dos repositórios (`buscarPorId`, `criar`, `listar`) em vez de se acoplarem diretamente ao driver SQLite ou consultas SQL em linha, permitindo fácil substituição por mocks ou outros drivers de persistência.

