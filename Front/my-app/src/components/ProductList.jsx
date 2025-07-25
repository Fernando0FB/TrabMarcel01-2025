// src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Trash2, ArrowLeft } from 'lucide-react';

export function ProductList() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/produtos')
      .then(res => res.json())
      .then(data => setProdutos(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const deleteProduct = (id) => {
    fetch(`http://localhost:8080/api/produtos/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Não foi possível excluir o produto, o mesmo já está vinculado a uma compra!');
        setProdutos(prev => prev.filter(p => p.id !== id));
      })
      .catch(err => showError(err.message));
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start bg-gradient-to-tr from-slate-900 via-purple-900 to-slate-800 p-8 relative">
      {/* Toast de erro no canto inferior esquerdo */}
      {errorMessage && (
        <div className="fixed bottom-5 left-5 bg-red-600 text-white px-5 py-3 rounded-lg shadow-lg animate-fade-in cursor-pointer">
          {errorMessage}
        </div>
      )}

      <div className="w-full max-w-3xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold drop-shadow-lg">
            Produtos
          </h1>
          <Link
            to="/produtos/novo"
            className="inline-flex items-center bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-lg transition cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Novo Produto
          </Link>
        </div>

        {/* Lista de produtos como cards */}
        <div className="space-y-6">
          {loading ? (
            <p className="text-center text-white">Carregando produtos...</p>
          ) : produtos.length === 0 ? (
            <p className="text-center text-white">Nenhum produto cadastrado.</p>
          ) : (
            produtos.map(p => (
              <div
                key={p.id}
                className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-6 flex items-center justify-between"
              >
                <div>
                  <p className="text-white text-xl font-semibold">{p.nome}</p>
                  <p className="text-gray-200 text-sm">{p.descricao}</p>
                  <p className="text-gray-200 text-sm">R$ {p.preco.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="inline-flex items-center text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-5 h-5 mr-1" />
                  Excluir
                </button>
              </div>
            ))
          )}
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
