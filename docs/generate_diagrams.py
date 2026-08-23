"""
Gerador de Diagramas UML em Alta Resolução (Matplotlib / Vector Canvas).
Sistema de Gestão de Hackathons Acadêmicos (DInf - UFPR).
Trabalho Prático 1 - Engenharia de Software 2026/1
Alunos: Mateus Siqueira Ruzene (GRR20221223) e Gabriel Claudino de Souza (GRR20215730)
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Rectangle, Ellipse

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "diagrams"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Estilo visual moderno e elegante
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'


def desenhar_ator(ax, x, y, nome):
    """Desenha o stickman UML e rótulo do ator."""
    # Cabeça
    ax.add_patch(plt.Circle((x, y + 0.35), 0.12, fill=True, color='#1e3a8a', ec='#0f172a', lw=1.5))
    # Tronco
    ax.plot([x, x], [y + 0.23, y - 0.15], color='#0f172a', lw=2)
    # Braços
    ax.plot([x - 0.22, x + 0.22], [y + 0.1, y + 0.1], color='#0f172a', lw=2)
    # Pernas
    ax.plot([x, x - 0.2], [y - 0.15, y - 0.45], color='#0f172a', lw=2)
    ax.plot([x, x + 0.2], [y - 0.15, y - 0.45], color='#0f172a', lw=2)
    # Nome
    ax.text(x, y - 0.65, nome, ha='center', va='top', fontsize=9, fontweight='bold', color='#0f172a')


def gerar_diagrama_casos_de_uso():
    fig, ax = plt.subplots(figsize=(12, 10), dpi=300)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 12)
    ax.axis('off')

    # Retângulo de Fronteira do Sistema
    sys_box = FancyBboxPatch((3.5, 0.5), 7.5, 11.0, boxstyle="round,pad=0.2",
                             fc='#f8fafc', ec='#334155', lw=2, linestyle='-')
    ax.add_patch(sys_box)
    ax.text(7.25, 11.2, "Sistema de Gestão de Hackathons Acadêmicos (HackDInf)",
            ha='center', va='center', fontsize=12, fontweight='bold', color='#1e293b')

    # Atores
    desenhar_ator(ax, 1.5, 9.5, "Organizador")
    desenhar_ator(ax, 1.5, 4.5, "Participante / Líder")
    desenhar_ator(ax, 12.5, 8.5, "Mentor")
    desenhar_ator(ax, 12.5, 3.5, "Jurado")

    # Casos de uso (Elipses)
    uc_list = [
        (7.25, 10.3, "ECU 001: Cadastrar Hackathon"),
        (7.25, 9.1, "ECU 002: Cadastrar Participante"),
        (7.25, 7.9, "ECU 003: Inscrever Equipe no Hackathon"),
        (7.25, 6.7, "ECU 004: Registrar Projeto da Equipe"),
        (7.25, 5.5, "ECU 005: Cadastrar Mentor e Jurado"),
        (7.25, 4.3, "ECU 006: Registrar Mentoria"),
        (7.25, 3.1, "ECU 007: Registrar Avaliação de Projeto"),
        (7.25, 1.9, "ECU 008: Determinar Classificação Final"),
        (7.25, 0.9, "ECU 009: Consultar Informações do Hackathon"),
    ]

    for (cx, cy, label) in uc_list:
        el = Ellipse((cx, cy), 5.4, 0.75, fc='#e0f2fe', ec='#0284c7', lw=1.5)
        ax.add_patch(el)
        ax.text(cx, cy, label, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#0369a1')

    # Conexões Organizador
    for target_y in [10.3, 5.5, 1.9, 0.9]:
        ax.plot([1.8, 4.5], [9.5, target_y], color='#475569', lw=1.2)

    # Conexões Participante
    for target_y in [9.1, 7.9, 6.7]:
        ax.plot([1.8, 4.5], [4.5, target_y], color='#475569', lw=1.2)

    # Conexão Mentor
    ax.plot([12.2, 10.0], [8.5, 4.3], color='#475569', lw=1.2)

    # Conexão Jurado
    ax.plot([12.2, 10.0], [3.5, 3.1], color='#475569', lw=1.2)

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "diagrama_casos_de_uso.png")
    plt.savefig(path, bbox_inches='tight', dpi=300)
    plt.close()
    print(f"[+] Gerado: {path}")


def gerar_diagrama_classes_conceituais():
    fig, ax = plt.subplots(figsize=(14, 10), dpi=300)
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 12)
    ax.axis('off')

    ax.text(8, 11.6, "Modelo de Domínio Conceitual (Sistema de Hackathons - DInf UFPR)",
            ha='center', va='center', fontsize=13, fontweight='bold', color='#0f172a')

    def desenhar_classe_conceitual(x, y, w, h, titulo, atributos):
        # Caixa Externa
        box = FancyBboxPatch((x, y), w, h, boxstyle="square,pad=0", fc='#ffffff', ec='#1e293b', lw=1.5)
        ax.add_patch(box)
        # Cabeçalho
        header = Rectangle((x, y + h - 0.6), w, 0.6, fc='#e2e8f0', ec='#1e293b', lw=1.5)
        ax.add_patch(header)
        ax.text(x + w/2, y + h - 0.3, titulo, ha='center', va='center', fontsize=9.5, fontweight='bold', color='#0f172a')
        # Atributos
        txt = "\n".join(atributos)
        ax.text(x + 0.15, y + h - 0.8, txt, ha='left', va='top', fontsize=8, color='#334155', linespacing=1.3)

    # Hackathon
    desenhar_classe_conceitual(1.0, 7.5, 3.2, 2.8, "Hackathon", [
        "nome",
        "dataInicio",
        "dataTermino",
        "maxEquipes",
        "descricao"
    ])

    # Equipe
    desenhar_classe_conceitual(6.5, 7.5, 3.0, 2.2, "Equipe", [
        "nome"
    ])

    # Participante
    desenhar_classe_conceitual(6.5, 2.5, 3.0, 2.8, "Participante", [
        "nome",
        "email",
        "curso",
        "matricula"
    ])

    # Projeto
    desenhar_classe_conceitual(11.8, 7.5, 3.2, 2.8, "Projeto", [
        "titulo",
        "descricao",
        "areaTematica"
    ])

    # Mentor
    desenhar_classe_conceitual(1.0, 2.5, 3.2, 2.8, "Mentor", [
        "nome",
        "email",
        "especialidade",
        "instituicao"
    ])

    # Mentoria
    desenhar_classe_conceitual(6.5, 0.3, 3.0, 1.8, "Mentoria", [
        "dataHora",
        "comentarios"
    ])

    # Jurado
    desenhar_classe_conceitual(11.8, 2.5, 3.2, 2.4, "Jurado", [
        "nome",
        "email",
        "instituicao"
    ])

    # Avaliacao
    desenhar_classe_conceitual(11.8, 0.3, 3.2, 1.8, "Avaliacao", [
        "nota",
        "comentarios",
        "dataHora"
    ])

    # Relacionamento Hackathon - Equipe (1 possui 0..*)
    ax.plot([4.2, 6.5], [8.6, 8.6], color='#0f172a', lw=1.5)
    ax.text(4.4, 8.8, "1", fontsize=8.5, fontweight='bold')
    ax.text(6.0, 8.8, "0..max", fontsize=8.5, fontweight='bold')
    ax.text(5.3, 9.0, "possui ▶", ha='center', fontsize=8, color='#475569')

    # Relacionamento Equipe - Participante (1 é composta por 1..*)
    ax.plot([8.0, 8.0], [7.5, 5.3], color='#0f172a', lw=1.5)
    ax.text(8.2, 7.2, "1", fontsize=8.5, fontweight='bold')
    ax.text(8.2, 5.5, "1..*", fontsize=8.5, fontweight='bold')
    ax.text(8.4, 6.4, "◀ formada por", va='center', fontsize=8, color='#475569')

    # Relacionamento Equipe - Projeto (1 desenvolve 0..1)
    ax.plot([9.5, 11.8], [8.6, 8.6], color='#0f172a', lw=1.5)
    ax.text(9.7, 8.8, "1", fontsize=8.5, fontweight='bold')
    ax.text(11.3, 8.8, "0..1", fontsize=8.5, fontweight='bold')
    ax.text(10.65, 9.0, "desenvolve ▶", ha='center', fontsize=8, color='#475569')

    # Relacionamento Mentor - Mentoria (1 realiza 0..*)
    ax.plot([4.2, 6.5], [3.2, 1.2], color='#0f172a', lw=1.5)
    ax.text(4.4, 3.3, "1", fontsize=8.5, fontweight='bold')
    ax.text(6.0, 1.4, "0..*", fontsize=8.5, fontweight='bold')
    ax.text(5.0, 2.5, "realiza ▶", fontsize=8, color='#475569')

    # Relacionamento Mentoria - Equipe (0..* orienta 1)
    ax.plot([8.0, 8.0], [2.1, 7.5], color='#0f172a', lw=1.2, linestyle=':')
    ax.text(8.2, 2.3, "0..*", fontsize=8.5, fontweight='bold')
    ax.text(8.2, 7.3, "1", fontsize=8.5, fontweight='bold')

    # Relacionamento Jurado - Avaliacao (1 realiza 0..*)
    ax.plot([13.4, 13.4], [2.5, 2.1], color='#0f172a', lw=1.5)
    ax.text(13.6, 2.3, "1", fontsize=8.5, fontweight='bold')
    ax.text(13.6, 2.2, "0..*", fontsize=8.5, fontweight='bold')

    # Relacionamento Avaliacao - Projeto (0..* avalia 1)
    ax.plot([13.4, 13.4], [7.5, 2.1], color='#0f172a', lw=1.5)
    ax.text(13.6, 7.2, "1", fontsize=8.5, fontweight='bold')
    ax.text(13.6, 2.3, "0..*", fontsize=8.5, fontweight='bold')
    ax.text(13.8, 4.8, "avalia ▶", fontsize=8, color='#475569')

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "diagrama_classes_conceituais.png")
    plt.savefig(path, bbox_inches='tight', dpi=300)
    plt.close()
    print(f"[+] Gerado: {path}")


def desenhar_dss_generico(titulo, ator_nome, mensagens, filename):
    """Gera um Diagrama de Sequência de Sistema (DSS) padronizado."""
    fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 8)
    ax.axis('off')

    ax.text(5, 7.6, titulo, ha='center', va='center', fontsize=11, fontweight='bold', color='#0f172a')

    # Caixas das Linhas de Vida
    # Ator
    desenhar_ator(ax, 2.0, 6.8, ator_nome)
    # Sistema
    sys_rect = FancyBboxPatch((7.0, 6.5), 2.0, 0.7, boxstyle="square,pad=0", fc='#e0f2fe', ec='#0284c7', lw=1.5)
    ax.add_patch(sys_rect)
    ax.text(8.0, 6.85, ":Sistema", ha='center', va='center', fontsize=10, fontweight='bold', color='#0369a1')

    # Linhas tracejadas de vida
    ax.plot([2.0, 2.0], [5.9, 0.5], color='#94a3b8', lw=1.5, linestyle='--')
    ax.plot([8.0, 8.0], [6.5, 0.5], color='#94a3b8', lw=1.5, linestyle='--')

    # Barras de ativação
    act_sys = Rectangle((7.92, 0.8), 0.16, 5.4, fc='#cbd5e1', ec='#475569', lw=1)
    ax.add_patch(act_sys)

    y_pos = 5.6
    step = 4.8 / max(len(mensagens), 1)

    for msg in mensagens:
        tipo = msg.get("tipo", "req")  # "req" ou "resp"
        texto = msg.get("texto", "")

        if tipo == "req":
            # Seta cheia esquerda -> direita
            ax.annotate("", xy=(7.92, y_pos), xytext=(2.0, y_pos),
                        arrowprops=dict(arrowstyle="->", color='#1e293b', lw=1.5))
            ax.text(4.9, y_pos + 0.15, texto, ha='center', va='bottom', fontsize=8.5, fontweight='bold', color='#1e293b')
        else:
            # Seta tracejada retorno direita -> esquerda
            ax.annotate("", xy=(2.0, y_pos), xytext=(7.92, y_pos),
                        arrowprops=dict(arrowstyle="->", color='#0284c7', lw=1.3, linestyle='--'))
            ax.text(4.9, y_pos + 0.15, texto, ha='center', va='bottom', fontsize=8.2, fontstyle='italic', color='#0369a1')

        y_pos -= step

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, filename)
    plt.savefig(path, bbox_inches='tight', dpi=300)
    plt.close()
    print(f"[+] Gerado: {path}")


def gerar_todos_dss():
    # DSS 01: Cadastrar Hackathon
    desenhar_dss_generico(
        "DSS 001: Cadastrar Hackathon (ECU 001)",
        "Organizador",
        [
            {"tipo": "req", "texto": "1: cadastrarHackathon(nome, dtInicio, dtTermino, maxEquipes, desc)"},
            {"tipo": "resp", "texto": "confirmaçãoCadastro(hackathonId, mensagemSucesso)"}
        ],
        "dss_01_cadastrar_hackathon.png"
    )

    # DSS 02: Cadastrar Participante
    desenhar_dss_generico(
        "DSS 002: Cadastrar Participante (ECU 002)",
        "Participante",
        [
            {"tipo": "req", "texto": "1: cadastrarParticipante(nome, email, curso, matriculaGRR)"},
            {"tipo": "resp", "texto": "dadosParticipante(participanteId, statusSucesso)"}
        ],
        "dss_02_cadastrar_participante.png"
    )

    # DSS 03: Inscrever Equipe
    desenhar_dss_generico(
        "DSS 003: Inscrever Equipe no Hackathon (ECU 003)",
        "Líder de Equipe",
        [
            {"tipo": "req", "texto": "1: inscreverEquipe(nomeEquipe, hackathonId, listaParticipantesIds)"},
            {"tipo": "resp", "texto": "confirmacaoInscricao(equipeId, totalMembros, status)"}
        ],
        "dss_03_inscrever_equipe.png"
    )

    # DSS 04: Registrar Projeto
    desenhar_dss_generico(
        "DSS 004: Registrar Projeto da Equipe (ECU 004)",
        "Equipe",
        [
            {"tipo": "req", "texto": "1: registrarProjeto(equipeId, titulo, descricao, areaTematica)"},
            {"tipo": "resp", "texto": "confirmacaoProjeto(projetoId, statusVinculado)"}
        ],
        "dss_04_registrar_projeto.png"
    )

    # DSS 05: Registrar Mentoria
    desenhar_dss_generico(
        "DSS 006: Registrar Mentoria (ECU 006)",
        "Mentor",
        [
            {"tipo": "req", "texto": "1: registrarMentoria(mentorId, equipeId, comentariosOrientacao)"},
            {"tipo": "resp", "texto": "confirmacaoMentoria(mentoriaId, dataHoraRegistro)"}
        ],
        "dss_05_registrar_mentoria.png"
    )

    # DSS 06: Registrar Avaliação
    desenhar_dss_generico(
        "DSS 007: Registrar Avaliação de Projeto (ECU 007)",
        "Jurado",
        [
            {"tipo": "req", "texto": "1: registrarAvaliacao(juradoId, projetoId, nota, parecerComentarios)"},
            {"tipo": "resp", "texto": "confirmacaoAvaliacao(avaliacaoId, statusSucesso)"}
        ],
        "dss_06_registrar_avaliacao.png"
    )

    # DSS 07: Determinar Classificação Final
    desenhar_dss_generico(
        "DSS 008: Determinar Classificação Final (ECU 008)",
        "Organizador",
        [
            {"tipo": "req", "texto": "1: calcularClassificacaoFinal(hackathonId)"},
            {"tipo": "resp", "texto": "tabelaRankingProjetos(listaItemClassificacaoOrdenada)"}
        ],
        "dss_07_determinar_classificacao.png"
    )


def gerar_diagramas_interacao_projeto():
    """Gera os Diagramas de Sequência de Projeto detalhados com Padrões GRASP."""
    
    # 1. Interação: Inscrever Equipe
    fig, ax = plt.subplots(figsize=(13, 8), dpi=300)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)
    ax.axis('off')

    ax.text(7, 8.6, "Diagrama de Interação de Projeto: Inscrever Equipe (GRASP Controller & Creator)",
            ha='center', va='center', fontsize=11, fontweight='bold', color='#0f172a')

    # Objetos
    objs = [
        (1.5, ":UI_Equipe", "#f1f5f9"),
        (4.5, ":EquipeController", "#e0f2fe"),
        (7.8, ":Hackathon", "#fef3c7"),
        (10.5, ":EquipeRepository", "#e2e8f0"),
        (12.8, "eq:Equipe", "#dcfce7")
    ]

    for (x, label, color) in objs:
        rect = FancyBboxPatch((x - 1.1, 7.6), 2.2, 0.6, boxstyle="square,pad=0", fc=color, ec='#334155', lw=1.3)
        ax.add_patch(rect)
        ax.text(x, 7.9, label, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#1e293b')
        ax.plot([x, x], [7.6, 0.6], color='#94a3b8', lw=1.2, linestyle='--')

    # Mensagens de Sequência
    steps = [
        (7.0, 1.5, 4.5, "1: inscreverEquipe(nome, hackId, partIds)", "req"),
        (6.3, 4.5, 7.8, "1.1: podeReceberEquipe()", "req"),
        (5.7, 7.8, 4.5, "capacidadeValida: bool", "resp"),
        (5.0, 4.5, 12.8, "1.2: create(nome, hackId, participantes)", "req"),
        (4.3, 4.5, 10.5, "1.3: salvar(eq)", "req"),
        (3.6, 4.5, 7.8, "1.4: equipes.add(eq)", "req"),
        (2.9, 4.5, 1.5, "retorna eq:Equipe", "resp")
    ]

    for (y, x1, x2, txt, t) in steps:
        if t == "req":
            ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", color='#0f172a', lw=1.4))
            ax.text((x1 + x2)/2, y + 0.12, txt, ha='center', va='bottom', fontsize=8, fontweight='bold', color='#0f172a')
        else:
            ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", color='#0284c7', lw=1.2, linestyle='--'))
            ax.text((x1 + x2)/2, y + 0.12, txt, ha='center', va='bottom', fontsize=7.8, fontstyle='italic', color='#0369a1')

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "diagrama_interacao_inscrever_equipe.png")
    plt.savefig(path, bbox_inches='tight', dpi=300)
    plt.close()
    print(f"[+] Gerado: {path}")

    # 2. Interação: Avaliação e Classificação Final
    fig, ax = plt.subplots(figsize=(13, 8), dpi=300)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)
    ax.axis('off')

    ax.text(7, 8.6, "Diagrama de Interação de Projeto: Calcular Classificação Final (GRASP Information Expert)",
            ha='center', va='center', fontsize=11, fontweight='bold', color='#0f172a')

    objs2 = [
        (1.5, ":UI_Relatorio", "#f1f5f9"),
        (4.5, ":ClassificacaoController", "#e0f2fe"),
        (7.8, ":ProjetoRepository", "#e2e8f0"),
        (10.8, "p:Projeto", "#fef3c7"),
        (13.0, ":ItemClassificacao", "#dcfce7")
    ]

    for (x, label, color) in objs2:
        rect = FancyBboxPatch((x - 1.1, 7.6), 2.2, 0.6, boxstyle="square,pad=0", fc=color, ec='#334155', lw=1.3)
        ax.add_patch(rect)
        ax.text(x, 7.9, label, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#1e293b')
        ax.plot([x, x], [7.6, 0.6], color='#94a3b8', lw=1.2, linestyle='--')

    steps2 = [
        (7.0, 1.5, 4.5, "1: calcularClassificacaoFinal(hackId)", "req"),
        (6.3, 4.5, 7.8, "1.1: listarPorHackathon(hackId)", "req"),
        (5.6, 7.8, 4.5, "projetos: List<Projeto>", "resp"),
        (4.8, 4.5, 10.8, "1.2: [loop cada p] calcularNotaFinal()", "req"),
        (4.1, 10.8, 4.5, "notaMedia: float", "resp"),
        (3.3, 4.5, 4.5, "1.3: sort(decrescente por nota)", "req"),
        (2.5, 4.5, 13.0, "1.4: create(pos, p.id, notaMedia...)", "req"),
        (1.8, 4.5, 1.5, "retorna ranking: List<ItemClassificacao>", "resp")
    ]

    for (y, x1, x2, txt, t) in steps2:
        if t == "req":
            ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", color='#0f172a', lw=1.4))
            ax.text((x1 + x2)/2, y + 0.12, txt, ha='center', va='bottom', fontsize=8, fontweight='bold', color='#0f172a')
        else:
            ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", color='#0284c7', lw=1.2, linestyle='--'))
            ax.text((x1 + x2)/2, y + 0.12, txt, ha='center', va='bottom', fontsize=7.8, fontstyle='italic', color='#0369a1')

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "diagrama_interacao_classificacao_final.png")
    plt.savefig(path, bbox_inches='tight', dpi=300)
    plt.close()
    print(f"[+] Gerado: {path}")

    # 3. Interação: Registrar Projeto
    fig, ax = plt.subplots(figsize=(13, 8), dpi=300)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)
    ax.axis('off')

    ax.text(7, 8.6, "Diagrama de Interação de Projeto: Registrar Projeto (GRASP Creator & Information Expert)",
            ha='center', va='center', fontsize=11, fontweight='bold', color='#0f172a')

    objs3 = [
        (1.5, ":UI_Projeto", "#f1f5f9"),
        (4.5, ":ProjetoController", "#e0f2fe"),
        (7.5, ":EquipeRepository", "#e2e8f0"),
        (10.5, "eq:Equipe", "#fef3c7"),
        (13.0, "p:Projeto", "#dcfce7")
    ]

    for (x, label, color) in objs3:
        rect = FancyBboxPatch((x - 1.1, 7.6), 2.2, 0.6, boxstyle="square,pad=0", fc=color, ec='#334155', lw=1.3)
        ax.add_patch(rect)
        ax.text(x, 7.9, label, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#1e293b')
        ax.plot([x, x], [7.6, 0.6], color='#94a3b8', lw=1.2, linestyle='--')

    steps3 = [
        (7.0, 1.5, 4.5, "1: registrarProjeto(eqId, tit, desc, area)", "req"),
        (6.3, 4.5, 7.5, "1.1: buscarPorId(eqId)", "req"),
        (5.6, 7.5, 4.5, "eq: Equipe", "resp"),
        (4.9, 4.5, 10.5, "1.2: possuiProjeto()", "req"),
        (4.3, 10.5, 4.5, "false", "resp"),
        (3.6, 4.5, 13.0, "1.3: create(tit, desc, area, eqId)", "req"),
        (2.9, 4.5, 10.5, "1.4: associarProjeto(p)", "req"),
        (2.2, 4.5, 1.5, "retorna p:Projeto", "resp")
    ]

    for (y, x1, x2, txt, t) in steps3:
        if t == "req":
            ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", color='#0f172a', lw=1.4))
            ax.text((x1 + x2)/2, y + 0.12, txt, ha='center', va='bottom', fontsize=8, fontweight='bold', color='#0f172a')
        else:
            ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", color='#0284c7', lw=1.2, linestyle='--'))
            ax.text((x1 + x2)/2, y + 0.12, txt, ha='center', va='bottom', fontsize=7.8, fontstyle='italic', color='#0369a1')

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "diagrama_interacao_registrar_projeto.png")
    plt.savefig(path, bbox_inches='tight', dpi=300)
    plt.close()
    print(f"[+] Gerado: {path}")

    # 4. Interação: Registrar Avaliação
    fig, ax = plt.subplots(figsize=(13, 8), dpi=300)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)
    ax.axis('off')

    ax.text(7, 8.6, "Diagrama de Interação de Projeto: Registrar Avaliação (GRASP Controller & Expert)",
            ha='center', va='center', fontsize=11, fontweight='bold', color='#0f172a')

    objs4 = [
        (1.5, ":UI_Avaliacao", "#f1f5f9"),
        (4.5, ":AvaliacaoController", "#e0f2fe"),
        (7.5, ":ProjetoRepository", "#e2e8f0"),
        (10.5, "p:Projeto", "#fef3c7"),
        (13.0, "av:Avaliacao", "#dcfce7")
    ]

    for (x, label, color) in objs4:
        rect = FancyBboxPatch((x - 1.1, 7.6), 2.2, 0.6, boxstyle="square,pad=0", fc=color, ec='#334155', lw=1.3)
        ax.add_patch(rect)
        ax.text(x, 7.9, label, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#1e293b')
        ax.plot([x, x], [7.6, 0.6], color='#94a3b8', lw=1.2, linestyle='--')

    steps4 = [
        (7.0, 1.5, 4.5, "1: registrarAvaliacao(jId, pId, nota, com)", "req"),
        (6.3, 4.5, 7.5, "1.1: buscarPorId(pId)", "req"),
        (5.6, 7.5, 4.5, "p: Projeto", "resp"),
        (4.9, 4.5, 13.0, "1.2: create(jId, pId, nota, com)", "req"),
        (4.2, 4.5, 10.5, "1.3: adicionarAvaliacao(av)", "req"),
        (3.5, 4.5, 7.5, "1.4: salvar(p)", "req"),
        (2.8, 4.5, 1.5, "retorna av:Avaliacao", "resp")
    ]

    for (y, x1, x2, txt, t) in steps4:
        if t == "req":
            ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", color='#0f172a', lw=1.4))
            ax.text((x1 + x2)/2, y + 0.12, txt, ha='center', va='bottom', fontsize=8, fontweight='bold', color='#0f172a')
        else:
            ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", color='#0284c7', lw=1.2, linestyle='--'))
            ax.text((x1 + x2)/2, y + 0.12, txt, ha='center', va='bottom', fontsize=7.8, fontstyle='italic', color='#0369a1')

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "diagrama_interacao_registrar_avaliacao.png")
    plt.savefig(path, bbox_inches='tight', dpi=300)
    plt.close()
    print(f"[+] Gerado: {path}")


def gerar_diagrama_classes_projeto():
    """Gera o Diagrama de Classes - Visão de Projeto detalhado."""
    fig, ax = plt.subplots(figsize=(16, 12), dpi=300)
    ax.set_xlim(0, 20)
    ax.set_ylim(0, 16)
    ax.axis('off')

    ax.text(10, 15.5, "Diagrama de Classes - Visão de Projeto (Design Class Diagram - DCD)",
            ha='center', va='center', fontsize=14, fontweight='bold', color='#0f172a')

    def desenhar_classe_projeto(x, y, w, h, titulo, estereotipo, atributos, metodos, cor_header='#e2e8f0'):
        box = FancyBboxPatch((x, y), w, h, boxstyle="square,pad=0", fc='#ffffff', ec='#1e293b', lw=1.4)
        ax.add_patch(box)
        # Header
        header = Rectangle((x, y + h - 0.7), w, 0.7, fc=cor_header, ec='#1e293b', lw=1.4)
        ax.add_patch(header)
        st_text = f"«{estereotipo}»\n{titulo}" if estereotipo else titulo
        ax.text(x + w/2, y + h - 0.35, st_text, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#0f172a')

        # Linha divisória atributos
        h_attr = len(atributos) * 0.28 + 0.2
        # Atributos
        txt_attr = "\n".join(atributos)
        ax.text(x + 0.12, y + h - 0.85, txt_attr, ha='left', va='top', fontsize=7.2, color='#334155', linespacing=1.2)

        # Linha divisória entre atributos e métodos
        y_div = y + h - 0.7 - h_attr
        ax.plot([x, x + w], [y_div, y_div], color='#1e293b', lw=1)

        # Métodos
        txt_met = "\n".join(metodos)
        ax.text(x + 0.12, y_div - 0.15, txt_met, ha='left', va='top', fontsize=7.2, color='#0f172a', linespacing=1.2)

    # 1. Controladores
    desenhar_classe_projeto(1.0, 10.5, 5.2, 4.2, "SistemaHackathonFacade", "Controller / Facade", [
        "- hackathonRepo: IHackathonRepository",
        "- equipeRepo: IEquipeRepository",
        "- projetoRepo: IProjetoRepository",
        "- avaliacaoRepo: IAvaliacaoRepository"
    ], [
        "+ semearDadosExemplo(): str",
        "+ cadastrarHackathon(...): Hackathon",
        "+ inscreverEquipe(...): Equipe",
        "+ registrarProjeto(...): Projeto",
        "+ registrarMentoria(...): Mentoria",
        "+ registrarAvaliacao(...): Avaliacao",
        "+ calcularClassificacaoFinal(...): List",
        "+ gerarRelatorioHackathon(...): Dict"
    ], '#fed7aa')

    # 2. Entidades de Domínio
    desenhar_classe_projeto(7.5, 10.5, 4.0, 4.2, "Hackathon", "Entity", [
        "+ id: str",
        "+ nome: str",
        "+ data_inicio: str",
        "+ data_termino: str",
        "+ max_equipes: int",
        "+ descricao: str",
        "- equipes: List<Equipe>"
    ], [
        "+ pode_receber_equipe(): bool",
        "+ adicionar_equipe(eq: Equipe): void",
        "+ to_dict(): Dict"
    ], '#dbeafe')

    desenhar_classe_projeto(12.5, 10.5, 3.8, 4.2, "Equipe", "Entity", [
        "+ id: str",
        "+ nome: str",
        "+ hackathon_id: str",
        "+ participantes: List<Participante>",
        "+ projeto: Optional<Projeto>"
    ], [
        "+ validar_membros(): void",
        "+ adicionar_participante(p): void",
        "+ associar_projeto(proj): void",
        "+ to_dict(): Dict"
    ], '#dbeafe')

    desenhar_classe_projeto(12.5, 5.5, 3.8, 4.2, "Projeto", "Entity", [
        "+ id: str",
        "+ titulo: str",
        "+ descricao: str",
        "+ area_tematica: str",
        "+ equipe_id: str",
        "+ hackathon_id: str",
        "- avaliacoes: List<Avaliacao>",
        "- mentorias: List<Mentoria>"
    ], [
        "+ adicionar_avaliacao(av): void",
        "+ adicionar_mentoria(m): void",
        "+ calcular_nota_final(): float",
        "+ to_dict(): Dict"
    ], '#dbeafe')

    desenhar_classe_projeto(16.8, 10.5, 2.8, 3.5, "Participante", "Entity", [
        "+ id: str",
        "+ nome: str",
        "+ email: str",
        "+ curso: str",
        "+ matricula: str"
    ], [
        "+ to_dict(): Dict"
    ], '#dbeafe')

    desenhar_classe_projeto(7.5, 5.5, 3.8, 4.0, "Mentoria", "Entity", [
        "+ id: str",
        "+ mentor_id: str",
        "+ equipe_id: str",
        "+ projeto_id: str",
        "+ comentarios: str",
        "+ data_hora: str"
    ], [
        "+ to_dict(): Dict"
    ], '#dbeafe')

    desenhar_classe_projeto(16.8, 5.5, 2.8, 3.8, "Avaliacao", "Entity", [
        "+ id: str",
        "+ jurado_id: str",
        "+ projeto_id: str",
        "+ nota: float",
        "+ comentarios: str",
        "+ data_hora: str"
    ], [
        "+ to_dict(): Dict"
    ], '#dbeafe')

    desenhar_classe_projeto(1.0, 5.5, 4.8, 4.0, "ClassificacaoController", "Controller", [
        "- hackathonRepo: IHackathonRepo",
        "- projetoRepo: IProjetoRepo",
        "- equipeRepo: IEquipeRepo"
    ], [
        "+ calcular_classificacao_final(id): List",
        "+ gerar_relatorio_hackathon(id): Dict"
    ], '#fed7aa')

    desenhar_classe_projeto(1.0, 0.8, 4.8, 3.8, "ItemClassificacao", "DTO / ValueObject", [
        "+ posicao: int",
        "+ projeto_id: str",
        "+ titulo_projeto: str",
        "+ equipe_id: str",
        "+ nome_equipe: str",
        "+ area_tematica: str",
        "+ nota_media: float",
        "+ total_avaliacoes: int"
    ], [
        "+ to_dict(): Dict"
    ], '#dcfce7')

    # Relacionamentos com linhas e multiplicidades
    ax.plot([11.5, 12.5], [12.6, 12.6], color='#0f172a', lw=1.5)
    ax.text(11.6, 12.8, "1", fontsize=8, fontweight='bold')
    ax.text(12.2, 12.8, "0..*", fontsize=8, fontweight='bold')

    ax.plot([14.4, 14.4], [10.5, 9.7], color='#0f172a', lw=1.5)
    ax.text(14.6, 10.2, "1", fontsize=8, fontweight='bold')
    ax.text(14.6, 9.8, "0..1", fontsize=8, fontweight='bold')

    ax.plot([15.3, 16.8], [12.6, 12.6], color='#0f172a', lw=1.5)
    ax.text(15.5, 12.8, "1", fontsize=8, fontweight='bold')
    ax.text(16.5, 12.8, "1..*", fontsize=8, fontweight='bold')

    ax.plot([15.3, 16.8], [7.5, 7.5], color='#0f172a', lw=1.5)
    ax.text(15.5, 7.7, "1", fontsize=8, fontweight='bold')
    ax.text(16.5, 7.7, "0..*", fontsize=8, fontweight='bold')

    ax.plot([11.3, 12.5], [7.5, 7.5], color='#0f172a', lw=1.5)
    ax.text(11.4, 7.7, "0..*", fontsize=8, fontweight='bold')
    ax.text(12.2, 7.7, "1", fontsize=8, fontweight='bold')

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "diagrama_classes_projeto.png")
    plt.savefig(path, bbox_inches='tight', dpi=300)
    plt.close()
    print(f"[+] Gerado: {path}")


def gerar_diagrama_pacotes():
    """Gera o Diagrama de Pacotes (Arquitetura em Camadas)."""
    fig, ax = plt.subplots(figsize=(10, 7), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 8)
    ax.axis('off')

    ax.text(5, 7.6, "Diagrama de Pacotes (Arquitetura em Camadas do Sistema)",
            ha='center', va='center', fontsize=12, fontweight='bold', color='#0f172a')

    def desenhar_pacote(x, y, w, h, nome, subitens, cor='#f8fafc'):
        # Guia do pacote
        tab = Rectangle((x, y + h), w * 0.4, 0.4, fc=cor, ec='#334155', lw=1.4)
        ax.add_patch(tab)
        # Corpo do pacote
        body = Rectangle((x, y), w, h, fc=cor, ec='#334155', lw=1.4)
        ax.add_patch(body)
        ax.text(x + 0.2, y + h - 0.3, nome, ha='left', va='top', fontsize=9.5, fontweight='bold', color='#0f172a')

        txt = "\n".join(subitens)
        ax.text(x + 0.3, y + h - 0.7, txt, ha='left', va='top', fontsize=8, color='#475569', linespacing=1.3)

    # Presentation
    desenhar_pacote(1.0, 5.0, 8.0, 1.8, "presentation", [
        "• cli.py (Interface de Linha de Comando Interativa)",
        "• web_server.py (API REST & Servidor HTTP)",
        "• static/ (Dashboard HTML5, CSS3, JS Moderno)"
    ], '#e0f2fe')

    # Application
    desenhar_pacote(1.0, 2.7, 3.8, 1.8, "application", [
        "• controllers.py (GRASP Controllers)",
        "• facade.py (Fachada Central)"
    ], '#fed7aa')

    # Repositories
    desenhar_pacote(5.2, 2.7, 3.8, 1.8, "repositories", [
        "• interfaces.py (Contratos Repositório)",
        "• memory_repo.py (InMemory DB)"
    ], '#e2e8f0')

    # Domain
    desenhar_pacote(1.0, 0.4, 8.0, 1.8, "domain", [
        "• models.py (Hackathon, Equipe, Participante, Projeto, Mentor, Mentoria, Jurado, Avaliacao)",
        "• exceptions.py (Domain Exceptions & Regras de Validação)"
    ], '#dcfce7')

    # Dependências entre pacotes
    ax.annotate("", xy=(3.0, 4.5), xytext=(3.0, 5.0), arrowprops=dict(arrowstyle="->", color='#334155', lw=1.3, linestyle='--'))
    ax.annotate("", xy=(7.0, 4.5), xytext=(7.0, 5.0), arrowprops=dict(arrowstyle="->", color='#334155', lw=1.3, linestyle='--'))
    ax.annotate("", xy=(3.0, 2.2), xytext=(3.0, 2.7), arrowprops=dict(arrowstyle="->", color='#334155', lw=1.3, linestyle='--'))
    ax.annotate("", xy=(7.0, 2.2), xytext=(7.0, 2.7), arrowprops=dict(arrowstyle="->", color='#334155', lw=1.3, linestyle='--'))

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "diagrama_pacotes.png")
    plt.savefig(path, bbox_inches='tight', dpi=300)
    plt.close()
    print(f"[+] Gerado: {path}")


if __name__ == "__main__":
    gerar_diagrama_casos_de_uso()
    gerar_diagrama_classes_conceituais()
    gerar_todos_dss()
    gerar_diagramas_interacao_projeto()
    gerar_diagrama_classes_projeto()
    gerar_diagrama_pacotes()
    print("\nTodos os diagramas foram gerados com sucesso!")
