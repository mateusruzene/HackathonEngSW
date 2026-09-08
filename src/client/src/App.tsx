import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
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
    const toastId = toast.loading('Carregando dados de demonstração da UFPR...');
    try {
      const res = await api.carregarDemo();
      await fetchHackathons();
      if (res.hackathonId) {
        setSelectedHackathonId(res.hackathonId);
      }
      await refreshHackathonData();
      toast.success('Demonstração UFPR carregada com sucesso!', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Erro ao carregar demonstração', { id: toastId });
    } finally {
      setLoadingDemo(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Toast Notifications Container */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '13px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
          },
          success: {
            iconTheme: {
              primary: '#059669',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#e11d48',
              secondary: '#ffffff',
            },
          }
        }}
      />

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
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>
          Departamento de Informática — Universidade Federal do Paraná (UFPR) • Engenharia de Software 2026/1
        </p>
        <p className="mt-1 text-slate-400">
          Autores: <span className="font-semibold text-slate-600">Mateus Siqueira Ruzene</span> (GRR20221223) e <span className="font-semibold text-slate-600">Gabriel Claudino de Souza</span> (GRR20215730)
        </p>
      </footer>

    </div>
  );
};
export default App;
