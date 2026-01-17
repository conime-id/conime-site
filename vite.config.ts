import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,json,ttf}'],
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          },
          manifest: {
            name: 'CoNime | Portal Berita Budaya Pop Visual',
            short_name: 'CoNime',
            description: 'Portal informasi terpercaya mengenai anime, manga, dan perkembangan budaya pop visual global.',
            theme_color: '#0f172a',
            background_color: '#0f172a',
            display: 'standalone',
            start_url: '/',
            icons: [
              {
                src: '/icons/android-chrome-192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: '/icons/android-chrome-512.png',
                sizes: '512x512',
                type: 'image/png'
              },
              {
                src: '/icons/android-chrome-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
              }
            ]
          }
        })
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
