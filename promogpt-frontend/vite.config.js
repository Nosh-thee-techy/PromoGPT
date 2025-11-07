import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // important for deployed apps or certain setups
  build: { target: 'es2019' } // ensures compatibility
});
