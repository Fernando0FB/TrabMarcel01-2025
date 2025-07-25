// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FullScreenLayout from './components/Layout';
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
      <Route element={<FullScreenLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/clientes" element={<ClientList />} />
        <Route path="/clientes/novo" element={<ClientForm />} />
        <Route path="/produtos" element={<ProductList />} />
        <Route path="/produtos/novo" element={<ProductForm />} />
        <Route path="/criar-compra" element={<ProductSelection />} />
        <Route path="/criar-compra/clientes" element={<ClientSelection />} />
        <Route path="/compras" element={<PurchaseList />} />
        <Route path="/compras/:id" element={<PurchaseDetails />} />
      </Route>
    </Routes>
  );
}
