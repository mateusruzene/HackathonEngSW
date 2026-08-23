"""
Ponto de Entrada Principal do Sistema de Gestão de Hackathons Acadêmicos (HackDInf UFPR).
Trabalho Prático 1 - Engenharia de Software (2026/1) - Prof. Diego Addan
Autores:
  - Mateus Siqueira Ruzene (GRR20221223)
  - Gabriel Claudino de Souza (GRR20215730)
"""

import sys
import os

# Adiciona o diretório raiz do projeto ao sys.path para importações consistentes
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import argparse
import unittest
from src.application.controllers import SistemaHackathonFacade
from src.presentation.cli import HackathonCLI
from src.presentation.web_server import start_web_server


def run_demo():
    print("=" * 80)
    print("DEMONSTRAÇÃO AUTOMATIZADA: SISTEMA DE GESTÃO DE HACKATHONS ACADÊMICOS (DINF - UFPR)")
    print("Autores: Mateus Siqueira Ruzene (GRR20221223) & Gabriel Claudino de Souza (GRR20215730)")
    print("=" * 80)

    facade = SistemaHackathonFacade()
    hack_id = facade.semear_dados_exemplo()

    relatorio = facade.classificacao.gerar_relatorio_hackathon(hack_id)
    h = relatorio["hackathon"]
    m = relatorio["metricas"]

    print(f"\n[+] Hackathon: {h['nome']} (ID: {h['id']})")
    print(f"    Período: {h['data_inicio']} a {h['data_termino']} | Limite: {h['max_equipes']} equipes")
    print(f"    Descrição: {h['descricao']}")

    print(f"\n[+] Métricas Consolidadas:")
    print(f"    • Equipes: {m['total_equipes']}")
    print(f"    • Participantes: {m['total_participantes']}")
    print(f"    • Projetos: {m['total_projetos']}")
    print(f"    • Mentorias Realizadas: {m['total_mentorias']}")
    print(f"    • Avaliações Emitidas: {m['total_avaliacoes']}")

    print(f"\n[+] Equipes e Membros:")
    for eq in relatorio["equipes"]:
        membros = ", ".join([f"{p['nome']} ({p['matricula']})" for p in eq["participantes"]])
        proj_nome = eq["projeto"]["titulo"] if eq["projeto"] else "Sem projeto"
        print(f"    • {eq['nome']}: {membros} -> Projeto: '{proj_nome}'")

    print(f"\n[+] Classificação Final e Ranking:")
    print("-" * 80)
    for item in relatorio["ranking"]:
        print(f"    {item['posicao']}º Lugar: {item['titulo_projeto']} (Equipe: {item['nome_equipe']})")
        print(f"       -> Média: {item['nota_media']:.2f} | Área: {item['area_tematica']} | Total de Avaliações: {item['total_avaliacoes']}")
    print("-" * 80)
    print("\n[OK] Demonstração concluída com 100% de sucesso!")


def run_tests():
    print("=" * 80)
    print("EXECUTANDO TESTES AUTOMATIZADOS DE DOMÍNIO, REGRAS DE NEGÓCIO E CONTROLADORES")
    print("=" * 80)
    loader = unittest.TestLoader()
    suite = loader.discover("tests", pattern="test_*.py")
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    if not result.wasSuccessful():
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Sistema de Gestão de Hackathons Acadêmicos (DInf - UFPR) - Engenharia de Software"
    )
    parser.add_argument("--cli", action="store_true", help="Inicia a interface interativa no terminal (CLI)")
    parser.add_argument("--web", action="store_true", help="Inicia o servidor web com interface gráfica")
    parser.add_argument("--port", type=int, default=8080, help="Porta do servidor web (padrão: 8080)")
    parser.add_argument("--demo", action="store_true", help="Executa a demonstração automatizada no terminal")
    parser.add_argument("--test", action="store_true", help="Executa a bateria de testes automatizados")

    args = parser.parse_args()

    if args.test:
        run_tests()
    elif args.demo:
        run_demo()
    elif args.web:
        start_web_server(port=args.port)
    else:
        # Default behavior: run CLI
        facade = SistemaHackathonFacade()
        cli = HackathonCLI(facade)
        cli.menu_principal()


if __name__ == "__main__":
    main()
