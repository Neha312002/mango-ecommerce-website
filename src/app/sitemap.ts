import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mangofreshfarm.com';
  
  // Static pages
  const staticPages = [
    '',
    '/auth',
    '/account',
    '/wishlist',
    '/checkout',
    '/privacy-policy',
    '/terms',
    '/refund-policy',
    '/shipping-policy',
    '/our-process',
    '/track-order',
  ];

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // You can add dynamic product pages here when you have a products API
  // Example:
  // const products = await fetch('your-api/products').then(res => res.json());
  // const productRoutes = products.map((product) => ({
  //   url: `${baseUrl}/product/${product.id}`,
  //   lastModified: new Date(product.updatedAt),
  //   changeFrequency: 'daily',
  //   priority: 0.7,
  // }));

  return [
    ...staticRoutes,
    // ...productRoutes, // Uncomment when you have dynamic products
  ];
}
