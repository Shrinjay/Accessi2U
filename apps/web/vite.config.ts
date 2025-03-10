import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// --------------------config--------------------

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd());

  return {
    plugins: [tsconfigPaths(), react({ babel: { plugins: [['babel-plugin-styled-components']] } })],
    server: {
      host: true,
      port: 3000,
      open: true,
    },
  };
});
