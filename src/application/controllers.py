"""
Controladores de Aplicação e Casos de Uso (Padrão GRASP Controller).
Sistema de Gestão de Hackathons Acadêmicos (DInf - UFPR).
Trabalho Prático 1 - Engenharia de Software - 2026/1
Alunos: Mateus Siqueira Ruzene (GRR20221223) e Gabriel Claudino de Souza (GRR20215730)
"""

import uuid
from typing import List, Optional, Dict, Any

from src.domain.models import (
    Hackathon,
    Participante,
    Equipe,
    Projeto,
    Mentor,
    Mentoria,
    Jurado,
    Avaliacao,
    ItemClassificacao
)
from src.domain.exceptions import (
    EntidadeNaoEncontradaException,
    ValidacaoDominioException,
    HackathonLotadoException,
    ProjetoJaCadastradoException,
    EquipeSemParticipantesException,
    ParticipanteJaEmEquipeException,
    NotaInvalidaException
)
from src.repositories.memory_repo import (
    InMemoryDatabase,
    IHackathonRepository,
    IParticipanteRepository,
    IEquipeRepository,
    IProjetoRepository,
    IMentorRepository,
    IMentoriaRepository,
    IJuradoRepository,
    IAvaliacaoRepository,
    MemoryHackathonRepository,
    MemoryParticipanteRepository,
    MemoryEquipeRepository,
    MemoryProjetoRepository,
    MemoryMentorRepository,
    MemoryMentoriaRepository,
    MemoryJuradoRepository,
    MemoryAvaliacaoRepository
)


class HackathonController:
    def __init__(self, hackathon_repo: IHackathonRepository):
        self.hackathon_repo = hackathon_repo

    def cadastrar_hackathon(
        self,
        nome: str,
        data_inicio: str,
        data_termino: str,
        max_equipes: int,
        descricao: str = ""
    ) -> Hackathon:
        hackathon_id = f"HACK-{uuid.uuid4().hex[:6].upper()}"
        hackathon = Hackathon(
            id=hackathon_id,
            nome=nome,
            data_inicio=data_inicio,
            data_termino=data_termino,
            max_equipes=int(max_equipes),
            descricao=descricao
        )
        self.hackathon_repo.salvar(hackathon)
        return hackathon

    def listar_hackathons(self) -> List[Hackathon]:
        return self.hackathon_repo.listar_todos()

    def buscar_por_id(self, hackathon_id: str) -> Hackathon:
        hack = self.hackathon_repo.buscar_por_id(hackathon_id)
        if not hack:
            raise EntidadeNaoEncontradaException(f"Hackathon com ID '{hackathon_id}' não foi encontrado.")
        return hack


class ParticipanteController:
    def __init__(self, participante_repo: IParticipanteRepository):
        self.participante_repo = participante_repo

    def cadastrar_participante(
        self,
        nome: str,
        email: str,
        curso: str,
        matricula: str
    ) -> Participante:
        if self.participante_repo.buscar_por_email(email):
            raise ValidacaoDominioException(f"Já existe participante cadastrado com o e-mail '{email}'.")
        if self.participante_repo.buscar_por_matricula(matricula):
            raise ValidacaoDominioException(f"Já existe participante cadastrado com a matrícula '{matricula}'.")

        p_id = f"PART-{uuid.uuid4().hex[:6].upper()}"
        participante = Participante(
            id=p_id,
            nome=nome,
            email=email,
            curso=curso,
            matricula=matricula
        )
        self.participante_repo.salvar(participante)
        return participante

    def listar_participantes(self) -> List[Participante]:
        return self.participante_repo.listar_todos()

    def buscar_por_id(self, participante_id: str) -> Participante:
        p = self.participante_repo.buscar_por_id(participante_id)
        if not p:
            raise EntidadeNaoEncontradaException(f"Participante com ID '{participante_id}' não encontrado.")
        return p


