import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ClientList from './components/ClientList';
import ClientForm from './components/ClientForm';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import ProductSelection from './components/ProductSelection';
import ClientSelection from './components/ClientSelection';
import PurchaseList from './components/PurchaseList';
import PurchaseDetails from './components/PurchaseDetails';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Cliente routes */}
      <Route path="/clientes" element={<ClientList />} />
      <Route path="/clientes/novo" element={<ClientForm />} />
      {/* Produto routes */}
      <Route path="/produtos" element={<ProductList />} />
      <Route path="/produtos/novo" element={<ProductForm />} />

      {/* Compra creation flow */}
      <Route path="/criar-compra" element={<ProductSelection />} />
      <Route path="/criar-compra/clientes" element={<ClientSelection />} />

      {/* Compra viewing */}
      <Route path="/compras" element={<PurchaseList />} />
      <Route path="/compras/:id" element={<PurchaseDetails />} />
    </Routes>
  );
}
