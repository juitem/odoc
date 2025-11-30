import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    base: '/odoc/', // Sets the base path for https://juitem.github.io/odoc/
    define: {
      // This is crucial: it replaces `process.env.API_KEY` in the client code
      // with the actual value from VITE_API_KEY environment variable.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
    },
  }
})