class EquipeController:
    def __init__(
        self,
        equipe_repo: IEquipeRepository,
        hackathon_repo: IHackathonRepository,
        participante_repo: IParticipanteRepository
    ):
        self.equipe_repo = equipe_repo
        self.hackathon_repo = hackathon_repo
        self.participante_repo = participante_repo

    def inscrever_equipe(
        self,
        nome: str,
        hackathon_id: str,
        participantes_ids: List[str]
    ) -> Equipe:
        hackathon = self.hackathon_repo.buscar_por_id(hackathon_id)
        if not hackathon:
            raise EntidadeNaoEncontradaException(f"Hackathon com ID '{hackathon_id}' não encontrado.")

        equipes_atuais = self.equipe_repo.listar_por_hackathon(hackathon_id)
        if len(equipes_atuais) >= hackathon.max_equipes:
            raise HackathonLotadoException(
                f"O Hackathon '{hackathon.nome}' atingiu a capacidade máxima de {hackathon.max_equipes} equipes."
            )

        if not participantes_ids:
            raise EquipeSemParticipantesException("A equipe deve ter pelo menos um participante.")

        membros: List[Participante] = []
        for p_id in participantes_ids:
            p = self.participante_repo.buscar_por_id(p_id)
            if not p:
                raise EntidadeNaoEncontradaException(f"Participante ID '{p_id}' não encontrado.")

            equipe_existente = self.equipe_repo.buscar_equipe_do_participante(p_id, hackathon_id)
            if equipe_existente:
                raise ParticipanteJaEmEquipeException(
                    f"O participante '{p.nome}' já pertence à equipe '{equipe_existente.nome}' neste hackathon."
                )
            membros.append(p)

        eq_id = f"EQ-{uuid.uuid4().hex[:6].upper()}"
        nova_equipe = Equipe(
            id=eq_id,
            nome=nome,
            hackathon_id=hackathon_id,
            participantes=membros
        )
        self.equipe_repo.salvar(nova_equipe)
        hackathon.equipes.append(nova_equipe)
        return nova_equipe

    def adicionar_membro(self, equipe_id: str, participante_id: str) -> Equipe:
        equipe = self.equipe_repo.buscar_por_id(equipe_id)
        if not equipe:
            raise EntidadeNaoEncontradaException(f"Equipe com ID '{equipe_id}' não encontrada.")

        participante = self.participante_repo.buscar_por_id(participante_id)
        if not participante:
            raise EntidadeNaoEncontradaException(f"Participante com ID '{participante_id}' não encontrado.")

        equipe_existente = self.equipe_repo.buscar_equipe_do_participante(participante_id, equipe.hackathon_id)
        if equipe_existente and equipe_existente.id != equipe_id:
            raise ParticipanteJaEmEquipeException(
                f"O participante '{participante.nome}' já pertence à equipe '{equipe_existente.nome}'."
            )

        equipe.adicionar_participante(participante)
        self.equipe_repo.salvar(equipe)
        return equipe

    def listar_equipes_por_hackathon(self, hackathon_id: str) -> List[Equipe]:
        return self.equipe_repo.listar_por_hackathon(hackathon_id)

    def buscar_por_id(self, equipe_id: str) -> Equipe:
        eq = self.equipe_repo.buscar_por_id(equipe_id)
        if not eq:
            raise EntidadeNaoEncontradaException(f"Equipe com ID '{equipe_id}' não encontrada.")
        return eq


