// src/components/PurchaseList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export default function PurchaseList() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/compras')
      .then(res => res.json())
      .then(data => setCompras(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-purple-900 to-slate-800 p-8">
        <p className="text-white text-lg">Carregando compras...</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start bg-gradient-to-tr from-slate-900 via-purple-900 to-slate-800 p-8">
      <div className="w-full max-w-3xl space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold drop-shadow-lg">
            Compras
          </h1>
        </div>

        {/* Lista de compras */}
        <div className="space-y-4">
          {compras.map(compra => (
            <div
              key={compra.id}
              className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-6 flex items-center justify-between"
            >
              <div>
                <p className="text-white text-xl font-semibold">
                  R$ {compra.valorTotalcompra.toFixed(2)}
                </p>
                <p className="text-gray-200 text-sm">
                  {new Date(compra.dataCompra).toLocaleDateString('pt-BR')} —{' '}
                  {compra.cliente.nome}
                </p>
              </div>
              <Link
                to={`/compras/${compra.id}`}
                className="inline-flex items-center text-white hover:text-purple-300 transition cursor-pointer"
              >
                Ver detalhes <ChevronRight className="w-5 h-5 ml-1" />
              </Link>
            </div>
          ))}
        </div>

        {/* Botão de voltar */}
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-lg transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}
