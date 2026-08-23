"""
Testes Unitários e de Integração dos Controladores de Caso de Uso.
Trabalho Prático 1 - Engenharia de Software 2026/1
Alunos: Mateus Siqueira Ruzene (GRR20221223) e Gabriel Claudino de Souza (GRR20215730)
"""

import unittest
import sys
import os

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from src.application.controllers import SistemaHackathonFacade
from src.domain.exceptions import (
    EntidadeNaoEncontradaException,
    ValidacaoDominioException,
    HackathonLotadoException,
    ProjetoJaCadastradoException,
    ParticipanteJaEmEquipeException
)


class TestControllers(unittest.TestCase):

    def setUp(self):
        self.facade = SistemaHackathonFacade()

    def test_fluxo_cadastro_hackathon_e_participantes(self):
        hack = self.facade.hackathons.cadastrar_hackathon("Hackathon Teste", "2026-10-01", "2026-10-03", 3, "Desc")
        self.assertIsNotNone(hack.id)

        p1 = self.facade.participantes.cadastrar_participante("Mateus", "mateus@ufpr.br", "BCC", "GRR20221223")
        p2 = self.facade.participantes.cadastrar_participante("Gabriel", "gabriel@ufpr.br", "BCC", "GRR20215730")

        self.assertEqual(len(self.facade.participantes.listar_participantes()), 2)
        self.assertEqual(self.facade.participantes.buscar_por_id(p1.id).nome, "Mateus")

    def test_inscricao_equipe_e_projeto(self):
        hack = self.facade.hackathons.cadastrar_hackathon("Hackathon Teste", "2026-10-01", "2026-10-03", 2)
        p1 = self.facade.participantes.cadastrar_participante("Aluno 1", "a1@ufpr.br", "BCC", "GRR1")
        p2 = self.facade.participantes.cadastrar_participante("Aluno 2", "a2@ufpr.br", "BCC", "GRR2")

        eq = self.facade.equipes.inscrever_equipe("Equipe Beta", hack.id, [p1.id, p2.id])
        self.assertEqual(len(eq.participantes), 2)

        proj = self.facade.projetos.registrar_projeto(eq.id, "Proj Beta", "Descricao", "IA")
        self.assertEqual(proj.titulo, "Proj Beta")
        self.assertEqual(eq.projeto.id, proj.id)

    def test_mentorias_e_avaliacoes(self):
        hack = self.facade.hackathons.cadastrar_hackathon("Hack", "2026-10-01", "2026-10-03", 5)
        p = self.facade.participantes.cadastrar_participante("Aluno", "aluno@ufpr.br", "BCC", "GRR1")
        eq = self.facade.equipes.inscrever_equipe("Eq 1", hack.id, [p.id])
        proj = self.facade.projetos.registrar_projeto(eq.id, "Proj 1", "Desc", "Web")

        mentor = self.facade.mentorias.cadastrar_mentor("Prof. Diego", "diego@ufpr.br", "Engenharia de Software", "UFPR")
        mentoria = self.facade.mentorias.registrar_mentoria(mentor.id, eq.id, "Boa arquitetura")
        self.assertEqual(mentoria.mentor_id, mentor.id)

        jurado1 = self.facade.avaliacoes.cadastrar_jurado("Jurado 1", "j1@ufpr.br", "DInf")
        jurado2 = self.facade.avaliacoes.cadastrar_jurado("Jurado 2", "j2@ufpr.br", "DInf")

        self.facade.avaliacoes.registrar_avaliacao(jurado1.id, proj.id, 9.0, "Ótimo")
        self.facade.avaliacoes.registrar_avaliacao(jurado2.id, proj.id, 10.0, "Perfeito")

        ranking = self.facade.classificacao.calcular_classificacao_final(hack.id)
        self.assertEqual(len(ranking), 1)
        self.assertEqual(ranking[0].nota_media, 9.5)
        self.assertEqual(ranking[0].total_avaliacoes, 2)


