import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('C:/Users/Пипин/chess/certs/client/client.key'),
      cert: fs.readFileSync('C:/Users/Пипин/chess/certs/client/client.crt')
    }
  },
})
