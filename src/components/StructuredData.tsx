export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mango Fresh Farm',
    url: 'https://mangofreshfarm.com',
    logo: 'https://mangofreshfarm.com/logo.png',
    description: 'Premium organic mangoes directly from our farm in India',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: 'India',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXXX-XXXXXX',
      contactType: 'Customer Service',
      email: 'support@mangofreshfarm.com',
      availableLanguage: ['en', 'hi'],
    },
    sameAs: [
      'https://facebook.com/mangofreshfarm',
      'https://twitter.com/mangofreshfarm',
      'https://instagram.com/mangofreshfarm',
      'https://linkedin.com/company/mangofreshfarm',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Mango Fresh Farm',
    url: 'https://mangofreshfarm.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://mangofreshfarm.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchema({ product }: { product: any }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Mango Fresh Farm',
    },
    offers: {
      '@type': 'Offer',
      url: `https://mangofreshfarm.com/product/${product.id}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Mango Fresh Farm',
      },
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount || 0,
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://mangofreshfarm.com${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://mangofreshfarm.com',
    name: 'Mango Fresh Farm',
    image: 'https://mangofreshfarm.com/logo.png',
    url: 'https://mangofreshfarm.com',
    telephone: '+91-XXXX-XXXXXX',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: 'India',
    },
    geo: {
      '@type': 'GeoCoordinates',
      // Add your actual coordinates
      latitude: 0,
      longitude: 0,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    servesCuisine: 'Organic Fruits',
    paymentAccepted: 'Credit Card, UPI, Net Banking, Wallets',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
