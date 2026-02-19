import Link from 'next/link';
import { headers } from 'next/headers';
import ProductDetailClient from './ProductDetailClient';
import type { Product as ClientProduct } from './ProductDetailClient';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const productId = Number(id);

  if (isNaN(productId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Link href="/" className="text-[#FF8C42] hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const incomingHeaders = await headers();
  const host = incomingHeaders.get('host') ?? 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/products/${productId}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Link href="/" className="text-[#FF8C42] hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const product = (await res.json()) as ClientProduct;

  return <ProductDetailClient product={product} />;
}
