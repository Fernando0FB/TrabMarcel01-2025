import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function ProductForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nome: '', descricao: '', preco: '' });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
    setErrors(errs => ({ ...errs, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.nome.trim()) errs.nome = 'Nome obrigatório';
    if (!formData.descricao.trim()) errs.descricao = 'Descrição obrigatória';
    if (isNaN(parseFloat(formData.preco))) errs.preco = 'Preço inválido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      nome: formData.nome,
      descricao: formData.descricao,
      preco: parseFloat(formData.preco)
    };

    fetch('http://localhost:8080/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Falha ao criar');
        return res.json();
      })
      .then(() => {
        navigate('/produtos');
      })
      .catch(console.error);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <ArrowLeft
            className="w-5 h-5 cursor-pointer mr-2 text-gray-600 hover:text-gray-800"
            onClick={() => navigate('/produtos')}
          />
          <h2 className="text-2xl font-semibold text-gray-800">Novo Produto</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Preço</label>
            <input
              name="preco"
              value={formData.preco}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.preco && <p className="text-red-500 text-sm mt-1">{errors.preco}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >Criar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
