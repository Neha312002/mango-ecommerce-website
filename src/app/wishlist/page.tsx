'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function WishlistPage() {
  const router = useRouter();
  const { addToCart, removeFromWishlist, isInWishlist } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      router.push('/auth');
      return;
    }

    const userData = JSON.parse(currentUser);
    loadWishlist(userData.id);
  }, []);

  async function loadWishlist(userId: number) {
    try {
      const response = await fetch(`/api/wishlist?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setWishlistProducts(data.wishlist);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(productId: number) {
    removeFromWishlist(productId);
    setWishlistProducts(prev => prev.filter(item => item.productId !== productId));
  }

  async function handleAddToCart(product: any) {
    const productData = {
      id: product.product.id,
      name: product.product.name,
      price: product.product.price,
      img: product.product.image,
      desc: product.product.description,
    };
    addToCart(productData);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <span className="text-3xl">🥭</span>
            <h1 className="text-xl font-bold text-[#FF8C42]">Mango Fresh Farm</h1>
          </Link>
          <Link 
            href="/" 
            className="bg-[#FF8C42] hover:bg-orange-600 text-white px-6 py-2 rounded-md font-semibold transition"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Wishlist Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.h1 
          className="text-4xl font-bold text-[#3D4F42] mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          My Wishlist ❤️
        </motion.h1>

        {wishlistProducts.length === 0 ? (
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-7xl mb-4">💔</p>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-6">Add your favorite mangoes to your wishlist!</p>
            <Link 
              href="/"
              className="inline-block bg-[#FF8C42] hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((item, idx) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="relative h-48">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#3D4F42] mb-2">
                    {item.product.name}
                  </h3>
                  <p className="text-2xl font-bold text-[#FF8C42] mb-4">
                    ${item.product.price.toFixed(2)} / kg
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.product.description}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-[#3D4F42] hover:bg-[#FF8C42] text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="w-12 h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center justify-center"
                      title="Remove from wishlist"
                    >
                      🗑️
                    </button>
                  </div>
                  <Link
                    href={`/product/${item.product.id}`}
                    className="block mt-3 text-center text-sm text-[#FF8C42] hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
