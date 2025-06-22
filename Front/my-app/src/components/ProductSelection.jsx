import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

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
      if (copy[id]) {
        delete copy[id]
      } else {
        copy[id] = 1
      }
      return copy
    })
  }

  const changeQty = (id, value) => {
    setQuantities(qty => ({
      ...qty,
      [id]: Math.max(1, Number(value) || 1)
    }))
  }

  const selectedEntries = Object.entries(quantities) // [[id, qty], ...]

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Selecione Produtos</h1>

      <ul className="space-y-3 mb-6">
        {produtos.map(p => {
          const isSel = quantities[p.id] != null
          return (
            <li key={p.id} className="flex items-center justify-between">
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={isSel}
                    onChange={() => toggle(p.id)}
                    className="mr-2"
                  />
                  <span className="font-medium">{p.nome}</span>
                </label>
                <span className="text-gray-600 ml-4">R$ {p.preco.toFixed(2)}</span>
              </div>
              {isSel && (
                <input
                  type="number"
                  min="1"
                  value={quantities[p.id]}
                  onChange={e => changeQty(p.id, e.target.value)}
                  className="w-16 border rounded px-2 py-1"
                />
              )}
            </li>
          )
        })}
      </ul>

      <div className="flex justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
        </button>
        <button
          disabled={selectedEntries.length === 0}
          onClick={() =>
            navigate('/criar-compra/clientes', {
              state: {
                produtos: selectedEntries.map(
                  ([id, qty]) => ({ produtoId: Number(id), quantidade: qty })
                )
              }
            })
          }
          className="bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Comprar ({selectedEntries.reduce((sum,[,q]) => sum + q, 0)} itens)
        </button>
      </div>
    </div>
  )
}
