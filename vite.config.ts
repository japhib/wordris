import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/wordris/',
  build: {
    // output to `docs` for use with Github Pages
    outDir: 'docs'
  }
})
