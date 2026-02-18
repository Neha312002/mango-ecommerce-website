'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useCart } from '../context/CartContext';
import { useState, useRef, useEffect, type MouseEvent, type CSSProperties } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

const sliderImages = [
  '/images/mango1.jpg',
  '/images/mango2.jpg',
  '/images/mango3.jpg',
];

const products = [
  { id: 1, name: 'Alphonso Mango', price: 20, img: '/images/mango1.jpg', desc: 'Rich, sweet, and juicy - the king of mangoes.' },
  { id: 2, name: 'Kesar Mango', price: 18, img: '/images/mango2.jpg', desc: 'Aromatic and flavorful with saffron notes.' },
  { id: 3, name: 'Banganapalli Mango', price: 15, img: '/images/mango3.jpg', desc: 'Firm, delicious, and perfectly sweet.' },
  { id: 4, name: 'Totapuri Mango', price: 16, img: '/images/mango1.jpg', desc: 'Tangy and great for cooking or eating.' },
  { id: 5, name: 'Dasheri Mango', price: 19, img: '/images/mango2.jpg', desc: 'Sweet fragrance with delicious pulp.' },
  { id: 6, name: 'Langra Mango', price: 17, img: '/images/mango3.jpg', desc: 'Green-skinned with exceptional sweetness.' },
];

type FlyingMango = {
  id: number;
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
};

