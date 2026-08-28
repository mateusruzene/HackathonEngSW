import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  PlusCircle, 
  Users, 
  Layers, 
  Sparkles
} from 'lucide-react';
import { Hackathon, DashboardData } from '../types';
import { api } from '../api';

interface OrganizadorPageProps {
  hackathons: Hackathon[];
  selectedHackathonId: number | null;
  setSelectedHackathonId: (id: number) => void;
  dashboard: DashboardData | null;
  onRefresh: () => void;
  onCarregarDemo: () => void;
}

export const OrganizadorPage: React.FC<OrganizadorPageProps> = ({
  hackathons: _hackathons,
  selectedHackathonId: _selectedHackathonId,
  setSelectedHackathonId,
  dashboard,
  onRefresh,
  onCarregarDemo
}) => {
  const [nome, setNome] = useState('');
  const [dataInicio, setDataInicio] = useState('2026-09-01');
  const [dataTermino, setDataTermino] = useState('2026-09-03');
  const [maxEquipes, setMaxEquipes] = useState(5);
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const novo = await api.criarHackathon({
        nome,
        dataInicio,
        dataTermino,
        maxEquipes: Number(maxEquipes),
        descricao
      });
      toast.success(`Hackathon "${novo.nome}" cadastrado com sucesso!`);
      setNome('');
      setDescricao('');
      onRefresh();
      setSelectedHackathonId(novo.id);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar hackathon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Portal do Organizador (ECU 001)</h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestão de edições do Hackathon, limites de capacidade de equipes e visão geral dos eventos.
          </p>
        </div>

        <button
          onClick={onCarregarDemo}
          className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer w-fit"
        >
          <Sparkles className="w-4 h-4" />
          <span>Carregar Demonstração UFPR</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulário de Criação (ECU 001) */}
        <div className="lg:col-span-1 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-400" /> Cadastrar Novo Hackathon
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nome da Edição</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Hackathon DInf UFPR 2026/1"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Data de Início</label>
                <input
                  type="date"
                  required
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Data de Término</label>
                <input
                  type="date"
                  required
                  value={dataTermino}
                  onChange={(e) => setDataTermino(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Capacidade Máxima (maxEquipes)
              </label>
              <input
                type="number"
                min="1"
                required
                value={maxEquipes}
                onChange={(e) => setMaxEquipes(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Controla o limite estrito de vagas do evento.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição do Evento</label>
              <textarea
                rows={3}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o tema, regulamento e objetivos da maratona..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar e Abrir Inscrições'}
            </button>
          </form>
        </div>

        {/* Visão Geral e Detalhes do Hackathon Selecionado */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" /> Detalhes do Evento
              </h2>
              {dashboard?.hackathon && (
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  ID: #{dashboard.hackathon.id}
                </span>
              )}
            </div>

            {dashboard?.hackathon ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{dashboard.hackathon.nome}</h3>
                  <p className="text-xs text-slate-400 mt-1">{dashboard.hackathon.descricao || 'Sem descrição cadastrada.'}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Início</span>
                    <span className="text-xs font-semibold text-slate-200">{dashboard.hackathon.dataInicio}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Término</span>
                    <span className="text-xs font-semibold text-slate-200">{dashboard.hackathon.dataTermino}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Ocupação</span>
                    <span className={`text-xs font-bold ${
                      dashboard.estatisticas.vagasRestantes === 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {dashboard.estatisticas.totalEquipes} / {dashboard.estatisticas.maxEquipes} Equipes
                    </span>
                  </div>
                </div>

                {/* Lista de Equipes Inscritas */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" /> Equipes Inscritas ({dashboard.equipes.length})
                  </h4>
                  {dashboard.equipes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {dashboard.equipes.map((eq) => (
                        <div key={eq.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white">{eq.nome}</span>
                            <span className="text-[10px] text-slate-400">{eq.membros.length} membros</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {eq.membros.map(m => m.nome).join(', ')}
                          </p>
                          {eq.projeto ? (
                            <p className="text-[10px] text-amber-400/90 font-medium">
                              Projeto: {eq.projeto.titulo}
                            </p>
                          ) : (
                            <p className="text-[10px] text-slate-500 italic">Projeto não submetido</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Nenhuma equipe inscrita neste evento ainda.</p>
                  )}
                </div>

              </div>
            ) : (
              <p className="text-xs text-slate-500 italic text-center py-6">
                Selecione um hackathon ou cadastre um novo para visualizar o painel.
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
export default OrganizadorPage;
