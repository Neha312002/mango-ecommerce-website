'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminSetupPage() {
  const [email, setEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handlePromoteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/auth/make-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, masterPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({
          success: true,
          message: `✅ Success! ${data.user.name} (${data.user.email}) is now an admin.`,
        });
        setEmail('');
        setMasterPassword('');
      } else {
        setResult({
          success: false,
          message: `❌ Error: ${data.error}`,
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: '❌ Failed to connect to server',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🛡️</div>
            <h1 className="text-3xl font-bold text-[#3D4F42] mb-2">Admin Setup</h1>
            <p className="text-gray-600">Promote a user account to admin role</p>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <div className="text-sm">
                <p className="font-semibold text-red-900 mb-1">Security Warning</p>
                <p className="text-red-800">
                  This page should be disabled in production. Only use it once to create your first admin account.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handlePromoteAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                User Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                placeholder="user@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the email of an existing user account
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Master Admin Password *
              </label>
              <input
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                placeholder="Enter master password"
              />
              <p className="text-xs text-gray-500 mt-1">
                Set MASTER_ADMIN_PASSWORD in your environment variables
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF8C42] hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold transition disabled:bg-gray-400"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? 'Processing...' : 'Promote to Admin'}
            </motion.button>
          </form>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-6 p-4 rounded-lg ${
                result.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <p className={`text-sm ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.message}
              </p>
              {result.success && (
                <Link href="/admin" className="mt-3 inline-block text-[#FF8C42] hover:underline text-sm font-semibold">
                  Go to Admin Panel →
                </Link>
              )}
            </motion.div>
          )}

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm">📋 Instructions</h3>
            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
              <li>Create a regular user account first (sign up)</li>
              <li>Set MASTER_ADMIN_PASSWORD in your .env.local file</li>
              <li>Use this form to promote that user to admin</li>
              <li>Login with that account and access /admin</li>
              <li>Delete or disable this page in production</li>
            </ol>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex gap-3 justify-center text-sm">
            <Link href="/" className="text-gray-600 hover:text-[#FF8C42]">
              ← Back to Home
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/auth" className="text-gray-600 hover:text-[#FF8C42]">
              Sign In/Up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
