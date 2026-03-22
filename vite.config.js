import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts(),
  ],
  build: {
    rollupOptions: {
      external: ['nanostores'],
    },
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      outputDir: 'dist/types',
      name: 'LaserEyes',
      fileName: 'index',
    },
  },
})
