'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((o) => o.status === filterStatus));
    }
  }, [filterStatus, orders]);

  const fetchOrders = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No auth token found');
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }

      console.log('Fetching orders with token...');
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Orders response status:', res.status);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to fetch orders:', errorData);
        setError(`Failed to load orders: ${errorData.error || 'Unknown error'}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log('Orders fetched successfully:', data.length, 'orders');
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setOrders(data);
        setFilteredOrders(data);
      } else {
        console.error('Invalid orders data (not an array):', data);
        setError('Invalid data received from server');
        setOrders([]);
        setFilteredOrders([]);
      }
      
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setError(`Failed to load orders: ${error.message || 'Network error'}`);
      setOrders([]);
      setFilteredOrders([]);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        alert('Order status updated successfully!');
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🥭</div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-12">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Failed to Load Orders</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={fetchOrders}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/auth?redirect=/admin/orders';
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Re-login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusColors: any = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3D4F42] mb-2">Orders Management</h1>
        <p className="text-gray-600">View and manage all customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap gap-3">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <motion.button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === status
                  ? 'bg-[#FF8C42] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 text-sm">
                ({status === 'all' ? orders.length : orders.filter((o) => o.status === status).length})
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <span className="text-6xl block mb-4">📭</span>
            <p>No orders found for this filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Order ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Items</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="py-4 px-6 font-mono text-sm">{order.orderNumber}</td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold">{order.user?.name || 'Guest'}</div>
                        <div className="text-sm text-gray-500">{order.user?.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">{order.items?.length || 0} items</td>
                    <td className="py-4 px-6 font-semibold text-lg">₹{order.total?.toFixed(2) || '0.00'}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleViewDetails(order)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {detailModalOpen && selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setDetailModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#3D4F42]">
                    Order Details - {selectedOrder.orderNumber}
                  </h2>
                  <button
                    onClick={() => setDetailModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Customer Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-3">Customer Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-semibold">{selectedOrder.user?.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 font-semibold">{selectedOrder.user?.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-3">Shipping Address</h3>
                    <p className="text-sm">{selectedOrder.shippingAddress}</p>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-bold text-lg mb-3">Order Items</h3>
                    <div className="space-y-2">
                      {selectedOrder.items?.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <div>
                            <div className="font-semibold">{item.productName}</div>
                            <div className="text-sm text-gray-600">Quantity: {item.quantity}kg</div>
                          </div>
                          <div className="font-bold">₹{item.price.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-3">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{selectedOrder.total?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span className="text-green-600">FREE</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span>₹{selectedOrder.total?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-3">Payment Information</h3>
                    <div className="text-sm space-y-2">
                      <div>
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="ml-2 font-mono">{selectedOrder.paymentId || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="ml-2">{selectedOrder.paymentMethod || 'Razorpay'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Update Status */}
                  <div className="bg-orange-50 rounded-lg p-4 border-2 border-[#FF8C42]">
                    <h3 className="font-bold text-lg mb-3">Update Order Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <motion.button
                          key={status}
                          onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
                            selectedOrder.status === status
                              ? 'bg-[#FF8C42] text-white'
                              : 'bg-white hover:bg-gray-100 text-gray-700'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
