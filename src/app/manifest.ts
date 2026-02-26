import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mango Fresh Farm - Premium Organic Mangoes',
    short_name: 'Mango Fresh',
    description: 'Shop premium organic mangoes directly from our farm. Sustainably grown, hand-picked fresh mangoes delivered to your door.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffa62b',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['food', 'shopping', 'lifestyle'],
    orientation: 'portrait',
  };
}
