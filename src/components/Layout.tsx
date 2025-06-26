import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar } from 'lucide-react';

const menu = [
  { label: 'Dashboard', to: '/', icon: <Home className="h-5 w-5" /> },
  { label: 'Pacientes', to: '/patients', icon: <Users className="h-5 w-5" /> },
  { label: 'Atendimentos', to: '/appointments', icon: <Calendar className="h-5 w-5" /> },
];

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gradient-to-br from-blue-800 to-green-600 text-white flex flex-row md:flex-col py-4 md:py-6 px-2 md:px-4 shadow-lg md:static fixed bottom-0 left-0 right-0 z-40">
        <div className="flex items-center gap-2 mb-4 md:mb-10 px-2">
          <span className="bg-white rounded-full p-2 text-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 4.5v15m9-15v15M3 9h18M3 15h18" />
            </svg>
          </span>
          <span className="text-2xl font-bold tracking-tight hidden md:block">ACME Clínica</span>
        </div>
        <nav className="flex flex-1 flex-row md:flex-col gap-2 justify-center md:justify-start">
          {menu.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium text-base
                ${location.pathname === item.to
                  ? 'bg-blue-100 text-blue-800 shadow font-bold'
                  : 'hover:bg-blue-700/40 hover:text-white/90 text-white/90'}`}
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm border-b px-4 md:px-8 py-4 flex items-center min-h-[56px] md:min-h-[64px]">
          {/* Espaço para ações do topo se necessário */}
        </header>
        <main className="flex-1 bg-gradient-to-br from-blue-50 to-green-50 px-2 md:px-8 py-4 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
