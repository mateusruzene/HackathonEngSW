import React from 'react';
import { 
  Trophy, 
  Users, 
  GraduationCap, 
  Compass, 
  Gavel, 
  Sparkles, 
  Calendar 
} from 'lucide-react';
import { Hackathon } from '../types';

interface NavbarProps {
  currentRoute: string;
  setRoute: (route: string) => void;
  hackathons: Hackathon[];
  selectedHackathonId: number | null;
  setSelectedHackathonId: (id: number) => void;
  onCarregarDemo: () => void;
  loadingDemo: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  setRoute,
  hackathons,
  selectedHackathonId,
  setSelectedHackathonId,
  onCarregarDemo,
  loadingDemo
}) => {
  const navItems = [
    { id: 'ranking', label: 'Classificação & Pódio', icon: Trophy, path: '/' },
    { id: 'organizador', label: 'Organizador', icon: Users, path: '/organizador' },
    { id: 'estudante', label: 'Estudante', icon: GraduationCap, path: '/estudante' },
    { id: 'mentor', label: 'Mentor', icon: Compass, path: '/mentor' },
    { id: 'jurado', label: 'Jurado', icon: Gavel, path: '/jurado' }
  ];

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & UFPR Badge */}
          <div 
            onClick={() => setRoute('ranking')} 
            className="flex items-center space-x-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Trophy className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-white tracking-tight">HackDInf</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20 px-1.5 py-0.5 rounded">
                  UFPR
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Engenharia de Software 2026/1</p>
            </div>
          </div>

          {/* Navigation Links por Papéis de Atores UML */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setRoute(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Hackathon Selector & Demo Seed Button */}
          <div className="flex items-center space-x-3">
            {hackathons.length > 0 && (
              <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                <select
                  value={selectedHackathonId || ''}
                  onChange={(e) => setSelectedHackathonId(Number(e.target.value))}
                  className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-2 font-medium"
                >
                  {hackathons.map((h) => (
                    <option key={h.id} value={h.id} className="bg-slate-900 text-white">
                      {h.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={onCarregarDemo}
              disabled={loadingDemo}
              title="Carrega dados realistas da UFPR com 3 equipes, projetos, mentores e avaliações"
              className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loadingDemo ? 'Carregando...' : 'Demo UFPR'}</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/80 overflow-x-auto gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setRoute(item.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
export default Navbar;
