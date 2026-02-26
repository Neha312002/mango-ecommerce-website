'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [redirect, setRedirect] = useState<string | null>('/');

  // Read redirect parameter from URL on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redirectParam = params.get('redirect');
      setRedirect(redirectParam || '/');
    }
  }, []);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin) {
        // Signup validation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        // Call signup API
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Signup failed');
          setLoading(false);
          return;
        }

        // Store user data
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        setLoading(false);
        router.push(redirect || '/');
      } else {
        // Login - Call login API
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Login failed');
          setLoading(false);
          return;
        }

        // Store user data and token
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        localStorage.setItem('authToken', data.token);
        setLoading(false);
        router.push(redirect || '/');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-[#ffa62b] to-[#ff9500] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
            <span className="text-4xl drop-shadow-lg">🥭</span>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-md">Mango Fresh Farm</h1>
              <p className="text-xs text-white/90">Naturally Sweet</p>
            </div>
          </Link>
          <Link 
            href="/" 
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-2 rounded-lg font-semibold transition border border-white/20"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Toggle Tabs */}
          <div className="grid grid-cols-2 bg-gray-100">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`py-4 font-bold transition ${
                isLogin
                  ? 'bg-white text-[#ffa62b]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`py-4 font-bold transition ${
                !isLogin
                  ? 'bg-white text-[#ffa62b]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <motion.span
                className="text-6xl mb-4 block"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                🥭
              </motion.span>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-2">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-gray-600">
                {isLogin
                  ? 'Login to track orders and manage your account'
                  : 'Join us to enjoy fresh organic mangoes'}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa62b] focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa62b] focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password *
                  </label>
                  {isLogin && (
                    <Link
                      href="/forgot-password"
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Forgot Password?
                    </Link>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa62b] focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa62b] focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ffa62b] hover:bg-[#FFA558] text-white px-8 py-4 rounded-lg font-bold text-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
              </button>
            </form>

            {isLogin && (
              <div className="mt-6 text-center">
                <a href="#" className="text-[#ffa62b] hover:underline text-sm">
                  Forgot Password?
                </a>
              </div>
            )}

            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-sm text-gray-600 mb-4">Or continue with</p>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <span className="text-xl">G</span>
                  <span className="font-semibold">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <span className="text-xl">f</span>
                  <span className="font-semibold">Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <p className="text-center mt-6 text-gray-600 text-sm">
          By continuing, you agree to our{' '}
          <Link href="#" className="text-[#ffa62b] hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="text-[#ffa62b] hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
