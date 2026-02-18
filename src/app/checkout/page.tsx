'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

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
    
    // Save new address to database if user is adding a new one
    if (useNewAddress && !selectedAddressId) {
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

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    try {
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
        return;
      }
      
      // Prepare order items with productId
      const orderItems = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity || 1,
        price: item.price,
      }));
      
      console.log('Placing order with items:', orderItems);

      // Save order to database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.id,
          items: orderItems,
          shipping: shippingInfo,
          subtotal: subtotal,
          shippingCost: shipping,
          tax: tax,
          total: total,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderNumber(data.order.orderNumber);
        setOrderPlaced(true);
        clearCart();
        
        // Also save to localStorage as backup
        const order = {
          orderNumber: data.order.orderNumber,
          date: new Date().toISOString(),
          items: cart,
          total: total,
          shipping: shippingInfo,
          status: 'processing'
        };
        
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        localStorage.setItem('orders', JSON.stringify([...existingOrders, order]));
      } else {
        const error = await response.json();
        console.error('Order creation failed:', error);
        console.error('Order data sent:', { orderItems, userData: userData.id });
        alert(`Failed to place order: ${error.error || 'Unknown error'}. Please check that products are still available.`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again or clear your cart and add products fresh from the homepage.');
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
                className="block w-full bg-[#FF8C42] hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold transition"
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
            className="inline-block bg-[#FF8C42] hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold transition"
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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <span className="text-3xl">🥭</span>
            <h1 className="text-xl font-bold text-[#FF8C42]">Mango Fresh Farm</h1>
          </Link>
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

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
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
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-[#3D4F42] mb-6">Shipping Information</h2>
                  
                  {/* Saved Addresses */}
                  {savedAddresses.length > 0 && !useNewAddress && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">Select Saved Address</h3>
                      <div className="space-y-3 mb-4">
                        {savedAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => selectAddress(addr)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                              selectedAddressId === addr.id
                                ? 'border-[#FF8C42] bg-orange-50'
                                : 'border-gray-200 hover:border-[#FF8C42]/50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-gray-800">{addr.fullName}</p>
                                <p className="text-sm text-gray-600">{addr.phone}</p>
                                <p className="text-sm text-gray-600">{addr.address}, {addr.city}, {addr.state} {addr.zipCode}</p>
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
                    </div>                    </>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-[#FF8C42] hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition"
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
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-[#3D4F42] mb-6">Payment Information</h2>
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentInfo.cardName}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentInfo.expiry}
                          onChange={(e) => setPaymentInfo({...paymentInfo, expiry: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                      <span className="text-green-600 text-xl">🔒</span>
                      <p className="text-sm text-gray-700">
                        Your payment information is encrypted and secure. We never store your card details.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-4 rounded-lg font-bold transition"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-[#FF8C42] hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold transition"
                      >
                        Review Order →
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 3: Review & Place Order */}
              {step === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Shipping Details */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-[#3D4F42]">Shipping Address</h3>
                      <button
                        onClick={() => setStep(1)}
                        className="text-[#FF8C42] hover:underline text-sm font-semibold"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-gray-700">
                      <p className="font-semibold">{shippingInfo.fullName}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                      <p className="mt-2">{shippingInfo.email}</p>
                      <p>{shippingInfo.phone}</p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-[#3D4F42]">Payment Method</h3>
                      <button
                        onClick={() => setStep(2)}
                        className="text-[#FF8C42] hover:underline text-sm font-semibold"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-gray-700">
                      <p>Card ending in ****{paymentInfo.cardNumber.slice(-4)}</p>
                      <p className="text-sm text-gray-500">Expires {paymentInfo.expiry}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-4 rounded-lg font-bold transition"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold transition"
                    >
                      Place Order - ${total.toFixed(2)}
                    </button>
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
                  <div key={index} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.img}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                      <p className="text-[#FF8C42] font-bold">${item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.name)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              
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

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold text-[#3D4F42]">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {subtotal < 50 && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    💡 Add <strong>${(50 - subtotal).toFixed(2)}</strong> more to get FREE shipping!
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
