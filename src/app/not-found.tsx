'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Animated 404 with Mango */}
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-9xl font-bold text-[#ffa62b]">4</span>
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-9xl"
              >
                🥭
              </motion.span>
              <span className="text-9xl font-bold text-[#ffa62b]">4</span>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#3D4F42] mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Looks like this mango fell off the tree! The page you're looking for doesn't exist.
            </p>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-xl font-semibold text-[#3D4F42] mb-4">
              Here's what you can do:
            </h2>
            <ul className="space-y-3 text-left">
              <li className="flex items-start gap-3">
                <span className="text-[#ffa62b] text-xl">🏠</span>
                <div>
                  <span className="text-gray-700">Go back to our </span>
                  <Link href="/" className="text-[#ffa62b] hover:underline font-semibold">
                    Homepage
                  </Link>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#ffa62b] text-xl">🛒</span>
                <div>
                  <span className="text-gray-700">Browse our </span>
                  <Link href="/#products" className="text-[#ffa62b] hover:underline font-semibold">
                    Fresh Mangoes
                  </Link>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#ffa62b] text-xl">❤️</span>
                <div>
                  <span className="text-gray-700">Check your </span>
                  <Link href="/wishlist" className="text-[#ffa62b] hover:underline font-semibold">
                    Wishlist
                  </Link>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#ffa62b] text-xl">👤</span>
                <div>
                  <span className="text-gray-700">Visit your </span>
                  <Link href="/account" className="text-[#ffa62b] hover:underline font-semibold">
                    Account
                  </Link>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/">
              <motion.button
                className="bg-[#ffa62b] hover:bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold transition shadow-lg text-lg"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255, 140, 66, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                🏠 Back to Home
              </motion.button>
            </Link>
            <Link href="/#products">
              <motion.button
                className="bg-[#3D4F42] hover:bg-[#2d3a32] text-white px-8 py-4 rounded-lg font-semibold transition shadow-lg text-lg"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(61, 79, 66, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                🥭 Shop Mangoes
              </motion.button>
            </Link>
          </motion.div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-500 text-sm mt-8"
          >
            Need help? Contact us at{' '}
            <a href="mailto:support@mangofreshfarm.com" className="text-[#ffa62b] hover:underline">
              support@mangofreshfarm.com
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
