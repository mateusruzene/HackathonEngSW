"""
Interfaces e Repositórios em Memória do Sistema de Gestão de Hackathons Acadêmicos.
Trabalho Prático 1 - Engenharia de Software - 2026/1
Alunos: Mateus Siqueira Ruzene (GRR20221223) e Gabriel Claudino de Souza (GRR20215730)
"""

from abc import ABC, abstractmethod
from typing import List, Optional, Dict
from src.domain.models import (
    Hackathon,
    Participante,
    Equipe,
    Projeto,
    Mentor,
    Mentoria,
    Jurado,
    Avaliacao
)


class IHackathonRepository(ABC):
    @abstractmethod
    def salvar(self, hackathon: Hackathon) -> None: ...
    @abstractmethod
    def buscar_por_id(self, id: str) -> Optional[Hackathon]: ...
    @abstractmethod
    def listar_todos(self) -> List[Hackathon]: ...


class IParticipanteRepository(ABC):
    @abstractmethod
    def salvar(self, participante: Participante) -> None: ...
    @abstractmethod
    def buscar_por_id(self, id: str) -> Optional[Participante]: ...
    @abstractmethod
    def buscar_por_email(self, email: str) -> Optional[Participante]: ...
    @abstractmethod
    def buscar_por_matricula(self, matricula: str) -> Optional[Participante]: ...
    @abstractmethod
    def listar_todos(self) -> List[Participante]: ...


class IEquipeRepository(ABC):
    @abstractmethod
    def salvar(self, equipe: Equipe) -> None: ...
    @abstractmethod
    def buscar_por_id(self, id: str) -> Optional[Equipe]: ...
    @abstractmethod
    def listar_por_hackathon(self, hackathon_id: str) -> List[Equipe]: ...
    @abstractmethod
    def buscar_equipe_do_participante(self, participante_id: str, hackathon_id: str) -> Optional[Equipe]: ...


class IProjetoRepository(ABC):
    @abstractmethod
    def salvar(self, projeto: Projeto) -> None: ...
    @abstractmethod
    def buscar_por_id(self, id: str) -> Optional[Projeto]: ...
    @abstractmethod
    def buscar_por_equipe(self, equipe_id: str) -> Optional[Projeto]: ...
    @abstractmethod
    def listar_por_hackathon(self, hackathon_id: str) -> List[Projeto]: ...


class IMentorRepository(ABC):
    @abstractmethod
    def salvar(self, mentor: Mentor) -> None: ...
    @abstractmethod
    def buscar_por_id(self, id: str) -> Optional[Mentor]: ...
    @abstractmethod
    def listar_todos(self) -> List[Mentor]: ...


class IMentoriaRepository(ABC):
    @abstractmethod
    def salvar(self, mentoria: Mentoria) -> None: ...
    @abstractmethod
    def buscar_por_id(self, id: str) -> Optional[Mentoria]: ...
    @abstractmethod
    def listar_por_equipe(self, equipe_id: str) -> List[Mentoria]: ...
    @abstractmethod
    def listar_por_mentor(self, mentor_id: str) -> List[Mentoria]: ...
    @abstractmethod
    def listar_todas(self) -> List[Mentoria]: ...


class IJuradoRepository(ABC):
    @abstractmethod
    def salvar(self, jurado: Jurado) -> None: ...
    @abstractmethod
    def buscar_por_id(self, id: str) -> Optional[Jurado]: ...
    @abstractmethod
    def listar_todos(self) -> List[Jurado]: ...


class IAvaliacaoRepository(ABC):
    @abstractmethod
    def salvar(self, avaliacao: Avaliacao) -> None: ...
    @abstractmethod
    def buscar_por_id(self, id: str) -> Optional[Avaliacao]: ...
    @abstractmethod
    def listar_por_projeto(self, projeto_id: str) -> List[Avaliacao]: ...
    @abstractmethod
    def listar_todas(self) -> List[Avaliacao]: ...


# ---------------------------------------------------------
# Implementação em Memória
# ---------------------------------------------------------

class InMemoryDatabase:
    def __init__(self):
        self.hackathons: Dict[str, Hackathon] = {}
        self.participantes: Dict[str, Participante] = {}
        self.equipes: Dict[str, Equipe] = {}
        self.projetos: Dict[str, Projeto] = {}
        self.mentores: Dict[str, Mentor] = {}
        self.mentorias: Dict[str, Mentoria] = {}
        self.jurados: Dict[str, Jurado] = {}
        self.avaliacoes: Dict[str, Avaliacao] = {}

    def limpar(self):
        self.hackathons.clear()
        self.participantes.clear()
        self.equipes.clear()
        self.projetos.clear()
        self.mentores.clear()
        self.mentorias.clear()
        self.jurados.clear()
        self.avaliacoes.clear()


