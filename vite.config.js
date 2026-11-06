import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages project sites live under /<repository-name>/.
// Set GITHUB_PAGES=true in the Actions build environment.
const base = process.env.GITHUB_PAGES === 'true'
  ? `/${process.env.GITHUB_REPOSITORY?.split('/')[1] || 'catatan-pwa'}/`
  : '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Ruang Catatan',
        short_name: 'Catatan',
        description: 'Simpan ide, rencana, dan hal penting dalam satu tempat.',
        theme_color: '#17181c',
        background_color: '#0d0e13',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          { src: `${base}pwa-192.svg`, sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: `${base}pwa-512.svg`, sizes: '512x512', type: 'image/svg+xml', purpose: 'any' }
        ]
      },
      workbox: {
        navigateFallback: `${base}index.html`,
        globPatterns: ['**/*.{js,css,html,svg,ico,png,webp}']
      }
    })
  ]
})
