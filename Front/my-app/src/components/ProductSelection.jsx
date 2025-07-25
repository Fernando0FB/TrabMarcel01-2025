// src/components/ProductSelection.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart } from 'lucide-react'

export default function ProductSelection() {
  const [produtos, setProdutos] = useState([])
  const [quantities, setQuantities] = useState({}) // { [id]: quantidade }
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:8080/api/produtos')
      .then(res => res.json())
      .then(setProdutos)
      .catch(console.error)
  }, [])

  const toggle = id => {
    setQuantities(qty => {
      const copy = { ...qty }
      if (copy[id]) delete copy[id]
      else copy[id] = 1
      return copy
    })
  }

  const changeQty = (id, value) => {
    setQuantities(qty => ({
      ...qty,
      [id]: Math.max(1, Number(value) || 1)
    }))
  }

  const selectedEntries = Object.entries(quantities)
  const totalItems = selectedEntries.reduce((sum, [, q]) => sum + q, 0)

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-6 text-white">
        <h1 className="text-3xl font-extrabold mb-6 text-center">
          Selecione Produtos
        </h1>

        <ul className="space-y-4 mb-6">
          {produtos.map(p => {
            const isSel = quantities[p.id] != null
            return (
              <li
                key={p.id}
                className={`flex items-center justify-between p-4 rounded-xl transition ${
                  isSel ? 'bg-white/20' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isSel}
                    onChange={() => toggle(p.id)}
                    className="form-checkbox h-5 w-5 text-indigo-400 mr-4"
                  />
                  <div>
                    <p className="font-semibold">{p.nome}</p>
                    <p className="text-sm text-gray-200">
                      R$ {p.preco.toFixed(2)}
                    </p>
                  </div>
                </div>
                {isSel && (
                  <input
                    type="number"
                    min="1"
                    value={quantities[p.id]}
                    onChange={e => changeQty(p.id, e.target.value)}
                    className="w-20 bg-white/20 backdrop-blur-md border border-white/30 rounded-md px-2 py-1 text-center text-white font-medium"
                  />
                )}
              </li>
            )
          })}
        </ul>

        <div className="flex justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-2xl shadow transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
          </button>
          <button
            disabled={totalItems === 0}
            onClick={() =>
              navigate('/criar-compra/clientes', {
                state: {
                  produtos: selectedEntries.map(
                    ([id, qty]) => ({ produtoId: Number(id), quantidade: qty })
                  )
                }
              })
            }
            className="inline-flex items-center bg-indigo-500 disabled:opacity-50 hover:bg-indigo-600 text-white px-4 py-2 rounded-2xl shadow transition"
          >
            <ShoppingCart className="w-5 h-5 mr-2" /> Continuar ({totalItems}{' '}
            {totalItems === 1 ? 'item' : 'itens'})
          </button>
        </div>
      </div>
    </div>
  )
}
