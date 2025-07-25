// src/components/ClientSelection.jsx
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, User } from 'lucide-react'

export default function ClientSelection() {
  const [clientes, setClientes] = useState([])
  const [selecionado, setSelecionado] = useState(null)
  const { state } = useLocation()
  const navigate = useNavigate()
  const produtosSelecionados = state?.produtos || []

  useEffect(() => {
    fetch('http://localhost:8080/api/clientes')
      .then(res => res.json())
      .then(setClientes)
      .catch(console.error)
  }, [])

  const confirmar = () => {
    const payload = {
      clienteId: selecionado,
      produtos: produtosSelecionados
    }

    fetch('http://localhost:8080/api/compras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`)
        return res.json()
      })
      .then(() => {
        navigate('/', { replace: true })
      })
      .catch(() => {
        alert('Falha ao confirmar compra.')
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-6 text-white">
        {/* Título e botão voltar */}
        <div className="flex items-center mb-6">
          <h1 className="flex-1 text-center text-2xl font-extrabold">
            Escolha o Cliente
          </h1>
        </div>

        {/* Lista de clientes */}
        <ul className="space-y-4 mb-6">
          {clientes.map(c => (
            <li
              key={c.id}
              onClick={() => setSelecionado(c.id)}
              className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition
                ${selecionado === c.id ? 'bg-white/20' : 'hover:bg-white/5'}`}
            >
              <div className="flex items-center">
                <User className="w-6 h-6 mr-3 text-indigo-300" />
                <div>
                  <p className="font-semibold">{c.nome}</p>
                  <p className="text-sm text-gray-200">{c.email}</p>
                </div>
              </div>
              <input
                type="radio"
                name="cliente"
                checked={selecionado === c.id}
                onChange={() => setSelecionado(c.id)}
                className="form-radio h-5 w-5 text-indigo-400"
              />
            </li>
          ))}
        </ul>

        {/* Resumo da compra */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 mb-6">
          <p><strong>Resumo da Compra:</strong></p>
          <p>Cliente: {selecionado ? clientes.find(c => c.id === selecionado).nome : '—'}</p>
          <p>Itens selecionados: {produtosSelecionados.length}</p>
          <p>Total de unidades: {produtosSelecionados.reduce((sum, p) => sum + p.quantidade, 0)}</p>
        </div>

        {/* Botões Voltar e Confirmar lado a lado */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-2xl shadow transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
          </button>
          <button
            disabled={!selecionado}
            onClick={confirmar}
            className="inline-flex items-center bg-indigo-500 disabled:opacity-50 hover:bg-indigo-600 text-white px-4 py-2 rounded-2xl shadow transition"
          >
            Confirmar Compra
          </button>
        </div>
      </div>
    </div>
  )
}