class TestBusinessRules(unittest.TestCase):

    def setUp(self):
        self.facade = SistemaHackathonFacade()

    def test_regra_limite_maximo_equipes(self):
        hack = self.facade.hackathons.cadastrar_hackathon("Hack Limitado", "2026-10-01", "2026-10-03", 2)
        p1 = self.facade.participantes.cadastrar_participante("A1", "a1@ufpr.br", "BCC", "GRR1")
        p2 = self.facade.participantes.cadastrar_participante("A2", "a2@ufpr.br", "BCC", "GRR2")
        p3 = self.facade.participantes.cadastrar_participante("A3", "a3@ufpr.br", "BCC", "GRR3")

        self.facade.equipes.inscrever_equipe("Eq 1", hack.id, [p1.id])
        self.facade.equipes.inscrever_equipe("Eq 2", hack.id, [p2.id])

        # 3ª equipe deve estourar o limite de 2
        with self.assertRaises(HackathonLotadoException):
            self.facade.equipes.inscrever_equipe("Eq 3", hack.id, [p3.id])

    def test_regra_apenas_um_projeto_por_equipe(self):
        hack = self.facade.hackathons.cadastrar_hackathon("Hack", "2026-10-01", "2026-10-03", 5)
        p = self.facade.participantes.cadastrar_participante("A", "a@ufpr.br", "BCC", "GRR1")
        eq = self.facade.equipes.inscrever_equipe("Eq Unica", hack.id, [p.id])

        self.facade.projetos.registrar_projeto(eq.id, "Proj 1", "Desc", "IA")
        with self.assertRaises(ProjetoJaCadastradoException):
            self.facade.projetos.registrar_projeto(eq.id, "Proj 2", "Desc", "Web")

    def test_regra_participante_nao_pode_estar_em_duas_equipes_mesmo_hackathon(self):
        hack = self.facade.hackathons.cadastrar_hackathon("Hack", "2026-10-01", "2026-10-03", 5)
        p1 = self.facade.participantes.cadastrar_participante("A1", "a1@ufpr.br", "BCC", "GRR1")
        p2 = self.facade.participantes.cadastrar_participante("A2", "a2@ufpr.br", "BCC", "GRR2")

        self.facade.equipes.inscrever_equipe("Eq 1", hack.id, [p1.id])

        # Tentar inscrever p1 em outra equipe no mesmo hackathon
        with self.assertRaises(ParticipanteJaEmEquipeException):
            self.facade.equipes.inscrever_equipe("Eq 2", hack.id, [p1.id, p2.id])

    def test_ordenacao_ranking_multiplos_projetos(self):
        hack = self.facade.hackathons.cadastrar_hackathon("Hack Ranking", "2026-10-01", "2026-10-03", 5)
        p1 = self.facade.participantes.cadastrar_participante("P1", "p1@ufpr.br", "BCC", "G1")
        p2 = self.facade.participantes.cadastrar_participante("P2", "p2@ufpr.br", "BCC", "G2")
        p3 = self.facade.participantes.cadastrar_participante("P3", "p3@ufpr.br", "BCC", "G3")

        eq1 = self.facade.equipes.inscrever_equipe("Eq 1", hack.id, [p1.id])
        eq2 = self.facade.equipes.inscrever_equipe("Eq 2", hack.id, [p2.id])
        eq3 = self.facade.equipes.inscrever_equipe("Eq 3", hack.id, [p3.id])

        proj1 = self.facade.projetos.registrar_projeto(eq1.id, "Proj Bronze", "Desc", "A")
        proj2 = self.facade.projetos.registrar_projeto(eq2.id, "Proj Ouro", "Desc", "B")
        proj3 = self.facade.projetos.registrar_projeto(eq3.id, "Proj Prata", "Desc", "C")

        jurado = self.facade.avaliacoes.cadastrar_jurado("Jurado", "j@ufpr.br", "DInf")

        self.facade.avaliacoes.registrar_avaliacao(jurado.id, proj1.id, 7.5, "")
        self.facade.avaliacoes.registrar_avaliacao(jurado.id, proj2.id, 9.8, "")
        self.facade.avaliacoes.registrar_avaliacao(jurado.id, proj3.id, 8.5, "")

        ranking = self.facade.classificacao.calcular_classificacao_final(hack.id)
        self.assertEqual(ranking[0].titulo_projeto, "Proj Ouro")
        self.assertEqual(ranking[0].posicao, 1)
        self.assertEqual(ranking[1].titulo_projeto, "Proj Prata")
        self.assertEqual(ranking[1].posicao, 2)
        self.assertEqual(ranking[2].titulo_projeto, "Proj Bronze")
        self.assertEqual(ranking[2].posicao, 3)


if __name__ == "__main__":
    unittest.main()
