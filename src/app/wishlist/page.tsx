'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function WishlistPage() {
  const router = useRouter();
  const { cart, addToCart, removeFromWishlist, isInWishlist, addToWishlist } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition' | 'reviews'>('description');
  const [cartOpen, setCartOpen] = useState(false);

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

  async function handleAddToCart(product: any, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    const productData = {
      id: product.product.id,
      name: product.product.name,
      price: product.product.price,
      img: product.product.image,
      desc: product.product.description,
    };
    addToCart(productData);
    
    // Optional: Show a brief notification
    const button = event?.currentTarget as HTMLElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = '✓ Added!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 1000);
    }
  }

  const handleProductClick = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedProduct(data);
        setProductModalOpen(true);
        setActiveTab('description');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const closeProductModal = () => {
    setProductModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Product Detail Modal */}
      <AnimatePresence>
        {productModalOpen && selectedProduct && (
          <motion.div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProductModal}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8 relative max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button 
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100" 
                onClick={closeProductModal}
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-2xl">×</span>
              </motion.button>

              <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
                {/* Product Image */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
                    <Image 
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    ✓ USDA Organic
                  </div>
                </motion.div>

                {/* Product Info */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">⭐</span>
                    <span className="text-xl font-bold text-gray-800">
                      {selectedProduct.reviews && selectedProduct.reviews.length > 0
                        ? (selectedProduct.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / selectedProduct.reviews.length).toFixed(1)
                        : '5.0'}
                    </span>
                    <span className="text-gray-600">
                      ({selectedProduct.reviews?.length || 0} reviews)
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-[#3D4F42] mb-3">
                    {selectedProduct.name}
                  </h1>
                  
                  <p className="text-2xl font-bold text-[#FF8C42] mb-4">
                    ₹{selectedProduct.price} / kg
                  </p>

                  <p className="text-gray-700 text-base leading-relaxed mb-6">
                    {selectedProduct.description}
                  </p>

                  {/* Product Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Origin</p>
                      <p className="font-semibold text-gray-800 text-sm">{selectedProduct.origin}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Season</p>
                      <p className="font-semibold text-gray-800 text-sm">{selectedProduct.season}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Weight</p>
                      <p className="font-semibold text-gray-800 text-sm">{selectedProduct.weight}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Freshness</p>
                      <p className="font-semibold text-green-600 text-sm">★ Fresh Today</p>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      const cartProduct = {
                        id: selectedProduct.id,
                        name: selectedProduct.name,
                        price: selectedProduct.price,
                        img: selectedProduct.image,
                        desc: selectedProduct.description,
                      };
                      addToCart(cartProduct);
                      closeProductModal();
                    }}
                    className="w-full bg-[#FF8C42] hover:bg-[#FFA558] text-white px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition mb-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🛒 Add to Cart
                  </motion.button>

                  {/* Wishlist Button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isInWishlist(selectedProduct.id)) {
                        removeFromWishlist(selectedProduct.id);
                        setWishlistProducts(prev => prev.filter(item => item.productId !== selectedProduct.id));
                      } else {
                        addToWishlist(selectedProduct.id);
                      }
                    }}
                    className={`w-full px-6 py-2 rounded-lg font-semibold transition ${
                      isInWishlist(selectedProduct.id)
                        ? 'bg-pink-50 text-pink-600 border-2 border-pink-300 hover:bg-pink-100'
                        : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isInWishlist(selectedProduct.id) ? '💖 In Wishlist' : '🤍 Add to Wishlist'}
                  </motion.button>
                </motion.div>
              </div>

              {/* Tabs Section */}
              <div className="border-t px-6 md:px-10 pb-10">
                <div className="flex gap-4 border-b mb-6 pt-6">
                  {['description', 'nutrition', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-4 py-2 font-semibold capitalize transition ${
                        activeTab === tab
                          ? 'text-[#FF8C42] border-b-2 border-[#FF8C42]'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeTab === 'description' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold text-[#3D4F42] mb-3">About This Mango</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">{selectedProduct.details}</p>
                    <h4 className="text-lg font-bold text-[#3D4F42] mb-2">Why Choose Our Mangoes?</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FF8C42]">✓</span>
                        <span>100% USDA Organic Certified</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FF8C42]">✓</span>
                        <span>Hand-picked at peak ripeness</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FF8C42]">✓</span>
                        <span>Shipped within 24 hours of harvest</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FF8C42]">✓</span>
                        <span>Sustainable farming practices</span>
                      </li>
                    </ul>
                  </motion.div>
                )}

                {activeTab === 'nutrition' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold text-[#3D4F42] mb-3">Nutritional Information</h3>
                    <p className="text-gray-700 mb-4">{selectedProduct.nutritional}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-bold text-[#3D4F42] mb-2">Health Benefits</h4>
                        <ul className="space-y-1 text-gray-700 text-sm">
                          <li>• Boosts immune system</li>
                          <li>• Improves digestion</li>
                          <li>• Supports eye health</li>
                          <li>• Rich in antioxidants</li>
                        </ul>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-bold text-[#3D4F42] mb-2">Key Nutrients</h4>
                        <ul className="space-y-1 text-gray-700 text-sm">
                          <li>• Vitamin C: 36mg per 100g</li>
                          <li>• Vitamin A: 54μg per 100g</li>
                          <li>• Dietary Fiber: 1.6g per 100g</li>
                          <li>• Potassium: 168mg per 100g</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-[#3D4F42]">Customer Reviews</h3>
                      <Link 
                        href={`/account?tab=reviews&productId=${selectedProduct.id}`}
                        className="bg-[#FF8C42] hover:bg-[#FFA558] text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                        onClick={closeProductModal}
                      >
                        Write a Review
                      </Link>
                    </div>

                    <div className="space-y-4">
                      {(!selectedProduct.reviews || selectedProduct.reviews.length === 0) ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-1">No reviews yet</p>
                          <p className="text-gray-400 text-sm">Be the first to review this product!</p>
                        </div>
                      ) : (
                        selectedProduct.reviews.map((review: any) => (
                          <div key={review.id} className="border-b pb-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#FF8C42] rounded-full flex items-center justify-center text-white text-sm font-bold">
                                  {review.user.name[0]}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800 text-sm">{review.user.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric', 
                                      year: 'numeric' 
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <span className="text-3xl">🥭</span>
            <h1 className="text-xl font-bold text-[#FF8C42]">Mango Fresh Farm</h1>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/checkout"
              className="bg-[#FF8C42] hover:bg-[#FFA558] text-white px-3 sm:px-4 py-2 rounded-md flex items-center gap-2 font-medium transition shadow-md"
            >
              🛒 <span className="hidden sm:inline">Cart</span> ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </Link>
            <Link 
              href="/" 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 sm:px-4 py-2 rounded-md font-semibold transition"
            >
              <span className="hidden sm:inline">← Back to Home</span>
              <span className="sm:hidden">← Home</span>
            </Link>
          </div>
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
              className="inline-block bg-[#FF8C42] hover:bg-[#FFA558] text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((item, idx) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleProductClick(item.product.id)}
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
                  </h3>handleAddToCart(item, e)
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.product.description}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="flex-1 bg-[#3D4F42] hover:bg-[#FF8C42] text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.productId);
                      }}
                      className="w-12 h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center justify-center"
                      title="Remove from wishlist"
                    >
                      🗑️
                    </button>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(item.product.id);
                    }}
                    className="block w-full mt-3 text-center text-sm text-[#FF8C42] hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