export default function Home() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageName, setMessageName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [flyingMangoes, setFlyingMangoes] = useState<FlyingMango[]>([]);
  const [cartAnimating, setCartAnimating] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const cartButtonRef = useRef<HTMLButtonElement | null>(null);

  // Check for logged-in user on mount
  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  function handleAddToCart(product: (typeof products)[number], event: MouseEvent<HTMLButtonElement>) {
    addToCart(product);

    if (!cartButtonRef.current) return;

    const productRect = event.currentTarget.getBoundingClientRect();
    const cartRect = cartButtonRef.current.getBoundingClientRect();

    const startX = productRect.left + productRect.width / 2;
    const startY = productRect.top + productRect.height / 2;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    const id = Date.now() + Math.random();
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    setFlyingMangoes((prev) => [...prev, { id, startX, startY, deltaX, deltaY }]);

    setCartAnimating(true);
    setTimeout(() => setCartAnimating(false), 800);

    setTimeout(() => {
      setFlyingMangoes((prev) => prev.filter((mango) => mango.id !== id));
    }, 1000);
  }

  // Hide splash screen after animation
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Mango Splash Reveal Animation */}
      {showSplash && (
        <div className="splash-screen">
          <div className="splash-content">
            {/* Mango drop animation */}
            <div className="mango-drop">
              <span className="text-9xl">🥭</span>
            </div>
            
            {/* Juice splash effects */}
            <div className="juice-splash splash-1"></div>
            <div className="juice-splash splash-2"></div>
            <div className="juice-splash splash-3"></div>
            <div className="juice-splash splash-4"></div>
            
            {/* Brand text */}
            <div className="splash-text">
              <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
                Mango Fresh Farm
              </h1>
              <p className="text-xl md:text-2xl text-orange-200 mt-4">Pure Sweetness, Straight from the Tree</p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 shadow-lg text-white">
        <div className="flex w-full">
          {/* Left Brand Block */}
          <div className="hidden sm:flex items-center gap-3 bg-[#FF8C42] text-[#3D4F42] px-5 md:px-8 py-3 relative overflow-visible">
            {/* Mango with Juice Splash */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              
              {/* Splash droplets flying around */}
              <motion.div
                className="absolute -top-4 left-1/2 w-2 h-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60"
                animate={{
                  y: [-3, 3, -3],
                  x: [-2, 2, -2],
                  opacity: [0.6, 0.3, 0.6]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute top-0 -right-4 w-1.5 h-1.5 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-50"
                animate={{
                  y: [2, -2, 2],
                  x: [3, -1, 3],
                  opacity: [0.5, 0.2, 0.5]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.3, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-4 right-1/4 w-2 h-2 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full opacity-50"
                animate={{
                  y: [3, -3, 3],
                  x: [-1, 1, -1],
                  opacity: [0.5, 0.2, 0.5]
                }}
                transition={{ duration: 2.8, repeat: Infinity, delay: 0.6, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute top-1/2 -left-4 w-1.5 h-1.5 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-50"
                animate={{
                  x: [-3, 1, -3],
                  y: [-1, 1, -1],
                  opacity: [0.5, 0.2, 0.5]
                }}
                transition={{ duration: 3.2, repeat: Infinity, delay: 0.4, ease: "easeInOut" }}
              />
              
              {/* Mango in center */}
              <motion.div
                className="relative z-10 text-5xl"
                animate={{ 
                  rotate: [-5, 5, -5],
                  scale: [1, 1.02, 1],
                  y: [-1, 1, -1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  filter: 'drop-shadow(0 3px 6px rgba(255, 140, 66, 0.4))'
                }}
              >
                🥭
              </motion.div>
              
              {/* Subtle glow effect behind mango */}
              <motion.div
                className="absolute inset-0 bg-gradient-radial from-yellow-300/30 to-transparent rounded-full"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            
            {/* Brand Text */}
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Mango Fresh Farm</h1>
              <p className="text-xs md:text-sm font-medium">Deliver Season's Best</p>
            </div>
          </div>

          {/* Center Nav Area */}
          <div className="flex-1 bg-[#3D4F42] px-4 md:px-8 py-3 flex items-center justify-between">
            {/* Mobile Brand (when left block is hidden) */}
            <div className="sm:hidden flex items-center gap-2">
              <div className="relative w-12 h-12 flex items-center justify-center">
                {/* Small splash for mobile */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-30 blur-sm"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.span 
                  className="text-3xl relative z-10"
                  animate={{ 
                    rotate: [-8, 8, -8],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity
                  }}
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(255, 140, 66, 0.5))' }}
                >
                  🥭
                </motion.span>
              </div>
              <h1 className="text-xl font-bold text-[#FF8C42]">Mango Fresh Farm</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10 mx-auto">
              <a href="#home" className="text-[#FF8C42] hover:text-orange-300 transition font-medium">Home</a>
              <a href="#about" className="hover:text-[#FF8C42] transition font-medium">About</a>
              <a href="/our-process" className="hover:text-[#FF8C42] transition font-medium">Our Process</a>
              <a href="#products" className="hover:text-[#FF8C42] transition font-medium">Order Online</a>
              <a href="#blog" className="hover:text-[#FF8C42] transition font-medium">Blog</a>
              <a href="#contact" className="hover:text-[#FF8C42] transition font-medium">Contact Us</a>
            </div>

            {/* Right side actions (log in + cart) */}
            <div className="flex items-center gap-4 ml-auto">
              <Link href="/auth" className="hidden sm:inline-flex items-center gap-2 text-sm md:text-base hover:text-orange-300 transition">
                <span className="text-lg">👤</span>
                <span className="font-medium">{currentUser ? currentUser.name : 'Account'}</span>
              </Link>
              <button
                ref={cartButtonRef}
                onClick={() => setCartOpen(true)}
                className={`bg-[#FF8C42] hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition shadow-md ${cartAnimating ? 'cart-animate' : ''}`}
              >
                🛒 <span className="hidden sm:inline">Cart</span> ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </button>
            </div>
          </div>

        </div>
      </nav>

      {/* Flying Mango Animation Layer */}
      {flyingMangoes.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-40">
          {flyingMangoes.map((mango) => (
            <div
              key={mango.id}
              className="flying-mango"
              style={{
                left: mango.startX,
                top: mango.startY,
                '--dx': `${mango.deltaX}px`,
                '--dy': `${mango.deltaY}px`,
              } as CSSProperties}
            >
              🥭
            </div>
          ))}
        </div>
      )}

      {/* Cart Modal */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md relative"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button 
                className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-gray-600" 
                onClick={() => setCartOpen(false)}
                whileHover={{ rotate: 90, scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                &times;
              </motion.button>
              <motion.h2 
                className="text-2xl font-bold mb-6 text-[#3D4F42]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Your Cart
              </motion.h2>
              {cart.length === 0 ? (
                <motion.p 
                  className="text-gray-500 text-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Your cart is empty.
                </motion.p>
              ) : (
                <>
                  <ul className="mb-6 space-y-3">
                    {cart.map((item, idx) => (
                      <motion.li 
                        key={item.name} 
                        className="flex items-center justify-between border-b pb-3"
                        initial={{ opacity: 0,x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <div className="flex-1">
                          <p className="font-medium text-[#3D4F42]">{item.name}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <motion.button
                              onClick={() => removeFromCart(item.name)}
                              className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-700"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              −
                            </motion.button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <motion.button
                              onClick={(e) => {
                                // Find existing product from products array and add one more
                                const product = products.find(p => p.name === item.name);
                                if (product) {
                                  addToCart(product);
                                }
                              }}
                              className="w-7 h-7 rounded-full bg-[#FF8C42] hover:bg-orange-600 text-white flex items-center justify-center font-bold"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              +
                            </motion.button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#FF8C42]">${item.price * item.quantity}</span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.div 
                    className="flex items-center justify-between mb-6 pt-4 border-t-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="font-bold text-xl text-[#3D4F42]">Total:</span>
                    <motion.span 
                      className="font-bold text-2xl text-[#FF8C42]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.5 }}
                    >
                      ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                    </motion.span>
                  </motion.div>
                  <Link href="/checkout" className="w-full block">
                    <motion.button 
                      className="w-full bg-[#3D4F42] hover:bg-[#2d3a32] text-white py-3 rounded-lg font-bold text-lg transition shadow-md mb-3"
                      whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(61, 79, 66, 0.3)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Proceed to Checkout
                    </motion.button>
                  </Link>
                  <motion.button 
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition" 
                  onClick={clearCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear Cart
                </motion.button>
              </>
            )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Image Slider */}
      <section id="home" className="relative w-full h-[70vh] md:h-[85vh] flex items-center justify-center">
        <Swiper 
          className="w-full h-full" 
          loop 
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          modules={[Autoplay]}
        >
          {sliderImages.map((src, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full">
                <Image 
                  src={src} 
                  alt={`Fresh Mango ${idx + 1}`} 
                  fill 
                  className="object-cover" 
                  priority={idx === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/60 to-black/30 flex items-center px-6 md:px-16">
          <div className="max-w-3xl text-left">
            <motion.h1 
              className="mb-2 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-2xl leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.span 
                className="block"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Fresh Mango
              </motion.span>
              <motion.span 
                className="block gradient-text"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                style={{
                  background: 'linear-gradient(90deg, #fff, #FFB84D, #FFA500, #fff)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Delivery
              </motion.span>
            </motion.h1>
            <motion.p 
              className="mt-4 text-base sm:text-xl text-orange-200 font-medium drop-shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              From Our Farm to Your Doorstep
            </motion.p>
            <motion.a
              href="#products"
              className="inline-block mt-6 bg-white text-[#3D4F42] border border-white px-6 py-2.5 rounded-md font-semibold text-base shadow-xl transition-all juice-button-outline"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              whileHover={{ scale: 1.1, boxShadow: '0 20px 40px rgba(255, 140, 66, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              Order Online
            </motion.a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <motion.section 
        id="about" 
        className="py-16 md:py-24 px-6 bg-gray-50 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#3D4F42] mb-6">
              From Our Family Farm to Your Table
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              For over 15 years, our family has been growing the finest organic mangoes using traditional, 
              sustainable methods passed down through generations. We believe in complete transparency—what 
              you see is what you get.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              <strong className="text-[#FF8C42]">Our Promise:</strong> Every mango is USDA Organic certified, 
              hand-picked at peak ripeness, and shipped fresh within 24 hours. No chemicals, no shortcuts, 
              just pure, delicious mangoes grown the way nature intended.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              When you choose us, you're supporting sustainable agriculture, reducing your carbon footprint, 
              and getting the healthiest mangoes possible for your family.
            </p>
              <a 
              href="#products" 
              className="inline-block bg-[#FF8C42] hover:bg-orange-600 text-white px-6 py-3 rounded-md font-semibold transition shadow-md juice-button"
            >
              Shop Now
            </a>
          </motion.div>
          <motion.div 
            className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Image 
              src="/images/mango2.jpg" 
              alt="Our Mango Farm" 
              fill 
              className="object-cover"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Professional Trust Badges & Certifications */}
      <motion.section 
        className="py-12 bg-white border-y border-gray-200 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            {[
              { icon: '✓', title: 'USDA Organic', subtitle: 'Certified' },
              { icon: '★', title: '15+ Years', subtitle: 'Experience' },
              { icon: '🏆', title: 'Award Winning', subtitle: 'Quality' },
              { icon: '🚚', title: 'Free Shipping', subtitle: 'On Orders $50+' }
            ].map((badge, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div className="text-3xl mb-2 text-[#FF8C42]">{badge.icon}</div>
                <h4 className="font-bold text-[#3D4F42] text-sm">{badge.title}</h4>
                <p className="text-xs text-gray-600">{badge.subtitle}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Organic Process CTA Banner */}
      <motion.section 
        className="py-12 px-6 bg-gradient-to-r from-green-100 via-green-50 to-yellow-50 border-y-2 border-green-200"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-5xl">🌱</span>
              <h3 className="text-2xl md:text-3xl font-bold text-[#3D4F42]">
                Want to Know How We Grow Organic?
              </h3>
              <span className="text-5xl">🥭</span>
            </div>
            <p className="text-gray-700 text-lg mb-6 max-w-3xl mx-auto">
              Discover our complete organic growing process, certifications, and guarantees. 
              See exactly how we ensure every mango is 100% organic and chemical-free.
            </p>
            <motion.a
              href="/our-process"
              className="inline-flex items-center gap-3 bg-[#3D4F42] hover:bg-[#FF8C42] text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg transition-all"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(61, 79, 66, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span>🌾</span>
              See Our Organic Process
              <span>→</span>
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* Mango Wave Divider */}
      <div className="w-full overflow-hidden leading-none bg-gray-50">
        <svg
          className="block w-full h-16 md:h-24"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="mangoWave" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FFE9D6" />
            </linearGradient>
          </defs>
          <path
            fill="url(#mangoWave)"
            d="M0,224L60,208C120,192,240,160,360,154.7C480,149,600,171,720,181.3C840,192,960,192,1080,186.7C1200,181,1320,171,1380,165.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
          <path
            fill="#FFE9D6"
            fillOpacity="0.85"
            d="M0,256L80,245.3C160,235,320,213,480,218.7C640,224,800,256,960,256C1120,256,1280,224,1360,208L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </svg>
      </div>

      {/* Product Catalog Section */}
      <motion.section 
        id="products" 
        className="py-16 md:py-24 px-6 bg-gradient-to-b from-[#FFE9D6] to-white relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-center text-[#3D4F42] mb-4"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            Our Premium Mangoes
          </motion.h2>
          <motion.p 
            className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Hand-picked varieties, each with unique flavors and characteristics. Slide to explore our collection.
          </motion.p>
          
          {/* Product Carousel */}
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="product-swiper pb-12"
          >
            {products.map((product, idx) => (
              <SwiperSlide key={idx}>
                <Link href={`/product/${product.id}`}>
                  <motion.div 
                    className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-2xl flex flex-col overflow-hidden h-full product-card-3d cursor-pointer"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ 
                      y: -10, 
                      scale: 1.03,
                      boxShadow: '0 25px 50px -12px rgba(255, 140, 66, 0.25)',
                      transition: { duration: 0.3 }
                    }}
                  >
                    <motion.div 
                      className="relative w-full h-56 overflow-hidden"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image 
                        src={product.img} 
                        alt={product.name} 
                        fill 
                        className="object-cover"
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-[#FF8C42]/20 to-transparent opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-[#3D4F42] mb-2">{product.name}</h3>
                      <motion.p 
                        className="text-2xl font-bold text-[#FF8C42] mb-3"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        ${product.price} / kg
                      </motion.p>
                      <p className="text-gray-600 mb-6 flex-grow">{product.desc}</p>
                      <motion.button 
                        className="w-full bg-[#3D4F42] hover:bg-[#FF8C42] text-white px-6 py-3 rounded-md font-semibold transition shadow-md juice-button" 
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          handleAddToCart(product, event);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add to Cart
                      </motion.button>
                    </div>
                  </motion.div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </motion.section>

      {/* Customer Testimonials */}
      <motion.section 
        className="py-16 md:py-20 px-6 bg-white relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center text-[#3D4F42] mb-3"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            What Our Customers Say
          </motion.h2>
          <motion.p 
            className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of satisfied customers who trust us for premium quality mangoes
          </motion.p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Verified Customer',
                rating: 5,
                text: 'The best mangoes I\'ve ever tasted! Fresh, juicy, and delivered right to my door. Highly recommend!'
              },
              {
                name: 'Michael Chen',
                role: 'Restaurant Owner',
                rating: 5,
                text: 'We\'ve been sourcing our mangoes from them for 3 years. Consistent quality and excellent service.'
              },
              {
                name: 'Priya Patel',
                role: 'Home Chef',
                rating: 5,
                text: 'Finally found a supplier that delivers organic mangoes that taste like they\'re fresh from the tree!'
              }
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-4 italic">\"{testimonial.text}\"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-[#3D4F42]">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Meet Our Farm Family Section - Creative Image Layout */}
      <motion.section 
        className="py-16 md:py-24 px-6 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-center text-[#3D4F42] mb-4"
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            Meet Our Farm Family
          </motion.h2>
          <motion.p 
            className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Dedicated farmers committed to bringing you the freshest mangoes
          </motion.p>
          
          {/* Creative Multi-Image Collage Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Artistic Overlapping Images with Rotation */}
            <motion.div 
              className="relative h-[450px] md:h-[550px]"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Background decorative element */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C42]/5 to-[#3D4F42]/5 rounded-3xl"></div>
              
              {/* Image 1 - Large tilted */}
              <motion.div 
                className="absolute top-8 left-4 w-[60%] h-[55%] rounded-2xl overflow-hidden shadow-2xl transform -rotate-6 z-20 border-8 border-white"
                initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ rotate: 0, scale: 1.05, zIndex: 50, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
              >
                <Image 
                  src="/images/mango1.jpg" 
                  alt="Farm Team" 
                  fill 
                  className="object-cover"
                />
              </motion.div>
              
              {/* Image 2 - Medium overlapping top right */}
              <motion.div 
                className="absolute top-0 right-0 w-[55%] h-[45%] rounded-2xl overflow-hidden shadow-2xl transform rotate-3 z-30 border-8 border-white"
                initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ rotate: 0, scale: 1.05, zIndex: 50, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
              >
                <Image 
                  src="/images/mango2.jpg" 
                  alt="Fresh Harvest" 
                  fill 
                  className="object-cover"
                />
              </motion.div>
              
              {/* Image 3 - Small accent bottom left */}
              <motion.div 
                className="absolute bottom-16 left-8 w-[45%] h-[35%] rounded-2xl overflow-hidden shadow-2xl transform rotate-6 z-10 border-8 border-white"
                initial={{ opacity: 0, scale: 0.8, rotate: 20 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 6 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ rotate: 0, scale: 1.05, zIndex: 50, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
              >
                <Image 
                  src="/images/mango3.jpg" 
                  alt="Quality Check" 
                  fill 
                  className="object-cover"
                />
              </motion.div>
              
              {/* Image 4 - Vertical accent bottom right */}
              <motion.div 
                className="absolute bottom-0 right-8 w-[40%] h-[48%] rounded-2xl overflow-hidden shadow-2xl transform -rotate-3 z-25 border-8 border-white"
                initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.7 }}
                whileHover={{ rotate: 0, scale: 1.05, zIndex: 50, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
              >
                <Image 
                  src="/images/mango1.jpg" 
                  alt="Packaging" 
                  fill 
                  className="object-cover"
                />
              </motion.div>
              
              {/* Decorative elements */}
              <motion.div 
                className="absolute top-1/4 right-1/4 w-16 h-16 bg-[#FF8C42]/20 rounded-full blur-2xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div 
                className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-[#3D4F42]/20 rounded-full blur-2xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
            </motion.div>
            
            {/* Right Side - Text Content */}
            <motion.div 
              className="space-y-6 lg:pl-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.div 
                className="inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <span className="bg-[#FF8C42]/10 text-[#FF8C42] px-4 py-2 rounded-full text-sm font-semibold">
                  🌱 100% Organic & Fresh
                </span>
              </motion.div>
              <motion.h3 
                className="text-2xl md:text-4xl font-bold text-[#3D4F42] leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                Passion for Quality Since Day One
              </motion.h3>
              <motion.p 
                className="text-gray-700 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                Our family has been cultivating premium mangoes for generations. Each fruit is hand-selected 
                with care, ensuring you receive only the best quality produce straight from our farm.
              </motion.p>
              <motion.p 
                className="text-gray-700 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                We believe in sustainable farming practices and building strong relationships with our customers. 
                When you order from us, you're supporting local agriculture and getting the freshest mangoes possible.
              </motion.p>
              
              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { icon: '🚜', title: 'Farm Fresh', desc: 'Direct from our fields' },
                  { icon: '🌿', title: 'Organic', desc: 'No harmful chemicals' },
                  { icon: '📦', title: 'Fast Delivery', desc: 'Same day shipping' },
                  { icon: '❤️', title: 'Family Owned', desc: 'Trusted for generations' }
                ].map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    className="flex items-start gap-3 bg-white/50 p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.5, delay: 1 + (idx * 0.1) }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <motion.span 
                      className="text-2xl"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {feature.icon}
                    </motion.span>
                    <div>
                      <h4 className="font-semibold text-[#3D4F42]">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="pt-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 1.5 }}
              >
                <motion.a 
                  href="#products" 
                  className="inline-block bg-[#FF8C42] hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg juice-button"
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 140, 66, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  🛒 Shop Our Mangoes
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Blog Section - Farm Stories & Tips */}
      <motion.section 
        id="blog"
        className="py-16 md:py-24 px-6 bg-white relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#3D4F42] mb-4">
              From Our Farm 🌾
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Stories, recipes, and tips straight from the mango fields
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image: '/images/mango1.jpg',
                category: 'Recipes',
                title: '5 Delicious Mango Smoothie Recipes',
                excerpt: 'Transform your mangoes into refreshing smoothies perfect for summer mornings...',
                date: 'Feb 15, 2026',
                readTime: '5 min read'
              },
              {
                image: '/images/mango2.jpg',
                category: 'Farm Life',
                title: 'A Day in the Life at Mango Fresh Farm',
                excerpt: 'Follow us through a typical harvest day and see how we bring fresh mangoes to your table...',
                date: 'Feb 10, 2026',
                readTime: '7 min read'
              },
              {
                image: '/images/mango3.jpg',
                category: 'Tips & Tricks',
                title: 'How to Pick the Perfect Ripe Mango',
                excerpt: 'Learn the secrets to selecting the sweetest, juiciest mangoes every time...',
                date: 'Feb 5, 2026',
                readTime: '4 min read'
              }
            ].map((post, idx) => (
              <motion.article
                key={idx}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -10 }}
              >
                <motion.div 
                  className="relative h-56 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  <Image 
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <motion.div
                    className="absolute top-4 left-4 bg-[#FF8C42] text-white px-3 py-1 rounded-full text-sm font-semibold"
                    whileHover={{ scale: 1.1 }}
                  >
                    {post.category}
                  </motion.div>
                </motion.div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      📅 {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      ⏱️ {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#3D4F42] mb-3 group-hover:text-[#FF8C42] transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <motion.button
                    className="inline-flex items-center gap-2 text-[#FF8C42] font-semibold hover:gap-3 transition-all"
                    whileHover={{ x: 5 }}
                  >
                    Read More
                    <span>→</span>
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Follow on Instagram CTA */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl p-8 border-2 border-orange-200">
              <motion.div
                className="text-5xl mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📸
              </motion.div>
              <h3 className="text-2xl font-bold text-[#3D4F42] mb-3">
                Follow Our Farm Journey on Instagram
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Daily mango photos, behind-the-scenes farm life, recipes, and exclusive offers. Join our community!
              </p>
              <motion.a
                href="https://instagram.com/mangofreshfarm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 140, 66, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @mangofreshfarm
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Combined FAQ & Contact Section - Creative Split Layout */}
      <motion.section 
        id="contact"
        className="py-16 md:py-24 px-6 bg-gradient-to-br from-gray-50 via-white to-orange-50 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-yellow-200/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#3D4F42] mb-4">
              Questions? We're Here to Help!
            </h2>
            <p className="text-gray-600 text-lg">
              Everything you need to know or ask us directly
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Side: FAQ with Accordion Style */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-100">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">❓</span>
                  <h3 className="text-2xl font-bold text-[#3D4F42]">Frequently Asked Questions</h3>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      q: 'How do you ensure freshness during shipping?',
                      a: 'We use specialized packaging with temperature control. Mangoes are picked at optimal ripeness and shipped within 24 hours using express delivery.'
                    },
                    {
                      q: 'Are your mangoes really organic?',
                      a: 'Yes! All our mangoes are USDA Organic certified. We use sustainable farming practices without synthetic pesticides or chemicals.'
                    },
                    {
                      q: 'What\'s your return/refund policy?',
                      a: 'We offer a 30-day money-back guarantee. Not satisfied? Contact us for a full refund or replacement.'
                    },
                    {
                      q: 'How long do mangoes last?',
                      a: 'At room temperature: 3-5 days. Refrigerated: 5-7 days. Storage instructions included with every order.'
                    },
                    {
                      q: 'Do you offer bulk pricing?',
                      a: 'Yes! Contact us for special pricing on bulk orders and wholesale partnerships.'
                    }
                  ].map((faq, idx) => (
                    <motion.div
                      key={idx}
                      className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 hover:shadow-md transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <h4 className="font-bold text-[#3D4F42] mb-2 flex items-start gap-2">
                        <span className="text-[#FF8C42] text-lg">Q:</span>
                        <span className="text-sm">{faq.q}</span>
                      </h4>
                      <p className="text-gray-600 text-sm pl-6">{faq.a}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Side: Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-6"
            >
              {/* Contact Info Card */}
              <div className="bg-gradient-to-br from-[#3D4F42] to-[#2d3a32] rounded-2xl shadow-xl p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">💬</span>
                  <h3 className="text-2xl font-bold">Get In Touch</h3>
                </div>
                
                <p className="text-orange-200 mb-6">
                  Have questions about our mangoes or want to place a bulk order? We'd love to hear from you!
                </p>

                <div className="space-y-4 mb-8">
                  <motion.div 
                    className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm"
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', x: 5 }}
                  >
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="text-xs text-orange-200">Email</p>
                      <a href="mailto:info@mangofresh.com" className="font-semibold hover:text-[#FF8C42] transition">
                        info@mangofresh.com
                      </a>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm"
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', x: 5 }}
                  >
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="text-xs text-orange-200">Phone</p>
                      <a href="tel:+1234567890" className="font-semibold hover:text-[#FF8C42] transition">
                        +1 (234) 567-890
                      </a>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm"
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', x: 5 }}
                  >
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="text-xs text-orange-200">Address</p>
                      <p className="font-semibold text-sm">123 Farm Lane, Mango Valley, MV 12345</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm"
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', x: 5 }}
                  >
                    <span className="text-2xl">🕐</span>
                    <div>
                      <p className="text-xs text-orange-200">Hours</p>
                      <p className="font-semibold text-sm">Mon-Sat: 8AM - 6PM</p>
                    </div>
                  </motion.div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.a
                    href="mailto:info@mangofreshfarm.com"
                    className="flex-1 bg-[#FF8C42] hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition text-center"
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255, 140, 66, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    📧 Email Us
                  </motion.a>
                  <motion.button
                    onClick={() => setMessageOpen(true)}
                    className="flex-1 bg-white text-[#3D4F42] hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition"
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255, 255, 255, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    💬 Live Chat
                  </motion.button>
                </div>
              </div>

              {/* Quick Response Badge */}
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg">
                    ⚡
                  </div>
                  <div>
                    <h4 className="font-bold text-[#3D4F42] text-lg">Quick Response Promise</h4>
                    <p className="text-gray-600 text-sm">We respond to all inquiries within 2 hours during business hours!</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Floating Message Icon */}
      <button
        onClick={() => setMessageOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-[#FF8C42] hover:bg-orange-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-3xl transition-all transform hover:scale-110 animate-bounce"
        aria-label="Open message dialog"
      >
        💬
      </button>

      {/* Message Dialog Modal - Centered Modal Style */}
      {messageOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMessageOpen(false)}
          ></div>
          
          {/* Centered Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
              {/* Header - Red/Orange */}
              <div className="bg-[#FF8C42] text-white p-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Mango Fresh Farm</h2>
                  <p className="text-sm flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    We'll reply as soon as we can
                  </p>
                </div>
                <button 
                  className="text-2xl font-bold hover:text-gray-200" 
                  onClick={() => setMessageOpen(false)}
                >
                  ×
                </button>
              </div>
              
              {/* Message Content Area - Scrollable */}
              <div className="flex-1 overflow-y-auto p-5 bg-orange-50/30 space-y-4">
                {/* Initial Farm Message */}
                <div className="bg-white p-4 rounded-xl">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Hey there, please leave your details so we can contact you even if you are no longer on the site.
                  </p>
                </div>
                
                {/* Time Divider */}
                <div className="flex justify-center py-2">
                  <span className="bg-gray-400 text-white text-xs px-3 py-1 rounded-full">10:52 PM</span>
                </div>
                
                {/* New Messages Label */}
                <div className="flex justify-center py-2">
                  <span className="bg-white text-gray-500 text-xs px-6 py-2 rounded-full border border-gray-300 font-semibold">NEW MESSAGES</span>
                </div>
                
                {/* User Message Preview if exists */}
                {messageText && (
                  <div className="flex justify-end">
                    <div className="bg-orange-100 text-gray-800 px-4 py-2 rounded-2xl rounded-tr-sm max-w-xs text-sm">
                      <p>{messageText}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Form Section */}
              <div className="border-t border-gray-200 p-5 bg-white space-y-4">
                {/* Name Input */}
                <div className="relative">
                  <label className="block text-sm text-gray-600 mb-2">Name</label>
                  <input 
                    type="text" 
                    placeholder="Your name"
                    value={messageName}
                    onChange={(e) => setMessageName(e.target.value)}
                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-[#FF8C42] focus:outline-none bg-transparent text-gray-700 transition"
                  />
                  <span className="absolute right-3 top-8 text-gray-400">ℹ️</span>
                </div>
                
                {/* Email Input */}
                <div className="relative">
                  <label className="block text-sm text-gray-600 mb-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-[#FF8C42] focus:outline-none bg-transparent text-gray-700 transition"
                  />
                </div>
                
                {/* Message Input */}
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Write your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-[#FF8C42] focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 transition"
                  />
                  <div className="absolute right-2 -bottom-8 flex gap-2 text-gray-400">
                    <button className="hover:text-[#FF8C42] transition">😊</button>
                    <button className="hover:text-[#FF8C42] transition">📎</button>
                  </div>
                </div>
                
                {/* Submit Button */}
                <button 
                  onClick={() => {
                    if (messageName.trim() && messageText.trim()) {
                      alert(`Message sent!\nName: ${messageName}\nMessage: ${messageText}`);
                      setMessageName('');
                      setMessageText('');
                    }
                  }}
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition mt-6"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Compact Newsletter + Footer Combined */}
      <section className="bg-gradient-to-br from-[#2d3a32] to-[#1a2520] text-gray-300">
        {/* Newsletter Banner */}
        <motion.div 
          className="py-12 px-6 border-b border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">📧</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    Stay Fresh with Our Newsletter
                  </h3>
                </div>
                <p className="text-orange-200">
                  Get exclusive offers, seasonal updates, and mango recipes delivered to your inbox
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF8C42] transition"
                />
                <motion.button
                  className="bg-[#FF8C42] hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg whitespace-nowrap"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255, 140, 66, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Content */}
        <div className="max-w-7xl mx-auto py-10 px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* About Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🥭</span>
                <h3 className="text-white font-bold text-lg">Mango Fresh Farm</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                Premium organic mangoes grown with sustainable farming practices. From our farm to your table with love and care.
              </p>
              <div className="flex gap-3 mt-4">
                <a href="https://facebook.com/mangofreshfarm" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 hover:bg-[#FF8C42] rounded-full flex items-center justify-center transition" title="Facebook">
                  <span className="text-sm">f</span>
                </a>
                <a href="https://twitter.com/mangofreshfarm" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 hover:bg-[#FF8C42] rounded-full flex items-center justify-center transition" title="Twitter/X">
                  <span className="text-sm">𝕏</span>
                </a>
                <a href="https://linkedin.com/company/mangofreshfarm" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 hover:bg-[#FF8C42] rounded-full flex items-center justify-center transition" title="LinkedIn">
                  <span className="text-sm">in</span>
                </a>
                <a href="https://instagram.com/mangofreshfarm" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 rounded-full flex items-center justify-center transition" title="Instagram">
                  <span className="text-sm">📷</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-[#FF8C42] transition">About Us</a></li>
                <li><a href="/our-process" className="hover:text-[#FF8C42] transition">Our Organic Process</a></li>
                <li><a href="#products" className="hover:text-[#FF8C42] transition">Our Products</a></li>
                <li><a href="#blog" className="hover:text-[#FF8C42] transition">Blog</a></li>
                <li><a href="#team" className="hover:text-[#FF8C42] transition">Our Team</a></li>
                <li><a href="#testimonials" className="hover:text-[#FF8C42] transition">Testimonials</a></li>
                <li><a href="#contact" className="hover:text-[#FF8C42] transition">Contact Us</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-white font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#FF8C42] transition">Shipping Information</a></li>
                <li><a href="#" className="hover:text-[#FF8C42] transition">Return Policy</a></li>
                <li><a href="#" className="hover:text-[#FF8C42] transition">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-[#FF8C42] transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#FF8C42] transition">FAQ</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-semibold mb-4">Get In Touch</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF8C42] mt-1">📍</span>
                  <span className="text-gray-400">123 Farm Lane<br/>Mango Valley, MV 12345</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF8C42]">📞</span>
                  <a href="tel:+1234567890" className="text-gray-400 hover:text-[#FF8C42] transition">+1 (234) 567-890</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF8C42]">✉️</span>
                  <a href="mailto:info@mangofresh.com" className="text-gray-400 hover:text-[#FF8C42] transition">info@mangofresh.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF8C42]">🕐</span>
                  <span className="text-gray-400">Mon-Sat: 8AM - 6PM</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-6 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p className="text-gray-400">&copy; 2026 Mango Fresh Farm. All rights reserved.</p>
              <div className="flex gap-6 text-gray-400">
                <a href="#" className="hover:text-[#FF8C42] transition">Privacy</a>
                <a href="#" className="hover:text-[#FF8C42] transition">Terms</a>
                <a href="#" className="hover:text-[#FF8C42] transition">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
