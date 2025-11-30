import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/odoc/', // Sets the base path for https://juitem.github.io/odoc/
  define: {
    // Ensures process.env.API_KEY is available in the client build if set in the build environment
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})