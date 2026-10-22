import { appConfig } from '@/common/constants';
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appConfig.pageTitle,
    short_name: appConfig.name,
    description: appConfig.manifestDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/cover.png',
        sizes: '1280x640',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Application',
      },
      {
        src: '/screenshot-mobile.png',
        sizes: '1170x2532',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Application',
      },
    ],
  };
}
