// src/components/ClientSelection.jsx
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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
      .then(resp => {
        console.log('Compra criada:', resp)
        // ex: navegar pra página de sucesso
        navigate('/', { replace: true })
      })
      .catch(err => {
        console.error('Erro ao criar compra:', err)
        alert('Falha ao confirmar compra.')
      })
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Selecione o Cliente</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {clientes.map(c => (
          <li key={c.id} style={{ marginBottom: '0.5rem' }}>
            <input
              type="radio"
              name="cliente"
              checked={selecionado === c.id}
              onChange={() => setSelecionado(c.id)}
            />{' '}
            {c.nome} — {c.email}
          </li>
        ))}
      </ul>

      <button
        disabled={!selecionado}
        onClick={confirmar}
      >
        Confirmar Compra
      </button>
      <button onClick={() => navigate(-1)} style={{ marginLeft: '1rem' }}>
        Voltar
      </button>
      <div style={{ marginTop: '1rem' }}>
        <strong>Resumo:</strong><br/>
        Cliente: {selecionado}<br/>
        Itens: {produtosSelecionados.length}<br/>
        Total Unidades: {produtosSelecionados.reduce((sum, p) => sum + p.quantidade, 0)}
      </div>
    </div>
  )
}
