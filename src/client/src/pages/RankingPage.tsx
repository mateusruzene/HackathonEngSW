import React from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  Sparkles, 
  MessageSquare
} from 'lucide-react';
import { ItemClassificacao, DashboardData } from '../types';

interface RankingPageProps {
  dashboard: DashboardData | null;
  ranking: ItemClassificacao[];
  onCarregarDemo: () => void;
}

export const RankingPage: React.FC<RankingPageProps> = ({
  dashboard,
  ranking,
  onCarregarDemo
}) => {
  const top1 = ranking[0];
  const top2 = ranking[1];
  const top3 = ranking[2];

  return (
    <div className="space-y-8">
      
      {/* Hero Header & Metrics */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Painel Oficial do Hackathon DInf/UFPR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {dashboard?.hackathon?.nome || 'Classificação Final e Pódio'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {dashboard?.hackathon?.descricao || 'Acompanhe em tempo real o ranking dos projetos avaliados pela banca examinadora.'}
            </p>
          </div>

          {/* Cards de Métricas Rápidas */}
          {dashboard?.estatisticas && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Equipes</span>
                <span className="text-xl font-extrabold text-white">
                  {dashboard.estatisticas.totalEquipes}/{dashboard.estatisticas.maxEquipes}
                </span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Projetos</span>
                <span className="text-xl font-extrabold text-amber-400">
                  {dashboard.estatisticas.totalProjetos}
                </span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Mentorias</span>
                <span className="text-xl font-extrabold text-blue-400">
                  {dashboard.estatisticas.totalMentorias}
                </span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Avaliações</span>
                <span className="text-xl font-extrabold text-emerald-400">
                  {dashboard.estatisticas.totalAvaliacoes}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pódio Visual dos 3 Primeiros Colocados */}
      {ranking.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Pódio dos Vencedores</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4">
            
            {/* 2º Lugar (Prata) */}
            {top2 ? (
              <div className="order-2 md:order-1 bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transform md:translate-y-2 hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Medal className="w-6 h-6 text-slate-300" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">2º Lugar</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-300 bg-slate-700/50 px-2 py-0.5 rounded border border-slate-600">
                    ★ {top2.notaMedia.toFixed(2)}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{top2.nomeEquipe}</h3>
                  <p className="text-xs font-medium text-amber-400/90 mt-0.5">{top2.projetoTitulo}</p>
                  <span className="inline-block mt-2 text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-400">
                    {top2.areaTematica}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 border-t border-slate-700/50 pt-2.5">
                  <span className="font-semibold text-slate-300">Membros: </span>
                  {top2.membros.map(m => m.nome).join(', ')}
                </div>
              </div>
            ) : <div className="hidden md:block"></div>}

            {/* 1º Lugar (Ouro) */}
            {top1 ? (
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl shadow-amber-500/10 flex flex-col justify-between space-y-4 transform md:-translate-y-3 hover:-translate-y-4 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-7 h-7 text-amber-400" />
                    <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">1º Lugar — Campeão</span>
                  </div>
                  <span className="text-sm font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-xl border border-amber-500/30">
                    ★ {top1.notaMedia.toFixed(2)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">{top1.nomeEquipe}</h3>
                  <p className="text-xs font-medium text-amber-300 mt-1">{top1.projetoTitulo}</p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{top1.descricaoProjeto}</p>
                  <span className="inline-block mt-2 text-[10px] bg-slate-950 px-2.5 py-1 rounded-lg text-amber-400/80 border border-amber-500/20 font-semibold">
                    {top1.areaTematica}
                  </span>
                </div>
                <div className="text-xs text-slate-400 border-t border-slate-800 pt-3">
                  <span className="font-semibold text-slate-200">Membros: </span>
                  {top1.membros.map(m => m.nome).join(', ')}
                </div>
              </div>
            ) : null}

            {/* 3º Lugar (Bronze) */}
            {top3 ? (
              <div className="order-3 bg-gradient-to-b from-amber-900/20 to-slate-900/90 border border-amber-800/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transform md:translate-y-4 hover:translate-y-2 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-6 h-6 text-amber-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-500">3º Lugar</span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-500 bg-amber-900/20 px-2 py-0.5 rounded border border-amber-800/40">
                    ★ {top3.notaMedia.toFixed(2)}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{top3.nomeEquipe}</h3>
                  <p className="text-xs font-medium text-amber-400/90 mt-0.5">{top3.projetoTitulo}</p>
                  <span className="inline-block mt-2 text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-400">
                    {top3.areaTematica}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2.5">
                  <span className="font-semibold text-slate-300">Membros: </span>
                  {top3.membros.map(m => m.nome).join(', ')}
                </div>
              </div>
            ) : <div className="hidden md:block"></div>}

          </div>
        </div>
      ) : null}

      {/* Tabela de Classificação Geral e Pareceres da Banca */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Classificação Geral dos Projetos (ECU 007)</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cálculo aritmético das notas atribuídas pelos jurados da banca examinadora (Padrão Information Expert).
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-800 text-slate-300 rounded-full w-fit">
            {ranking.length} {ranking.length === 1 ? 'equipe avaliada' : 'equipes ranqueadas'}
          </span>
        </div>

        {ranking.length > 0 ? (
          <div className="divide-y divide-slate-800/60">
            {ranking.map((item) => (
              <div key={item.equipeId} className="p-6 hover:bg-slate-800/30 transition-all space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shadow ${
                      item.posicao === 1 ? 'bg-amber-500 text-slate-950' :
                      item.posicao === 2 ? 'bg-slate-300 text-slate-950' :
                      item.posicao === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{item.posicao}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{item.nomeEquipe}</h3>
                      <p className="text-xs text-slate-400">
                        Integrantes: <span className="text-slate-300">{item.membros.map(m => `${m.nome} (${m.grr})`).join(', ')}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-medium">Nota Média</span>
                      <span className="text-lg font-extrabold text-amber-400">
                        {item.notaMedia > 0 ? item.notaMedia.toFixed(2) : 'Sem Nota'}
                      </span>
                    </div>
                    <div className="text-right border-l border-slate-800 pl-3">
                      <span className="text-xs text-slate-400 block font-medium">Avaliações</span>
                      <span className="text-sm font-bold text-slate-300">
                        {item.totalAvaliacoes}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detalhes do Projeto */}
                <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">{item.projetoTitulo}</span>
                    <span className="text-[10px] uppercase font-semibold bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                      {item.areaTematica}
                    </span>
                  </div>
                  {item.descricaoProjeto && (
                    <p className="text-xs text-slate-400 leading-relaxed">{item.descricaoProjeto}</p>
                  )}

                  {/* Feedback dos Jurados */}
                  {item.avaliacoes && item.avaliacoes.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Pareceres dos Jurados:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        {item.avaliacoes.map((av, i) => (
                          <div key={i} className="text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                            <div className="flex items-center justify-between font-semibold text-slate-300 mb-0.5">
                              <span>{av.juradoNome || 'Jurado'}</span>
                              <span className="text-amber-400 font-extrabold text-[11px]">★ {Number(av.nota).toFixed(1)}</span>
                            </div>
                            <p className="text-slate-400 text-[11px] italic">"{av.comentarios || 'Sem comentários adicionais.'}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center mx-auto text-amber-400">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Nenhuma equipe ranqueada no momento</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Cadastre um hackathon, participantes, equipes e lance avaliações, ou carregue os dados de demonstração da UFPR para ver o ranking instantaneamente.
              </p>
            </div>
            <button
              onClick={onCarregarDemo}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Carregar Demonstração UFPR</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
export default RankingPage;
