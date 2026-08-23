"""
Modelos de Domínio do Sistema de Gestão de Hackathons Acadêmicos (DInf - UFPR).
Trabalho Prático 1 - Engenharia de Software - 2026/1
Alunos: Mateus Siqueira Ruzene (GRR20221223) e Gabriel Claudino de Souza (GRR20215730)
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional, Dict, Any
import uuid

from src.domain.exceptions import (
    ValidacaoDominioException,
    NotaInvalidaException,
    EquipeSemParticipantesException,
    ProjetoJaCadastradoException
)


@dataclass
class Participante:
    id: str
    nome: str
    email: str
    curso: str
    matricula: str

    def __post_init__(self):
        if not self.nome or not self.nome.strip():
            raise ValidacaoDominioException("O nome do participante é obrigatório.")
        if not self.email or "@" not in self.email:
            raise ValidacaoDominioException("Email inválido para o participante.")
        if not self.matricula or not self.matricula.strip():
            raise ValidacaoDominioException("A matrícula/GRR do participante é obrigatória.")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "curso": self.curso,
            "matricula": self.matricula
        }


@dataclass
class Mentor:
    id: str
    nome: str
    email: str
    especialidade: str
    instituicao: str

    def __post_init__(self):
        if not self.nome or not self.nome.strip():
            raise ValidacaoDominioException("O nome do mentor é obrigatório.")
        if not self.email or "@" not in self.email:
            raise ValidacaoDominioException("Email inválido para o mentor.")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "especialidade": self.especialidade,
            "instituicao": self.instituicao
        }


@dataclass
class Jurado:
    id: str
    nome: str
    email: str
    instituicao: str

    def __post_init__(self):
        if not self.nome or not self.nome.strip():
            raise ValidacaoDominioException("O nome do jurado é obrigatório.")
        if not self.email or "@" not in self.email:
            raise ValidacaoDominioException("Email inválido para o jurado.")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "instituicao": self.instituicao
        }


@dataclass
class Mentoria:
    id: str
    mentor_id: str
    equipe_id: str
    comentarios: str
    projeto_id: Optional[str] = None
    data_hora: str = field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    def __post_init__(self):
        if not self.mentor_id:
            raise ValidacaoDominioException("O identificador do mentor é obrigatório.")
        if not self.equipe_id:
            raise ValidacaoDominioException("O identificador da equipe é obrigatório.")
        if not self.comentarios or not self.comentarios.strip():
            raise ValidacaoDominioException("Os comentários da mentoria são obrigatórios.")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "mentor_id": self.mentor_id,
            "equipe_id": self.equipe_id,
            "projeto_id": self.projeto_id,
            "comentarios": self.comentarios,
            "data_hora": self.data_hora
        }


@dataclass
class Avaliacao:
    id: str
    jurado_id: str
    projeto_id: str
    nota: float
    comentarios: str
    data_hora: str = field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    def __post_init__(self):
        if not self.jurado_id:
            raise ValidacaoDominioException("O jurado é obrigatório na avaliação.")
        if not self.projeto_id:
            raise ValidacaoDominioException("O projeto avaliado é obrigatório.")
        if self.nota < 0.0 or self.nota > 10.0:
            raise NotaInvalidaException(f"A nota deve estar entre 0.0 e 10.0. Valor informado: {self.nota}")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "jurado_id": self.jurado_id,
            "projeto_id": self.projeto_id,
            "nota": self.nota,
            "comentarios": self.comentarios,
            "data_hora": self.data_hora
        }


@dataclass
class Projeto:
    id: str
    titulo: str
    descricao: str
    area_tematica: str
    equipe_id: str
    hackathon_id: str
    avaliacoes: List[Avaliacao] = field(default_factory=list)
    mentorias: List[Mentoria] = field(default_factory=list)

    def __post_init__(self):
        if not self.titulo or not self.titulo.strip():
            raise ValidacaoDominioException("O título do projeto é obrigatório.")
        if not self.descricao or not self.descricao.strip():
            raise ValidacaoDominioException("A descrição do projeto é obrigatória.")
        if not self.area_tematica or not self.area_tematica.strip():
            raise ValidacaoDominioException("A área temática do projeto é obrigatória.")
        if not self.equipe_id:
            raise ValidacaoDominioException("O projeto deve pertencer a uma equipe.")
        if not self.hackathon_id:
            raise ValidacaoDominioException("O projeto deve estar associado a um hackathon.")

    def adicionar_avaliacao(self, avaliacao: Avaliacao) -> None:
        self.avaliacoes.append(avaliacao)

    def adicionar_mentoria(self, mentoria: Mentoria) -> None:
        self.mentorias.append(mentoria)

    def calcular_nota_final(self) -> float:
        """Calcula a nota média das avaliações dos jurados."""
        if not self.avaliacoes:
            return 0.0
        soma = sum(av.nota for av in self.avaliacoes)
        return round(soma / len(self.avaliacoes), 2)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "titulo": self.titulo,
            "descricao": self.descricao,
            "area_tematica": self.area_tematica,
            "equipe_id": self.equipe_id,
            "hackathon_id": self.hackathon_id,
            "nota_final": self.calcular_nota_final(),
            "total_avaliacoes": len(self.avaliacoes),
            "total_mentorias": len(self.mentorias)
        }


@dataclass
class Equipe:
    id: str
    nome: str
    hackathon_id: str
    participantes: List[Participante] = field(default_factory=list)
    projeto: Optional[Projeto] = None

    def __post_init__(self):
        if not self.nome or not self.nome.strip():
            raise ValidacaoDominioException("O nome da equipe é obrigatório.")
        if not self.hackathon_id:
            raise ValidacaoDominioException("A equipe deve estar vinculada a um hackathon.")

    def validar_membros(self) -> None:
        if not self.participantes:
            raise EquipeSemParticipantesException("A equipe deve possuir pelo menos um participante.")

    def adicionar_participante(self, participante: Participante) -> None:
        if any(p.id == participante.id for p in self.participantes):
            raise ValidacaoDominioException(f"Participante {participante.nome} já está na equipe.")
        self.participantes.append(participante)

    def associar_projeto(self, projeto: Projeto) -> None:
        if self.projeto is not None:
            raise ProjetoJaCadastradoException(f"A equipe '{self.nome}' já possui o projeto '{self.projeto.titulo}' registrado.")
        self.projeto = projeto

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "nome": self.nome,
            "hackathon_id": self.hackathon_id,
            "total_membros": len(self.participantes),
            "participantes": [p.to_dict() for p in self.participantes],
            "projeto": self.projeto.to_dict() if self.projeto else None
        }


@dataclass
class Hackathon:
    id: str
    nome: str
    data_inicio: str
    data_termino: str
    max_equipes: int
    descricao: str = ""
    equipes: List[Equipe] = field(default_factory=list)

    def __post_init__(self):
        if not self.nome or not self.nome.strip():
            raise ValidacaoDominioException("O nome do Hackathon é obrigatório.")
        if self.max_equipes <= 0:
            raise ValidacaoDominioException("O número máximo de equipes deve ser maior que zero.")

    def pode_receber_equipe(self) -> bool:
        return len(self.equipes) < self.max_equipes

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "nome": self.nome,
            "data_inicio": self.data_inicio,
            "data_termino": self.data_termino,
            "max_equipes": self.max_equipes,
            "total_equipes": len(self.equipes),
            "descricao": self.descricao
        }


@dataclass
class ItemClassificacao:
    posicao: int
    projeto_id: str
    titulo_projeto: str
    equipe_id: str
    nome_equipe: str
    area_tematica: str
    nota_media: float
    total_avaliacoes: int

    def to_dict(self) -> Dict[str, Any]:
        return {
            "posicao": self.posicao,
            "projeto_id": self.projeto_id,
            "titulo_projeto": self.titulo_projeto,
            "equipe_id": self.equipe_id,
            "nome_equipe": self.nome_equipe,
            "area_tematica": self.area_tematica,
            "nota_media": self.nota_media,
            "total_avaliacoes": self.total_avaliacoes
        }
