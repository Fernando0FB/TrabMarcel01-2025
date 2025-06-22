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

  if (loading) return <p className="text-center mt-10">Carregando compras...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Compras</h1>
        <ul className="divide-y divide-gray-200">
          {compras.map(compra => (
            <li key={compra.id} className="flex items-center justify-between py-4">
              <div>
                <p className="text-lg font-medium text-gray-900">
                  R$ {compra.valorTotalcompra.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(compra.dataCompra).toLocaleDateString('pt-BR')} — {compra.cliente.nome}
                </p>
              </div>
              <Link
                to={`/compras/${compra.id}`}
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                Ver detalhes <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-end">
          <Link
            to="/"
            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}
