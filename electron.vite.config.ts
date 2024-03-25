import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

const alias = {
  '@main': resolve('src/main'),
  '@renderer': resolve('src/renderer/src'),
  '@common': resolve('src/common')
}

export default defineConfig({
  main: {
    resolve: {
      alias
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    resolve: {
      alias
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias
    },
    plugins: [react()]
  }
})
