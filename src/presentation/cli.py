"""
Interface de Linha de Comando (CLI) Interativa.
Sistema de Gestão de Hackathons Acadêmicos (DInf - UFPR).
Trabalho Prático 1 - Engenharia de Software - 2026/1
Alunos: Mateus Siqueira Ruzene (GRR20221223) e Gabriel Claudino de Souza (GRR20215730)
"""

import sys
import os

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from typing import Optional
from src.application.controllers import SistemaHackathonFacade
from src.domain.exceptions import DomainException


class HackathonCLI:
    def __init__(self, facade: SistemaHackathonFacade):
        self.facade = facade
        self.hackathon_atual_id: Optional[str] = None

    def limpar_tela(self):
        print("\n" + "=" * 78)

    def cabecalho(self):
        print("=" * 78)
        print("  UNIVERSIDADE FEDERAL DO PARANÁ (UFPR) - DEPARTAMENTO DE INFORMÁTICA")
        print("  SISTEMA DE GESTÃO DE HACKATHONS ACADÊMICOS (HACK-DINF)")
        print("  Autores: Mateus Siqueira Ruzene (GRR20221223) | Gabriel Claudino de Souza (GRR20215730)")
        print("  Engenharia de Software 2026/1 - Prof. Diego Addan")
        print("=" * 78)

    def menu_principal(self):
        while True:
            self.cabecalho()
            hack_info = "Nenhum selecionado"
            if self.hackathon_atual_id:
                try:
                    h = self.facade.hackathons.buscar_por_id(self.hackathon_atual_id)
                    hack_info = f"{h.nome} [{h.id}]"
                except Exception:
                    self.hackathon_atual_id = None

            print(f"  HACKATHON ATIVO: {hack_info}")
            print("-" * 78)
            print("  1. [ECU 001] Gerenciar Hackathons (Cadastrar / Selecionar / Listar)")
            print("  2. [ECU 002] Cadastrar Participante (Estudante)")
            print("  3. [ECU 003] Formar e Inscrever Equipe no Hackathon")
            print("  4. [ECU 004] Registrar Projeto da Equipe")
            print("  5. [ECU 005] Cadastrar Mentores e Jurados")
            print("  6. [ECU 006] Registrar Mentoria de Equipe")
            print("  7. [ECU 007] Registrar Avaliação de Projeto (Jurados)")
            print("  8. [ECU 008] Determinar Classificação Final e Ranking dos Projetos")
            print("  9. [ECU 009] Consultar Informações Completas do Hackathon (Relatório)")
            print("  ------------------------------------------------------------------")
            print("  D. Carregar Dados de Demonstração (Seed com Hackathon UFPR Completo)")
            print("  0. Sair do Sistema")
            print("=" * 78)

            opcao = input(" Escolha uma opção [0-9 ou D]: ").strip().upper()

            if opcao == "0":
                print("\nEncerrando o Sistema de Gestão de Hackathons. Até logo!\n")
                sys.exit(0)
            elif opcao == "D":
                self.carregar_seed()
            elif opcao == "1":
                self.menu_hackathons()
            elif opcao == "2":
                self.cadastrar_participante()
            elif opcao == "3":
                self.inscrever_equipe()
            elif opcao == "4":
                self.registrar_projeto()
            elif opcao == "5":
                self.cadastrar_mentor_ou_jurado()
            elif opcao == "6":
                self.registrar_mentoria()
            elif opcao == "7":
                self.registrar_avaliacao()
            elif opcao == "8":
                self.exibir_classificacao()
            elif opcao == "9":
                self.exibir_relatorio_completo()
            else:
                print("\n[ERRO] Opção inválida! Pressione ENTER para tentar novamente.")
                input()

    def carregar_seed(self):
        print("\n--> Carregando dados de demonstração da UFPR...")
        self.hackathon_atual_id = self.facade.semear_dados_exemplo()
        print(f"[SUCESSO] Hackathon carregado e selecionado! ID: {self.hackathon_atual_id}")
        input("\nPressione ENTER para continuar...")

    def menu_hackathons(self):
        print("\n--- [ECU 001] GERENCIAR HACKATHONS ---")
        print("1. Cadastrar Novo Hackathon")
        print("2. Listar Todos os Hackathons")
        print("3. Selecionar Hackathon Ativo")
        print("0. Voltar ao Menu Principal")
        sub = input("Opção: ").strip()

        if sub == "1":
            nome = input("Nome do Hackathon: ").strip()
            data_ini = input("Data de Início (ex: 2026-09-10): ").strip()
            data_fim = input("Data de Término (ex: 2026-09-12): ").strip()
            max_eq = input("Número Máximo de Equipes: ").strip()
            desc = input("Descrição do Evento: ").strip()
            try:
                h = self.facade.hackathons.cadastrar_hackathon(nome, data_ini, data_fim, int(max_eq), desc)
                self.hackathon_atual_id = h.id
                print(f"\n[SUCESSO] Hackathon '{h.nome}' cadastrado com sucesso! ID: {h.id}")
            except Exception as e:
                print(f"\n[ERRO] Falha ao cadastrar: {e}")
        elif sub == "2":
            hacks = self.facade.hackathons.listar_hackathons()
            if not hacks:
                print("\nNenhum hackathon cadastrado.")
            else:
                print("\n--- HACKATHONS CADASTRADOS ---")
                for h in hacks:
                    print(f"• ID: {h.id} | Nome: {h.nome} | Período: {h.data_inicio} até {h.data_termino} | Limite Equipes: {h.max_equipes} (Inscritas: {len(h.equipes)})")
        elif sub == "3":
            hacks = self.facade.hackathons.listar_hackathons()
            if not hacks:
                print("\nNenhum hackathon cadastrado.")
            else:
                for idx, h in enumerate(hacks, 1):
                    print(f"{idx}. {h.nome} ({h.id})")
                esc = input("Selecione o número do hackathon: ").strip()
                try:
                    num = int(esc) - 1
                    if 0 <= num < len(hacks):
                        self.hackathon_atual_id = hacks[num].id
                        print(f"[SUCESSO] Hackathon '{hacks[num].nome}' selecionado como ativo.")
                except Exception:
                    print("[ERRO] Seleção inválida.")
        input("\nPressione ENTER para continuar...")

    def cadastrar_participante(self):
        print("\n--- [ECU 002] CADASTRAR PARTICIPANTE (ESTUDANTE) ---")
        nome = input("Nome Completo: ").strip()
        email = input("E-mail Institucional: ").strip()
        curso = input("Curso (ex: Ciência da Computação): ").strip()
        matricula = input("Matrícula / GRR (ex: GRR20221223): ").strip()

        try:
            p = self.facade.participantes.cadastrar_participante(nome, email, curso, matricula)
            print(f"\n[SUCESSO] Participante {p.nome} ({p.matricula}) cadastrado com sucesso! ID: {p.id}")
        except Exception as e:
            print(f"\n[ERRO] {e}")
        input("\nPressione ENTER para continuar...")

    def inscrever_equipe(self):
        print("\n--- [ECU 003] INSCREVER EQUIPE NO HACKATHON ---")
        if not self.hackathon_atual_id:
            print("[AVISO] Selecione ou crie um Hackathon primeiro (Opção 1 ou D).")
            input("\nPressione ENTER para voltar...")
            return

        nome_eq = input("Nome da Equipe: ").strip()
        participantes = self.facade.participantes.listar_participantes()
        if not participantes:
            print("\n[ERRO] Nenhum participante cadastrado no sistema. Cadastre participantes primeiro (Opção 2).")
            input("\nPressione ENTER para voltar...")
            return

        print("\nParticipantes Disponíveis:")
        for idx, p in enumerate(participantes, 1):
            print(f"{idx}. {p.nome} - GRR: {p.matricula} ({p.curso}) [ID: {p.id}]")

        escolhas = input("\nDigite os números dos participantes separados por vírgula (ex: 1, 2): ").strip()
        ids_selecionados = []
        try:
            for num_str in escolhas.split(","):
                idx = int(num_str.strip()) - 1
                if 0 <= idx < len(participantes):
                    ids_selecionados.append(participantes[idx].id)
            
            eq = self.facade.equipes.inscrever_equipe(nome_eq, self.hackathon_atual_id, ids_selecionados)
            print(f"\n[SUCESSO] Equipe '{eq.nome}' inscrita com sucesso no Hackathon! Total de membros: {len(eq.participantes)}")
        except Exception as e:
            print(f"\n[ERRO] Falha na inscrição da equipe: {e}")
        input("\nPressione ENTER para continuar...")

    def registrar_projeto(self):
        print("\n--- [ECU 004] REGISTRAR PROJETO DA EQUIPE ---")
        if not self.hackathon_atual_id:
            print("[AVISO] Selecione um Hackathon ativo primeiro.")
            input("\nPressione ENTER para voltar...")
            return

        equipes = self.facade.equipes.listar_equipes_por_hackathon(self.hackathon_atual_id)
        if not equipes:
            print("Nenhuma equipe inscrita neste hackathon.")
            input("\nPressione ENTER para voltar...")
            return

        print("\nEquipes inscritas:")
        for idx, eq in enumerate(equipes, 1):
            status = f"Projeto: '{eq.projeto.titulo}'" if eq.projeto else "Sem projeto registrado"
            print(f"{idx}. {eq.nome} ({status})")

        esc = input("\nEscolha o número da equipe: ").strip()
        try:
            num = int(esc) - 1
            if 0 <= num < len(equipes):
                eq_escolhida = equipes[num]
                titulo = input("Título do Projeto: ").strip()
                descricao = input("Descrição da Proposta: ").strip()
                area = input("Área Temática (ex: Inteligência Artificial, Saúde, Cidades Inteligentes): ").strip()

                proj = self.facade.projetos.registrar_projeto(eq_escolhida.id, titulo, descricao, area)
                print(f"\n[SUCESSO] Projeto '{proj.titulo}' registrado para a equipe '{eq_escolhida.nome}'! ID: {proj.id}")
        except Exception as e:
            print(f"\n[ERRO] Falha ao registrar projeto: {e}")
        input("\nPressione ENTER para continuar...")

    def cadastrar_mentor_ou_jurado(self):
        print("\n--- [ECU 005] CADASTRAR MENTOR OU JURADO ---")
        print("1. Cadastrar Mentor")
        print("2. Cadastrar Jurado")
        print("3. Listar Mentores e Jurados")
        sub = input("Opção: ").strip()

        if sub == "1":
            nome = input("Nome do Mentor: ").strip()
            email = input("E-mail: ").strip()
            esp = input("Especialidade (ex: Engenharia de Software, IA, UX): ").strip()
            inst = input("Instituição / Empresa: ").strip()
            try:
                m = self.facade.mentorias.cadastrar_mentor(nome, email, esp, inst)
                print(f"\n[SUCESSO] Mentor '{m.nome}' cadastrado com sucesso! ID: {m.id}")
            except Exception as e:
                print(f"\n[ERRO] {e}")
        elif sub == "2":
            nome = input("Nome do Jurado: ").strip()
            email = input("E-mail: ").strip()
            inst = input("Instituição / Organização: ").strip()
            try:
                j = self.facade.avaliacoes.cadastrar_jurado(nome, email, inst)
                print(f"\n[SUCESSO] Jurado '{j.nome}' cadastrado com sucesso! ID: {j.id}")
            except Exception as e:
                print(f"\n[ERRO] {e}")
        elif sub == "3":
            print("\n--- MENTORES CADASTRADOS ---")
            for m in self.facade.mentorias.listar_todos_mentores():
                print(f"• {m.nome} ({m.especialidade} - {m.instituicao})")
            print("\n--- JURADOS CADASTRADOS ---")
            for j in self.facade.avaliacoes.listar_todos_jurados():
                print(f"• {j.nome} ({j.instituicao})")
        input("\nPressione ENTER para continuar...")

    def registrar_mentoria(self):
        print("\n--- [ECU 006] REGISTRAR MENTORIA ---")
        if not self.hackathon_atual_id:
            print("[AVISO] Selecione um Hackathon ativo primeiro.")
            input("\nPressione ENTER para voltar...")
            return

        mentores = self.facade.mentorias.listar_todos_mentores()
        if not mentores:
            print("Nenhum mentor cadastrado.")
            input("\nPressione ENTER para voltar...")
            return

        equipes = self.facade.equipes.listar_equipes_por_hackathon(self.hackathon_atual_id)
        if not equipes:
            print("Nenhuma equipe cadastrada.")
            input("\nPressione ENTER para voltar...")
            return

        print("\nMentores:")
        for idx, m in enumerate(mentores, 1):
            print(f"{idx}. {m.nome} ({m.especialidade})")
        idx_m = int(input("Escolha o Mentor: ").strip()) - 1

        print("\nEquipes:")
        for idx, eq in enumerate(equipes, 1):
            print(f"{idx}. {eq.nome}")
        idx_eq = int(input("Escolha a Equipe atendida: ").strip()) - 1

        comentarios = input("Comentários e orientações realizadas: ").strip()

        try:
            mentoria = self.facade.mentorias.registrar_mentoria(
                mentores[idx_m].id,
                equipes[idx_eq].id,
                comentarios
            )
            print(f"\n[SUCESSO] Mentoria registrada com sucesso! Data/Hora: {mentoria.data_hora}")
        except Exception as e:
            print(f"\n[ERRO] {e}")
        input("\nPressione ENTER para continuar...")

    def registrar_avaliacao(self):
        print("\n--- [ECU 007] REGISTRAR AVALIAÇÃO DE PROJETO (JURADOS) ---")
        if not self.hackathon_atual_id:
            print("[AVISO] Selecione um Hackathon ativo primeiro.")
            input("\nPressione ENTER para voltar...")
            return

        jurados = self.facade.avaliacoes.listar_todos_jurados()
        if not jurados:
            print("Nenhum jurado cadastrado.")
            input("\nPressione ENTER para voltar...")
            return

        projetos = self.facade.projetos.listar_por_hackathon(self.hackathon_atual_id)
        if not projetos:
            print("Nenhum projeto cadastrado neste hackathon.")
            input("\nPressione ENTER para voltar...")
            return

        print("\nJurados:")
        for idx, j in enumerate(jurados, 1):
            print(f"{idx}. {j.nome} ({j.instituicao})")
        idx_j = int(input("Escolha o Jurado: ").strip()) - 1

        print("\nProjetos a serem avaliados:")
        for idx, p in enumerate(projetos, 1):
            print(f"{idx}. {p.titulo} [Área: {p.area_tematica}] (Avaliações atuais: {len(p.avaliacoes)})")
        idx_p = int(input("Escolha o Projeto: ").strip()) - 1

        nota_str = input("Nota (de 0.0 a 10.0): ").strip()
        comentarios = input("Comentários e justificativa da avaliação: ").strip()

        try:
            nota = float(nota_str)
            av = self.facade.avaliacoes.registrar_avaliacao(
                jurados[idx_j].id,
                projetos[idx_p].id,
                nota,
                comentarios
            )
            print(f"\n[SUCESSO] Avaliação registrada! Nota: {av.nota} para o projeto '{projetos[idx_p].titulo}'.")
        except Exception as e:
            print(f"\n[ERRO] {e}")
        input("\nPressione ENTER para continuar...")

    def exibir_classificacao(self):
        print("\n--- [ECU 008] CLASSIFICAÇÃO FINAL E RANKING DOS PROJETOS ---")
        if not self.hackathon_atual_id:
            print("[AVISO] Selecione um Hackathon ativo primeiro.")
            input("\nPressione ENTER para voltar...")
            return

        try:
            ranking = self.facade.classificacao.calcular_classificacao_final(self.hackathon_atual_id)
            if not ranking:
                print("Nenhum projeto avaliado para gerar ranking.")
            else:
                print("=" * 82)
                print(f"{'POS':<5} | {'PROJETO':<24} | {'EQUIPE':<20} | {'ÁREA':<18} | {'MÉDIA':<6}")
                print("=" * 82)
                for item in ranking:
                    medalha = "🥇 " if item.posicao == 1 else ("🥈 " if item.posicao == 2 else ("🥉 " if item.posicao == 3 else f"{item.posicao}º "))
                    print(f"{medalha:<5} | {item.titulo_projeto:<24} | {item.nome_equipe:<20} | {item.area_tematica:<18} | {item.nota_media:.2f} ({item.total_avaliacoes} avaliações)")
                print("=" * 82)
        except Exception as e:
            print(f"\n[ERRO] {e}")
        input("\nPressione ENTER para continuar...")

    def exibir_relatorio_completo(self):
        print("\n--- [ECU 009] RELATÓRIO GERAL DO HACKATHON ---")
        if not self.hackathon_atual_id:
            print("[AVISO] Selecione um Hackathon ativo primeiro.")
            input("\nPressione ENTER para voltar...")
            return

        try:
            rel = self.facade.classificacao.gerar_relatorio_hackathon(self.hackathon_atual_id)
            h = rel["hackathon"]
            m = rel["metricas"]

            print("=" * 78)
            print(f"RELATÓRIO CONSOLIDADO: {h['nome']}")
            print(f"Período: {h['data_inicio']} até {h['data_termino']} | Limite de Equipes: {h['max_equipes']}")
            print(f"Descrição: {h['descricao']}")
            print("-" * 78)
            print("MÉTRICAS DO EVENTO:")
            print(f"• Total de Equipes Inscritas: {m['total_equipes']}")
            print(f"• Total de Estudantes Participantes: {m['total_participantes']}")
            print(f"• Total de Projetos Submetidos: {m['total_projetos']}")
            print(f"• Total de Mentorias Realizadas: {m['total_mentorias']}")
            print(f"• Total de Avaliações Emitidas: {m['total_avaliacoes']}")
            print("-" * 78)
            print("EQUIPES & PARTICIPANTES:")
            for eq in rel["equipes"]:
                membros_str = ", ".join([f"{p['nome']} ({p['matricula']})" for p in eq["participantes"]])
                print(f"  • {eq['nome']}: {membros_str}")
            print("-" * 78)
            print("PROJETOS E RANKING FINAL:")
            for item in rel["ranking"]:
                print(f"  {item['posicao']}º Lugar: {item['titulo_projeto']} ({item['nome_equipe']}) - Média: {item['nota_media']:.2f} [{item['area_tematica']}]")
            print("=" * 78)
        except Exception as e:
            print(f"\n[ERRO] {e}")
        input("\nPressione ENTER para continuar...")


def run_cli():
    facade = SistemaHackathonFacade()
    cli = HackathonCLI(facade)
    cli.menu_principal()


if __name__ == "__main__":
    run_cli()
