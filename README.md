# Sistema de Gestão de Hackathons Acadêmicos (HackDInf UFPR)
**Engenharia de Software (2026/1) — Primeiro Trabalho Prático**  
**Departamento de Informática (DInf) — Universidade Federal do Paraná (UFPR)**  
**Professor:** Prof. Diego Addan  

### Autores:
- **Mateus Siqueira Ruzene** — GRR20221223
- **Gabriel Claudino de Souza** — GRR20215730

---

## 📌 1. Visão Geral do Projeto

Este projeto consiste na modelagem completa em **UML (Unified Modeling Language)**, aplicação dos padrões **GRASP** de atribuição de responsabilidades e implementação orientada a objetos de um sistema para gestão de **Hackathons Acadêmicos** do DInf - UFPR.

O software gerencia todo o ciclo do evento:
1. **Configuração de Hackathons:** Criação de edições com limite de equipes e períodos.
2. **Cadastro de Participantes:** Registro de estudantes com curso e GRR.
3. **Formação de Equipes:** Inscrição de equipes com 1 ou mais estudantes e validação de capacidade máxima.
4. **Submissão de Projetos:** Registro de 1 projeto único por equipe (título, descrição e área temática).
5. **Mentorias:** Acompanhamento de mentores com registro de feedbacks e orientações.
6. **Banca Julgadora e Avaliações:** Atribuição de notas (0 a 10) e pareceres por jurados.
7. **Ranking e Classificação Final:** Cálculo automatizado da média aritmética e ordenação com desempate.
8. **Consultas e Relatórios:** Métricas consolidadas para organizadores.

---

## 🏛️ 2. Arquitetura e Padrões de Projeto (GRASP)

O sistema adota uma **Arquitetura Limpa em Camadas**:
- `domain/`: Entidades de negócio (`Hackathon`, `Equipe`, `Participante`, `Projeto`, `Mentor`, `Mentoria`, `Jurado`, `Avaliacao`) e regras de validação.
- `repositories/`: Interfaces e repositórios em memória com suporte a persistência e serialização.
- `application/`: Controladores de caso de uso (Padrão **GRASP Controller**) e Fachada Geral (**GoF Facade**).
- `presentation/`: Interface de Linha de Comando (CLI) interativa colorida e Servidor HTTP com API REST e Dashboard Web responsiva.

### Padrões GRASP Aplicados:
- **Controller:** Separação entre apresentação e lógica de aplicação (`EquipeController`, `ProjetoController`, etc.).
- **Information Expert:** O cálculo da nota final do projeto pertence à classe `Projeto`, especialista nas suas avaliações.
- **Creator:** Criação de instâncias orquestrada pelos controladores e agregadores naturais.
- **Low Coupling & High Cohesion:** Módulos altamente coesos e desacoplados via repositórios e injeção de dependências.

---

## 🚀 3. Como Executar o Sistema

Requisitos: **Python 3.8+** (sem necessidade de instalar pacotes externos para a execução do software).

### 3.1 Interface de Linha de Comando (CLI Interativa)
Execute o comando:
```bash
python3 src/main.py --cli
```
*Dica:* Use a opção **`D`** no menu principal para carregar o conjunto de dados completo de demonstração da UFPR!

### 3.2 Servidor Web e Dashboard Gráfica
Execute o comando:
```bash
python3 src/main.py --web --port 8080
```
Em seguida, abra o navegador em: [http://localhost:8080](http://localhost:8080)

### 3.3 Executar Testes Automatizados (16 testes unitários e de integração)
```bash
python3 src/main.py --test
```

### 3.4 Executar Demonstração Automatizada no Terminal
```bash
python3 src/main.py --demo
```

---

## 📄 4. Artefatos de Entrega

- `GRR20221223_GRR20215730.pdf` (e `GRR20221223 GRR20215730.pdf`): Documento PDF acadêmico completo com todos os Casos de Uso (ECU), Diagrama Conceitual, Diagramas de Sequência de Sistema (DSS), Contratos de Operação formais, Diagramas de Interação GRASP, Diagrama de Classes Visão de Projeto (DCD) e Diagrama de Pacotes.
- `GRR20221223_GRR20215730.tar.gz`: Arquivo compactado com o código-fonte, diagramas, testes e documentação.
- `EXPLICACAO_DO_TRABALHO.md`: Documento explicativo detalhado passo a passo de todo o projeto.
