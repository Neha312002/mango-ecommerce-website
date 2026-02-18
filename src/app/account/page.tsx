'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  joinedDate: string;
  wishlist: any[];
  reviews: any[];
}

interface Order {
  orderNumber: string;
  date: string;
  items: any[];
  total: number;
  status: string;
}

function AccountPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'reviews' | 'wishlist'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviewForm, setReviewForm] = useState<{ productId: number; rating: number; comment: string } | null>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      router.push('/auth');
      return;
    }

    const userData = JSON.parse(currentUser);
    setUser(userData);

    // Load orders from database
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?userId=${userData.id}`);
        if (response.ok) {
          const dbOrders = await response.json();
          // Transform database orders to match the Order interface
          const transformedOrders = dbOrders.map((order: any) => ({
            orderNumber: order.orderNumber,
            date: order.createdAt,
            items: order.items.map((item: any) => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.price,
              image: item.product.image,
            })),
            total: order.total,
            status: order.status,
          }));
          setOrders(transformedOrders);
        } else {
          // Fallback to localStorage if API fails
          const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
          setOrders(allOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Fallback to localStorage if API fails
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(allOrders);
      }
    };

    fetchOrders();

    // Check for tab parameter
    const tab = searchParams.get('tab');
    if (tab && ['orders', 'profile', 'reviews', 'wishlist'].includes(tab)) {
      setActiveTab(tab as any);
    }

    // Check for productId parameter (to open review modal)
    const productId = searchParams.get('productId');
    if (productId && tab === 'reviews') {
      setReviewForm({ productId: parseInt(productId), rating: 5, comment: '' });
    }
  }, [router, searchParams]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  const handleSubmitReview = async (orderNumber: string, productId: number) => {
    if (!reviewForm || !user) return;

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          productId: reviewForm.productId,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          orderNumber: orderNumber,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Review submitted successfully!');
        setReviewForm(null);
        
        // Update user reviews in localStorage
        const updatedUser = { 
          ...user, 
          reviews: [...user.reviews, data.review] 
        };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      } else {
        const error = await response.json();
        alert(`Failed to submit review: ${error.error}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔄</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <span className="text-3xl">🥭</span>
            <h1 className="text-xl font-bold text-[#FF8C42]">Mango Fresh Farm</h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Hello, <strong>{user.name}</strong></span>
            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {/* Profile Summary */}
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-24 h-24 bg-gradient-to-br from-[#FF8C42] to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {user.name[0].toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Member since {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                {[
                  { id: 'orders', icon: '📦', label: 'My Orders', count: orders.length },
                  { id: 'profile', icon: '👤', label: 'Profile' },
                  { id: 'reviews', icon: '⭐', label: 'My Reviews', count: user.reviews.length },
                  { id: 'wishlist', icon: '❤️', label: 'Wishlist', count: user.wishlist.length }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-semibold transition ${
                      activeTab === item.id
                        ? 'bg-[#FF8C42] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      {item.label}
                    </span>
                    {item.count !== undefined && (
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        activeTab === item.id ? 'bg-white/20' : 'bg-gray-200'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h1 className="text-3xl font-bold text-[#3D4F42] mb-8">My Orders</h1>
                  
                  {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                      <span className="text-6xl mb-4 block">📦</span>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
                      <p className="text-gray-600 mb-6">Start shopping for delicious organic mangoes!</p>
                      <Link
                        href="/#products"
                        className="inline-block bg-[#FF8C42] hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold transition"
                      >
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.orderNumber} className="bg-white rounded-2xl shadow-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Order Number</p>
                              <p className="text-lg font-bold text-[#FF8C42]">{order.orderNumber}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Order Date</p>
                              <p className="font-semibold">
                                {new Date(order.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                  <Image 
                                    src={item.img}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800">{item.name}</p>
                                  <p className="text-[#FF8C42] font-bold">${item.price.toFixed(2)}</p>
                                  <button
                                    onClick={() => setReviewForm({ productId: item.id, rating: 5, comment: '' })}
                                    className="text-sm text-[#FF8C42] hover:underline mt-1"
                                  >
                                    Write a Review
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div>
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 text-green-700'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {order.status === 'processing' && '⏳ Processing'}
                                {order.status === 'packed' && '📦 Packed'}
                                {order.status === 'shipped' && '🚚 Shipped'}
                                {order.status === 'delivered' && '✓ Delivered'}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="text-xl font-bold text-[#3D4F42]">
                                Total: ${order.total.toFixed(2)}
                              </p>
                              <Link
                                href={`/track-order?order=${order.orderNumber}`}
                                className="bg-[#FF8C42] hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                              >
                                Track Order
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h1 className="text-3xl font-bold text-[#3D4F42] mb-8">My Profile</h1>
                  
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.name}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+1 (234) 567-890"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                        />
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          className="bg-[#FF8C42] hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold transition"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>

                    <div className="mt-8 pt-8 border-t">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Change Password</h3>
                      <form className="space-y-4">
                        <input
                          type="password"
                          placeholder="Current Password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                        />
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                        />
                        <button
                          type="submit"
                          className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-bold transition"
                        >
                          Update Password
                        </button>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h1 className="text-3xl font-bold text-[#3D4F42] mb-8">My Reviews</h1>
                  
                  {user.reviews.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                      <span className="text-6xl mb-4 block">⭐</span>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">No Reviews Yet</h3>
                      <p className="text-gray-600 mb-6">Purchase products and share your experience!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.reviews.map((review: any) => (
                        <div key={review.id} className="bg-white rounded-2xl shadow-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800">Product #{review.productId}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h1 className="text-3xl font-bold text-[#3D4F42] mb-8">My Wishlist</h1>
                  
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <span className="text-6xl mb-4 block">❤️</span>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Wishlist Coming Soon</h3>
                    <p className="text-gray-600 mb-6">Save your favorite products for later!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-lg w-full"
          >
            <h2 className="text-2xl font-bold text-[#3D4F42] mb-6">Write a Review</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="text-4xl transition hover:scale-110"
                  >
                    <span className={star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                placeholder="Share your experience with this product..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setReviewForm(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitReview('', reviewForm.productId)}
                className="flex-1 bg-[#FF8C42] hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold transition"
              >
                Submit Review
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AccountPageContent />
    </Suspense>
  );
}
