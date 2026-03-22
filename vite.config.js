import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts(),
  ],
  build: {
    rollupOptions: {
      external: ['nanostores', 'bitcoinjs-lib', /^bitcoinjs-lib\//, 'sats-connect'],
      output: {
        globals: {
          nanostores: 'nanostores',
          'bitcoinjs-lib': 'bitcoin',
          'bitcoinjs-lib/src/psbt/bip371': 'bitcoin',
          'bitcoinjs-lib/src/address': 'bitcoin',
          'sats-connect': 'satsConnect',
        },
      },
    },
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      outputDir: 'dist/types',
      name: 'LaserEyes',
      fileName: 'index',
    },
  },
})
