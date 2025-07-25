// src/main.jsx  (assegure-se de que o nome do arquivo seja exatamente este para o Vite)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// **import do CSS onde estão as diretivas do Tailwind**
import './index.css';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
