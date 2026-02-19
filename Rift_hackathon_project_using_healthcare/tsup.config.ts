import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['backend/src/index.ts', 'api/index.ts'],
  format: ['cjs'],
  target: 'node20',
  clean: false,
  sourcemap: true,
  outDir: 'backend/dist',
});