class ProjetoController:
    def __init__(
        self,
        projeto_repo: IProjetoRepository,
        equipe_repo: IEquipeRepository
    ):
        self.projeto_repo = projeto_repo
        self.equipe_repo = equipe_repo

    def registrar_projeto(
        self,
        equipe_id: str,
        titulo: str,
        descricao: str,
        area_tematica: str
    ) -> Projeto:
        equipe = self.equipe_repo.buscar_por_id(equipe_id)
        if not equipe:
            raise EntidadeNaoEncontradaException(f"Equipe com ID '{equipe_id}' não encontrada.")

        if equipe.projeto is not None or self.projeto_repo.buscar_por_equipe(equipe_id) is not None:
            raise ProjetoJaCadastradoException(
                f"A equipe '{equipe.nome}' já possui um projeto cadastrado neste hackathon."
            )

        proj_id = f"PROJ-{uuid.uuid4().hex[:6].upper()}"
        projeto = Projeto(
            id=proj_id,
            titulo=titulo,
            descricao=descricao,
            area_tematica=area_tematica,
            equipe_id=equipe.id,
            hackathon_id=equipe.hackathon_id
        )
        self.projeto_repo.salvar(projeto)
        equipe.associar_projeto(projeto)
        self.equipe_repo.salvar(equipe)
        return projeto

    def buscar_por_id(self, projeto_id: str) -> Projeto:
        p = self.projeto_repo.buscar_por_id(projeto_id)
        if not p:
            raise EntidadeNaoEncontradaException(f"Projeto com ID '{projeto_id}' não encontrado.")
        return p

    def listar_por_hackathon(self, hackathon_id: str) -> List[Projeto]:
        return self.projeto_repo.listar_por_hackathon(hackathon_id)


class MentoriaController:
    def __init__(
        self,
        mentor_repo: IMentorRepository,
        mentoria_repo: IMentoriaRepository,
        equipe_repo: IEquipeRepository
    ):
        self.mentor_repo = mentor_repo
        self.mentoria_repo = mentoria_repo
        self.equipe_repo = equipe_repo

    def cadastrar_mentor(
        self,
        nome: str,
        email: str,
        especialidade: str,
        instituicao: str
    ) -> Mentor:
        m_id = f"MENT-{uuid.uuid4().hex[:6].upper()}"
        mentor = Mentor(
            id=m_id,
            nome=nome,
            email=email,
            especialidade=especialidade,
            instituicao=instituicao
        )
        self.mentor_repo.salvar(mentor)
        return mentor

    def registrar_mentoria(
        self,
        mentor_id: str,
        equipe_id: str,
        comentarios: str
    ) -> Mentoria:
        mentor = self.mentor_repo.buscar_por_id(mentor_id)
        if not mentor:
            raise EntidadeNaoEncontradaException(f"Mentor com ID '{mentor_id}' não encontrado.")

        equipe = self.equipe_repo.buscar_por_id(equipe_id)
        if not equipe:
            raise EntidadeNaoEncontradaException(f"Equipe com ID '{equipe_id}' não encontrada.")

        ment_id = f"ORIE-{uuid.uuid4().hex[:6].upper()}"
        mentoria = Mentoria(
            id=ment_id,
            mentor_id=mentor.id,
            equipe_id=equipe.id,
            projeto_id=equipe.projeto.id if equipe.projeto else None,
            comentarios=comentarios
        )
        self.mentoria_repo.salvar(mentoria)
        if equipe.projeto:
            equipe.projeto.adicionar_mentoria(mentoria)
        return mentoria

    def listar_por_equipe(self, equipe_id: str) -> List[Mentoria]:
        return self.mentoria_repo.listar_por_equipe(equipe_id)

    def listar_todos_mentores(self) -> List[Mentor]:
        return self.mentor_repo.listar_todos()

    def listar_todas_mentorias(self) -> List[Mentoria]:
        return self.mentoria_repo.listar_todas()


