'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

// Declare Razorpay type
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [saveAddress, setSaveAddress] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  // Ensure user is logged in before using checkout
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      router.push('/auth?redirect=/checkout');
    }
  }, [router]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Load saved addresses when component mounts
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      loadSavedAddresses(userData.id);
      // Pre-fill email from user data
      setShippingInfo(prev => ({ ...prev, email: userData.email || '' }));
    }
  }, []);

  async function loadSavedAddresses(userId: number) {
    try {
      const response = await fetch(`/api/addresses?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSavedAddresses(data.addresses);
        
        // Auto-select default address if exists
        const defaultAddress = data.addresses.find((addr: any) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          setShippingInfo({
            fullName: defaultAddress.fullName,
            email: shippingInfo.email,
            phone: defaultAddress.phone,
            address: defaultAddress.address,
            city: defaultAddress.city,
            state: defaultAddress.state,
            zipCode: defaultAddress.zipCode,
            country: defaultAddress.country
          });
        } else if (data.addresses.length === 0) {
          setUseNewAddress(true);
          setSaveAddress(true);
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      setUseNewAddress(true);
    }
  }

  function selectAddress(address: any) {
    setSelectedAddressId(address.id);
    setUseNewAddress(false);
    setShippingInfo({
      fullName: address.fullName,
      email: shippingInfo.email,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country
    });
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save new address to database only if user chose to save it
    if (useNewAddress && !selectedAddressId && saveAddress) {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        try {
          const response = await fetch('/api/addresses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userData.id,
              fullName: shippingInfo.fullName,
              phone: shippingInfo.phone,
              address: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              zipCode: shippingInfo.zipCode,
              country: shippingInfo.country,
              isDefault: savedAddresses.length === 0, // Make default if it's the first address
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            setSelectedAddressId(data.address.id);
          }
        } catch (error) {
          console.error('Error saving address:', error);
        }
      }
    }
    
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    try {
      setProcessingPayment(true);

      // Get current user
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        alert('Please login to place an order');
        router.push('/auth?redirect=/checkout');
        return;
      }
      
      const userData = JSON.parse(currentUser);
      
      // Validate cart items have IDs
      const invalidItems = cart.filter((item) => !item.id);
      if (invalidItems.length > 0) {
        alert('Some items in your cart are invalid. Please clear your cart and add products again from the homepage.');
        console.error('Invalid cart items:', invalidItems);
        setProcessingPayment(false);
        return;
      }

      // Create Razorpay order
      const razorpayOrderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
        }),
      });

      const razorpayOrderData = await razorpayOrderResponse.json();

      if (!razorpayOrderData.success) {
        throw new Error(razorpayOrderData.error || 'Failed to create payment order');
      }

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency,
        name: 'Mango Fresh Farm',
        description: 'Fresh Organic Mangoes',
        order_id: razorpayOrderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Payment verified, now create order in database
              const orderItems = cart.map((item) => ({
                productId: item.id,
                quantity: item.quantity || 1,
                price: item.price,
              }));

              const shippingForOrder = {
                ...shippingInfo,
                email: shippingInfo.email || userData.email || '',
              };

              const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: userData.id,
                  items: orderItems,
                  shipping: shippingForOrder,
                  subtotal: subtotal,
                  shippingCost: shipping,
                  tax: tax,
                  total: total,
                  paymentId: response.razorpay_payment_id,
                }),
              });

              if (orderResponse.ok) {
                const orderData = await orderResponse.json();
                setOrderNumber(orderData.order.orderNumber);
                setOrderPlaced(true);
                clearCart();
                
                // Save to localStorage as backup
                const order = {
                  orderNumber: orderData.order.orderNumber,
                  date: new Date().toISOString(),
                  items: cart,
                  total: total,
                  shipping: shippingForOrder,
                  status: 'processing',
                  paymentId: response.razorpay_payment_id,
                };
                
                const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
                localStorage.setItem('orders', JSON.stringify([...existingOrders, order]));
              } else {
                throw new Error('Failed to create order in database');
              }
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error: any) {
            console.error('Error after payment:', error);
            alert('Payment successful but order creation failed. Please contact support with payment ID: ' + response.razorpay_payment_id);
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: shippingInfo.fullName,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        theme: {
          color: '#FF8C42',
        },
        modal: {
          ondismiss: function() {
            setProcessingPayment(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment: ' + error.message);
      setProcessingPayment(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <span className="text-3xl">🥭</span>
              <h1 className="text-xl font-bold text-[#FF8C42]">Mango Fresh Farm</h1>
            </Link>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <span className="text-5xl">✓</span>
            </motion.div>
            
            <h1 className="text-3xl font-bold text-[#3D4F42] mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Thank you for your order. We'll start processing it right away!
            </p>

            <div className="bg-orange-50 border-2 border-[#FF8C42] rounded-xl p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Your Order Number</p>
              <p className="text-3xl font-bold text-[#FF8C42] mb-4">{orderNumber}</p>
              <p className="text-sm text-gray-600">
                A confirmation email has been sent to {shippingInfo.email}
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href={`/track-order?order=${orderNumber}`}
                className="block w-full bg-[#FF8C42] hover:bg-[#FFA558] text-white px-8 py-4 rounded-lg font-bold transition"
              >
                Track Your Order
              </Link>
              <Link
                href="/"
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-4 rounded-lg font-bold transition"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <span className="text-3xl">🥭</span>
              <h1 className="text-xl font-bold text-[#FF8C42]">Mango Fresh Farm</h1>
            </Link>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <span className="text-8xl mb-6 block">🛒</span>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some delicious mangoes to get started!</p>
          <Link
            href="/#products"
            className="inline-block bg-[#FF8C42] hover:bg-[#FFA558] text-white px-8 py-4 rounded-lg font-bold transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <span className="text-3xl">🥭</span>
              <h1 className="text-xl font-bold text-[#FF8C42]">Mango Fresh Farm</h1>
            </Link>
            <Link
              href="/"
              className="bg-[#FF8C42] hover:bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Continue Shopping</span>
              <span className="sm:hidden">Shop</span>
            </Link>
          </div>
          <div className="text-sm text-gray-600">
            🛒 <span className="font-semibold">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span> in cart
          </div>
        </div>
      </nav>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Shipping' },
              { num: 2, label: 'Payment' },
              { num: 3, label: 'Review' }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                    step >= s.num
                      ? 'bg-[#FF8C42] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s.num}
                  </div>
                  <span className={`font-semibold ${step >= s.num ? 'text-[#FF8C42]' : 'text-gray-500'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`h-1 flex-1 mx-4 ${step > s.num ? 'bg-[#FF8C42]' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#3D4F42] mb-4 sm:mb-6">Shipping Information</h2>
                  
                  {/* Saved Addresses */}
                  {savedAddresses.length > 0 && !useNewAddress && (
                    <div className="mb-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">Select Saved Address</h3>
                      <div className="space-y-3 mb-4">
                        {savedAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => selectAddress(addr)}
                            className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition ${
                              selectedAddressId === addr.id
                                ? 'border-[#FF8C42] bg-orange-50'
                                : 'border-gray-200 hover:border-[#FF8C42]/50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-gray-800 text-sm sm:text-base">{addr.fullName}</p>
                                <p className="text-xs sm:text-sm text-gray-600">{addr.phone}</p>
                                <p className="text-xs sm:text-sm text-gray-600">{addr.address}, {addr.city}, {addr.state} {addr.zipCode}</p>
                                {addr.isDefault && (
                                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-[#FF8C42] text-white rounded">
                                    Default
                                  </span>
                                )}
                              </div>
                              {selectedAddressId === addr.id && (
                                <span className="text-[#FF8C42] text-xl">✓</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUseNewAddress(true);
                          setSelectedAddressId(null);
                          setSaveAddress(true);
                          setShippingInfo({
                            fullName: '',
                            email: shippingInfo.email,
                            phone: '',
                            address: '',
                            city: '',
                            state: '',
                            zipCode: '',
                            country: 'United States'
                          });
                        }}
                        className="text-[#FF8C42] hover:underline font-semibold"
                      >
                        + Add New Address
                      </button>
                    </div>
                  )}
                  
                  {/* Show form only when adding new address or no saved addresses */}
                  {(useNewAddress || savedAddresses.length === 0) && (
                    <>
                      {savedAddresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setUseNewAddress(false);
                            const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
                            if (defaultAddr) selectAddress(defaultAddr);
                          }}
                          className="mb-4 text-sm text-gray-600 hover:text-[#FF8C42]"
                        >
                          ← Back to saved addresses
                        </button>
                      )}
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        {savedAddresses.length > 0 ? 'New Address' : 'Enter Shipping Address'}
                      </h3>
                    </>
                  )}
                  
                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    {(useNewAddress || savedAddresses.length === 0) && (
                    <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.fullName}
                          onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                        placeholder="+1 (234) 567-890"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                        placeholder="123 Mango Street"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                          placeholder="Miami"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                          placeholder="FL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                          placeholder="33101"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <input
                        id="save-address"
                        type="checkbox"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="h-4 w-4 text-[#FF8C42] border-gray-300 rounded focus:ring-[#FF8C42]"
                      />
                      <label htmlFor="save-address" className="text-sm text-gray-700">
                        Save this address to my account
                      </label>
                    </div>
                    </>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-[#FF8C42] hover:bg-[#FFA558] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition"
                    >
                      Continue to Payment →
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Step 2: Payment Information */}
              {step === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-[#3D4F42] mb-4 sm:mb-6">Payment Method</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-[#FF8C42]/10 to-[#3D4F42]/10 border-2 border-[#FF8C42] rounded-xl p-4 sm:p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl sm:text-3xl">💳</span>
                        <h3 className="text-lg sm:text-xl font-bold text-[#3D4F42]">Secure Payment with Razorpay</h3>
                      </div>
                      <p className="text-gray-700 mb-4">
                        Your payment will be processed securely through Razorpay, India's leading payment gateway.
                      </p>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white rounded-lg p-3 text-center">
                          <p className="text-sm font-semibold text-gray-700">💳 Credit/Debit Cards</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                          <p className="text-sm font-semibold text-gray-700">🏦 Net Banking</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                          <p className="text-sm font-semibold text-gray-700">📱 UPI</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                          <p className="text-sm font-semibold text-gray-700">👝 Wallets</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                      <span className="text-green-600 text-xl">🔒</span>
                      <div>
                        <p className="font-semibold text-gray-800 mb-1">100% Secure & Encrypted</p>
                        <p className="text-sm text-gray-700">
                          Your payment information is encrypted with 256-bit SSL. We never store your card details.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold transition text-sm sm:text-base"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 bg-[#FF8C42] hover:bg-[#FFA558] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold transition text-sm sm:text-base"
                      >
                        Review Order →
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review & Place Order */}
              {step === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Review Order Details */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#3D4F42] mb-6">Review Your Order</h2>
                    
                    {/* Shipping Details */}
                    <div className="mb-6 pb-6 border-b">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-[#3D4F42]">Shipping Address</h3>
                        <button
                          onClick={() => setStep(1)}
                          className="text-[#FF8C42] hover:underline text-sm font-semibold"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                        <p className="font-semibold text-base">{shippingInfo.fullName}</p>
                        <p className="text-sm">{shippingInfo.address}</p>
                        <p className="text-sm">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p className="text-sm mt-2">{shippingInfo.email}</p>
                        <p className="text-sm">{shippingInfo.phone}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6 pb-6 border-b">
                      <h3 className="text-lg font-bold text-[#3D4F42] mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {cart.map((item, index) => (
                          <div key={index} className="flex gap-4 bg-gray-50 rounded-lg p-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image 
                                src={item.img}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{item.name}</p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity || 1}</p>
                              <p className="text-[#FF8C42] font-bold">₹{item.price.toFixed(2)} each</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-800">₹{(item.price * (item.quantity || 1)).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-[#3D4F42] mb-3">Payment Method</h3>
                      <div className="bg-gradient-to-r from-[#FF8C42]/10 to-[#3D4F42]/10 border-2 border-[#FF8C42] rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">💳</span>
                          <p className="font-semibold text-gray-800">Razorpay Payment Gateway</p>
                        </div>
                        <p className="text-sm text-gray-600">You will be redirected to secure payment page after clicking "Place Order"</p>
                        <p className="text-xs text-gray-500 mt-2">Accepts: UPI, Cards, Net Banking, Wallets</p>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-bold text-[#3D4F42] mb-3">Order Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-700">
                          <span>Subtotal</span>
                          <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                          <span>Shipping</span>
                          <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                          <span>Tax (8%)</span>
                          <span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between text-xl font-bold text-[#3D4F42]">
                          <span>Total</span>
                          <span>₹{total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold transition text-sm sm:text-base"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={processingPayment}
                        className={`flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold transition text-sm sm:text-base ${
                          processingPayment
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {processingPayment ? '⏳ Processing...' : `🔒 Place Order - ₹${total.toFixed(2)}`}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-[#3D4F42] mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.img}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                      {step === 1 ? (
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => updateQuantity(item.name, (item.quantity || 1) - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-700 transition"
                          >
                            −
                          </button>
                          <span className="text-sm font-semibold text-gray-700 min-w-[20px] text-center">{item.quantity || 1}</span>
                          <button
                            onClick={() => updateQuantity(item.name, (item.quantity || 1) + 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-700 transition"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity || 1}</p>
                      )}
                      <p className="text-[#FF8C42] font-bold text-sm mt-1">₹{item.price.toFixed(2)}</p>
                    </div>
                    {step === 1 && (
                      <button
                        onClick={() => removeFromCart(item.name)}
                        className="text-red-500 hover:text-red-700 text-xs self-start"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {step === 1 && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear your entire cart?')) {
                      clearCart();
                    }
                  }}
                  className="w-full mb-4 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Clear Cart
                </button>
              )}

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold text-[#3D4F42]">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {subtotal < 50 && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    💡 Add <strong>₹{(50 - subtotal).toFixed(2)}</strong> more to get FREE shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
