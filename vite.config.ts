import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import pluginPurgeCss from '@mojojoejo/vite-plugin-purgecss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), pluginPurgeCss()],
})
