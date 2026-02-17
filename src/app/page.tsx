'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const sliderImages = [
  '/images/mango1.jpg',
  '/images/mango2.jpg',
  '/images/mango3.jpg',
];

const products = [
  { name: 'Alphonso Mango', price: 20, img: '/images/mango1.jpg', desc: 'Rich, sweet, and juicy - the king of mangoes.' },
  { name: 'Kesar Mango', price: 18, img: '/images/mango2.jpg', desc: 'Aromatic and flavorful with saffron notes.' },
  { name: 'Banganapalli Mango', price: 15, img: '/images/mango3.jpg', desc: 'Firm, delicious, and perfectly sweet.' },
  { name: 'Totapuri Mango', price: 16, img: '/images/mango1.jpg', desc: 'Tangy and great for cooking or eating.' },
  { name: 'Dasheri Mango', price: 19, img: '/images/mango2.jpg', desc: 'Sweet fragrance with delicious pulp.' },
  { name: 'Langra Mango', price: 17, img: '/images/mango3.jpg', desc: 'Green-skinned with exceptional sweetness.' },
];

export default function Home() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageName, setMessageName] = useState('');
  const [messageText, setMessageText] = useState('');

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-[#3D4F42] text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#FF8C42]">Mango Fresh Farm</h1>
              <p className="text-xs md:text-sm text-orange-200">Deliver Season's Best</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-[#FF8C42] hover:text-orange-300 transition font-medium">Home</a>
            <a href="#about" className="hover:text-[#FF8C42] transition font-medium">About</a>
            <a href="#products" className="hover:text-[#FF8C42] transition font-medium">Order Online</a>
            <a href="#contact" className="hover:text-[#FF8C42] transition font-medium">Contact Us</a>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="bg-[#FF8C42] hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition shadow-md"
          >
            🛒 <span className="hidden sm:inline">Cart</span> ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
        </div>
      </nav>

      {/* Cart Modal */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md relative">
            <button 
              className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-gray-600" 
              onClick={() => setCartOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-[#3D4F42]">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
            ) : (
              <>
                <ul className="mb-6 space-y-3">
                  {cart.map((item) => (
                    <li key={item.name} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium text-[#3D4F42]">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#FF8C42]">${item.price * item.quantity}</span>
                        <button 
                          className="text-red-500 hover:text-red-700 text-sm font-medium" 
                          onClick={() => removeFromCart(item.name)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between mb-6 pt-4 border-t-2">
                  <span className="font-bold text-xl text-[#3D4F42]">Total:</span>
                  <span className="font-bold text-2xl text-[#FF8C42]">${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
                </div>
                <button 
                  className="w-full bg-[#3D4F42] hover:bg-[#2d3a32] text-white py-3 rounded-lg font-bold text-lg transition shadow-md mb-3"
                >
                  Proceed to Checkout
                </button>
                <button 
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition" 
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </>
            )}
          </div>
        </div>
      )}

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
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white drop-shadow-2xl mb-4 leading-tight">
            Fresh Mango Delivery
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-orange-200 font-medium mb-8 max-w-2xl drop-shadow-lg">
            From Our Farm to Your Doorstep
          </p>
          <a 
            href="#products" 
            className="bg-white text-[#3D4F42] hover:bg-[#FF8C42] hover:text-white px-8 py-4 rounded-md font-bold text-lg shadow-xl transition-all transform hover:scale-105"
          >
            Order Online
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3D4F42] mb-6">
              Support Sustainable Farming
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              We're passionate about bringing you the freshest, most delicious mangoes straight from our farm. 
              Every mango is hand-picked at peak ripeness to ensure maximum flavor and quality.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Our commitment to sustainable farming practices means you get healthy, chemical-free mangoes 
              while supporting local agriculture and our environment.
            </p>
            <a 
              href="#products" 
              className="inline-block bg-[#FF8C42] hover:bg-orange-600 text-white px-6 py-3 rounded-md font-semibold transition shadow-md"
            >
              Shop Now
            </a>
          </div>
          <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-2xl">
            <Image 
              src="/images/mango2.jpg" 
              alt="Our Mango Farm" 
              fill 
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section id="products" className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-[#3D4F42] mb-4">
            Our Premium Mangoes
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Hand-picked varieties, each with unique flavors and characteristics. Slide to explore our collection.
          </p>
          
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
                <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-2xl flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 h-full">
                  <div className="relative w-full h-56">
                    <Image 
                      src={product.img} 
                      alt={product.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-[#3D4F42] mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-[#FF8C42] mb-3">${product.price} / kg</p>
                    <p className="text-gray-600 mb-6 flex-grow">{product.desc}</p>
                    <button 
                      className="w-full bg-[#3D4F42] hover:bg-[#FF8C42] text-white px-6 py-3 rounded-md font-semibold transition shadow-md" 
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Meet Our Team Section - Creative Image Layout */}
      <section className="py-16 md:py-24 px-6 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-[#3D4F42] mb-4">
            Meet Our Farm Family
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Dedicated farmers committed to bringing you the freshest mangoes
          </p>
          
          {/* Creative Multi-Image Collage Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Artistic Overlapping Images with Rotation */}
            <div className="relative h-[450px] md:h-[550px]">
              {/* Background decorative element */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C42]/5 to-[#3D4F42]/5 rounded-3xl"></div>
              
              {/* Image 1 - Large tilted */}
              <div className="absolute top-8 left-4 w-[60%] h-[55%] rounded-2xl overflow-hidden shadow-2xl transform -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-500 z-20 border-8 border-white">
                <Image 
                  src="/images/mango1.jpg" 
                  alt="Farm Team" 
                  fill 
                  className="object-cover"
                />
              </div>
              
              {/* Image 2 - Medium overlapping top right */}
              <div className="absolute top-0 right-0 w-[55%] h-[45%] rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 z-30 border-8 border-white">
                <Image 
                  src="/images/mango2.jpg" 
                  alt="Fresh Harvest" 
                  fill 
                  className="object-cover"
                />
              </div>
              
              {/* Image 3 - Small accent bottom left */}
              <div className="absolute bottom-16 left-8 w-[45%] h-[35%] rounded-2xl overflow-hidden shadow-2xl transform rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-500 z-10 border-8 border-white">
                <Image 
                  src="/images/mango3.jpg" 
                  alt="Quality Check" 
                  fill 
                  className="object-cover"
                />
              </div>
              
              {/* Image 4 - Vertical accent bottom right */}
              <div className="absolute bottom-0 right-8 w-[40%] h-[48%] rounded-2xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 z-25 border-8 border-white">
                <Image 
                  src="/images/mango1.jpg" 
                  alt="Packaging" 
                  fill 
                  className="object-cover"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-[#FF8C42]/20 rounded-full blur-2xl"></div>
              <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-[#3D4F42]/20 rounded-full blur-2xl"></div>
            </div>
            
            {/* Right Side - Text Content */}
            <div className="space-y-6 lg:pl-8">
              <div className="inline-block">
                <span className="bg-[#FF8C42]/10 text-[#FF8C42] px-4 py-2 rounded-full text-sm font-semibold">
                  🌱 100% Organic & Fresh
                </span>
              </div>
              <h3 className="text-2xl md:text-4xl font-bold text-[#3D4F42] leading-tight">
                Passion for Quality Since Day One
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our family has been cultivating premium mangoes for generations. Each fruit is hand-selected 
                with care, ensuring you receive only the best quality produce straight from our farm.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                We believe in sustainable farming practices and building strong relationships with our customers. 
                When you order from us, you're supporting local agriculture and getting the freshest mangoes possible.
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🚜</span>
                  <div>
                    <h4 className="font-semibold text-[#3D4F42]">Farm Fresh</h4>
                    <p className="text-sm text-gray-600">Direct from our fields</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌿</span>
                  <div>
                    <h4 className="font-semibold text-[#3D4F42]">Organic</h4>
                    <p className="text-sm text-gray-600">No harmful chemicals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <h4 className="font-semibold text-[#3D4F42]">Fast Delivery</h4>
                    <p className="text-sm text-gray-600">Same day shipping</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">❤️</span>
                  <div>
                    <h4 className="font-semibold text-[#3D4F42]">Family Owned</h4>
                    <p className="text-sm text-gray-600">Trusted for generations</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setMessageOpen(true)}
                  className="bg-[#FF8C42] hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg flex items-center gap-2 transform hover:scale-105"
                >
                  💬 Message Us
                </button>
                <a 
                  href="#products" 
                  className="bg-[#3D4F42] hover:bg-[#2d3a32] text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg transform hover:scale-105"
                >
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 px-6 bg-[#3D4F42] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
          <p className="text-lg text-orange-200 mb-8">
            Have questions about our mangoes or want to place a bulk order? We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href="mailto:info@mangofreshfarm.com" 
              className="bg-[#FF8C42] hover:bg-orange-600 text-white px-8 py-3 rounded-md font-semibold transition shadow-lg"
            >
              Email Us
            </a>
            <a 
              href="tel:+1234567890" 
              className="bg-white text-[#3D4F42] hover:bg-gray-100 px-8 py-3 rounded-md font-semibold transition shadow-lg"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>

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

      {/* Footer */}
      <footer className="bg-[#2d3a32] text-gray-300 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">&copy; 2026 Mango Fresh Farm. All rights reserved.</p>
          <p className="text-xs mt-2">Delivering fresh, sustainable mangoes from our farm to your table.</p>
        </div>
      </footer>
    </div>
  );
}
