'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-[#ffa62b] to-[#ff9500] shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
            <span className="text-4xl drop-shadow-lg">🥭</span>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-md">Mango Fresh Farm</h1>
              <p className="text-xs text-white/90">Naturally Sweet</p>
            </div>
          </Link>
          <Link 
            href="/" 
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-semibold transition border border-white/20"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-[#3D4F42] mb-4">Shipping Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: February 26, 2026</p>

          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-gray-700">
                <strong>🚚 Fresh Delivery Guaranteed!</strong> We ship fresh, organic mangoes 
                directly from our farm to your doorstep with special temperature-controlled packaging.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">1. Shipping Coverage</h2>
              <p className="text-gray-700 mb-4">
                We currently ship to all major cities and towns across India:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Metro cities: Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, etc.</li>
                <li>Tier-2 cities and major towns</li>
                <li>Selected rural areas (check availability at checkout)</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Enter your PIN code at checkout to verify if we deliver to your location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">2. Shipping Costs</h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-lg p-4 border-2 border-[#ffa62b]">
                  <p className="font-semibold text-lg text-[#3D4F42] mb-2">🎉 FREE Shipping on Orders Above ₹50!</p>
                  <p className="text-gray-700">
                    Orders below ₹50 will incur a shipping charge of ₹9.99
                  </p>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 font-semibold">Order Value</th>
                      <th className="border border-gray-300 p-3 font-semibold">Shipping Cost</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr>
                      <td className="border border-gray-300 p-3">Below ₹50</td>
                      <td className="border border-gray-300 p-3">₹9.99</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">₹50 and above</td>
                      <td className="border border-gray-300 p-3 font-semibold text-green-600">FREE</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">3. Delivery Time</h2>
              <div className="space-y-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 font-semibold">Location</th>
                      <th className="border border-gray-300 p-3 font-semibold">Estimated Delivery</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr>
                      <td className="border border-gray-300 p-3">Metro Cities</td>
                      <td className="border border-gray-300 p-3">2-3 business days</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Tier-2 Cities</td>
                      <td className="border border-gray-300 p-3">3-5 business days</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Rural Areas</td>
                      <td className="border border-gray-300 p-3">5-7 business days</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-gray-700 text-sm">
                  *Delivery times are estimates and may vary during peak seasons, festivals, or due to 
                  unforeseen circumstances like weather conditions or courier delays.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">4. Order Processing</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Orders are processed within 24 hours of payment confirmation</li>
                <li>Orders placed on weekends/holidays are processed on the next business day</li>
                <li>You'll receive an order confirmation email immediately after purchase</li>
                <li>A shipping confirmation with tracking details will be sent when your order ships</li>
                <li>We harvest and pack mangoes fresh for each order</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">5. Packaging</h2>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="font-semibold text-[#3D4F42] mb-2">📦 Premium Packaging</p>
                <p className="text-gray-700 mb-4">
                  We use special eco-friendly, temperature-controlled packaging to ensure your mangoes 
                  arrive fresh:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Food-grade, BPA-free materials</li>
                  <li>Cushioned protection to prevent bruising</li>
                  <li>Breathable design to maintain freshness</li>
                  <li>Insulated packaging for long-distance shipments</li>
                  <li>100% recyclable materials</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">6. Order Tracking</h2>
              <div className="space-y-4 text-gray-700">
                <p>You can track your order through:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Tracking link sent via email</li>
                  <li>Your account dashboard under "My Orders"</li>
                  <li>Our <Link href="/track-order" className="text-[#ffa62b] hover:underline">Track Order</Link> page using your order number</li>
                </ol>
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="font-semibold mb-2">📱 Real-Time Updates</p>
                  <p className="text-sm">You'll receive SMS and email notifications at every stage:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-4 mt-2">
                    <li>Order Confirmed</li>
                    <li>Order Shipped</li>
                    <li>Out for Delivery</li>
                    <li>Delivered</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">7. Delivery Instructions</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Ensure someone is available to receive the delivery</li>
                <li>Signature may be required upon delivery</li>
                <li>Inspect the package for any visible damage before accepting</li>
                <li>If package appears damaged, note it with the delivery person</li>
                <li>Contact us immediately if there are any issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">8. Failed Delivery Attempts</h2>
              <p className="text-gray-700 mb-4">
                If delivery fails due to incorrect address or unavailability:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Courier will attempt delivery 2-3 times</li>
                <li>You'll be contacted via phone/SMS</li>
                <li>Package will be held at local courier office for 3-5 days</li>
                <li>Return shipping may apply if redelivery is needed</li>
                <li>Unclaimed orders will be returned to us (refund minus shipping costs)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">9. International Shipping</h2>
              <p className="text-gray-700">
                Currently, we only ship within India. International shipping is not available at this 
                time. We're working on expanding our reach - stay tuned!
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">10. Special Circumstances</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Weather Conditions</h3>
                  <p>
                    Extreme weather may cause delays. We'll notify you if your delivery is affected.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Festival/Peak Season</h3>
                  <p>
                    During mango season (April-July) and festivals, delivery may take 1-2 extra days 
                    due to high demand.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Courier Strikes</h3>
                  <p>
                    We're not responsible for delays due to courier strikes or force majeure events.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">11. Damaged or Lost Shipments</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Report damaged shipments within 24 hours of delivery</li>
                <li>Provide photos of damaged package and products</li>
                <li>We'll arrange for replacement or full refund</li>
                <li>Lost shipments will be investigated with the courier</li>
                <li>Refund/replacement provided once investigation confirms loss</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">12. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                For shipping inquiries or support:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:shipping@mangofreshfarm.com" className="text-[#ffa62b] hover:underline">shipping@mangofreshfarm.com</a></p>
                <p><strong>Phone:</strong> +91 XXXX-XXXXXX (Mon-Sat, 9 AM - 6 PM IST)</p>
                <p><strong>Track Order:</strong> <Link href="/track-order" className="text-[#ffa62b] hover:underline">Click here</Link></p>
              </div>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="inline-block bg-[#ffa62b] hover:bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Start Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
