import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},

    // ✅ This fixes the "global is not defined" error for Cognito
    global: 'globalThis',
  },
})