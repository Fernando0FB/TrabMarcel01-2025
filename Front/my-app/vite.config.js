import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';  // plugin oficial

export default defineConfig({
  plugins: [
    react(),
    tailwind({
      config: './tailwind.config.cjs',   // aponte para o seu config CJS
    })
  ]
});