class MemoryHackathonRepository(IHackathonRepository):
    def __init__(self, db: InMemoryDatabase):
        self.db = db

    def salvar(self, hackathon: Hackathon) -> None:
        self.db.hackathons[hackathon.id] = hackathon

    def buscar_por_id(self, id: str) -> Optional[Hackathon]:
        return self.db.hackathons.get(id)

    def listar_todos(self) -> List[Hackathon]:
        return list(self.db.hackathons.values())


class MemoryParticipanteRepository(IParticipanteRepository):
    def __init__(self, db: InMemoryDatabase):
        self.db = db

    def salvar(self, participante: Participante) -> None:
        self.db.participantes[participante.id] = participante

    def buscar_por_id(self, id: str) -> Optional[Participante]:
        return self.db.participantes.get(id)

    def buscar_por_email(self, email: str) -> Optional[Participante]:
        for p in self.db.participantes.values():
            if p.email.lower() == email.lower():
                return p
        return None

    def buscar_por_matricula(self, matricula: str) -> Optional[Participante]:
        for p in self.db.participantes.values():
            if p.matricula.strip().lower() == matricula.strip().lower():
                return p
        return None

    def listar_todos(self) -> List[Participante]:
        return list(self.db.participantes.values())


class MemoryEquipeRepository(IEquipeRepository):
    def __init__(self, db: InMemoryDatabase):
        self.db = db

    def salvar(self, equipe: Equipe) -> None:
        self.db.equipes[equipe.id] = equipe

    def buscar_por_id(self, id: str) -> Optional[Equipe]:
        return self.db.equipes.get(id)

    def listar_por_hackathon(self, hackathon_id: str) -> List[Equipe]:
        return [eq for eq in self.db.equipes.values() if eq.hackathon_id == hackathon_id]

    def buscar_equipe_do_participante(self, participante_id: str, hackathon_id: str) -> Optional[Equipe]:
        for eq in self.db.equipes.values():
            if eq.hackathon_id == hackathon_id:
                if any(p.id == participante_id for p in eq.participantes):
                    return eq
        return None


class MemoryProjetoRepository(IProjetoRepository):
    def __init__(self, db: InMemoryDatabase):
        self.db = db

    def salvar(self, projeto: Projeto) -> None:
        self.db.projetos[projeto.id] = projeto

    def buscar_por_id(self, id: str) -> Optional[Projeto]:
        return self.db.projetos.get(id)

    def buscar_por_equipe(self, equipe_id: str) -> Optional[Projeto]:
        for proj in self.db.projetos.values():
            if proj.equipe_id == equipe_id:
                return proj
        return None

    def listar_por_hackathon(self, hackathon_id: str) -> List[Projeto]:
        return [p for p in self.db.projetos.values() if p.hackathon_id == hackathon_id]


class MemoryMentorRepository(IMentorRepository):
    def __init__(self, db: InMemoryDatabase):
        self.db = db

    def salvar(self, mentor: Mentor) -> None:
        self.db.mentores[mentor.id] = mentor

    def buscar_por_id(self, id: str) -> Optional[Mentor]:
        return self.db.mentores.get(id)

    def listar_todos(self) -> List[Mentor]:
        return list(self.db.mentores.values())


class MemoryMentoriaRepository(IMentoriaRepository):
    def __init__(self, db: InMemoryDatabase):
        self.db = db

    def salvar(self, mentoria: Mentoria) -> None:
        self.db.mentorias[mentoria.id] = mentoria

    def buscar_por_id(self, id: str) -> Optional[Mentoria]:
        return self.db.mentorias.get(id)

    def listar_por_equipe(self, equipe_id: str) -> List[Mentoria]:
        return [m for m in self.db.mentorias.values() if m.equipe_id == equipe_id]

    def listar_por_mentor(self, mentor_id: str) -> List[Mentoria]:
        return [m for m in self.db.mentorias.values() if m.mentor_id == mentor_id]

    def listar_todas(self) -> List[Mentoria]:
        return list(self.db.mentorias.values())


class MemoryJuradoRepository(IJuradoRepository):
    def __init__(self, db: InMemoryDatabase):
        self.db = db

    def salvar(self, jurado: Jurado) -> None:
        self.db.jurados[jurado.id] = jurado

    def buscar_por_id(self, id: str) -> Optional[Jurado]:
        return self.db.jurados.get(id)

    def listar_todos(self) -> List[Jurado]:
        return list(self.db.jurados.values())


class MemoryAvaliacaoRepository(IAvaliacaoRepository):
    def __init__(self, db: InMemoryDatabase):
        self.db = db

    def salvar(self, avaliacao: Avaliacao) -> None:
        self.db.avaliacoes[avaliacao.id] = avaliacao

    def buscar_por_id(self, id: str) -> Optional[Avaliacao]:
        return self.db.avaliacoes.get(id)

    def listar_por_projeto(self, projeto_id: str) -> List[Avaliacao]:
        return [av for av in self.db.avaliacoes.values() if av.projeto_id == projeto_id]

    def listar_todas(self) -> List[Avaliacao]:
        return list(self.db.avaliacoes.values())
