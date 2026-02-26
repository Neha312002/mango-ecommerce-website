import Link from 'next/link';
import { prisma } from '@/lib/prisma';
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
          <Link href="/" className="text-[#ffa62b] hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  try {
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
            <Link href="/" className="text-[#ffa62b] hover:underline">Return to Home</Link>
          </div>
        </div>
      );
    }

    // Convert Prisma result to client-safe format
    const clientProduct: ClientProduct = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      description: product.description,
      details: product.details,
      weight: product.weight,
      origin: product.origin,
      season: product.season,
      nutritional: product.nutritional,
      reviews: product.reviews.map((review) => ({
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
  } catch (error) {
    console.error('Error fetching product:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">An error occurred loading this product.</p>
          <Link href="/" className="text-[#ffa62b] hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }
}
