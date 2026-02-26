import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: 'public',
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
