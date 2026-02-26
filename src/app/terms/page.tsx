'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <span className="text-3xl">🥭</span>
            <h1 className="text-xl font-bold text-[#FF8C42]">Mango Fresh Farm</h1>
          </Link>
          <Link 
            href="/" 
            className="bg-[#FF8C42] hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold transition"
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
          <h1 className="text-4xl font-bold text-[#3D4F42] mb-4">Terms & Conditions</h1>
          <p className="text-gray-600 mb-8">Last updated: February 26, 2026</p>

          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using Mango Fresh Farm website and services, you accept and agree to 
                be bound by these Terms and Conditions. If you do not agree to these terms, please do 
                not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">2. Products and Services</h2>
              <p className="text-gray-700 mb-4">
                Mango Fresh Farm provides fresh, organic mangoes and related products:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>All products are subject to availability</li>
                <li>We reserve the right to limit quantities</li>
                <li>Prices are subject to change without notice</li>
                <li>Product images are for illustration purposes</li>
                <li>We strive for accurate descriptions but cannot guarantee 100% accuracy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">3. Account Registration</h2>
              <p className="text-gray-700 mb-4">To place orders, you must:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Be at least 18 years of age</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">4. Orders and Payment</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Order Placement</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>All orders are subject to acceptance and availability</li>
                    <li>We reserve the right to refuse or cancel any order</li>
                    <li>Order confirmation does not guarantee acceptance</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Payment</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Payment is processed through Razorpay</li>
                    <li>All prices are in Indian Rupees (INR)</li>
                    <li>Payment must be completed at the time of order</li>
                    <li>We accept UPI, Credit/Debit Cards, Net Banking, and Wallets</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">5. Shipping and Delivery</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Delivery times are estimates and not guaranteed</li>
                <li>We are not responsible for delays due to unforeseen circumstances</li>
                <li>You must provide accurate shipping information</li>
                <li>Risk of loss transfers upon delivery</li>
                <li>Shipping costs are calculated at checkout</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">6. Returns and Refunds</h2>
              <p className="text-gray-700 mb-4">
                Please refer to our <Link href="/refund-policy" className="text-[#FF8C42] hover:underline">Refund Policy</Link> for detailed information about returns and refunds.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Fresh produce has specific return conditions</li>
                <li>Report issues within 24 hours of delivery</li>
                <li>Refunds are processed within 5-7 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">7. User Conduct</h2>
              <p className="text-gray-700 mb-4">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Use the service for any illegal purpose</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious code or viruses</li>
                <li>Attempt to gain unauthorized access</li>
                <li>Harass, abuse, or harm others</li>
                <li>Post false or misleading reviews</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">8. Intellectual Property</h2>
              <p className="text-gray-700">
                All content on this website, including text, graphics, logos, images, and software, 
                is the property of Mango Fresh Farm or its content suppliers and is protected by 
                international copyright laws. You may not reproduce, distribute, or modify any 
                content without our written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>Our total liability is limited to the amount you paid for the product</li>
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>We are not responsible for third-party services or links</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">10. Disclaimer</h2>
              <p className="text-gray-700">
                Our service is provided "as is" without any warranties, express or implied. We do not 
                warrant that our service will meet your requirements or be available, timely, secure, 
                or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">11. Indemnification</h2>
              <p className="text-gray-700">
                You agree to indemnify and hold Mango Fresh Farm harmless from any claims, losses, 
                damages, liabilities, and expenses arising from your use of our service or violation 
                of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">12. Governing Law</h2>
              <p className="text-gray-700">
                These Terms and Conditions are governed by the laws of India. Any disputes shall be 
                subject to the exclusive jurisdiction of the courts in India.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. Changes will be effective 
                immediately upon posting. Your continued use of the service constitutes acceptance 
                of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">14. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms and Conditions, contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:support@mangofreshfarm.com" className="text-[#FF8C42] hover:underline">support@mangofreshfarm.com</a></p>
                <p><strong>Address:</strong> Mango Fresh Farm, India</p>
                <p><strong>Phone:</strong> +91 XXXX-XXXXXX</p>
              </div>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="inline-block bg-[#FF8C42] hover:bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Back to Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
