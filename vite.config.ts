import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/gz4c-campaign-dashboard/', // or whatever your repo name is
  define: {
    // Expose environment variables to the client
    __VITE_ENCODED_PASSWORD__: JSON.stringify(process.env.VITE_ENCODED_PASSWORD)
  }

})
// export default {
//   base: '/gz4c-campaign-dashboard/', // or whatever your repo name is
// };