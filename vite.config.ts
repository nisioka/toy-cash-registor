import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/toy-cash-registor/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'レジごっこ',
        short_name: 'レジごっこ',
        description: 'バーコードでピッ!と遊べる子供向けレジアプリ',
        theme_color: '#ff8a3d',
        background_color: '#fff8e7',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/toy-cash-registor/',
        start_url: '/toy-cash-registor/',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico}'],
      },
    }),
  ],
});
