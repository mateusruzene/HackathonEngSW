import React from 'react';
import {
  Trophy,
  Users,
  GraduationCap,
  Compass,
  Gavel,
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
    { id: 'ranking', label: 'Classificação & Pódio', icon: Trophy },
    { id: 'organizador', label: 'Organizador', icon: Users },
    { id: 'estudante', label: 'Estudante', icon: GraduationCap },
    { id: 'mentor', label: 'Mentor', icon: Compass },
    { id: 'jurado', label: 'Jurado', icon: Gavel }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & UFPR Badge */}
          <div
            onClick={() => setRoute('ranking')}
            className="flex items-center space-x-3 cursor-pointer select-none"
          >
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base text-slate-900 tracking-tight">HackDInf</span>
              </div>
              <p className="text-xs text-slate-500">Engenharia de Software 2026/1</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setRoute(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                    }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-700' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Hackathon Selector & Demo Seed Button */}
          <div className="flex items-center space-x-2.5">
            {hackathons.length > 0 && (
              <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                <select
                  value={selectedHackathonId || ''}
                  onChange={(e) => setSelectedHackathonId(Number(e.target.value))}
                  className="bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer pr-1 font-medium"
                >
                  {hackathons.map((h) => (
                    <option key={h.id} value={h.id} className="bg-white text-slate-900">
                      {h.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={onCarregarDemo}
              disabled={loadingDemo}
              title="Carrega dados de demonstração da UFPR"
              className="flex items-center space-x-1.5 bg-blue-700 hover:bg-blue-800 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>{loadingDemo ? 'Carregando...' : 'Demo'}</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 overflow-x-auto gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setRoute(item.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs whitespace-nowrap ${isActive
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
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
