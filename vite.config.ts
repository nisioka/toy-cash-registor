import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const siteUrl = 'https://nisioka.github.io/toy-cash-registor/';

export default defineConfig({
  base: '/toy-cash-registor/',
  plugins: [
    {
      name: 'inject-site-url',
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          return html.replace(/\{\{SITE_URL\}\}/g, siteUrl);
        },
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png'],
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
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
});
