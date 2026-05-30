import { defineConfig } from '/tmp/vitest-runner/node_modules/vitest/dist/config.js';
import path from 'path';

const TMP = '/tmp/vitest-runner/node_modules';
const SRC = path.resolve(__dirname, 'src');

// All React must come from TMP so @testing-library/react uses the same instance
export default defineConfig({
  resolve: {
    alias: [
      // --- Antd stub ---
      { find: 'antd',              replacement: path.join(SRC, 'test/antd-mock.tsx') },
      { find: '@ant-design/icons', replacement: path.join(SRC, 'test/antd-mock.tsx') },
      // --- React sub-paths (must be before bare react alias) ---
      { find: 'react/jsx-dev-runtime', replacement: path.join(TMP, 'react/jsx-dev-runtime.js') },
      { find: 'react/jsx-runtime',     replacement: path.join(TMP, 'react/jsx-runtime.js') },
      { find: 'react-dom/client',      replacement: path.join(TMP, 'react-dom/client.js') },
      { find: 'react-dom/server',      replacement: path.join(TMP, 'react-dom/server.js') },
      // --- Bare React from TMP (matches @testing-library/react's own React) ---
      { find: /^react$/,     replacement: path.join(TMP, 'react/index.js') },
      { find: /^react-dom$/, replacement: path.join(TMP, 'react-dom/index.js') },
      // --- Testing library from TMP ---
      { find: '@testing-library/react',      replacement: path.join(TMP, '@testing-library/react') },
      { find: '@testing-library/user-event', replacement: path.join(TMP, '@testing-library/user-event') },
      // --- @tanstack/react-query from TMP (uses same React instance) ---
      { find: '@tanstack/react-query', replacement: path.join(TMP, '@tanstack/react-query') },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    testTimeout: 15000,
    deps: { interopDefault: true },
  },
});
