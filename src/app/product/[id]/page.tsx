'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

const products = [
  { id: 1, name: 'Alphonso Mango', price: 12.99, img: '/images/mango1.jpg', desc: 'The king of mangoes with rich, creamy texture and aromatic sweetness.', details: 'Alphonso mangoes are renowned worldwide for their golden color, smooth texture, and rich taste. Perfect for eating fresh or in desserts.', weight: '1 kg', origin: 'Maharashtra, India', season: 'April - June', nutritional: '60 calories per 100g, Rich in Vitamin C and Fiber' },
  { id: 2, name: 'Kesar Mango', price: 10.99, img: '/images/mango2.jpg', desc: 'Known for its saffron color and uniquely sweet taste.', details: 'Kesar mangoes have a distinctive saffron color inside and out. They are incredibly sweet with a hint of citrus flavor.', weight: '1 kg', origin: 'Gujarat, India', season: 'May - July', nutritional: '65 calories per 100g, High in Vitamin A' },
  { id: 3, name: 'Dasheri Mango', price: 9.99, img: '/images/mango3.jpg', desc: 'Fiber-free pulp with an exceptionally sweet flavor.', details: 'Dasheri mangoes are elongated with smooth, fiber-free pulp. Perfect for smoothies and mango lassi.', weight: '1 kg', origin: 'Uttar Pradesh, India', season: 'June - July', nutritional: '58 calories per 100g, Low in fat' },
  { id: 4, name: 'Totapuri Mango', price: 8.99, img: '/images/mango1.jpg', desc: 'Firm texture makes it perfect for cooking and pickling.', details: 'Totapuri has a distinctive parrot-beak shape. Its firm texture makes it ideal for salads, cooking, and pickling.', weight: '1 kg', origin: 'Karnataka, India', season: 'May - July', nutritional: '55 calories per 100g, Good source of potassium' },
  { id: 5, name: 'Langra Mango', price: 11.99, img: '/images/mango2.jpg', desc: 'Traditional variety loved for its tangy-sweet balance.', details: 'Langra mangoes have a unique greenish skin even when ripe. They offer a perfect balance of sweet and tangy flavors.', weight: '1 kg', origin: 'Uttar Pradesh, India', season: 'July - August', nutritional: '62 calories per 100g, Rich in antioxidants' },
  { id: 6, name: 'Badami Mango', price: 13.99, img: '/images/mango3.jpg', desc: 'Buttery smooth with an intense tropical flavor.', details: 'Badami mangoes are named after the almond-like shape (Badam means almond). They have a smooth, buttery texture and intense sweetness.', weight: '1 kg', origin: 'Karnataka, India', season: 'May - June', nutritional: '70 calories per 100g, High in beta-carotene' }
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition' | 'reviews'>('description');
  const [reviews, setReviews] = useState<any[]>([]);
  
  const product = products.find(p => p.id === parseInt(params.id));

  // Load reviews from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedReviews = localStorage.getItem('reviews');
      if (storedReviews) {
        const allReviews = JSON.parse(storedReviews);
        // Filter reviews for this product
        const productReviews = allReviews.filter((r: any) => r.productId === parseInt(params.id));
        setReviews(productReviews);
      }
    }
  }, [params.id]);

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

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    router.push('/checkout');
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 5;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <span className="text-3xl">🥭</span>
            <h1 className="text-xl font-bold text-[#FF8C42]">Mango Fresh Farm</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/#products" className="text-gray-700 hover:text-[#FF8C42] transition">
              ← Back to Products
            </Link>
          </div>
        </div>
      </nav>

      {/* Product Detail Section */}
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src={product.img}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                ✓ USDA Organic
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-4xl">{avgRating >= 4.5 ? '⭐' : '⭐'}</span>
                <span className="text-2xl font-bold text-gray-800">{avgRating.toFixed(1)}</span>
                <span className="text-gray-600">({reviews.length} reviews)</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-[#3D4F42] mb-4">
                {product.name}
              </h1>
              
              <p className="text-2xl font-bold text-[#FF8C42] mb-6">
                ${product.price} / kg
              </p>

              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {product.desc}
              </p>

              {/* Product Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-white rounded-xl shadow-md">
                <div>
                  <p className="text-sm text-gray-500">Origin</p>
                  <p className="font-semibold text-gray-800">{product.origin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Season</p>
                  <p className="font-semibold text-gray-800">{product.season}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-semibold text-gray-800">{product.weight}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Freshness</p>
                  <p className="font-semibold text-green-600">★ Fresh Today</p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl transition"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold text-gray-800 w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl transition"
                  >
                    +
                  </button>
                  <span className="text-gray-600">kg</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#FF8C42] hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🛒 Add to Cart - ${(product.price * quantity).toFixed(2)}
                </motion.button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t">
                <div className="text-center">
                  <div className="text-3xl mb-2">🚚</div>
                  <p className="text-xs text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">✓</div>
                  <p className="text-xs text-gray-600">Fresh Guarantee</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">↩️</div>
                  <p className="text-xs text-gray-600">30-Day Returns</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex gap-4 border-b mb-8">
              {['description', 'nutrition', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-3 font-semibold capitalize transition ${
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
              <div>
                <h3 className="text-2xl font-bold text-[#3D4F42] mb-4">About This Mango</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">{product.details}</p>
                <h4 className="text-xl font-bold text-[#3D4F42] mb-3">Why Choose Our Mangoes?</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-[#FF8C42] text-xl">✓</span>
                    <span>100% USDA Organic Certified - No synthetic pesticides or chemicals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#FF8C42] text-xl">✓</span>
                    <span>Hand-picked at peak ripeness for maximum flavor</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#FF8C42] text-xl">✓</span>
                    <span>Shipped within 24 hours of harvest</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#FF8C42] text-xl">✓</span>
                    <span>Sustainable farming practices for 15+ years</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div>
                <h3 className="text-2xl font-bold text-[#3D4F42] mb-4">Nutritional Information</h3>
                <p className="text-gray-700 text-lg mb-6">{product.nutritional}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-xl">
                    <h4 className="font-bold text-lg text-[#3D4F42] mb-3">Health Benefits</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Boosts immune system</li>
                      <li>• Improves digestion</li>
                      <li>• Supports eye health</li>
                      <li>• Rich in antioxidants</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-xl">
                    <h4 className="font-bold text-lg text-[#3D4F42] mb-3">Key Nutrients</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Vitamin C: 36mg per 100g</li>
                      <li>• Vitamin A: 54μg per 100g</li>
                      <li>• Dietary Fiber: 1.6g per 100g</li>
                      <li>• Potassium: 168mg per 100g</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-[#3D4F42] mb-2">Customer Reviews</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-2xl ${star <= avgRating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                      <span className="text-xl font-bold">{avgRating.toFixed(1)}</span>
                      <span className="text-gray-600">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                    </div>
                  </div>
                  <Link href={`/account?tab=reviews&productId=${product.id}`} className="bg-[#FF8C42] hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition inline-block">
                    Write a Review
                  </Link>
                </div>

                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg mb-2">No reviews yet</p>
                      <p className="text-gray-400">Be the first to review this product!</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#FF8C42] rounded-full flex items-center justify-center text-white font-bold">
                              {review.userName[0]}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">{review.userName}</p>
                              <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-[#3D4F42] mb-8">You Might Also Like</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {products.filter(p => p.id !== product.id).slice(0, 3).map((relatedProduct) => (
                <Link 
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group"
                >
                  <div className="relative h-48">
                    <Image 
                      src={relatedProduct.img}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-xl text-[#3D4F42] mb-2">{relatedProduct.name}</h4>
                    <p className="text-[#FF8C42] font-bold text-lg">${relatedProduct.price} / kg</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
