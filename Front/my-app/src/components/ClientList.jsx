import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function ClientList() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/clientes')
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const deleteClient = id => {
    fetch(`http://localhost:8080/api/clientes/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Falha ao deletar');
        setClientes(prev => prev.filter(c => c.id !== id));
      })
      .catch(console.error);
  };

  if (loading) return <p className="text-center mt-10">Carregando clientes...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
          <Link
            to="/clientes/novo"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Novo Cliente
          </Link>
        </div>

        <ul className="divide-y divide-gray-200">
          {clientes.map(c => (
            <li key={c.id} className="flex items-center justify-between py-4">
              <div>
                <p className="text-lg font-medium text-gray-900">{c.nome}</p>
                <p className="text-sm text-gray-500">{c.email}</p>
                <p className="text-sm text-gray-500">{c.telefone}</p>
              </div>
              <button
                onClick={() => deleteClient(c.id)}
                className="text-red-500 hover:text-red-700 transition"
              >Excluir</button>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-end">
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
