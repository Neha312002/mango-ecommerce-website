'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('currentUser');
    
    console.log('Admin auth check:', { token: !!token, userData: !!userData });
    
    if (!token || !userData) {
      console.log('No auth data, redirecting to login');
      router.push('/auth?redirect=/admin');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      console.log('Parsed user:', { email: parsedUser.email, role: parsedUser.role });
      
      // Check if user has admin role
      if (parsedUser.role !== 'admin') {
        console.log('User is not admin, redirecting');
        alert('Access denied. Admin privileges required.');
        router.push('/');
        return;
      }

      console.log('Admin access granted');
      setUser(parsedUser);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth?redirect=/admin');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🥭</div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Products', path: '/admin/products', icon: '🥭' },
    { name: 'Orders', path: '/admin/orders', icon: '📦' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                <span className="text-3xl">🥭</span>
                <div>
                  <h1 className="text-xl font-bold text-[#FF8C42]">Mango Fresh Farm</h1>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-[#FF8C42] transition flex items-center gap-2"
              >
                <span>🏠</span>
                <span className="hidden sm:inline">View Site</span>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:inline">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-73px)] sticky top-[73px] hidden lg:block">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link href={item.path}>
                      <motion.div
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                          isActive
                            ? 'bg-[#FF8C42] text-white'
                            : 'text-gray-700 hover:bg-orange-50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="font-semibold">{item.name}</span>
                      </motion.div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-40">
          <nav className="flex justify-around py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`flex flex-col items-center px-4 py-2 ${isActive ? 'text-[#FF8C42]' : 'text-gray-600'}`}>
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-xs mt-1">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
