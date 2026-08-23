"""
Exceções de Domínio do Sistema de Gestão de Hackathons Acadêmicos (DInf - UFPR).
Trabalho Prático 1 - Engenharia de Software - 2026/1
Alunos: Mateus Siqueira Ruzene (GRR20221223) e Gabriel Claudino de Souza (GRR20215730)
"""

class DomainException(Exception):
    """Exceção base para regras de negócio do domínio."""
    pass

class EntidadeNaoEncontradaException(DomainException):
    """Lançada quando um recurso solicitado não existe."""
    pass

class ValidacaoDominioException(DomainException):
    """Lançada quando um campo ou estado não satisfaz regras de validação."""
    pass

class HackathonLotadoException(DomainException):
    """Lançada ao tentar registrar uma equipe além do limite do Hackathon."""
    pass

class ProjetoJaCadastradoException(DomainException):
    """Lançada quando uma equipe tenta cadastrar mais de um projeto."""
    pass

class EquipeSemParticipantesException(DomainException):
    """Lançada quando uma equipe é criada sem participantes válidos."""
    pass

class ParticipanteJaEmEquipeException(DomainException):
    """Lançada quando um participante já pertence a uma equipe no mesmo hackathon."""
    pass

class NotaInvalidaException(DomainException):
    """Lançada quando uma nota de avaliação está fora do intervalo permitido (0 a 10)."""
    pass
