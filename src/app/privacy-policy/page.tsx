'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold text-[#3D4F42] mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: February 26, 2026</p>

          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                At Mango Fresh Farm, we collect information to provide you with the best shopping experience:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and shipping address</li>
                <li><strong>Payment Information:</strong> Processed securely through Razorpay (we do not store card details)</li>
                <li><strong>Order Information:</strong> Products purchased, order history, and preferences</li>
                <li><strong>Account Information:</strong> Login credentials, wishlist, and reviews</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Provide customer support</li>
                <li>Improve our products and services</li>
                <li>Send promotional emails (you can opt-out anytime)</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We respect your privacy and do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Payment Processors:</strong> Razorpay for secure payment processing</li>
                <li><strong>Shipping Partners:</strong> To deliver your orders</li>
                <li><strong>Email Service:</strong> Resend for sending transactional emails</li>
                <li><strong>Legal Authorities:</strong> When required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">4. Data Security</h2>
              <p className="text-gray-700">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure password hashing (bcrypt)</li>
                <li>PCI-DSS compliant payment processing</li>
                <li>Regular security audits</li>
                <li>Access controls and monitoring</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">5. Cookies</h2>
              <p className="text-gray-700">
                We use cookies to enhance your experience. Cookies help us remember your preferences, 
                keep you logged in, and analyze site traffic. You can control cookies through your 
                browser settings, but some features may not work properly without them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">6. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data</li>
                <li>Object to data processing</li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise these rights, contact us at <a href="mailto:privacy@mangofreshfarm.com" className="text-[#ffa62b] hover:underline">privacy@mangofreshfarm.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">7. Data Retention</h2>
              <p className="text-gray-700">
                We retain your personal information for as long as necessary to fulfill the purposes 
                outlined in this policy, comply with legal obligations, resolve disputes, and enforce 
                our agreements. You can request deletion of your account at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700">
                Our service is not intended for children under 18. We do not knowingly collect 
                personal information from children. If you believe we have collected information 
                from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any 
                significant changes by email or through a notice on our website. Your continued 
                use of our service after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">10. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="mt-4 space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:privacy@mangofreshfarm.com" className="text-[#ffa62b] hover:underline">privacy@mangofreshfarm.com</a></p>
                <p><strong>Address:</strong> Mango Fresh Farm, India</p>
                <p><strong>Phone:</strong> +91 XXXX-XXXXXX</p>
              </div>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="inline-block bg-[#ffa62b] hover:bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Back to Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
