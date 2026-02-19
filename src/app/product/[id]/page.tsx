import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ProductDetailClient from './ProductDetailClient';
import type { Product as ClientProduct } from './ProductDetailClient';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = Number(params.id);

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

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Link href="/" className="text-[#FF8C42] hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const clientProduct: ClientProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    description: product.description,
    details: product.details,
    weight: product.weight,
    origin: product.origin,
    season: product.season,
    nutritional: product.nutritional,
    reviews: product.reviews.map((review: any): ClientProduct['reviews'][number] => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      user: {
        id: review.user.id,
        name: review.user.name,
      },
    })),
  };

  return <ProductDetailClient product={clientProduct} />;
}
