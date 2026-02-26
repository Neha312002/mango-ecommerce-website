'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Fetching users with token:', !!token);
      
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Users response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched users:', data.length);
        setUsers(data);
      } else {
        const errorText = await res.text();
        console.error('Failed to fetch users:', errorText);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🥭</div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3D4F42] mb-2">Users Management</h1>
        <p className="text-gray-600">View and manage registered users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">👥</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{users.length}</h3>
          <p className="text-white/80 text-sm">Total Users</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">📦</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">
            {users.reduce((sum, u) => sum + (u.ordersCount || 0), 0)}
          </h3>
          <p className="text-white/80 text-sm">Total Orders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">🛡️</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{users.filter(u => u.role === 'admin').length}</h3>
          <p className="text-white/80 text-sm">Admin Users</p>
        </motion.div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <span className="text-6xl block mb-4">👤</span>
            <p>No users found</p>
            <p className="text-sm mt-2">User management API endpoint needed</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Orders</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Joined</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-mono text-sm text-gray-600">#{user.id}</td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">{user.name || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-semibold">{user.ordersCount || 0}</span>
                        <span className="text-xs text-gray-500">orders</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {user.role === 'admin' ? '🛡️ Admin' : '👤 Customer'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Note */}
      {users.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-green-50 border-l-4 border-green-500 p-4 rounded"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-semibold text-green-900 mb-1">User Management Active</h3>
              <p className="text-sm text-green-800">
                Showing {users.length} registered users from the database. User data includes order counts, reviews, and wishlist items.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
