// src/components/ClientList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function ClientList() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/clientes')
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const deleteClient = (id) => {
    fetch(`http://localhost:8080/api/clientes/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Impossível excluir, já existem compras vinculadas ao cliente');
        }
        setClientes((prev) => prev.filter((c) => c.id !== id));
      })
      .catch((err) => showError(err.message));
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start bg-gradient-to-tr from-slate-900 via-purple-900 to-slate-800 p-8 relative">
      {errorMessage && (
        <div className="fixed bottom-5 left-5 bg-red-600 text-white px-5 py-3 rounded-lg shadow-lg animate-fade-in cursor-pointer">
          {errorMessage}
        </div>
      )}

      <div className="w-full max-w-3xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold drop-shadow-lg">
            Clientes
          </h1>
          <Link
            to="/clientes/novo"
            className="inline-flex items-center bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-lg transition cursor-pointer"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Novo Cliente
          </Link>
        </div>

        {/* Lista de clientes como cards */}
        <div className="space-y-6">
          {loading ? (
            <p className="text-center text-white">Carregando clientes...</p>
          ) : clientes.length === 0 ? (
            <p className="text-center text-white">Nenhum cliente cadastrado.</p>
          ) : (
            clientes.map((c) => (
              <div
                key={c.id}
                className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-6 flex items-center justify-between"
              >
                <div>
                  <p className="text-white text-xl font-semibold">{c.nome}</p>
                </div>
                <div>
                  <p className="text-gray-200 text-sm">{c.email}</p>
                </div>
                <div>
                  <p className="text-gray-200 text-sm">{c.telefone}</p>
                </div>
                <button
                  onClick={() => deleteClient(c.id)}
                  className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                >
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
