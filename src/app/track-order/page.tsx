'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Order {
  orderNumber: string;
  date: string;
  items: any[];
  total: number;
  shipping: any;
  status: 'processing' | 'packed' | 'shipped' | 'delivered';
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('order')) {
      searchForOrder(searchParams.get('order') || '');
    }
  }, [searchParams]);

  const searchForOrder = (num: string) => {
    setError('');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const found = orders.find((o: Order) => o.orderNumber === num);
    
    if (found) {
      setOrder(found);
    } else {
      setError('Order not found. Please check your order number and try again.');
      setOrder(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchForOrder(orderNumber);
  };

  const getStatusIndex = (status: string) => {
    const statuses = ['processing', 'packed', 'shipped', 'delivered'];
    return statuses.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <span className="text-3xl">🥭</span>
            <h1 className="text-xl font-bold text-[#FF8C42]">Mango Fresh Farm</h1>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h1 className="text-3xl font-bold text-[#3D4F42] mb-4">Track Your Order</h1>
          <p className="text-gray-600 mb-6">
            Enter your order number to track your mango delivery
          </p>

          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter order number (e.g., MF12345678)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="bg-[#FF8C42] hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold transition"
            >
              Track Order
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}
        </motion.div>

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Order Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="text-2xl font-bold text-[#FF8C42]">{order.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(order.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Order Status Timeline */}
              <div className="relative">
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                  <div
                    className="h-full bg-[#FF8C42] transition-all duration-500"
                    style={{ width: `${(getStatusIndex(order.status) / 3) * 100}%` }}
                  />
                </div>

                <div className="relative grid grid-cols-4 gap-4">
                  {[
                    { status: 'processing', icon: '📦', label: 'Order Received' },
                    { status: 'packed', icon: '✓', label: 'Packed' },
                    { status: 'shipped', icon: '🚚', label: 'Shipped' },
                    { status: 'delivered', icon: '🎉', label: 'Delivered' }
                  ].map((step, idx) => {
                    const isComplete = getStatusIndex(order.status) >= idx;
                    const isCurrent = getStatusIndex(order.status) === idx;

                    return (
                      <div key={step.status} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all ${
                            isComplete
                              ? 'bg-[#FF8C42] text-white'
                              : 'bg-gray-200 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-orange-200' : ''}`}
                        >
                          <span className="text-xl">{step.icon}</span>
                        </div>
                        <p
                          className={`text-sm font-semibold text-center ${
                            isComplete ? 'text-gray-800' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Message */}
              <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  {order.status === 'processing' && '📦 Your order is being processed'}
                  {order.status === 'packed' && '✓ Your order has been packed'}
                  {order.status === 'shipped' && '🚚 Your order is on its way!'}
                  {order.status === 'delivered' && '🎉 Your order has been delivered!'}
                </p>
                <p className="text-gray-600">
                  {order.status === 'processing' && 'We\'re preparing your fresh mangoes for shipment.'}
                  {order.status === 'packed' && 'Your mangoes are packed and ready to ship.'}
                  {order.status === 'shipped' && 'Estimated delivery: 2-3 business days'}
                  {order.status === 'delivered' && 'Thank you for your order! Enjoy your mangoes!'}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-[#3D4F42] mb-4">Shipping Address</h3>
              <div className="text-gray-700">
                <p className="font-semibold">{order.shipping.fullName}</p>
                <p>{order.shipping.address}</p>
                <p>
                  {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                </p>
                <p className="mt-2">{order.shipping.phone}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-[#3D4F42] mb-6">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">1 kg</p>
                    </div>
                    <p className="font-bold text-[#FF8C42]">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between text-2xl font-bold text-[#3D4F42]">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Link
                href="/#products"
                className="flex-1 bg-[#FF8C42] hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-center transition"
              >
                Order Again
              </Link>
              <Link
                href="/#contact"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-4 rounded-lg font-bold text-center transition"
              >
                Need Help?
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
