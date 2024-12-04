import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: 'src/background.ts',
        options: 'src/options.ts',
        sidepanel: 'src/sidepanel.ts',
        index: 'src/main.ts',
      },
      output: {
        entryFileNames: `build/[name].js`,
        chunkFileNames: `build/[name].js`,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return '[name].[ext]'
          }
          if (assetInfo.name?.startsWith('image-')) {
            return 'icons/[name].[ext]'
          }
          return '[name].[ext]'
        },
      },
    },
  },
})
