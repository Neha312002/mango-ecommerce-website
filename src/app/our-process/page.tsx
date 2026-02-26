'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function OurProcessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-orange-50/30">
      {/* Simple Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#ffa62b] to-[#ff9500] shadow-lg">
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

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="inline-block mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-8xl">🌱</span>
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-[#3D4F42] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            How We Grow Organic Mangoes
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Transparency is our promise. Here's exactly how we grow the healthiest, 
            most delicious organic mangoes using sustainable, chemical-free practices.
          </motion.p>
        </div>
      </section>

      {/* Growing Process Timeline */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                step: '01',
                icon: '🌍',
                title: 'Rich Organic Soil',
                description: 'We start with nutrient-rich soil enriched with natural compost and organic matter. No synthetic fertilizers—ever.'
              },
              {
                step: '02',
                icon: '💧',
                title: 'Natural Irrigation',
                description: 'Drip irrigation systems minimize water waste. We use rainwater harvesting and natural spring water.'
              },
              {
                step: '03',
                icon: '🐝',
                title: 'Natural Pest Control',
                description: 'We use beneficial insects, companion planting, and organic methods. Zero chemical pesticides.'
              },
              {
                step: '04',
                icon: '✋',
                title: 'Hand-Picked at Peak',
                description: 'Every mango is inspected and hand-picked at perfect ripeness. Quality over quantity, always.'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="relative bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100 hover:border-[#ffa62b] transition-all"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -10, scale: 1.03 }}
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#ffa62b] to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {item.step}
                </div>
                <motion.div
                  className="text-5xl mb-4 mt-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-[#3D4F42] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Certification Box */}
      <section className="py-16 px-6 bg-gradient-to-b from-white via-green-50/30 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="bg-gradient-to-br from-green-100 via-white to-yellow-50 rounded-3xl p-8 md:p-12 border-2 border-green-200 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Trust Points */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#3D4F42] mb-6">
                  Why Trust Our Organic Commitment?
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: '📜',
                      title: 'USDA Organic Certified',
                      desc: 'Officially certified and inspected annually. Our certification number is available on request.'
                    },
                    {
                      icon: '🔬',
                      title: 'Third-Party Lab Tested',
                      desc: 'Regular testing for pesticides, chemicals, and quality markers. Results available to customers.'
                    },
                    {
                      icon: '📹',
                      title: 'Farm Transparency',
                      desc: 'Follow our Instagram for daily farm updates. We show exactly what we do, every single day.'
                    },
                    {
                      icon: '🤝',
                      title: '15+ Years of Trust',
                      desc: 'Three generations of organic farming. Our family name depends on our quality.'
                    },
                    {
                      icon: '🌍',
                      title: 'Environmental Commitment',
                      desc: 'Carbon-neutral shipping, biodegradable packaging, and support for local ecosystems.'
                    }
                  ].map((point, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-start gap-4 bg-white/80 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-3xl flex-shrink-0">{point.icon}</span>
                      <div>
                        <h4 className="font-bold text-[#3D4F42] mb-1">{point.title}</h4>
                        <p className="text-sm text-gray-600">{point.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right: Certifications & Guarantees */}
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-xl"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h4 className="text-xl font-bold text-[#3D4F42] mb-6 text-center">
                  Our Guarantees to You
                </h4>
                
                <div className="space-y-6">
                  <motion.div
                    className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-5xl mb-3">✓</div>
                    <h5 className="font-bold text-lg text-[#3D4F42] mb-2">100% Organic Promise</h5>
                    <p className="text-sm text-gray-700">
                      If any independent lab finds synthetic chemicals in our mangoes, we'll refund 10x your purchase.
                    </p>
                  </motion.div>

                  <motion.div
                    className="text-center p-6 bg-gradient-to-br from-orange-50 to-yellow-100 rounded-xl border-2 border-orange-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-5xl mb-3">🏆</div>
                    <h5 className="font-bold text-lg text-[#3D4F42] mb-2">Quality Guaranteed</h5>
                    <p className="text-sm text-gray-700">
                      Not satisfied with taste, freshness, or quality? Full refund within 30 days. No questions asked.
                    </p>
                  </motion.div>

                  <motion.div
                    className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-5xl mb-3">🌱</div>
                    <h5 className="font-bold text-lg text-[#3D4F42] mb-2">Sustainable Impact</h5>
                    <p className="text-sm text-gray-700">
                      For every order, we plant a tree in our orchards. You get mangoes, Earth gets greener.
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  className="mt-8 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    href="/#products"
                    className="inline-block bg-[#3D4F42] hover:bg-[#ffa62b] text-white px-8 py-4 rounded-lg font-bold transition shadow-lg"
                  >
                    🥭 Order Organic Mangoes Now
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-gradient-to-r from-[#3D4F42] to-[#2d3a32] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Taste the Organic Difference?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 text-gray-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Experience the incredible flavor of mangoes grown with care, integrity, and love for the Earth.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/#products"
              className="inline-block bg-[#ffa62b] hover:bg-[#FFA558] text-white px-10 py-4 rounded-lg font-bold text-lg transition shadow-xl"
            >
              Shop Our Mangoes 🛒
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
