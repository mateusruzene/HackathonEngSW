import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  Gavel, 
  UserPlus, 
  Star, 
  FolderKanban
} from 'lucide-react';
import { Jurado, Projeto, Avaliacao } from '../types';
import { api } from '../api';

interface JuradoPageProps {
  selectedHackathonId: number | null;
  onRefresh: () => void;
}

export const JuradoPage: React.FC<JuradoPageProps> = ({
  selectedHackathonId,
  onRefresh
}) => {
  const [jurados, setJurados] = useState<Jurado[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(false);

  // Form Jurado
  const [nomeJurado, setNomeJurado] = useState('');
  const [emailJurado, setEmailJurado] = useState('');
  const [areaJurado, setAreaJurado] = useState('');

  // Form Avaliação (ECU 006)
  const [selectedJuradoId, setSelectedJuradoId] = useState<string>('');
  const [selectedProjetoId, setSelectedProjetoId] = useState<string>('');
  const [nota, setNota] = useState<number>(8.5);
  const [comentarios, setComentarios] = useState('');

  const loadData = async () => {
    try {
      const js = await api.getJurados();
      setJurados(js);
      if (selectedHackathonId) {
        const projs = await api.getProjetos(selectedHackathonId);
        setProjetos(projs);
        const avs = await api.getAvaliacoes(selectedHackathonId);
        setAvaliacoes(avs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedHackathonId]);

  const handleCadastrarJurado = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const novo = await api.cadastrarJurado({
        nome: nomeJurado,
        email: emailJurado,
        areaAtuacao: areaJurado
      });
      toast.success(`Jurado "${novo.nome}" cadastrado na banca com sucesso!`);
      setNomeJurado('');
      setEmailJurado('');
      setAreaJurado('');
      await loadData();
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar jurado');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarAvaliacao = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!selectedJuradoId || !selectedProjetoId) {
        throw new Error('Selecione o jurado avaliador e o projeto.');
      }
      const notaNum = parseFloat(String(nota));
      if (isNaN(notaNum) || notaNum < 0.0 || notaNum > 10.0) {
        throw new Error('A nota deve estar estritamente entre 0.0 e 10.0.');
      }
      await api.registrarAvaliacao({
        juradoId: Number(selectedJuradoId),
        projetoId: Number(selectedProjetoId),
        nota: notaNum,
        comentarios
      });
      toast.success(`Avaliação com nota ${notaNum.toFixed(1)} registrada com sucesso!`);
      setComentarios('');
      setNota(8.5);
      await loadData();
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao registrar avaliação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <Gavel className="w-6 h-6 text-amber-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-white">Banca Examinadora / Jurados (ECU 006)</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Cadastro de jurados examinadores e atribuição formal de notas (0.0 a 10.0) e pareceres aos projetos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Form 1: Cadastrar Jurado */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-400" /> Cadastrar Jurado / Examinador
          </h2>

          <form onSubmit={handleCadastrarJurado} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Jurado</label>
              <input
                type="text"
                required
                value={nomeJurado}
                onChange={(e) => setNomeJurado(e.target.value)}
                placeholder="Ex: Prof. Marcos Silva"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail</label>
              <input
                type="email"
                required
                value={emailJurado}
                onChange={(e) => setEmailJurado(e.target.value)}
                placeholder="Ex: marcos.silva@inf.ufpr.br"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Área de Atuação / Expertise</label>
              <input
                type="text"
                required
                value={areaJurado}
                onChange={(e) => setAreaJurado(e.target.value)}
                placeholder="Ex: Sistemas Distribuídos e Redes"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Jurado'}
            </button>
          </form>
        </div>

        {/* Form 2: Registrar Avaliação (ECU 006) */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" /> Registrar Avaliação do Projeto (ECU 006)
          </h2>

          <form onSubmit={handleRegistrarAvaliacao} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Jurado Avaliador</label>
              <select
                required
                value={selectedJuradoId}
                onChange={(e) => setSelectedJuradoId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">Selecione o jurado...</option>
                {jurados.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nome} ({j.areaAtuacao})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Projeto Avaliado</label>
              <select
                required
                value={selectedProjetoId}
                onChange={(e) => setSelectedProjetoId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">Selecione o projeto...</option>
                {projetos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.titulo} — Equipe: {p.equipeNome}
                  </option>
                ))}
              </select>
            </div>

            {/* Slider e Input de Nota (0.0 a 10.0) */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Nota Atribuída (0.0 a 10.0)</label>
                <span className="text-lg font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                  {Number(nota).toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={nota}
                onChange={(e) => setNota(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Parecer Técnico / Comentários</label>
              <textarea
                rows={3}
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                placeholder="Insira os pontos fortes, originalidade e recomendações para o projeto..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Lançar Nota e Avaliação'}
            </button>
          </form>
        </div>

      </div>

      {/* Histórico de Avaliações */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-amber-400" /> Avaliações Lançadas no Hackathon ({avaliacoes.length})
        </h2>

        {avaliacoes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {avaliacoes.map((av) => (
              <div key={av.id} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{av.juradoNome}</span>
                  <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    ★ {Number(av.nota).toFixed(1)}
                  </span>
                </div>
                <p className="text-[11px] text-amber-300 font-semibold">{av.projetoTitulo} ({av.equipeNome})</p>
                <p className="text-xs text-slate-300 italic">"{av.comentarios || 'Sem comentários adicionais.'}"</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic text-center py-4">Nenhuma avaliação realizada até o momento.</p>
        )}
      </div>

    </div>
  );
};
export default JuradoPage;