class AvaliacaoController:
    def __init__(
        self,
        jurado_repo: IJuradoRepository,
        avaliacao_repo: IAvaliacaoRepository,
        projeto_repo: IProjetoRepository
    ):
        self.jurado_repo = jurado_repo
        self.avaliacao_repo = avaliacao_repo
        self.projeto_repo = projeto_repo

    def cadastrar_jurado(
        self,
        nome: str,
        email: str,
        instituicao: str
    ) -> Jurado:
        j_id = f"JUR-{uuid.uuid4().hex[:6].upper()}"
        jurado = Jurado(
            id=j_id,
            nome=nome,
            email=email,
            instituicao=instituicao
        )
        self.jurado_repo.salvar(jurado)
        return jurado

    def registrar_avaliacao(
        self,
        jurado_id: str,
        projeto_id: str,
        nota: float,
        comentarios: str
    ) -> Avaliacao:
        jurado = self.jurado_repo.buscar_por_id(jurado_id)
        if not jurado:
            raise EntidadeNaoEncontradaException(f"Jurado com ID '{jurado_id}' não encontrado.")

        projeto = self.projeto_repo.buscar_por_id(projeto_id)
        if not projeto:
            raise EntidadeNaoEncontradaException(f"Projeto com ID '{projeto_id}' não encontrado.")

        try:
            nota_float = float(nota)
        except ValueError:
            raise NotaInvalidaException("A nota deve ser um número decimal válido.")

        if nota_float < 0.0 or nota_float > 10.0:
            raise NotaInvalidaException(f"A nota deve estar entre 0.0 e 10.0. Fornecido: {nota_float}")

        av_id = f"AVAL-{uuid.uuid4().hex[:6].upper()}"
        avaliacao = Avaliacao(
            id=av_id,
            jurado_id=jurado.id,
            projeto_id=projeto.id,
            nota=nota_float,
            comentarios=comentarios
        )
        self.avaliacao_repo.salvar(avaliacao)
        projeto.adicionar_avaliacao(avaliacao)
        self.projeto_repo.salvar(projeto)
        return avaliacao

    def listar_avaliacoes_do_projeto(self, projeto_id: str) -> List[Avaliacao]:
        return self.avaliacao_repo.listar_por_projeto(projeto_id)

    def listar_todos_jurados(self) -> List[Jurado]:
        return self.jurado_repo.listar_todos()


class ClassificacaoController:
    def __init__(
        self,
        hackathon_repo: IHackathonRepository,
        projeto_repo: IProjetoRepository,
        equipe_repo: IEquipeRepository,
        mentoria_repo: IMentoriaRepository,
        avaliacao_repo: IAvaliacaoRepository
    ):
        self.hackathon_repo = hackathon_repo
        self.projeto_repo = projeto_repo
        self.equipe_repo = equipe_repo
        self.mentoria_repo = mentoria_repo
        self.avaliacao_repo = avaliacao_repo

    def calcular_classificacao_final(self, hackathon_id: str) -> List[ItemClassificacao]:
        hackathon = self.hackathon_repo.buscar_por_id(hackathon_id)
        if not hackathon:
            raise EntidadeNaoEncontradaException(f"Hackathon com ID '{hackathon_id}' não encontrado.")

        projetos = self.projeto_repo.listar_por_hackathon(hackathon_id)
        itens: List[Dict[str, Any]] = []

        for p in projetos:
            equipe = self.equipe_repo.buscar_por_id(p.equipe_id)
            nome_equipe = equipe.nome if equipe else "Equipe Desconhecida"
            itens.append({
                "projeto_id": p.id,
                "titulo_projeto": p.titulo,
                "equipe_id": p.equipe_id,
                "nome_equipe": nome_equipe,
                "area_tematica": p.area_tematica,
                "nota_media": p.calcular_nota_final(),
                "total_avaliacoes": len(p.avaliacoes)
            })

        # Ordenar decrescente pela nota média, seguido por número de avaliações
        itens.sort(key=lambda x: (x["nota_media"], x["total_avaliacoes"]), reverse=True)

        resultado: List[ItemClassificacao] = []
        for idx, item in enumerate(itens, start=1):
            resultado.append(
                ItemClassificacao(
                    posicao=idx,
                    projeto_id=item["projeto_id"],
                    titulo_projeto=item["titulo_projeto"],
                    equipe_id=item["equipe_id"],
                    nome_equipe=item["nome_equipe"],
                    area_tematica=item["area_tematica"],
                    nota_media=item["nota_media"],
                    total_avaliacoes=item["total_avaliacoes"]
                )
            )
        return resultado

    def gerar_relatorio_hackathon(self, hackathon_id: str) -> Dict[str, Any]:
        hackathon = self.hackathon_repo.buscar_por_id(hackathon_id)
        if not hackathon:
            raise EntidadeNaoEncontradaException(f"Hackathon com ID '{hackathon_id}' não encontrado.")

        equipes = self.equipe_repo.listar_por_hackathon(hackathon_id)
        projetos = self.projeto_repo.listar_por_hackathon(hackathon_id)
        classificacao = self.calcular_classificacao_final(hackathon_id)

        total_participantes = sum(len(eq.participantes) for eq in equipes)
        total_mentorias = sum(len(p.mentorias) for p in projetos)
        total_avaliacoes = sum(len(p.avaliacoes) for p in projetos)

        return {
            "hackathon": hackathon.to_dict(),
            "metricas": {
                "total_equipes": len(equipes),
                "total_participantes": total_participantes,
                "total_projetos": len(projetos),
                "total_mentorias": total_mentorias,
                "total_avaliacoes": total_avaliacoes
            },
            "equipes": [eq.to_dict() for eq in equipes],
            "projetos": [p.to_dict() for p in projetos],
            "ranking": [item.to_dict() for item in classificacao]
        }


