// src/components/ClientForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ClientForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: ''
  });
  const [errors, setErrors] = useState({});

  // Mascara de CPF existente
  const applyCpfMask = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  };

  // Nova máscara de telefone
  const applyPhoneMask = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) {
      return `(${digits.slice(0,2)})${digits.slice(2)}`;
    }
    if (digits.length <= 10) {
      return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
    }
    // 11 dígitos (celular)
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newVal = value;
    if (name === 'cpf') newVal = applyCpfMask(value);
    if (name === 'telefone') newVal = applyPhoneMask(value);
    setFormData((fd) => ({ ...fd, [name]: newVal }));
    setErrors((errs) => ({ ...errs, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.nome.trim()) errs.nome = 'Nome obrigatório';
    if (!formData.email.includes('@')) errs.email = 'Email inválido';
    const cpfDigits = formData.cpf.replace(/\D/g, '');
    if (cpfDigits.length !== 11) errs.cpf = 'CPF deve ter 11 dígitos';
    const phoneDigits = formData.telefone.replace(/\D/g, '');
    if (phoneDigits.length < 10) errs.telefone = 'Telefone inválido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone.replace(/\D/g, ''),
      cpf: formData.cpf.replace(/\D/g, '')
    };

    fetch('http://localhost:8080/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao criar');
        return res.json();
      })
      .then(() => navigate('/clientes'))
      .catch((err) => console.error(err));
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-purple-900 to-slate-800 p-8">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center space-x-3">
          
          <h2 className="text-white text-2xl font-extrabold">Novo Cliente</h2>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Nome', name: 'nome', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Telefone', name: 'telefone', type: 'text', placeholder: '(xx) xxxxx-xxxx' },
            { label: 'CPF', name: 'cpf', type: 'text', placeholder: '000.000.000-00' }
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-white mb-1">{label}</label>
              <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                className="
                  mt-1 block w-full
                  bg-white/20 placeholder-white/50 text-white
                  rounded-lg border border-white/30
                  px-4 py-2
                  focus:outline-none focus:ring-2 focus:ring-white/50
                "
              />
              {errors[name] && (
                <p className="text-red-400 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          {/* Ações */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/clientes')}
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
