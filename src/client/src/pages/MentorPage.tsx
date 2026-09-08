import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  Compass, 
  UserPlus, 
  MessageSquare, 
  FolderKanban
} from 'lucide-react';
import { Mentor, Mentoria } from '../types';
import { api } from '../api';

interface MentorPageProps {
  selectedHackathonId: number | null;
  onRefresh: () => void;
}

export const MentorPage: React.FC<MentorPageProps> = ({
  selectedHackathonId,
  onRefresh
}) => {
  const [mentores, setMentores] = useState<Mentor[]>([]);
  const [mentorias, setMentorias] = useState<Mentoria[]>([]);
  const [equipes, setEquipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form Mentor
  const [nomeMentor, setNomeMentor] = useState('');
  const [emailMentor, setEmailMentor] = useState('');
  const [especialidade, setEspecialidade] = useState('');

  // Form Mentoria (ECU 005)
  const [selectedMentorId, setSelectedMentorId] = useState<string>('');
  const [selectedEquipeId, setSelectedEquipeId] = useState<string>('');
  const [comentarios, setComentarios] = useState('');

  const loadData = async () => {
    try {
      const ms = await api.getMentores();
      setMentores(ms);
      if (selectedHackathonId) {
        const eqs = await api.getEquipes(selectedHackathonId);
        setEquipes(eqs);
        const mList = await api.getMentorias(selectedHackathonId);
        setMentorias(mList);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedHackathonId]);

  const handleCadastrarMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const novo = await api.cadastrarMentor({
        nome: nomeMentor,
        email: emailMentor,
        especialidade
      });
      toast.success(`Mentor "${novo.nome}" cadastrado com sucesso!`);
      setNomeMentor('');
      setEmailMentor('');
      setEspecialidade('');
      await loadData();
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar mentor');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarMentoria = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!selectedMentorId || !selectedEquipeId) {
        throw new Error('Selecione o mentor e a equipe atendida.');
      }
      await api.registrarMentoria({
        mentorId: Number(selectedMentorId),
        equipeId: Number(selectedEquipeId),
        comentarios
      });
      toast.success('Sessão de mentoria registrada com sucesso!');
      setComentarios('');
      await loadData();
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao registrar mentoria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <Compass className="w-5 h-5 text-blue-700" />
          <h1 className="text-xl font-bold text-slate-900">Portal de Mentorias (ECU 005)</h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Acompanhamento técnico das equipes participantes por mentores e especialistas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Form 1: Cadastrar Mentor */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-700" /> Cadastrar Mentor
          </h2>

          <form onSubmit={handleCadastrarMentor} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nome do Mentor</label>
              <input
                type="text"
                required
                value={nomeMentor}
                onChange={(e) => setNomeMentor(e.target.value)}
                placeholder="Ex: Prof. Diego Addan"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                required
                value={emailMentor}
                onChange={(e) => setEmailMentor(e.target.value)}
                placeholder="Ex: diego.addan@inf.ufpr.br"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Especialidade</label>
              <input
                type="text"
                required
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                placeholder="Ex: Engenharia de Software e Padrões GRASP"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Mentor'}
            </button>
          </form>
        </div>

        {/* Form 2: Registrar Mentoria (ECU 005) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-700" /> Registrar Mentoria à Equipe (ECU 005)
          </h2>

          <form onSubmit={handleRegistrarMentoria} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Mentor Responsável</label>
              <select
                required
                value={selectedMentorId}
                onChange={(e) => setSelectedMentorId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione o mentor...</option>
                {mentores.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome} ({m.especialidade})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Equipe Orientada</label>
              <select
                required
                value={selectedEquipeId}
                onChange={(e) => setSelectedEquipeId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione a equipe...</option>
                {equipes.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Orientações e Feedback Técnico</label>
              <textarea
                rows={3}
                required
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                placeholder="Insira as recomendações de arquitetura, domínio e melhorias passadas à equipe..."
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Registrar Sessão de Mentoria'}
            </button>
          </form>
        </div>

      </div>

      {/* Histórico de Mentorias */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-blue-700" /> Mentorias Realizadas no Hackathon ({mentorias.length})
        </h2>

        {mentorias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mentorias.map((m) => (
              <div key={m.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">{m.mentorNome}</span>
                  <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-medium">
                    Equipe: {m.equipeNome}
                  </span>
                </div>
                <p className="text-xs text-slate-600 italic">"{m.comentarios}"</p>
                <p className="text-[10px] text-slate-400">{new Date(m.dataHora).toLocaleString('pt-BR')}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic text-center py-4">Nenhuma mentoria registrada até o momento.</p>
        )}
      </div>

    </div>
  );
};
export default MentorPage;
