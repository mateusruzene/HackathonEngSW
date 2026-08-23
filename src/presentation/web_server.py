"""
Servidor Web HTTP nativo e API REST para o Sistema de Gestão de Hackathons Acadêmicos.
Sistema DInf - UFPR (Engenharia de Software 2026/1).
Alunos: Mateus Siqueira Ruzene (GRR20221223) e Gabriel Claudino de Souza (GRR20215730)
"""

import http.server
import json
import os
import sys
import socketserver
import urllib.parse
from typing import Optional

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from src.application.controllers import SistemaHackathonFacade
from src.domain.exceptions import DomainException

STATIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static"))


class HackathonWebHandler(http.server.SimpleHTTPRequestHandler):
    facade: SistemaHackathonFacade = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def _set_json_headers(self, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_json_headers(200)

    def _read_json_body(self):
        content_len = int(self.headers.get("Content-Length", 0))
        if content_len == 0:
            return {}
        body = self.rfile.read(content_len).decode("utf-8")
        return json.loads(body)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if path == "/api/status":
            self._set_json_headers(200)
            self.wfile.write(json.dumps({"status": "online", "system": "HackDInf UFPR"}).encode("utf-8"))
            return

        elif path == "/api/hackathons":
            hacks = [h.to_dict() for h in self.facade.hackathons.listar_hackathons()]
            self._set_json_headers(200)
            self.wfile.write(json.dumps(hacks).encode("utf-8"))
            return

        elif path == "/api/participantes":
            parts = [p.to_dict() for p in self.facade.participantes.listar_participantes()]
            self._set_json_headers(200)
            self.wfile.write(json.dumps(parts).encode("utf-8"))
            return

        elif path == "/api/mentores":
            mentores = [m.to_dict() for m in self.facade.mentorias.listar_todos_mentores()]
            self._set_json_headers(200)
            self.wfile.write(json.dumps(mentores).encode("utf-8"))
            return

        elif path == "/api/jurados":
            jurados = [j.to_dict() for j in self.facade.avaliacoes.listar_todos_jurados()]
            self._set_json_headers(200)
            self.wfile.write(json.dumps(jurados).encode("utf-8"))
            return

        elif path == "/api/hackathon/relatorio":
            hack_id = query.get("id", [None])[0]
            if not hack_id:
                hacks = self.facade.hackathons.listar_hackathons()
                if hacks:
                    hack_id = hacks[0].id
                else:
                    self._set_json_headers(404)
                    self.wfile.write(json.dumps({"error": "Nenhum hackathon disponível."}).encode("utf-8"))
                    return
            try:
                rel = self.facade.classificacao.gerar_relatorio_hackathon(hack_id)
                self._set_json_headers(200)
                self.wfile.write(json.dumps(rel).encode("utf-8"))
            except Exception as e:
                self._set_json_headers(400)
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return

        # Static files fallback
        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        try:
            body = self._read_json_body()

            if path == "/api/seed":
                hack_id = self.facade.semear_dados_exemplo()
                self._set_json_headers(200)
                self.wfile.write(json.dumps({"success": True, "hackathon_id": hack_id}).encode("utf-8"))

            elif path == "/api/hackathons":
                h = self.facade.hackathons.cadastrar_hackathon(
                    nome=body["nome"],
                    data_inicio=body["data_inicio"],
                    data_termino=body["data_termino"],
                    max_equipes=int(body["max_equipes"]),
                    descricao=body.get("descricao", "")
                )
                self._set_json_headers(201)
                self.wfile.write(json.dumps(h.to_dict()).encode("utf-8"))

            elif path == "/api/participantes":
                p = self.facade.participantes.cadastrar_participante(
                    nome=body["nome"],
                    email=body["email"],
                    curso=body["curso"],
                    matricula=body["matricula"]
                )
                self._set_json_headers(201)
                self.wfile.write(json.dumps(p.to_dict()).encode("utf-8"))

            elif path == "/api/equipes":
                eq = self.facade.equipes.inscrever_equipe(
                    nome=body["nome"],
                    hackathon_id=body["hackathon_id"],
                    participantes_ids=body["participantes_ids"]
                )
                self._set_json_headers(201)
                self.wfile.write(json.dumps(eq.to_dict()).encode("utf-8"))

            elif path == "/api/projetos":
                proj = self.facade.projetos.registrar_projeto(
                    equipe_id=body["equipe_id"],
                    titulo=body["titulo"],
                    descricao=body["descricao"],
                    area_tematica=body["area_tematica"]
                )
                self._set_json_headers(201)
                self.wfile.write(json.dumps(proj.to_dict()).encode("utf-8"))

            elif path == "/api/mentores":
                m = self.facade.mentorias.cadastrar_mentor(
                    nome=body["nome"],
                    email=body["email"],
                    especialidade=body["especialidade"],
                    instituicao=body["instituicao"]
                )
                self._set_json_headers(201)
                self.wfile.write(json.dumps(m.to_dict()).encode("utf-8"))

            elif path == "/api/mentorias":
                ment = self.facade.mentorias.registrar_mentoria(
                    mentor_id=body["mentor_id"],
                    equipe_id=body["equipe_id"],
                    comentarios=body["comentarios"]
                )
                self._set_json_headers(201)
                self.wfile.write(json.dumps(ment.to_dict()).encode("utf-8"))

            elif path == "/api/jurados":
                j = self.facade.avaliacoes.cadastrar_jurado(
                    nome=body["nome"],
                    email=body["email"],
                    instituicao=body["instituicao"]
                )
                self._set_json_headers(201)
                self.wfile.write(json.dumps(j.to_dict()).encode("utf-8"))

            elif path == "/api/avaliacoes":
                av = self.facade.avaliacoes.registrar_avaliacao(
                    jurado_id=body["jurado_id"],
                    projeto_id=body["projeto_id"],
                    nota=float(body["nota"]),
                    comentarios=body.get("comentarios", "")
                )
                self._set_json_headers(201)
                self.wfile.write(json.dumps(av.to_dict()).encode("utf-8"))

            else:
                self._set_json_headers(404)
                self.wfile.write(json.dumps({"error": "Endpoint não encontrado"}).encode("utf-8"))

        except DomainException as de:
            self._set_json_headers(400)
            self.wfile.write(json.dumps({"error": str(de)}).encode("utf-8"))
        except Exception as ex:
            self._set_json_headers(500)
            self.wfile.write(json.dumps({"error": f"Erro interno do servidor: {str(ex)}"}).encode("utf-8"))


def start_web_server(port=8080, facade: Optional[SistemaHackathonFacade] = None):
    if facade is None:
        facade = SistemaHackathonFacade()
        facade.semear_dados_exemplo()

    HackathonWebHandler.facade = facade
    with socketserver.TCPServer(("", port), HackathonWebHandler) as httpd:
        print(f"🚀 Servidor Web HackDInf UFPR iniciado com sucesso!")
        print(f"🔗 Acesse: http://localhost:{port}")
        print(f"Para encerrar, pressione Ctrl+C")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor finalizado.")


if __name__ == "__main__":
    start_web_server()
