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
    <div className="space-y-6">
      
      {/* Hero Header & Metrics */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Painel Oficial do Hackathon DInf/UFPR</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {dashboard?.hackathon?.nome || 'Classificação Final e Pódio'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              {dashboard?.hackathon?.descricao || 'Acompanhe em tempo real o ranking dos projetos avaliados pela banca examinadora.'}
            </p>
          </div>

          {/* Cards de Métricas Rápidas */}
          {dashboard?.estatisticas && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <span className="text-[11px] font-medium text-slate-500 block mb-0.5">Equipes</span>
                <span className="text-lg font-bold text-slate-900">
                  {dashboard.estatisticas.totalEquipes}/{dashboard.estatisticas.maxEquipes}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <span className="text-[11px] font-medium text-slate-500 block mb-0.5">Projetos</span>
                <span className="text-lg font-bold text-blue-700">
                  {dashboard.estatisticas.totalProjetos}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <span className="text-[11px] font-medium text-slate-500 block mb-0.5">Mentorias</span>
                <span className="text-lg font-bold text-slate-700">
                  {dashboard.estatisticas.totalMentorias}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <span className="text-[11px] font-medium text-slate-500 block mb-0.5">Avaliações</span>
                <span className="text-lg font-bold text-emerald-700">
                  {dashboard.estatisticas.totalAvaliacoes}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pódio Visual dos 3 Primeiros Colocados */}
      {ranking.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">Pódio dos Vencedores</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1º Lugar (Ouro) */}
            {top1 ? (
              <div className="bg-amber-50/50 border-2 border-amber-400 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-amber-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800">1º Lugar — Campeão</span>
                  </div>
                  <span className="text-sm font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300">
                    ★ {top1.notaMedia.toFixed(2)}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{top1.nomeEquipe}</h3>
                  <p className="text-xs font-semibold text-blue-700 mt-0.5">{top1.projetoTitulo}</p>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{top1.descricaoProjeto}</p>
                  <span className="inline-block mt-2 text-[11px] bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-800 font-medium">
                    {top1.areaTematica}
                  </span>
                </div>
                <div className="text-xs text-slate-600 border-t border-amber-200 pt-2.5">
                  <span className="font-medium text-slate-700">Membros: </span>
                  {top1.membros.map(m => m.nome).join(', ')}
                </div>
              </div>
            ) : null}

            {/* 2º Lugar (Prata) */}
            {top2 ? (
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Medal className="w-5 h-5 text-slate-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">2º Lugar</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-300">
                    ★ {top2.notaMedia.toFixed(2)}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{top2.nomeEquipe}</h3>
                  <p className="text-xs font-semibold text-blue-700 mt-0.5">{top2.projetoTitulo}</p>
                  <span className="inline-block mt-2 text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    {top2.areaTematica}
                  </span>
                </div>
                <div className="text-xs text-slate-600 border-t border-slate-200 pt-2.5">
                  <span className="font-medium text-slate-700">Membros: </span>
                  {top2.membros.map(m => m.nome).join(', ')}
                </div>
              </div>
            ) : null}

            {/* 3º Lugar (Bronze) */}
            {top3 ? (
              <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-amber-700" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800">3º Lugar</span>
                  </div>
                  <span className="text-sm font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    ★ {top3.notaMedia.toFixed(2)}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{top3.nomeEquipe}</h3>
                  <p className="text-xs font-semibold text-blue-700 mt-0.5">{top3.projetoTitulo}</p>
                  <span className="inline-block mt-2 text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    {top3.areaTematica}
                  </span>
                </div>
                <div className="text-xs text-slate-600 border-t border-slate-200 pt-2.5">
                  <span className="font-medium text-slate-700">Membros: </span>
                  {top3.membros.map(m => m.nome).join(', ')}
                </div>
              </div>
            ) : null}

          </div>
        </div>
      ) : null}

      {/* Tabela de Classificação Geral e Pareceres da Banca */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Classificação Geral dos Projetos (ECU 007)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cálculo aritmético das notas atribuídas pelos jurados da banca examinadora (Padrão Information Expert).
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md w-fit">
            {ranking.length} {ranking.length === 1 ? 'equipe avaliada' : 'equipes ranqueadas'}
          </span>
        </div>

        {ranking.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {ranking.map((item) => (
              <div key={item.equipeId} className="p-5 hover:bg-slate-50/60 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      item.posicao === 1 ? 'bg-amber-400 text-amber-950' :
                      item.posicao === 2 ? 'bg-slate-200 text-slate-800' :
                      item.posicao === 3 ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      #{item.posicao}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{item.nomeEquipe}</h3>
                      <p className="text-xs text-slate-500">
                        Integrantes: <span className="text-slate-700">{item.membros.map(m => `${m.nome} (${m.grr})`).join(', ')}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 block font-medium">Nota Média</span>
                      <span className="text-base font-bold text-blue-700">
                        {item.notaMedia > 0 ? item.notaMedia.toFixed(2) : 'Sem Nota'}
                      </span>
                    </div>
                    <div className="text-right border-l border-slate-200 pl-4">
                      <span className="text-[11px] text-slate-500 block font-medium">Avaliações</span>
                      <span className="text-sm font-semibold text-slate-700">
                        {item.totalAvaliacoes}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detalhes do Projeto */}
                <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{item.projetoTitulo}</span>
                    <span className="text-[10px] uppercase font-semibold bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      {item.areaTematica}
                    </span>
                  </div>
                  {item.descricaoProjeto && (
                    <p className="text-xs text-slate-600 leading-relaxed">{item.descricaoProjeto}</p>
                  )}

                  {/* Feedback dos Jurados */}
                  {item.avaliacoes && item.avaliacoes.length > 0 && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-200 space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Pareceres dos Jurados:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        {item.avaliacoes.map((av, i) => (
                          <div key={i} className="text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between font-semibold text-slate-800 mb-0.5">
                              <span>{av.juradoNome || 'Jurado'}</span>
                              <span className="text-blue-700 font-bold text-[11px]">★ {Number(av.nota).toFixed(1)}</span>
                            </div>
                            <p className="text-slate-600 text-[11px] italic">"{av.comentarios || 'Sem comentários adicionais.'}"</p>
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
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">Nenhuma equipe ranqueada no momento</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Cadastre um hackathon, participantes, equipes e lance avaliações, ou carregue os dados de demonstração da UFPR para ver o ranking.
              </p>
            </div>
            <button
              onClick={onCarregarDemo}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Carregar Demonstração UFPR</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
export default RankingPage;
