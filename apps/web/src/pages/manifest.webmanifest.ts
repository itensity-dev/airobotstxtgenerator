import type { APIRoute } from 'astro';
import { BRAND } from '../config/site';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: BRAND,
        short_name: 'AI robots.txt',
        description: 'AI robots.txt generator and robots.txt tester. Works offline.',
        start_url: '/?source=pwa',
        scope: '/',
        display: 'standalone',
        background_color: '#f5f0e5',
        theme_color: '#f5f0e5',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      null,
      1,
    ),
    { headers: { 'content-type': 'application/manifest+json' } },
  );
