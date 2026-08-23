"""
Testes Unitários do Modelo de Domínio do Sistema de Hackathons.
Trabalho Prático 1 - Engenharia de Software 2026/1
Alunos: Mateus Siqueira Ruzene (GRR20221223) e Gabriel Claudino de Souza (GRR20215730)
"""

import unittest
import sys
import os

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

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
from src.domain.exceptions import (
    ValidacaoDominioException,
    NotaInvalidaException,
    ProjetoJaCadastradoException,
    EquipeSemParticipantesException
)


class TestDomainModels(unittest.TestCase):

    def test_criar_participante_valido(self):
        p = Participante("P1", "Mateus Ruzene", "mateus@ufpr.br", "BCC", "GRR20221223")
        self.assertEqual(p.nome, "Mateus Ruzene")
        self.assertEqual(p.matricula, "GRR20221223")
        self.assertEqual(p.to_dict()["email"], "mateus@ufpr.br")

    def test_participante_invalido_sem_nome_ou_email(self):
        with self.assertRaises(ValidacaoDominioException):
            Participante("P1", "", "mateus@ufpr.br", "BCC", "GRR20221223")
        with self.assertRaises(ValidacaoDominioException):
            Participante("P1", "Mateus", "email_invalido", "BCC", "GRR20221223")
        with self.assertRaises(ValidacaoDominioException):
            Participante("P1", "Mateus", "mateus@ufpr.br", "BCC", "")

    def test_criar_hackathon_valido(self):
        h = Hackathon("H1", "Hackathon DInf", "2026-09-01", "2026-09-03", 10, "Descricao")
        self.assertEqual(h.nome, "Hackathon DInf")
        self.assertEqual(h.max_equipes, 10)
        self.assertTrue(h.pode_receber_equipe())

    def test_hackathon_max_equipes_invalido(self):
        with self.assertRaises(ValidacaoDominioException):
            Hackathon("H1", "Hackathon", "2026-09-01", "2026-09-03", 0)

    def test_equipe_validacao_membros(self):
        eq = Equipe("E1", "Equipe Alfa", "H1")
        with self.assertRaises(EquipeSemParticipantesException):
            eq.validar_membros()

        p = Participante("P1", "Gabriel", "gabriel@ufpr.br", "BCC", "GRR20215730")
        eq.adicionar_participante(p)
        self.assertEqual(len(eq.participantes), 1)
        eq.validar_membros()  # Não deve lançar erro

    def test_equipe_nao_permite_participante_duplicado(self):
        eq = Equipe("E1", "Equipe Alfa", "H1")
        p = Participante("P1", "Gabriel", "gabriel@ufpr.br", "BCC", "GRR20215730")
        eq.adicionar_participante(p)
        with self.assertRaises(ValidacaoDominioException):
            eq.adicionar_participante(p)

    def test_equipe_apenas_um_projeto(self):
        eq = Equipe("E1", "Equipe Alfa", "H1")
        proj1 = Projeto("PR1", "Projeto 1", "Desc", "IA", "E1", "H1")
        proj2 = Projeto("PR2", "Projeto 2", "Desc", "Web", "E1", "H1")
        eq.associar_projeto(proj1)
        with self.assertRaises(ProjetoJaCadastradoException):
            eq.associar_projeto(proj2)

    def test_avaliacao_calculo_nota_media(self):
        proj = Projeto("PR1", "Smart Campus", "Desc", "IoT", "E1", "H1")
        self.assertEqual(proj.calcular_nota_final(), 0.0)

        av1 = Avaliacao("A1", "J1", "PR1", 8.0, "Bom")
        av2 = Avaliacao("A2", "J2", "PR1", 9.0, "Muito bom")
        av3 = Avaliacao("A3", "J3", "PR1", 10.0, "Excelente")

        proj.adicionar_avaliacao(av1)
        proj.adicionar_avaliacao(av2)
        proj.adicionar_avaliacao(av3)

        # Média: (8 + 9 + 10) / 3 = 9.0
        self.assertEqual(proj.calcular_nota_final(), 9.0)

    def test_avaliacao_nota_fora_do_intervalo(self):
        with self.assertRaises(NotaInvalidaException):
            Avaliacao("A1", "J1", "PR1", 10.5, "Nota inválida")
        with self.assertRaises(NotaInvalidaException):
            Avaliacao("A2", "J1", "PR1", -1.0, "Nota negativa")


if __name__ == "__main__":
    unittest.main()
