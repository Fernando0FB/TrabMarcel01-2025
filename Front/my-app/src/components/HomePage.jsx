import React from 'react';
import { Link } from 'react-router-dom';
import { User, Box, ShoppingCart, PlusCircle } from 'lucide-react';

export default function HomePage() {
  const buttons = [
    { label: 'Clientes', path: '/clientes', icon: <User className="w-6 h-6 mr-2" /> },
    { label: 'Produtos', path: '/produtos', icon: <Box className="w-6 h-6 mr-2" /> },
    { label: 'Compras', path: '/compras', icon: <ShoppingCart className="w-6 h-6 mr-2" /> },
    { label: 'Criar Compra', path: '/criar-compra', icon: <PlusCircle className="w-6 h-6 mr-2" /> }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-6">
      <h1 className="text-5xl font-bold text-white mb-12 drop-shadow-lg">Painel de Controle</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg w-full">
        {buttons.map(btn => (
          <Link key={btn.label} to={btn.path} className="transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-center bg-white bg-opacity-90 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-5">
              {btn.icon}
              <span className="text-xl font-medium text-gray-800">{btn.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
