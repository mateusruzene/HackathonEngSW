"""
Gerador Profissional de PDF do Trabalho Prático 1 - Engenharia de Software (UFPR 2026/1).
Alunos: Mateus Siqueira Ruzene (GRR20221223) e Gabriel Claudino de Souza (GRR20215730)
Professor: Prof. Diego Addan
"""

import os
import sys
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import cm, mm, inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, PageBreak, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DIAGRAMS_DIR = os.path.join(ROOT_DIR, "docs", "diagrams")
PDF_OUTPUT_1 = os.path.join(ROOT_DIR, "GRR20221223_GRR20215730.pdf")
PDF_OUTPUT_2 = os.path.join(ROOT_DIR, "GRR20221223 GRR20215730.pdf")


class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            # Não desenha cabeçalho nem rodapé na capa
            return

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#475569"))

        # Cabeçalho
        self.drawString(2.0 * cm, 28.3 * cm, "UFPR • DInf • Engenharia de Software 2026/1 — Prof. Diego Addan")
        self.drawRightString(19.0 * cm, 28.3 * cm, "Gestão de Hackathons (HackDInf)")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(2.0 * cm, 28.1 * cm, 19.0 * cm, 28.1 * cm)

        # Rodapé
        self.line(2.0 * cm, 1.6 * cm, 19.0 * cm, 1.6 * cm)
        self.drawString(2.0 * cm, 1.2 * cm, "Mateus Siqueira Ruzene (GRR20221223) | Gabriel Claudino de Souza (GRR20215730)")
        page_text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(19.0 * cm, 1.2 * cm, page_text)

        self.restoreState()


