// src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Trash2, ArrowLeft } from 'lucide-react';

export function ProductList() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/produtos')
      .then(res => res.json())
      .then(data => setProdutos(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const deleteProduct = id => {
    fetch(`http://localhost:8080/api/produtos/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Falha ao deletar');
        setProdutos(prev => prev.filter(p => p.id !== id));
      })
      .catch(console.error);
  };

  if (loading) return <p className="text-center mt-10">Carregando produtos...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Produtos</h1>
          <Link
            to="/produtos/novo"
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Novo Produto
          </Link>
        </div>

        <ul className="divide-y divide-gray-200">
          {produtos.map(p => (
            <li key={p.id} className="flex items-center justify-between py-4">
              <div>
                <p className="text-lg font-medium text-gray-900">{p.nome}</p>
                <p className="text-sm text-gray-500">{p.descricao}</p>
                <p className="text-sm text-gray-500">R$ {p.preco.toFixed(2)}</p>
              </div>
              <button
                onClick={() => deleteProduct(p.id)}
                className="text-red-500 hover:text-red-700 transition inline-flex items-center"
              >
                <Trash2 className="w-5 h-5 mr-1" /> Excluir
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-between">
          <Link
            to="/"
            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}