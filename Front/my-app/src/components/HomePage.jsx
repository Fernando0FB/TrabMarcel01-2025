import React from 'react';
import { Link } from 'react-router-dom';
import { User, Box, ShoppingCart, PlusCircle } from 'lucide-react';

export default function HomePage() {
  const buttons = [
    { label: 'Clientes', path: '/clientes', icon: <User className="w-6 h-6 mr-3 text-indigo-400" /> },
    { label: 'Produtos', path: '/produtos', icon: <Box className="w-6 h-6 mr-3 text-green-400" /> },
    { label: 'Compras', path: '/compras', icon: <ShoppingCart className="w-6 h-6 mr-3 text-yellow-400" /> },
    { label: 'Criar Compra', path: '/criar-compra', icon: <PlusCircle className="w-6 h-6 mr-3 text-pink-400" /> }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-5xl sm:text-6xl font-extrabold mb-16 drop-shadow-lg tracking-wider">
          Painel de Controle
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl mx-auto">
          {buttons.map(btn => (
            <Link
              key={btn.label}
              to={btn.path}
              className="group bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md p-6 rounded-2xl shadow-xl transform hover:scale-105 transition duration-300"
            >
              <div className="flex items-center justify-center">
                {btn.icon}
                <span className="text-lg sm:text-xl font-medium text-white group-hover:text-purple-300 transition-colors">
                  {btn.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
