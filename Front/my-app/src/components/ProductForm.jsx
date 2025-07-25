// src/components/ProductForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function ProductForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: ''
  });
  const [errors, setErrors] = useState({});

  // formata valor como BRL, só dígitos
  const applyPriceMask = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 12);
    const number = parseInt(digits || '0', 10);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(number / 100);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newVal = value;
    if (name === 'preco') newVal = applyPriceMask(value);
    setFormData((fd) => ({ ...fd, [name]: newVal }));
    setErrors((errs) => ({ ...errs, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.nome.trim()) errs.nome = 'Nome obrigatório';
    if (!formData.descricao.trim()) errs.descricao = 'Descrição obrigatória';
    const rawPrice = formData.preco.replace(/\D/g, '');
    if (rawPrice.length < 3) errs.preco = 'Preço inválido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      nome: formData.nome,
      descricao: formData.descricao,
      preco: parseFloat(formData.preco.replace(/\D/g, '')) / 100
    };

    fetch('http://localhost:8080/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao criar');
        return res.json();
      })
      .then(() => navigate('/produtos'))
      .catch((err) => console.error(err));
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-purple-900 to-slate-800 p-8">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center space-x-3">
          <ArrowLeft
            className="w-6 h-6 text-white cursor-pointer hover:text-gray-200 transition"
            onClick={() => navigate('/produtos')}
          />
          <h2 className="text-white text-2xl font-extrabold">Novo Produto</h2>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Nome
            </label>
            <input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="
                mt-1 block w-full
                bg-white/20 placeholder-white/50 text-white
                rounded-lg border border-white/30
                px-4 py-2
                focus:outline-none focus:ring-2 focus:ring-white/50
              "
              placeholder="Digite o nome"
            />
            {errors.nome && (
              <p className="text-red-400 text-sm mt-1">{errors.nome}</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className="
                mt-1 block w-full h-24
                bg-white/20 placeholder-white/50 text-white
                rounded-lg border border-white/30
                px-4 py-2
                focus:outline-none focus:ring-2 focus:ring-white/50
              "
              placeholder="Descreva o produto"
            />
            {errors.descricao && (
              <p className="text-red-400 text-sm mt-1">{errors.descricao}</p>
            )}
          </div>

          {/* Preço */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Preço
            </label>
            <input
              name="preco"
              value={formData.preco}
              onChange={handleChange}
              placeholder="R$ 0,00"
              className="
                mt-1 block w-full
                bg-white/20 placeholder-white/50 text-white
                rounded-lg border border-white/30
                px-4 py-2
                focus:outline-none focus:ring-2 focus:ring-white/50
              "
            />
            {errors.preco && (
              <p className="text-red-400 text-sm mt-1">{errors.preco}</p>
            )}
          </div>

          {/* Ações */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/produtos')}
              className="
                inline-flex items-center
                px-4 py-2 bg-white/10 hover:bg-white/20
                text-white rounded-2xl transition cursor-pointer
              "
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="
                inline-flex items-center
                px-4 py-2 bg-pink-500 hover:bg-pink-600
                text-white rounded-2xl transition cursor-pointer
              "
            >
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