class SistemaHackathonFacade:
    """Fachada Geral que expõe as operações do Sistema (GoF Facade / GRASP Controller Central)."""
    def __init__(self, db: Optional[InMemoryDatabase] = None):
        self.db = db or InMemoryDatabase()

        # Repositórios
        self.hackathon_repo = MemoryHackathonRepository(self.db)
        self.participante_repo = MemoryParticipanteRepository(self.db)
        self.equipe_repo = MemoryEquipeRepository(self.db)
        self.projeto_repo = MemoryProjetoRepository(self.db)
        self.mentor_repo = MemoryMentorRepository(self.db)
        self.mentoria_repo = MemoryMentoriaRepository(self.db)
        self.jurado_repo = MemoryJuradoRepository(self.db)
        self.avaliacao_repo = MemoryAvaliacaoRepository(self.db)

        # Controladores
        self.hackathons = HackathonController(self.hackathon_repo)
        self.participantes = ParticipanteController(self.participante_repo)
        self.equipes = EquipeController(self.equipe_repo, self.hackathon_repo, self.participante_repo)
        self.projetos = ProjetoController(self.projeto_repo, self.equipe_repo)
        self.mentorias = MentoriaController(self.mentor_repo, self.mentoria_repo, self.equipe_repo)
        self.avaliacoes = AvaliacaoController(self.jurado_repo, self.avaliacao_repo, self.projeto_repo)
        self.classificacao = ClassificacaoController(
            self.hackathon_repo,
            self.projeto_repo,
            self.equipe_repo,
            self.mentoria_repo,
            self.avaliacao_repo
        )

    def semear_dados_exemplo(self) -> str:
        """Carrega dados completos do Hackathon Acadêmico do DInf - UFPR."""
        hack = self.hackathons.cadastrar_hackathon(
            nome="HackDInf UFPR 2026 - Inovação & IA",
            data_inicio="2026-09-10",
            data_termino="2026-09-12",
            max_equipes=5,
            descricao="Maratona acadêmica de desenvolvimento do Departamento de Informática da UFPR."
        )

        # Participantes
        p1 = self.participantes.cadastrar_participante("Mateus Siqueira Ruzene", "mateus.ruzene@ufpr.br", "Ciência da Computação", "GRR20221223")
        p2 = self.participantes.cadastrar_participante("Gabriel Claudino de Souza", "gabriel.claudino@ufpr.br", "Ciência da Computação", "GRR20215730")
        p3 = self.participantes.cadastrar_participante("Ana Clara Silva", "ana.silva@ufpr.br", "Informática Biomédica", "GRR20234512")
        p4 = self.participantes.cadastrar_participante("Bruno Oliveira", "bruno.oliveira@ufpr.br", "Engenharia da Computação", "GRR20228899")
        p5 = self.participantes.cadastrar_participante("Camila Fernandes", "camila.f@ufpr.br", "Ciência da Computação", "GRR20219900")
        p6 = self.participantes.cadastrar_participante("Diego Santos", "diego.s@ufpr.br", "Análise de Sistemas", "GRR20241122")

        # Equipes
        eq1 = self.equipes.inscrever_equipe("ByteCrafters UFPR", hack.id, [p1.id, p2.id])
        eq2 = self.equipes.inscrever_equipe("BioData Miners", hack.id, [p3.id, p4.id])
        eq3 = self.equipes.inscrever_equipe("Neural Kernel", hack.id, [p5.id, p6.id])

        # Projetos
        proj1 = self.projetos.registrar_projeto(
            eq1.id,
            "SmartCampus UFPR",
            "Plataforma inteligente para otimização do fluxo de transporte e uso de salas no Campus Politécnico.",
            "Cidades Inteligentes & IoT"
        )
        proj2 = self.projetos.registrar_projeto(
            eq2.id,
            "OncoScan AI",
            "Algoritmo de visão computacional para triagem precoce de patologias em exames histológicos.",
            "Saúde Digital & IA"
        )
        proj3 = self.projetos.registrar_projeto(
            eq3.id,
            "GreenGrid Optimizer",
            "Sistema preditivo com redes neurais para eficiência energética em centros de supercomputação.",
            "Sustentabilidade & IA"
        )

        # Mentores
        m1 = self.mentorias.cadastrar_mentor("Prof. Carlos Eduardo", "carlos.eduardo@ufpr.br", "Arquitetura de Software", "DInf UFPR")
        m2 = self.mentorias.cadastrar_mentor("Dra. Juliana Mendes", "juliana.mendes@techcorp.com", "Inteligência Artificial & MLOps", "TechCorp Inovação")

        # Mentorias realizadas
        self.mentorias.registrar_mentoria(m1.id, eq1.id, "Orientado refinamento da modelagem UML e desacoplamento do backend.")
        self.mentorias.registrar_mentoria(m2.id, eq2.id, "Revisão dos hiperparâmetros do modelo CNN e validação cruzada.")
        self.mentorias.registrar_mentoria(m2.id, eq3.id, "Sugerido uso de streaming de telemetria para o dashboard.")

        # Jurados
        j1 = self.avaliacoes.cadastrar_jurado("Prof. Diego Addan", "diego.addan@ufpr.br", "DInf - UFPR")
        j2 = self.avaliacoes.cadastrar_jurado("Dra. Renata Vasconcellos", "renata.v@fundacaorau.org.br", "Instituto Araucária")
        j3 = self.avaliacoes.cadastrar_jurado("Eng. Lucas Prates", "lucas.prates@paranaict.gov.br", "Secretaria de Inovação")

        # Avaliações do Projeto 1 (SmartCampus)
        self.avaliacoes.registrar_avaliacao(j1.id, proj1.id, 9.8, "Excelente rigor arquitetural e aderência aos requisitos!")
        self.avaliacoes.registrar_avaliacao(j2.id, proj1.id, 9.5, "Grande impacto social e viabilidade prática imediata.")
        self.avaliacoes.registrar_avaliacao(j3.id, proj1.id, 9.7, "Apresentação e protótipo funcional impecáveis.")

        # Avaliações do Projeto 2 (OncoScan AI)
        self.avaliacoes.registrar_avaliacao(j1.id, proj2.id, 9.2, "Muito boa solução técnica e precisão no diagnóstico.")
        self.avaliacoes.registrar_avaliacao(j2.id, proj2.id, 9.6, "Inovação científica de alto nível para a saúde pública.")
        self.avaliacoes.registrar_avaliacao(j3.id, proj2.id, 9.1, "Excelente prototipação e validação médica.")

        # Avaliações do Projeto 3 (GreenGrid Optimizer)
        self.avaliacoes.registrar_avaliacao(j1.id, proj3.id, 8.9, "Boa proposta de sustentabilidade e modelagem estatística.")
        self.avaliacoes.registrar_avaliacao(j2.id, proj3.id, 8.8, "Relevante para datacenters de alto desempenho.")
        self.avaliacoes.registrar_avaliacao(j3.id, proj3.id, 9.0, "Solução robusta e bem explicada.")

        return hack.id
