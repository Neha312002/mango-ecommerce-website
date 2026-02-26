'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function RefundPolicyPage() {
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
          <h1 className="text-4xl font-bold text-[#3D4F42] mb-4">Refund & Return Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: February 26, 2026</p>

          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            <div className="bg-orange-50 border-l-4 border-[#FF8C42] p-4 rounded">
              <p className="text-gray-700">
                <strong>Important:</strong> As we deal with fresh, organic produce, please read our 
                return policy carefully. We want to ensure you receive the best quality mangoes!
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">1. Return Eligibility</h2>
              <p className="text-gray-700 mb-4">
                You may request a return or refund if:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Product is damaged or spoiled upon delivery</li>
                <li>Wrong product was delivered</li>
                <li>Product quality does not meet our standards</li>
                <li>Missing items from your order</li>
                <li>Packaging is severely damaged</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">2. Return Window</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-gray-700 font-semibold mb-2">⏰ Report Issues Within 24 Hours</p>
                <p className="text-gray-700">
                  Due to the perishable nature of our products, all issues must be reported within 
                  24 hours of delivery. Claims made after this period cannot be accepted.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">3. Non-Returnable Items</h2>
              <p className="text-gray-700 mb-4">
                The following items cannot be returned:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Products that have been consumed or used</li>
                <li>Products returned after 24 hours of delivery</li>
                <li>Products damaged due to mishandling by customer</li>
                <li>Promotional or sale items (unless defective)</li>
                <li>Products without original packaging</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">4. How to Request a Return</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg text-[#3D4F42] mb-2">Step 1: Contact Us</h3>
                  <p className="text-gray-700">
                    Email us at <a href="mailto:support@mangofreshfarm.com" className="text-[#FF8C42] hover:underline">support@mangofreshfarm.com</a> or 
                    call +91 XXXX-XXXXXX within 24 hours of delivery.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg text-[#3D4F42] mb-2">Step 2: Provide Details</h3>
                  <p className="text-gray-700 mb-2">Include the following information:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Order number</li>
                    <li>Product name and quantity</li>
                    <li>Clear photos of the issue</li>
                    <li>Description of the problem</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg text-[#3D4F42] mb-2">Step 3: Await Approval</h3>
                  <p className="text-gray-700">
                    Our team will review your request within 24 hours and notify you of the approval status.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg text-[#3D4F42] mb-2">Step 4: Return Process</h3>
                  <p className="text-gray-700">
                    If approved, we'll arrange for pickup or provide instructions for return shipping.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">5. Refund Process</h2>
              <div className="space-y-4 text-gray-700">
                <p>Once your return is received and inspected:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We will send you an email confirmation</li>
                  <li>Approved refunds are processed within 2-3 business days</li>
                  <li>Refund will be credited to your original payment method</li>
                  <li>Bank processing may take an additional 5-7 business days</li>
                </ul>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="font-semibold">💳 Refund Timeline</p>
                  <p className="text-sm mt-2">Total refund time: 7-10 business days from return approval</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">6. Replacement Option</h2>
              <p className="text-gray-700">
                Instead of a refund, you may choose to receive a replacement product. Replacements 
                are subject to stock availability and will be shipped at no additional cost.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">7. Cancellation Policy</h2>
              <div className="space-y-4 text-gray-700">
                <p>You can cancel your order:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Before Shipping:</strong> Full refund within 1-2 business days</li>
                  <li><strong>After Shipping:</strong> Subject to return policy (contact us immediately)</li>
                  <li><strong>During Delivery:</strong> You may refuse delivery for full refund</li>
                </ul>
                <p className="mt-4">
                  To cancel an order, go to your <Link href="/account" className="text-[#FF8C42] hover:underline">Account Dashboard</Link> or 
                  contact our support team.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">8. Shipping Costs</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Return shipping is free for defective or incorrect items</li>
                <li>Customer-initiated returns may incur shipping charges</li>
                <li>Original shipping charges are non-refundable</li>
                <li>We cover return pickup costs for approved quality issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">9. Partial Refunds</h2>
              <p className="text-gray-700 mb-4">
                Partial refunds may be granted for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Partial damage to order (only damaged items refunded)</li>
                <li>Missing items from order</li>
                <li>Products with minor defects (at our discretion)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">10. Quality Guarantee</h2>
              <div className="bg-gradient-to-r from-[#FF8C42]/10 to-[#3D4F42]/10 border-2 border-[#FF8C42] rounded-xl p-6">
                <p className="text-gray-700 mb-4">
                  <strong className="text-lg">🥭 Our Promise</strong>
                </p>
                <p className="text-gray-700">
                  We guarantee the freshness and quality of all our mangoes. If you're not completely 
                  satisfied with your purchase, we'll make it right. Your satisfaction is our priority!
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#3D4F42] mb-4">11. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                For returns, refunds, or any questions:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:support@mangofreshfarm.com" className="text-[#FF8C42] hover:underline">support@mangofreshfarm.com</a></p>
                <p><strong>Phone:</strong> +91 XXXX-XXXXXX (Mon-Sat, 9 AM - 6 PM IST)</p>
                <p><strong>Address:</strong> Mango Fresh Farm, India</p>
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
