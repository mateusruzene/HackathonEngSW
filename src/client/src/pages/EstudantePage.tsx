import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Participante, DashboardData } from '../types';
import { api } from '../api';

interface EstudantePageProps {
  selectedHackathonId: number | null;
  dashboard: DashboardData | null;
  onRefresh: () => void;
}

export const EstudantePage: React.FC<EstudantePageProps> = ({
  selectedHackathonId,
  dashboard,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'participante' | 'equipe' | 'projeto'>('participante');
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [loading, setLoading] = useState(false);

  // Form 1: Participante
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [curso, setCurso] = useState('Ciência da Computação');
  const [grr, setGrr] = useState('');

  // Form 2: Equipe
  const [nomeEquipe, setNomeEquipe] = useState('');
  const [selectedParticipantes, setSelectedParticipantes] = useState<number[]>([]);

  // Form 3: Projeto
  const [selectedEquipeId, setSelectedEquipeId] = useState<string>('');
  const [tituloProjeto, setTituloProjeto] = useState('');
  const [descricaoProjeto, setDescricaoProjeto] = useState('');
  const [areaTematica, setAreaTematica] = useState('Inteligência Artificial');

  const loadParticipantes = async () => {
    try {
      const data = await api.getParticipantes();
      setParticipantes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadParticipantes();
  }, []);

  const handleCadastrarParticipante = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const novo = await api.cadastrarParticipante({ nome, email, curso, grr });
      toast.success(`Participante "${novo.nome}" cadastrado com sucesso!`);
      setNome('');
      setEmail('');
      setGrr('');
      await loadParticipantes();
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar participante');
    } finally {
      setLoading(false);
    }
  };

  const handleInscreverEquipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHackathonId) {
      toast.error('Selecione um Hackathon ativo no topo da tela.');
      return;
    }
    if (selectedParticipantes.length === 0) {
      toast.error('Selecione ao menos 1 participante para compor a equipe.');
      return;
    }

    setLoading(true);
    try {
      const nova = await api.inscreverEquipe({
        hackathonId: selectedHackathonId,
        nome: nomeEquipe,
        participanteIds: selectedParticipantes
      });
      toast.success(`Equipe "${nova.nome}" inscrita com sucesso no evento!`);
      setNomeEquipe('');
      setSelectedParticipantes([]);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao inscrever equipe');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarProjeto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipeId) {
      toast.error('Selecione a equipe responsável pelo projeto.');
      return;
    }

    setLoading(true);
    try {
      const novo = await api.registrarProjeto({
        equipeId: Number(selectedEquipeId),
        titulo: tituloProjeto,
        descricao: descricaoProjeto,
        areaTematica
      });
      toast.success(`Projeto "${novo.titulo}" registrado com sucesso!`);
      setTituloProjeto('');
      setDescricaoProjeto('');
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao registrar projeto');
    } finally {
      setLoading(false);
    }
  };

  const toggleParticipanteSelection = (id: number) => {
    setSelectedParticipantes(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Portal do Estudante / Participante</h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Cadastro de estudantes, formação de equipes e submissão do projeto exclusivo do Hackathon.
        </p>

        {/* Abas de Navegação */}
        <div className="flex space-x-2 mt-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('participante')}
            className={`pb-2.5 px-3 text-xs transition-colors border-b-2 cursor-pointer ${
              activeTab === 'participante'
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            1. Cadastrar Estudante (ECU 002)
          </button>
          <button
            onClick={() => setActiveTab('equipe')}
            className={`pb-2.5 px-3 text-xs transition-colors border-b-2 cursor-pointer ${
              activeTab === 'equipe'
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            2. Inscrever Equipe (ECU 003)
          </button>
          <button
            onClick={() => setActiveTab('projeto')}
            className={`pb-2.5 px-3 text-xs transition-colors border-b-2 cursor-pointer ${
              activeTab === 'projeto'
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            3. Submeter Projeto (ECU 004)
          </button>
        </div>
      </div>

      {/* Conteúdo da Aba 1: Cadastrar Participante (ECU 002) */}
      {activeTab === 'participante' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Novo Participante
            </h2>

            <form onSubmit={handleCadastrarParticipante} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Mateus Ruzene"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">E-mail Institucional</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: msr22@inf.ufpr.br"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Curso</label>
                <input
                  type="text"
                  required
                  value={curso}
                  onChange={(e) => setCurso(e.target.value)}
                  placeholder="Ex: Ciência da Computação"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">GRR / Matrícula</label>
                <input
                  type="text"
                  required
                  value={grr}
                  onChange={(e) => setGrr(e.target.value)}
                  placeholder="Ex: GRR20221223"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar Participante'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Estudantes Cadastrados</span>
              <span className="text-xs font-normal text-slate-500">{participantes.length} estudantes</span>
            </h2>

            {participantes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {participantes.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900">{p.nome}</span>
                      <span className="text-xs font-mono bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                        {p.grr}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{p.email}</p>
                    <p className="text-xs text-slate-500">{p.curso}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-4">Nenhum estudante cadastrado no momento.</p>
            )}
          </div>
        </div>
      )}

      {/* Conteúdo da Aba 2: Inscrever Equipe (ECU 003) */}
      {activeTab === 'equipe' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Inscrição de Equipe no Hackathon
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Selecione os estudantes para compor a equipe. Cada estudante só pode integrar uma equipe por evento.
            </p>
          </div>

          <form onSubmit={handleInscreverEquipe} className="space-y-5">
            <div className="max-w-md">
              <label className="block text-xs font-medium text-slate-700 mb-1">Nome da Equipe</label>
              <input
                type="text"
                required
                value={nomeEquipe}
                onChange={(e) => setNomeEquipe(e.target.value)}
                placeholder="Ex: ByteCraft UFPR"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Selecione os Integrantes ({selectedParticipantes.length} selecionados)
              </label>
              
              {participantes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
                  {participantes.map((p) => {
                    const isSelected = selectedParticipantes.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleParticipanteSelection(p.id)}
                        className={`p-3 rounded-lg border transition-colors cursor-pointer select-none text-xs ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span>{p.nome}</span>
                          <span className="text-xs font-mono text-slate-500">{p.grr}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{p.curso}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Cadastre participantes na aba anterior primeiro.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || participantes.length === 0}
              className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Inscrevendo...' : 'Confirmar Inscrição da Equipe'}
            </button>
          </form>
        </div>
      )}

      {/* Conteúdo da Aba 3: Submeter Projeto (ECU 004) */}
      {activeTab === 'projeto' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Registro do Projeto da Equipe
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cada equipe pode cadastrar estritamente 1 projeto para ser avaliado pela banca examinadora.
            </p>
          </div>

          <form onSubmit={handleRegistrarProjeto} className="space-y-3.5 max-w-2xl">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Equipe Responsável</label>
              <select
                required
                value={selectedEquipeId}
                onChange={(e) => setSelectedEquipeId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione a equipe...</option>
                {dashboard?.equipes?.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.nome} {eq.projeto ? '(Projeto já cadastrado)' : '(Disponível para submissão)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Título do Projeto</label>
              <input
                type="text"
                required
                value={tituloProjeto}
                onChange={(e) => setTituloProjeto(e.target.value)}
                placeholder="Ex: EcoTrack UFPR - Monitoramento de Sustentabilidade"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Área Temática</label>
              <select
                value={areaTematica}
                onChange={(e) => setAreaTematica(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Sustentabilidade e IoT">Sustentabilidade e IoT</option>
                <option value="Saúde e Inteligência Artificial">Saúde e Inteligência Artificial</option>
                <option value="Cidades Inteligentes e Cloud">Cidades Inteligentes e Cloud</option>
                <option value="Educação e Acessibilidade">Educação e Acessibilidade</option>
                <option value="Segurança e Blockchain">Segurança e Blockchain</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Descrição Detalhada da Solução</label>
              <textarea
                rows={4}
                required
                value={descricaoProjeto}
                onChange={(e) => setDescricaoProjeto(e.target.value)}
                placeholder="Apresente a proposta de valor, tecnologias utilizadas e impacto para a comunidade..."
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Submetendo...' : 'Submeter Projeto Oficial'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
export default EstudantePage;
