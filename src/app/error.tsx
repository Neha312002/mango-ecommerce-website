'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Animated Error Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="inline-block"
            >
              <span className="text-9xl">⚠️</span>
            </motion.div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#3D4F42] mb-4">
              Oops! Something Went Wrong
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Don't worry, it's not you—it's us! Our mangoes got a bit tangled.
            </p>
          </motion.div>

          {/* Error Details (Development) */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left"
            >
              <p className="text-sm font-mono text-red-800 break-all">
                <strong>Error:</strong> {error.message}
              </p>
              {error.digest && (
                <p className="text-xs font-mono text-red-600 mt-2">
                  <strong>Digest:</strong> {error.digest}
                </p>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-xl font-semibold text-[#3D4F42] mb-6">
              Let's fix this together:
            </h2>
            
            <div className="space-y-4">
              {/* Try Again Button */}
              <motion.button
                onClick={reset}
                className="w-full bg-[#ffa62b] hover:bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold transition shadow-lg flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(255, 140, 66, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl">🔄</span>
                <span>Try Again</span>
              </motion.button>

              {/* Go Home Button */}
              <Link href="/" className="block">
                <motion.button
                  className="w-full bg-[#3D4F42] hover:bg-[#2d3a32] text-white px-8 py-4 rounded-lg font-semibold transition shadow-lg flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(61, 79, 66, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">🏠</span>
                  <span>Go to Homepage</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
          >
            <Link href="/#products" className="group">
              <div className="bg-white hover:bg-orange-50 rounded-lg p-4 shadow transition">
                <span className="text-3xl block mb-2">🥭</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#ffa62b]">
                  Products
                </span>
              </div>
            </Link>
            <Link href="/wishlist" className="group">
              <div className="bg-white hover:bg-orange-50 rounded-lg p-4 shadow transition">
                <span className="text-3xl block mb-2">❤️</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#ffa62b]">
                  Wishlist
                </span>
              </div>
            </Link>
            <Link href="/account" className="group">
              <div className="bg-white hover:bg-orange-50 rounded-lg p-4 shadow transition">
                <span className="text-3xl block mb-2">👤</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#ffa62b]">
                  Account
                </span>
              </div>
            </Link>
            <Link href="/#contact" className="group">
              <div className="bg-white hover:bg-orange-50 rounded-lg p-4 shadow transition">
                <span className="text-3xl block mb-2">📧</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#ffa62b]">
                  Contact
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-500 text-sm"
          >
            <p className="mb-2">If the problem persists, please contact our support team:</p>
            <p>
              📧{' '}
              <a href="mailto:support@mangofreshfarm.com" className="text-[#ffa62b] hover:underline">
                support@mangofreshfarm.com
              </a>
              {' '}or{' '}
              📞{' '}
              <a href="tel:+91XXXXXXXXXX" className="text-[#ffa62b] hover:underline">
                +91 XXXX-XXXXXX
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