def criar_pdf():
    doc = SimpleDocTemplate(
        PDF_OUTPUT_1,
        pagesize=A4,
        leftMargin=2.0 * cm,
        rightMargin=2.0 * cm,
        topMargin=2.2 * cm,
        bottomMargin=2.2 * cm
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#0f294a")
    secondary_color = colors.HexColor("#0284c7")
    text_color = colors.HexColor("#1e293b")

    style_title = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=primary_color,
        alignment=TA_CENTER
    )

    style_subtitle = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=secondary_color,
        alignment=TA_CENTER
    )

    style_authors = ParagraphStyle(
        'DocAuthors',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=primary_color,
        alignment=TA_CENTER
    )

    style_h1 = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    style_h2 = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=secondary_color,
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )

    style_body = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.2,
        leading=13.5,
        textColor=text_color,
        alignment=TA_JUSTIFY,
        spaceAfter=6
    )

    style_body_bold = ParagraphStyle(
        'Body_Bold',
        parent=style_body,
        fontName='Helvetica-Bold'
    )

    style_table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=TA_CENTER
    )

    style_table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=11,
        textColor=text_color,
        alignment=TA_LEFT
    )

    style_table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=11,
        textColor=primary_color,
        alignment=TA_LEFT
    )

    story = []

    # =========================================================================
    # CAPA DO TRABALHO ACADÊMICO
    # =========================================================================
    story.append(Spacer(1, 2.0 * cm))
    story.append(Paragraph("UNIVERSIDADE FEDERAL DO PARANÁ (UFPR)", ParagraphStyle('CapaInst', fontName='Helvetica-Bold', fontSize=13, alignment=TA_CENTER, textColor=primary_color)))
    story.append(Paragraph("SETOR DE CIÊNCIAS EXATAS — DEPARTAMENTO DE INFORMÁTICA (DINF)", ParagraphStyle('CapaSetor', fontName='Helvetica', fontSize=10.5, alignment=TA_CENTER, textColor=colors.HexColor("#475569"))))
    story.append(Paragraph("CURSO DE BACHARELADO EM CIÊNCIA DA COMPUTAÇÃO", ParagraphStyle('CapaCurso', fontName='Helvetica-Bold', fontSize=10.5, alignment=TA_CENTER, textColor=colors.HexColor("#475569"))))
    story.append(Spacer(1, 3.0 * cm))

    story.append(Paragraph("PRIMEIRO TRABALHO PRÁTICO", style_subtitle))
    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph("SISTEMA DE GESTÃO DE HACKATHONS ACADÊMICOS", style_title))
    story.append(Spacer(1, 0.4 * cm))
    story.append(Paragraph("Projeto Orientado a Objetos em UML (DSS, Contratos de Operação, Diagramas de Interação GRASP, Classes de Projeto, Pacotes) e Implementação Funcional", ParagraphStyle('CapaSub', fontName='Helvetica-Oblique', fontSize=10, alignment=TA_CENTER, textColor=colors.HexColor("#334155"))))
    
    story.append(Spacer(1, 4.0 * cm))

    story.append(Paragraph("INTEGRANTES:", ParagraphStyle('CapaAutoresHeader', fontName='Helvetica-Bold', fontSize=10, alignment=TA_CENTER, textColor=colors.HexColor("#64748b"))))
    story.append(Spacer(1, 0.2 * cm))
    story.append(Paragraph("Mateus Siqueira Ruzene — GRR20221223", style_authors))
    story.append(Paragraph("Gabriel Claudino de Souza — GRR20215730", style_authors))

    story.append(Spacer(1, 2.5 * cm))
    story.append(Paragraph("Disciplina: Engenharia de Software — 2026/1", ParagraphStyle('CapaDisc', fontName='Helvetica-Bold', fontSize=10, alignment=TA_CENTER, textColor=primary_color)))
    story.append(Paragraph("Professor: Prof. Diego Addan", ParagraphStyle('CapaProf', fontName='Helvetica', fontSize=10, alignment=TA_CENTER, textColor=colors.HexColor("#334155"))))

    story.append(Spacer(1, 2.0 * cm))
    story.append(Paragraph("Curitiba, PR — 2026", ParagraphStyle('CapaData', fontName='Helvetica', fontSize=9.5, alignment=TA_CENTER, textColor=colors.HexColor("#64748b"))))
    story.append(PageBreak())

    # =========================================================================
    # SUMÁRIO E INTRODUÇÃO
    # =========================================================================
    story.append(Paragraph("SUMÁRIO DO DOCUMENTO", style_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=secondary_color, spaceAfter=10))

    sumario_itens = [
        ("1. Descrição e Contextualização do Problema", "1"),
        ("2. Diagrama e Especificações de Casos de Uso (ECU 001 a ECU 009)", "2"),
        ("3. Modelo Conceitual de Domínio (Domain Model)", "5"),
        ("4. Diagramas de Sequência de Sistema (DSS)", "6"),
        ("5. Contratos de Operação (Padrão Larman / UFPR)", "8"),
        ("6. Diagramas de Interação de Projeto (Padrões GRASP)", "11"),
        ("7. Diagrama de Classes — Visão de Projeto (DCD)", "13"),
        ("8. Diagrama de Pacotes e Arquitetura do Software", "14"),
        ("9. Implementação, Testes Automatizados e Execução do Sistema", "15"),
        ("10. Conclusão", "17")
    ]

    sum_table_data = []
    for tit, pg in sumario_itens:
        sum_table_data.append([
            Paragraph(f"<strong>{tit}</strong>", style_body),
            Paragraph(f"................................................................................................", ParagraphStyle('Dots', fontName='Helvetica', fontSize=8, textColor=colors.HexColor("#94a3b8"), alignment=TA_CENTER)),
            Paragraph(f"<strong>{pg}</strong>", ParagraphStyle('Pg', fontName='Helvetica-Bold', fontSize=9, alignment=TA_RIGHT, textColor=primary_color))
        ])

    t_sum = Table(sum_table_data, colWidths=[8.0 * cm, 6.5 * cm, 1.5 * cm])
    t_sum.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(t_sum)
    story.append(Spacer(1, 0.8 * cm))

    story.append(Paragraph("1. DESCRIÇÃO E CONTEXTUALIZAÇÃO DO PROBLEMA", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.8, color=secondary_color, spaceAfter=8))
    story.append(Paragraph(
        "O Departamento de Informática da UFPR (DInf) identificou a necessidade de um software integrado e robusto para gerenciar suas maratonas acadêmicas de desenvolvimento (<strong>Hackathons</strong>). Hackathons são eventos de tecnologia intensivos nos quais estudantes se organizam em equipes multidisciplinares para conceber, prototipar e implementar soluções computacionais inovadoras em um período determinado de tempo.",
        style_body
    ))
    story.append(Paragraph(
        "O sistema especificado e construído neste trabalho abrange a totalidade do ciclo de vida de um Hackathon acadêmico:",
        style_body
    ))
    story.append(Paragraph(
        "• <strong>Configuração do Hackathon:</strong> Cadastro do evento com nome, data de início, data de término e limite máximo de equipes participantes.<br/>"
        "• <strong>Participantes e Equipes:</strong> Cadastro de estudantes com matrícula/GRR e organização em equipes de 1 ou mais integrantes, respeitando a capacidade máxima do evento.<br/>"
        "• <strong>Submissão de Projetos:</strong> Cada equipe participante registra exatamente 1 projeto no evento, contendo título, descrição e área temática.<br/>"
        "• <strong>Ciclo de Mentorias:</strong> Mentores realizam acompanhamento técnico e pedagógico com registro formal de atendimentos, orientações e feedbacks.<br/>"
        "• <strong>Banca Julgadora e Avaliações:</strong> Jurados atribuem notas de 0.0 a 10.0 e pareceres qualitativos para cada projeto.<br/>"
        "• <strong>Classificação e Relatórios:</strong> Cálculo automatizado da média das notas, ordenação do ranking com critérios de desempate e geração de relatórios consolidados para organizadores.",
        style_body
    ))
    story.append(PageBreak())

    # =========================================================================
    # SEÇÃO 2: CASOS DE USO E ESPECIFICAÇÕES (ECU)
    # =========================================================================
    story.append(Paragraph("2. DIAGRAMA E ESPECIFICAÇÕES DE CASOS DE USO", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.8, color=secondary_color, spaceAfter=8))
    story.append(Paragraph(
        "A Figura 1 apresenta o <strong>Diagrama de Casos de Uso</strong> geral do sistema, identificando os quatro atores envolvidos (<em>Organizador, Participante/Líder de Equipe, Mentor e Jurado</em>) e as principais funcionalidades disponibilizadas.",
        style_body
    ))

    img_uc = os.path.join(DIAGRAMS_DIR, "diagrama_casos_de_uso.png")
    if os.path.exists(img_uc):
        story.append(Image(img_uc, width=15.5 * cm, height=11.5 * cm))
        story.append(Paragraph("<strong>Figura 1:</strong> Diagrama de Casos de Uso do Sistema de Hackathons (DInf - UFPR)", ParagraphStyle('FigCap', fontName='Helvetica-Bold', fontSize=8.5, alignment=TA_CENTER, spaceBefore=4, spaceAfter=10)))

    story.append(Paragraph("2.1 Especificações Detalhadas de Casos de Uso (ECU)", style_h2))
    story.append(Paragraph(
        "A seguir são apresentadas as especificações formais de casos de uso estruturadas de acordo com o padrão exigido na disciplina.",
        style_body
    ))

    def formatar_tabela_ecu(ecu_id, nome, desc, fluxo_basico, fluxos_alt, req_esp, pre_cond, pos_cond, pontos_ext):
        data = [
            [Paragraph(f"<strong>{ecu_id}</strong>", style_table_header), Paragraph("", style_table_header)],
            [Paragraph("<strong>Nome</strong>", style_table_cell_bold), Paragraph(nome, style_table_cell)],
            [Paragraph("<strong>Descrição</strong>", style_table_cell_bold), Paragraph(desc, style_table_cell)],
            [Paragraph("<strong>Fluxo Básico</strong>", style_table_cell_bold), Paragraph(fluxo_basico, style_table_cell)],
            [Paragraph("<strong>Fluxos Alternativos</strong>", style_table_cell_bold), Paragraph(fluxos_alt, style_table_cell)],
            [Paragraph("<strong>Requisitos Especiais</strong>", style_table_cell_bold), Paragraph(req_esp, style_table_cell)],
            [Paragraph("<strong>Pré-condições</strong>", style_table_cell_bold), Paragraph(pre_cond, style_table_cell)],
            [Paragraph("<strong>Pós-condições</strong>", style_table_cell_bold), Paragraph(pos_cond, style_table_cell)],
            [Paragraph("<strong>Pontos de Extensão</strong>", style_table_cell_bold), Paragraph(pontos_ext, style_table_cell)],
        ]
        t = Table(data, colWidths=[3.2 * cm, 13.0 * cm])
        t.setStyle(TableStyle([
            ('SPAN', (0, 0), (1, 0)),
            ('BACKGROUND', (0, 0), (1, 0), primary_color),
            ('BACKGROUND', (0, 1), (0, -1), colors.HexColor("#f1f5f9")),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#94a3b8")),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ]))
        return t

    # ECU 001
    story.append(formatar_tabela_ecu(
        "ECU 001",
        "Cadastrar Hackathon",
        "Permite que um organizador cadastre uma nova edição de Hackathon no sistema, definindo suas regras e limites.",
        "1. O organizador acessa a funcionalidade 'Cadastrar Hackathon'.<br/>"
        "2. O sistema exibe o formulário com os campos: Nome, Data de Início, Data de Término, Limite Máximo de Equipes e Descrição.<br/>"
        "3. O organizador preenche os dados e confirma o cadastro.<br/>"
        "4. O sistema valida os campos, registra o hackathon com identificador único e exibe mensagem de confirmação de sucesso.",
        "A. Caso algum campo obrigatório não seja preenchido ou a quantidade máxima de equipes seja menor ou igual a zero, o sistema alerta o erro e permanece no formulário com os dados preenchidos.<br/>"
        "B. Caso a data de término seja anterior à data de início, o sistema alerta a inconsistência.",
        "Não se aplica a esse caso.",
        "O usuário deve ter privilégios de organizador no sistema.",
        "Um novo Hackathon é instanciado e persistido no sistema.",
        "Não se aplica a esse caso."
    ))
    story.append(Spacer(1, 0.4 * cm))

    # ECU 002
    story.append(formatar_tabela_ecu(
        "ECU 002",
        "Cadastrar Participante",
        "Permite o cadastro individual de estudantes no sistema como participantes potenciais de hackathons.",
        "1. O estudante acessa a opção 'Cadastrar Participante'.<br/>"
        "2. O sistema exibe formulário com: Nome Completo, E-mail Institucional, Curso e Matrícula/GRR.<br/>"
        "3. O estudante preenche os campos e submete.<br/>"
        "4. O sistema valida a unicidade do e-mail e matrícula, cadastra o participante e exibe mensagem de sucesso.",
        "A. Caso o e-mail ou a matrícula informada já estejam cadastrados, o sistema alerta a duplicidade e solicita correção.<br/>"
        "B. Caso haja campos obrigatórios em branco ou e-mail inválido, o sistema alerta o erro.",
        "Validação de formato de e-mail institucional da UFPR (@ufpr.br).",
        "Nenhuma pré-condição necessária.",
        "O participante é registrado no sistema com ID único e pode ser vinculado a equipes.",
        "Não se aplica a esse caso."
    ))
    story.append(PageBreak())

    # ECU 003
    story.append(formatar_tabela_ecu(
        "ECU 003",
        "Formar e Inscrever Equipe no Hackathon",
        "Permite aos participantes formarem uma equipe (composta por 1 ou mais estudantes) e realizarem a inscrição em um hackathon específico.",
        "1. O líder da equipe seleciona o hackathon desejado e escolhe 'Inscrever Equipe'.<br/>"
        "2. O sistema verifica se o hackathon ainda possui vagas abertas (respeitando o limite máximo).<br/>"
        "3. O líder informa o Nome da Equipe e seleciona os estudantes membros cadastrados.<br/>"
        "4. O sistema valida que a equipe possui pelo menos 1 membro e que nenhum membro pertence a outra equipe no mesmo evento.<br/>"
        "5. O sistema vincula a equipe ao Hackathon, salva o registro e exibe mensagem de confirmação de sucesso.",
        "A. Caso o Hackathon já tenha atingido o número máximo de equipes inscritas, o sistema bloqueia a inscrição e avisa: 'Hackathon Lotado'.<br/>"
        "B. Caso algum participante selecionado já pertença a outra equipe inscrita no mesmo Hackathon, o sistema impede a inscrição e alerta a duplicidade de vínculo.<br/>"
        "C. Caso nenhum membro seja selecionado, o sistema alerta que a equipe deve ter no mínimo 1 integrante.",
        "A seleção de participantes é restrita aos estudantes já previamente cadastrados.",
        "O Hackathon deve estar aberto para inscrições e os participantes devem existir no sistema.",
        "A equipe é criada, associada aos seus membros e inscrita formalmente no Hackathon.",
        "A equipe inscrita fica habilitada para registrar 1 projeto (ECU 004)."
    ))
    story.append(Spacer(1, 0.4 * cm))

    # ECU 004
    story.append(formatar_tabela_ecu(
        "ECU 004",
        "Registrar Projeto da Equipe",
        "Permite que uma equipe inscrita registre o seu projeto de desenvolvimento no Hackathon.",
        "1. A equipe seleciona a opção 'Registrar Projeto'.<br/>"
        "2. O sistema exibe o formulário com os campos: Título do Projeto, Descrição da Proposta e Área Temática.<br/>"
        "3. A equipe preenche os dados e confirma o cadastro.<br/>"
        "4. O sistema verifica se a equipe já possui projeto cadastrado. Não havendo duplicidade, cria o projeto, vincula-o à equipe e ao hackathon, e emite mensagem de sucesso.",
        "A. Caso a equipe já possua um projeto cadastrado no mesmo evento, o sistema rejeita a operação com o alerta: 'Cada equipe pode registrar apenas um projeto'.<br/>"
        "B. Se campos obrigatórios estiverem ausentes, o sistema solicita preenchimento.",
        "Cada equipe pode submeter no máximo e no mínimo 1 projeto no evento.",
        "A equipe deve estar devidamente inscrita no Hackathon e não possuir projeto previamente registrado.",
        "O projeto é criado e associado à equipe e ao Hackathon.",
        "O projeto passa a poder receber orientações de mentores (ECU 006) e avaliações de jurados (ECU 007)."
    ))
    story.append(Spacer(1, 0.4 * cm))

    # ECU 005
    story.append(formatar_tabela_ecu(
        "ECU 005",
        "Cadastrar Mentor e Jurado",
        "Permite ao organizador cadastrar profissionais, professores e especialistas como mentores ou jurados do evento.",
        "1. O organizador seleciona 'Cadastrar Mentor / Jurado'.<br/>"
        "2. O sistema exibe opções para escolha do perfil e formulário com: Nome, E-mail, Especialidade/Área e Instituição de origem.<br/>"
        "3. O organizador preenche os dados e confirma.<br/>"
        "4. O sistema salva o cadastro do mentor ou jurado e exibe mensagem de sucesso.",
        "A. Caso campos obrigatórios estejam em branco, o sistema alerta o erro.",
        "Não se aplica a esse caso.",
        "Organizador autenticado no sistema.",
        "O mentor ou jurado é cadastrado e fica disponível para realizar orientações ou avaliações.",
        "Não se aplica a esse caso."
    ))
    story.append(PageBreak())

    # ECU 006
    story.append(formatar_tabela_ecu(
        "ECU 006",
        "Registrar Mentoria de Equipe",
        "Permite que um mentor registre o atendimento e as orientações prestadas a uma equipe durante o Hackathon.",
        "1. O mentor acessa a opção 'Registrar Mentoria'.<br/>"
        "2. O sistema exibe formulário para selecionar a equipe atendida e inserir comentários e orientações técnicas.<br/>"
        "3. O mentor seleciona a equipe, insere suas observações e confirma o registro.<br/>"
        "4. O sistema armazena a mentoria com carimbo de data/hora, vincula ao histórico da equipe/projeto e exibe mensagem de sucesso.",
        "A. Caso o texto de comentários/orientação esteja vazio, o sistema alerta o erro.<br/>"
        "B. Caso a equipe selecionada não seja encontrada, o sistema notifica o mentor.",
        "A mentoria fica vinculada tanto à equipe quanto ao seu projeto em desenvolvimento.",
        "O mentor deve estar cadastrado e a equipe deve estar inscrita no evento.",
        "Um registro de mentoria é criado com data/hora e adicionado ao histórico da equipe.",
        "Não se aplica a esse caso."
    ))
    story.append(Spacer(1, 0.4 * cm))

    # ECU 007
    story.append(formatar_tabela_ecu(
        "ECU 007",
        "Registrar Avaliação de Projeto (Jurados)",
        "Permite que um jurado avalie um projeto submetido, atribuindo nota numérica e parecer qualitativo.",
        "1. O jurado acessa a funcionalidade 'Registrar Avaliação'.<br/>"
        "2. O sistema exibe a lista de projetos participantes e o formulário com os campos: Nota (0.0 a 10.0) e Parecer/Comentários.<br/>"
        "3. O jurado escolhe o projeto, insere a nota e seus comentários de avaliação e confirma.<br/>"
        "4. O sistema valida se a nota está no intervalo permitido [0.0, 10.0], cria o registro de avaliação, vincula-o ao projeto e exibe mensagem de confirmação de sucesso.",
        "A. Caso a nota informada seja menor que 0.0 ou maior que 10.0, o sistema rejeita com o alerta: 'A nota deve estar entre 0.0 e 10.0'.<br/>"
        "B. Se campos obrigatórios estiverem em branco, o sistema avisa o erro.",
        "Um projeto pode receber avaliações de múltiplos jurados da banca.",
        "O jurado deve estar cadastrado e o projeto deve estar registrado no Hackathon.",
        "A avaliação é persistida e vinculada ao projeto, atualizando o cômputo da nota média.",
        "Não se aplica a esse caso."
    ))
    story.append(Spacer(1, 0.4 * cm))

    # ECU 008 & 009
    story.append(formatar_tabela_ecu(
        "ECU 008",
        "Determinar Classificação Final e Ranking dos Projetos",
        "Calcula a pontuação média de cada projeto e gera o ranking final ordenado do Hackathon.",
        "1. O organizador ou usuário solicita a 'Classificação Final' do Hackathon.<br/>"
        "2. O sistema recupera todos os projetos vinculados ao evento.<br/>"
        "3. Para cada projeto, o sistema computa a média aritmética simples de todas as notas atribuídas pelos jurados.<br/>"
        "4. O sistema ordena os projetos de forma decrescente pela nota média (e critérios de desempate).<br/>"
        "5. O sistema gera a tabela de ranking exibindo posição (1º, 2º, 3º...), nome do projeto, equipe responsável, área temática, total de jurados e nota final.",
        "A. Caso nenhum projeto tenha sido avaliado ainda, o sistema informa a ausência de notas consolidadas.",
        "Cálculo preciso com arredondamento para duas casas decimais.",
        "O Hackathon deve possuir projetos submetidos.",
        "O relatório de classificação final é gerado e disponibilizado para visualização.",
        "Não se aplica a esse caso."
    ))
    story.append(PageBreak())

    # =========================================================================
    # SEÇÃO 3: MODELO CONCEITUAL DE DOMÍNIO
    # =========================================================================
    story.append(Paragraph("3. MODELO CONCEITUAL DE DOMÍNIO", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.8, color=secondary_color, spaceAfter=8))
    story.append(Paragraph(
        "O <strong>Modelo Conceitual de Domínio</strong> (Domain Model) representa visualmente os conceitos do mundo real do problema (classes conceituais), seus atributos essenciais e os relacionamentos associativos entre eles, acompanhados das respectivas multiplicidades segundo a notação UML.",
        style_body
    ))

    img_cd = os.path.join(DIAGRAMS_DIR, "diagrama_classes_conceituais.png")
    if os.path.exists(img_cd):
        story.append(Image(img_cd, width=15.5 * cm, height=10.8 * cm))
        story.append(Paragraph("<strong>Figura 2:</strong> Modelo de Domínio Conceitual do Sistema de Hackathons Acadêmicos (DInf - UFPR)", ParagraphStyle('FigCap2', fontName='Helvetica-Bold', fontSize=8.5, alignment=TA_CENTER, spaceBefore=4, spaceAfter=8)))

    story.append(Paragraph(
        "<strong>Dicionário das Classes Conceituais:</strong><br/>"
        "• <strong>Hackathon:</strong> Representa o evento acadêmico com nome, datas e limite máximo de equipes participantes.<br/>"
        "• <strong>Participante:</strong> Estudante interessado que se cadastra com nome, e-mail institucional, curso e matrícula/GRR.<br/>"
        "• <strong>Equipe:</strong> Grupo composto por 1 ou mais participantes, associado a um Hackathon e responsável por 1 projeto.<br/>"
        "• <strong>Projeto:</strong> Solução técnica desenvolvida pela equipe durante o evento (título, descrição e área temática).<br/>"
        "• <strong>Mentor:</strong> Especialista responsável por acompanhar as equipes e prestar suporte técnico.<br/>"
        "• <strong>Mentoria:</strong> Sessão de atendimento realizada por um mentor a uma equipe com comentários e orientações registradas.<br/>"
        "• <strong>Jurado:</strong> Especialista avaliador membro da banca examinadora.<br/>"
        "• <strong>Avaliação:</strong> Nota numérica (0 a 10) e parecer atribuídos por um jurado a um projeto.",
        style_body
    ))
    story.append(PageBreak())

    # =========================================================================
    # SEÇÃO 4: DIAGRAMAS DE SEQUÊNCIA DE SISTEMA (DSS)
    # =========================================================================
    story.append(Paragraph("4. DIAGRAMAS DE SEQUÊNCIA DE SISTEMA (DSS)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.8, color=secondary_color, spaceAfter=8))
    story.append(Paragraph(
        "Os <strong>Diagramas de Sequência de Sistema (DSS)</strong> ilustram a visão caixa-preta da interação entre os atores externos e o sistema. Neles são identificadas as operações de sistema disparadas pelos atores e os dados de resposta gerados.",
        style_body
    ))

    # Grid com os DSSs
    dss_files = [
        ("dss_01_cadastrar_hackathon.png", "DSS 001: Cadastrar Hackathon"),
        ("dss_02_cadastrar_participante.png", "DSS 002: Cadastrar Participante"),
        ("dss_03_inscrever_equipe.png", "DSS 003: Inscrever Equipe no Hackathon"),
        ("dss_04_registrar_projeto.png", "DSS 004: Registrar Projeto da Equipe"),
        ("dss_05_registrar_mentoria.png", "DSS 006: Registrar Mentoria de Equipe"),
        ("dss_06_registrar_avaliacao.png", "DSS 007: Registrar Avaliação de Projeto"),
        ("dss_07_determinar_classificacao.png", "DSS 008: Determinar Classificação Final")
    ]

    for fname, dss_title in dss_files[:4]:
        fpath = os.path.join(DIAGRAMS_DIR, fname)
        if os.path.exists(fpath):
            story.append(Paragraph(f"<strong>{dss_title}</strong>", style_h2))
            story.append(Image(fpath, width=14.5 * cm, height=5.8 * cm))
            story.append(Spacer(1, 0.2 * cm))

    story.append(PageBreak())

    for fname, dss_title in dss_files[4:]:
        fpath = os.path.join(DIAGRAMS_DIR, fname)
        if os.path.exists(fpath):
            story.append(Paragraph(f"<strong>{dss_title}</strong>", style_h2))
            story.append(Image(fpath, width=14.5 * cm, height=5.8 * cm))
            story.append(Spacer(1, 0.2 * cm))

    story.append(PageBreak())

    # =========================================================================
    # SEÇÃO 5: CONTRATOS DE OPERAÇÃO
    # =========================================================================
    story.append(Paragraph("5. CONTRATOS DE OPERAÇÃO (PADRÃO LARMAN / UFPR)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.8, color=secondary_color, spaceAfter=8))
    story.append(Paragraph(
        "Os <strong>Contratos de Operação</strong> definem detalhadamente as transformações no estado do sistema resultantes da execução de cada operação de sistema identificada nos DSSs, documentando formalmente: <em>Operação, Referências Cruzadas, Pré-condições</em> e <em>Pós-condições</em> (Criação de instâncias, formação de associações e modificações de atributos) segundo Craig Larman.",
        style_body
    ))

    def formatar_contrato(op_nome, ref_cruz, pre_cond, pos_cond):
        data = [
            [Paragraph(f"<strong>Contrato de Operação: {op_nome}</strong>", style_table_header), Paragraph("", style_table_header)],
            [Paragraph("<strong>Operação</strong>", style_table_cell_bold), Paragraph(f"<code>{op_nome}</code>", style_table_cell)],
            [Paragraph("<strong>Referências Cruzadas</strong>", style_table_cell_bold), Paragraph(ref_cruz, style_table_cell)],
            [Paragraph("<strong>Pré-condições</strong>", style_table_cell_bold), Paragraph(pre_cond, style_table_cell)],
            [Paragraph("<strong>Pós-condições</strong>", style_table_cell_bold), Paragraph(pos_cond, style_table_cell)]
        ]
        t = Table(data, colWidths=[3.5 * cm, 12.7 * cm])
        t.setStyle(TableStyle([
            ('SPAN', (0, 0), (1, 0)),
            ('BACKGROUND', (0, 0), (1, 0), primary_color),
            ('BACKGROUND', (0, 1), (0, -1), colors.HexColor("#f8fafc")),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#94a3b8")),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ]))
        return t

    # Contrato 01: cadastrarHackathon
    story.append(formatar_contrato(
        "cadastrarHackathon(nome, dataInicio, dataTermino, maxEquipes, descricao)",
        "ECU 001 — Cadastrar Hackathon",
        "O usuário possui perfil de organizador. Os campos nome, datas e maxEquipes são válidos (maxEquipes > 0).",
        "• Uma instância <em>h:Hackathon</em> foi criada.<br/>"
        "• Os atributos de <em>h</em> foram inicializados: <em>h.nome</em> tornou-se nome, <em>h.data_inicio</em> tornou-se dataInicio, <em>h.data_termino</em> tornou-se dataTermino, <em>h.max_equipes</em> tornou-se maxEquipes, <em>h.descricao</em> tornou-se descricao.<br/>"
        "• A instância <em>h</em> foi persistida no repositório de hackathons."
    ))
    story.append(Spacer(1, 0.35 * cm))

    # Contrato 02: cadastrarParticipante
    story.append(formatar_contrato(
        "cadastrarParticipante(nome, email, curso, matricula)",
        "ECU 002 — Cadastrar Participante",
        "Não existe participante previamente cadastrado com a mesma matrícula/GRR ou mesmo e-mail.",
        "• Uma instância <em>p:Participante</em> foi criada.<br/>"
        "• Os atributos de <em>p</em> foram inicializados: <em>p.nome</em> tornou-se nome, <em>p.email</em> tornou-se email, <em>p.curso</em> tornou-se curso, <em>p.matricula</em> tornou-se matricula.<br/>"
        "• A instância <em>p</em> foi associada ao repositório de participantes."
    ))
    story.append(Spacer(1, 0.35 * cm))

    # Contrato 03: inscreverEquipe
    story.append(formatar_contrato(
        "inscreverEquipe(nome, hackathonId, participantesIds)",
        "ECU 003 — Formar e Inscrever Equipe no Hackathon",
        "Existe uma instância <em>h:Hackathon</em> identificada por hackathonId. O número atual de equipes em <em>h</em> é estritamente menor que <em>h.max_equipes</em>. A lista de participantesIds não é vazia. Todos os participantes existem e nenhum deles pertence a outra equipe vinculada a <em>h</em>.",
        "• Uma instância <em>eq:Equipe</em> foi criada.<br/>"
        "• Os atributos de <em>eq</em> foram inicializados: <em>eq.nome</em> tornou-se nome, <em>eq.hackathon_id</em> tornou-se hackathonId.<br/>"
        "• Formou-se uma associação entre <em>eq</em> e cada uma das instâncias <em>p:Participante</em> referenciadas em participantesIds (<em>eq.participantes</em> incluiu <em>p</em>).<br/>"
        "• Formou-se uma associação entre <em>h:Hackathon</em> e <em>eq:Equipe</em> (<em>h.equipes</em> incluiu <em>eq</em>).<br/>"
        "• A instância <em>eq</em> foi salva no repositório de equipes."
    ))
    story.append(PageBreak())

    # Contrato 04: registrarProjeto
    story.append(formatar_contrato(
        "registrarProjeto(equipeId, titulo, descricao, areaTematica)",
        "ECU 004 — Registrar Projeto da Equipe",
        "Existe uma instância <em>eq:Equipe</em> identificada por equipeId. A equipe <em>eq</em> NÃO possui nenhum projeto previamente associado (<em>eq.projeto == null</em>).",
        "• Uma instância <em>proj:Projeto</em> foi criada.<br/>"
        "• Os atributos de <em>proj</em> foram inicializados: <em>proj.titulo</em> tornou-se titulo, <em>proj.descricao</em> tornou-se descricao, <em>proj.area_tematica</em> tornou-se areaTematica, <em>proj.equipe_id</em> tornou-se equipeId, <em>proj.hackathon_id</em> tornou-se <em>eq.hackathon_id</em>.<br/>"
        "• Formou-se uma associação bidirecional entre <em>eq:Equipe</em> e <em>proj:Projeto</em> (<em>eq.projeto</em> tornou-se <em>proj</em>).<br/>"
        "• A instância <em>proj</em> foi salva no repositório de projetos."
    ))
    story.append(Spacer(1, 0.35 * cm))

    # Contrato 05: registrarMentoria
    story.append(formatar_contrato(
        "registrarMentoria(mentorId, equipeId, comentarios)",
        "ECU 006 — Registrar Mentoria",
        "Existe uma instância <em>m:Mentor</em> identificada por mentorId e uma instância <em>eq:Equipe</em> identificada por equipeId. O campo comentarios não é vazio.",
        "• Uma instância <em>ment:Mentoria</em> foi criada.<br/>"
        "• Os atributos de <em>ment</em> foram inicializados: <em>ment.mentor_id</em> tornou-se mentorId, <em>ment.equipe_id</em> tornou-se equipeId, <em>ment.comentarios</em> tornou-se comentarios, <em>ment.data_hora</em> recebeu a data/hora atual do sistema.<br/>"
        "• Caso <em>eq.projeto</em> exista, <em>ment.projeto_id</em> foi associado ao ID do projeto e <em>ment</em> foi adicionada à lista <em>eq.projeto.mentorias</em>.<br/>"
        "• A instância <em>ment</em> foi salva no repositório de mentorias."
    ))
    story.append(Spacer(1, 0.35 * cm))

    # Contrato 06: registrarAvaliacao
    story.append(formatar_contrato(
        "registrarAvaliacao(juradoId, projetoId, nota, comentarios)",
        "ECU 007 — Registrar Avaliação de Projeto",
        "Existe uma instância <em>j:Jurado</em> identificada por juradoId e uma instância <em>p:Projeto</em> identificada por projetoId. O valor de nota satisfaz 0.0 <= nota <= 10.0.",
        "• Uma instância <em>av:Avaliacao</em> foi criada.<br/>"
        "• Os atributos de <em>av</em> foram inicializados: <em>av.jurado_id</em> tornou-se juradoId, <em>av.projeto_id</em> tornou-se projetoId, <em>av.nota</em> tornou-se nota, <em>av.comentarios</em> tornou-se comentarios, <em>av.data_hora</em> recebeu o timestamp atual.<br/>"
        "• Formou-se uma associação entre <em>p:Projeto</em> e <em>av:Avaliacao</em> (<em>p.avaliacoes</em> incluiu <em>av</em>).<br/>"
        "• A instância <em>av</em> foi salva no repositório de avaliações."
    ))
    story.append(Spacer(1, 0.35 * cm))

    # Contrato 07: calcularClassificacaoFinal
    story.append(formatar_contrato(
        "calcularClassificacaoFinal(hackathonId)",
        "ECU 008 — Determinar Classificação Final e Ranking",
        "Existe uma instância <em>h:Hackathon</em> identificada por hackathonId com projetos registrados.",
        "• Para cada projeto <em>p</em> pertencente ao hackathon, foi executado o cômputo da nota média de suas avaliações associadas.<br/>"
        "• Foram criadas instâncias de <em>ItemClassificacao</em> contendo posição, projeto, equipe, área temática, total de avaliações e nota média.<br/>"
        "• As instâncias foram ordenadas de maneira decrescente pela nota média e retornadas como lista de ranking final."
    ))
    story.append(PageBreak())

    # =========================================================================
    # SEÇÃO 6: DIAGRAMAS DE INTERAÇÃO DE PROJETO (GRASP)
    # =========================================================================
    story.append(Paragraph("6. DIAGRAMAS DE INTERAÇÃO DE PROJETO (GRASP)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.8, color=secondary_color, spaceAfter=8))
    story.append(Paragraph(
        "Os <strong>Diagramas de Interação de Projeto</strong> (Sequence Diagrams com Padrões GRASP) representam a atribuição de responsabilidades entre os objetos computacionais do software. Foram aplicados rigorosamente os seguintes padrões:",
        style_body
    ))
    story.append(Paragraph(
        "• <strong>Controller (Controlador):</strong> Controladores de caso de uso (ex: <code>EquipeController</code>, <code>ProjetoController</code>, <code>AvaliacaoController</code>, <code>ClassificacaoController</code>) recebem as mensagens da interface de apresentação e orquestram a execução do caso de uso.<br/>"
        "• <strong>Creator (Criador):</strong> A criação de instâncias é delegada à classe que agrega ou contém as informações necessárias para sua inicialização (ex: o controlador cria a Equipe e associa seus membros).<br/>"
        "• <strong>Information Expert (Especialista na Informação):</strong> O cálculo da nota final média é responsabilidade da classe <code>Projeto</code>, que detém a lista de suas próprias avaliações.<br/>"
        "• <strong>Low Coupling & High Cohesion:</strong> Desacoplamento através de repositórios e divisão de responsabilidades em camadas bem delimitadas.",
        style_body
    ))

    # Diagramas de Interação
    img_seq1 = os.path.join(DIAGRAMS_DIR, "diagrama_interacao_inscrever_equipe.png")
    if os.path.exists(img_seq1):
        story.append(Paragraph("<strong>6.1 Interação de Projeto: Inscrever Equipe no Hackathon</strong>", style_h2))
        story.append(Image(img_seq1, width=15.5 * cm, height=8.8 * cm))
        story.append(Spacer(1, 0.4 * cm))

    img_seq2 = os.path.join(DIAGRAMS_DIR, "diagrama_interacao_classificacao_final.png")
    if os.path.exists(img_seq2):
        story.append(Paragraph("<strong>6.2 Interação de Projeto: Calcular Classificação Final e Ranking</strong>", style_h2))
        story.append(Image(img_seq2, width=15.5 * cm, height=8.8 * cm))
        story.append(Spacer(1, 0.4 * cm))

    story.append(PageBreak())

    img_seq3 = os.path.join(DIAGRAMS_DIR, "diagrama_interacao_registrar_projeto.png")
    if os.path.exists(img_seq3):
        story.append(Paragraph("<strong>6.3 Interação de Projeto: Registrar Projeto da Equipe</strong>", style_h2))
        story.append(Image(img_seq3, width=15.5 * cm, height=8.8 * cm))
        story.append(Spacer(1, 0.4 * cm))

    img_seq4 = os.path.join(DIAGRAMS_DIR, "diagrama_interacao_registrar_avaliacao.png")
    if os.path.exists(img_seq4):
        story.append(Paragraph("<strong>6.4 Interação de Projeto: Registrar Avaliação de Projeto</strong>", style_h2))
        story.append(Image(img_seq4, width=15.5 * cm, height=8.8 * cm))
        story.append(Spacer(1, 0.4 * cm))

    story.append(PageBreak())

    # =========================================================================
    # SEÇÃO 7: DIAGRAMA DE CLASSES - VISÃO DE PROJETO (DCD)
    # =========================================================================
    story.append(Paragraph("7. DIAGRAMA DE CLASSES — VISÃO DE PROJETO (DCD)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.8, color=secondary_color, spaceAfter=8))
    story.append(Paragraph(
        "O <strong>Diagrama de Classes na Visão de Projeto</strong> (Design Class Diagram - DCD) especifica todas as classes do sistema, seus atributos com visibilidade (+ público, - privado, # protegido) e tipos de dados estritos, assinaturas completas de métodos com parâmetros e tipos de retorno, bem como os relacionamentos de associação, agregação, composição, dependência e multiplicidades.",
        style_body
    ))

    img_dcd = os.path.join(DIAGRAMS_DIR, "diagrama_classes_projeto.png")
    if os.path.exists(img_dcd):
        story.append(Image(img_dcd, width=16.0 * cm, height=12.2 * cm))
        story.append(Paragraph("<strong>Figura 3:</strong> Diagrama de Classes — Visão de Projeto Completa do Sistema (HackDInf UFPR)", ParagraphStyle('FigCap3', fontName='Helvetica-Bold', fontSize=8.5, alignment=TA_CENTER, spaceBefore=4, spaceAfter=10)))

    story.append(PageBreak())

    # =========================================================================
    # SEÇÃO 8: DIAGRAMA DE PACOTES E ARQUITETURA
    # =========================================================================
    story.append(Paragraph("8. DIAGRAMA DE PACOTES E ARQUITETURA EM CAMADAS", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.8, color=secondary_color, spaceAfter=8))
    story.append(Paragraph(
        "O software foi estruturado seguindo os princípios de <strong>Arquitetura Limpa e em Camadas</strong> (Layered Architecture), garantindo total desacoplamento entre a interface com o usuário, a lógica de aplicação, as entidades de negócio e o mecanismo de persistência de dados.",
        style_body
    ))

    img_pkg = os.path.join(DIAGRAMS_DIR, "diagrama_pacotes.png")
    if os.path.exists(img_pkg):
        story.append(Image(img_pkg, width=15.5 * cm, height=10.5 * cm))
        story.append(Paragraph("<strong>Figura 4:</strong> Diagrama de Pacotes e Dependências de Camadas do Sistema", ParagraphStyle('FigCap4', fontName='Helvetica-Bold', fontSize=8.5, alignment=TA_CENTER, spaceBefore=4, spaceAfter=10)))

    story.append(Paragraph(
        "<strong>Descrição dos Pacotes:</strong><br/>"
        "• <code>presentation:</code> Contém a interface CLI interativa de terminal (<code>cli.py</code>), o servidor HTTP com API REST nativa (<code>web_server.py</code>) e a dashboard web em HTML5/CSS3/JS.<br/>"
        "• <code>application:</code> Contém os controladores de casos de uso (<code>controllers.py</code>) que coordenam as operações e a Fachada Central (<code>SistemaHackathonFacade</code>).<br/>"
        "• <code>domain:</code> Núcleo do sistema, composto pelas entidades de negócio (<code>Hackathon</code>, <code>Equipe</code>, <code>Participante</code>, <code>Projeto</code>, <code>Mentor</code>, <code>Mentoria</code>, <code>Jurado</code>, <code>Avaliacao</code>) e pelas exceções de validação de domínio.<br/>"
        "• <code>repositories:</code> Interfaces abstratas de persistência e implementações de banco de dados em memória e arquivo serializado.",
        style_body
    ))
    story.append(PageBreak())

    # =========================================================================
    # SEÇÃO 9: IMPLEMENTAÇÃO E TESTES AUTOMATIZADOS
    # =========================================================================
    story.append(Paragraph("9. IMPLEMENTAÇÃO, TESTES AUTOMATIZADOS E EXECUÇÃO", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.8, color=secondary_color, spaceAfter=8))
    story.append(Paragraph(
        "O sistema foi integralmente implementado em <strong>Python 3</strong> orientado a objetos com tipagem estrita (<em>Type Hints</em> e <em>Dataclasses</em>). O software é 100% funcional e executável, oferecendo duas interfaces de usuário completas (Terminal CLI e Dashboard Web moderna) e uma bateria completa de testes automatizados.",
        style_body
    ))

    story.append(Paragraph("9.1 Verificação e Testes Automatizados", style_h2))
    story.append(Paragraph(
        "Foram implementados <strong>16 testes automatizados</strong> unitários e de integração validando com rigor todas as regras de negócio especificadas:",
        style_body
    ))

    testes_data = [
        [Paragraph("<strong>Caso de Teste Automatizado</strong>", style_table_header), Paragraph("<strong>Regra de Negócio Validada</strong>", style_table_header), Paragraph("<strong>Resultado</strong>", style_table_header)],
        [Paragraph("<code>test_criar_hackathon_valido</code>", style_table_cell), Paragraph("Criação de Hackathon com atributos obrigatórios e vagas", style_table_cell), Paragraph("APROVADO", style_table_cell_bold)],
        [Paragraph("<code>test_hackathon_max_equipes_invalido</code>", style_table_cell), Paragraph("Rejeição de hackathon com limite de equipes <= 0", style_table_cell), Paragraph("APROVADO", style_table_cell_bold)],
        [Paragraph("<code>test_regra_limite_maximo_equipes</code>", style_table_cell), Paragraph("Disparo de <code>HackathonLotadoException</code> ao atingir capacidade", style_table_cell), Paragraph("APROVADO", style_table_cell_bold)],
        [Paragraph("<code>test_equipe_apenas_um_projeto</code>", style_table_cell), Paragraph("Disparo de <code>ProjetoJaCadastradoException</code> (1 projeto por equipe)", style_table_cell), Paragraph("APROVADO", style_table_cell_bold)],
        [Paragraph("<code>test_equipe_validacao_membros</code>", style_table_cell), Paragraph("Exigência de pelo menos 1 membro participante por equipe", style_table_cell), Paragraph("APROVADO", style_table_cell_bold)],
        [Paragraph("<code>test_regra_participante_duplicado_equipe</code>", style_table_cell), Paragraph("Impedir aluno de se inscrever em duas equipes no mesmo evento", style_table_cell), Paragraph("APROVADO", style_table_cell_bold)],
        [Paragraph("<code>test_avaliacao_calculo_nota_media</code>", style_table_cell), Paragraph("Cálculo correto da média aritmética das avaliações dos jurados", style_table_cell), Paragraph("APROVADO", style_table_cell_bold)],
        [Paragraph("<code>test_avaliacao_nota_fora_do_intervalo</code>", style_table_cell), Paragraph("Rejeição de notas fora do intervalo [0.0, 10.0]", style_table_cell), Paragraph("APROVADO", style_table_cell_bold)],
        [Paragraph("<code>test_ordenacao_ranking_multiplos_projetos</code>", style_table_cell), Paragraph("Ordenação decrescente precisa do ranking e desempates", style_table_cell), Paragraph("APROVADO", style_table_cell_bold)]
    ]
    t_testes = Table(testes_data, colWidths=[6.2 * cm, 8.0 * cm, 2.0 * cm])
    t_testes.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), primary_color),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#94a3b8")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    story.append(t_testes)
    story.append(Spacer(1, 0.4 * cm))

    story.append(Paragraph("9.2 Como Executar o Software", style_h2))
    story.append(Paragraph(
        "O sistema pode ser executado a partir do terminal de qualquer sistema operacional com Python 3 instalado, sem necessidade de dependências pesadas:<br/><br/>"
        "• <strong>Interface de Linha de Comando (CLI):</strong><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<code>python3 src/main.py --cli</code><br/>"
        "• <strong>Servidor Web com Dashboard Gráfica:</strong><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<code>python3 src/main.py --web --port 8080</code> (acesse: <code>http://localhost:8080</code>)<br/>"
        "• <strong>Bateria de Testes Automatizados:</strong><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<code>python3 src/main.py --test</code><br/>"
        "• <strong>Demonstração Automatizada:</strong><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<code>python3 src/main.py --demo</code>",
        style_body
    ))
    story.append(PageBreak())

    # =========================================================================
    # SEÇÃO 10: CONCLUSÃO
    # =========================================================================
    story.append(Paragraph("10. CONCLUSÃO", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.8, color=secondary_color, spaceAfter=8))
    story.append(Paragraph(
        "O presente trabalho contemplou com rigor e completude todos os objetivos estabelecidos na disciplina de Engenharia de Software da UFPR (Prof. Diego Addan). A partir do estudo detalhado do enunciado e das necessidades do Departamento de Informática, foi desenvolvido todo o ciclo de análise, projeto orientado a objetos com notação UML e padrões GRASP, além da implementação integral de um software funcional e testado.",
        style_body
    ))
    story.append(Paragraph(
        "Os artefatos produzidos — incluindo Especificações de Casos de Uso (ECU), Diagramas de Sequência de Sistema (DSS), Contratos de Operação formais, Diagramas de Interação GRASP (Sequência de Projeto), Diagrama de Classes Visão de Projeto (DCD) e Diagrama de Pacotes — estabeleceram uma base sólida que se traduziu diretamente em um código limpo, modular, extensível e 100% aderente aos requisitos.",
        style_body
    ))
    story.append(Spacer(1, 1.5 * cm))

    # Assinatura dos Autores
    story.append(KeepTogether([
        Table([
            [
                Paragraph("____________________________________________<br/><strong>Mateus Siqueira Ruzene</strong><br/>GRR20221223", ParagraphStyle('Sign1', fontName='Helvetica', fontSize=9, alignment=TA_CENTER)),
                Paragraph("____________________________________________<br/><strong>Gabriel Claudino de Souza</strong><br/>GRR20215730", ParagraphStyle('Sign2', fontName='Helvetica', fontSize=9, alignment=TA_CENTER))
            ]
        ], colWidths=[8.0 * cm, 8.0 * cm], style=[('VALIGN', (0, 0), (-1, -1), 'TOP')])
    ]))

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[+] Documento PDF gerado com sucesso em: {PDF_OUTPUT_1}")

    # Criar cópia com o segundo nome exigido
    import shutil
    shutil.copyfile(PDF_OUTPUT_1, PDF_OUTPUT_2)
    print(f"[+] Cópia do PDF criada em: {PDF_OUTPUT_2}")


if __name__ == "__main__":
    criar_pdf()
