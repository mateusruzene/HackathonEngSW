import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RankingPage from './pages/RankingPage';
import OrganizadorPage from './pages/OrganizadorPage';
import EstudantePage from './pages/EstudantePage';
import MentorPage from './pages/MentorPage';
import JuradoPage from './pages/JuradoPage';
import { Hackathon, ItemClassificacao, DashboardData } from './types';
import { api } from './api';

export const App: React.FC = () => {
  const getInitialRoute = () => {
    const path = window.location.pathname.replace('/', '').toLowerCase();
    if (['organizador', 'estudante', 'mentor', 'jurado'].includes(path)) {
      return path;
    }
    return 'ranking';
  };

  const [currentRoute, setCurrentRouteState] = useState<string>(getInitialRoute);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState<number | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [ranking, setRanking] = useState<ItemClassificacao[]>([]);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [globalNotification, setGlobalNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const setRoute = (route: string) => {
    setCurrentRouteState(route);
    const newPath = route === 'ranking' ? '/' : `/${route}`;
    window.history.pushState({}, '', newPath);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRouteState(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchHackathons = async () => {
    try {
      const data = await api.getHackathons();
      setHackathons(data);
      if (data && data.length > 0 && !selectedHackathonId) {
        setSelectedHackathonId(data[0].id);
      }
    } catch (err) {
      console.error('Erro ao buscar hackathons:', err);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  const refreshHackathonData = async () => {
    if (!selectedHackathonId) return;
    try {
      const [dash, rnk] = await Promise.all([
        api.getDashboard(selectedHackathonId),
        api.getRanking(selectedHackathonId)
      ]);
      setDashboard(dash);
      setRanking(rnk);
    } catch (err) {
      console.error('Erro ao atualizar dados do hackathon:', err);
    }
  };

  useEffect(() => {
    refreshHackathonData();
  }, [selectedHackathonId]);

  const handleCarregarDemo = async () => {
    setLoadingDemo(true);
    setGlobalNotification(null);
    try {
      const res = await api.carregarDemo();
      await fetchHackathons();
      if (res.hackathonId) {
        setSelectedHackathonId(res.hackathonId);
      }
      await refreshHackathonData();
      setGlobalNotification({
        type: 'success',
        text: '⚡ Demonstração do DInf UFPR carregada com sucesso com 3 equipes, projetos, mentores e avaliações!'
      });
      setTimeout(() => setGlobalNotification(null), 5000);
    } catch (err: any) {
      setGlobalNotification({ type: 'error', text: err.message });
    } finally {
      setLoadingDemo(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* Top Navigation */}
      <Navbar
        currentRoute={currentRoute}
        setRoute={setRoute}
        hackathons={hackathons}
        selectedHackathonId={selectedHackathonId}
        setSelectedHackathonId={setSelectedHackathonId}
        onCarregarDemo={handleCarregarDemo}
        loadingDemo={loadingDemo}
      />

      {/* Global Notification Toast */}
      {globalNotification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between border shadow-lg ${
            globalNotification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}>
            <span>{globalNotification.text}</span>
            <button onClick={() => setGlobalNotification(null)} className="text-slate-400 hover:text-white ml-3">✕</button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {currentRoute === 'ranking' && (
          <RankingPage
            dashboard={dashboard}
            ranking={ranking}
            onCarregarDemo={handleCarregarDemo}
          />
        )}

        {currentRoute === 'organizador' && (
          <OrganizadorPage
            hackathons={hackathons}
            selectedHackathonId={selectedHackathonId}
            setSelectedHackathonId={setSelectedHackathonId}
            dashboard={dashboard}
            onRefresh={() => {
              fetchHackathons();
              refreshHackathonData();
            }}
            onCarregarDemo={handleCarregarDemo}
          />
        )}

        {currentRoute === 'estudante' && (
          <EstudantePage
            selectedHackathonId={selectedHackathonId}
            dashboard={dashboard}
            onRefresh={refreshHackathonData}
          />
        )}

        {currentRoute === 'mentor' && (
          <MentorPage
            selectedHackathonId={selectedHackathonId}
            onRefresh={refreshHackathonData}
          />
        )}

        {currentRoute === 'jurado' && (
          <JuradoPage
            selectedHackathonId={selectedHackathonId}
            onRefresh={refreshHackathonData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>
          Departamento de Informática — Universidade Federal do Paraná (UFPR) • Engenharia de Software 2026/1
        </p>
        <p className="mt-1 text-slate-600">
          Autores: <strong>Mateus Siqueira Ruzene</strong> (GRR20221223) e <strong>Gabriel Claudino de Souza</strong> (GRR20215730)
        </p>
      </footer>

    </div>
  );
};
export default App;
