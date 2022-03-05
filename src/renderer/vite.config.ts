import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const { resolve } = require('path')
import electronRenderer from 'vite-plugin-electron-renderer'
import pkg from '../../package.json'

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  mode: process.env.NODE_ENV,
  plugins: [
    vue(),
    electronRenderer({
      resolve: {
        'electron-store': 'export default require("electron-store");',
        'fs': 'export default require("fs");',
        'electron': 'export default require("electron");',
        'electron-ssh2': 'export default require("electron-ssh2");',
        'ssh2-sftp-client': 'export default require("ssh2-sftp-client");',
      },
    }),
  ],
  alias: {
    '/@/': resolve(__dirname, 'src')
  },
  build: {
    emptyOutDir: true,
    outDir: '../../dist/renderer',
  },
  server: {
    host: pkg.env.HOST,
    port: pkg.env.PORT,
  },
});
