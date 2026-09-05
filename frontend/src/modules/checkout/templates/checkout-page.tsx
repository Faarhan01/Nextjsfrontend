'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { SafeImage } from '@modules/common/components/safe-image';
import { 
  ShieldCheck, 
  Truck, 
  Lock, 
  CreditCard, 
  Check, 
  ArrowLeft, 
  ShoppingBag, 
  Tag, 
  Sparkles, 
  ChevronRight, 
  User, 
  MapPin, 
  CheckCircle2,
  Zap,
  Globe,
  FileText,
  Building2,
  Copy
} from 'lucide-react';
import { CartItem, UserProfile } from '@/types';
import { formatCurrency } from '@/utils/pricing';
import { sdk } from '@lib/sdk';
import { trackBeginCheckout, trackPurchase } from '@/utils/gtm';

interface CheckoutPageProps {
  cart: CartItem[];
  onClearCart: () => void;
  onNavigate: (page: string, params?: any) => void;
  themeColor: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  getThemeClasses: (color: string) => any;
  showToast: (msg: string) => void;
  currentUser: UserProfile | null;
  onOpenAuthModal?: () => void;
  freeShippingThreshold: number;
}

export default function CheckoutPage({
  cart,
  onClearCart,
  onNavigate,
  themeColor,
  getThemeClasses,
  showToast,
  currentUser,
  onOpenAuthModal,
  freeShippingThreshold
}: CheckoutPageProps) {
  const currentTheme = getThemeClasses(themeColor);

  // Step state: 1 = Delivery Details, 2 = Payment
  const [activeStep, setActiveStep] = useState<1 | 2>(1);

  // Form Fields State (South Africa Defaults)
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('+27 82 123 4567');
  
  const [firstName, setFirstName] = useState(currentUser?.name ? currentUser.name.split(' ')[0] : 'Sipho');
  const [lastName, setLastName] = useState(currentUser?.name && currentUser.name.split(' ').length > 1 ? currentUser.name.split(' ').slice(1).join(' ') : 'Dlamini');
  const [address, setAddress] = useState('142 Jan Smuts Avenue');
  const [apartment, setApartment] = useState('Suite 12');
  const [city, setCity] = useState('Rosebank, Johannesburg');
  const [stateProv, setStateProv] = useState('Gauteng');
  const [zipCode, setZipCode] = useState('2196');
  const [country, setCountry] = useState('South Africa');

  // Extra Info / Delivery Instructions
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'overnight'>('standard');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bankPayment' | 'applepay' | 'cod'>('bankPayment');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardName, setCardName] = useState(currentUser?.name || 'Sipho Dlamini');

  // Load configured bank details for EFT
  const bankDetails = useMemo(() => {
    try {
      const saved = localStorage.getItem('mrbulk_admin_bank_details') || localStorage.getItem('luxestore_admin_bank_details');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      bankName: 'First National Bank (FNB)',
      accountName: 'Mr Cheap General Dealer ZA (Mrbulk)',
      accountNumber: '62894102948',
      branchCode: '250655',
      accountType: 'Cheque Account',
      referenceInstructions: 'Use your Order Number as payment reference'
    };
  }, []);

  // Track GA4 begin_checkout event when entering checkout flow
  React.useEffect(() => {
    if (cart.length > 0) {
      trackBeginCheckout(cart, appliedPromoName || undefined, 'ZAR');
    }
  }, []);

  // Promo Code
  const [promoInput, setPromoInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [appliedPromoName, setAppliedPromoName] = useState<string>('');

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations (ZAR Currency)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let shippingCost = 0;
  if (shippingMethod === 'standard') {
    shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 150.00;
  } else if (shippingMethod === 'express') {
    shippingCost = 250.00;
  } else if (shippingMethod === 'overnight') {
    shippingCost = 450.00;
  }

  const taxAmount = Math.round(subtotal * 0.15 * 100) / 100; // 15% South Africa VAT
  const discountAmount = Math.round(subtotal * discountPercent * 100) / 100;
  const grandTotal = Math.max(0, subtotal + shippingCost + taxAmount - discountAmount);

  // Validate Step 1 and proceed to Payment
  const handleNextToPayment = () => {
    if (!email.trim()) {
      showToast('Please enter a valid email address.');
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      showToast('Please enter your full name.');
      return;
    }
    if (!address.trim() || !city.trim() || !zipCode.trim()) {
      showToast('Please complete your shipping address.');
      return;
    }
    setActiveStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Promo Application Handler
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoInput.trim().toUpperCase();
    if (!clean) return;

    if (clean === 'LUXE10' || clean === 'WELCOME10') {
      setDiscountPercent(0.10);
      setAppliedPromoName(clean);
      showToast(`Promo code "${clean}" applied! 10% discount saved.`);
    } else if (clean === 'LUXE20' || clean === 'VIP20') {
      setDiscountPercent(0.20);
      setAppliedPromoName(clean);
      showToast(`VIP Promo code "${clean}" applied! 20% discount saved.`);
    } else {
      showToast('Invalid promo code. Try "LUXE10" or "LUXE20"');
    }
  };

  // Order Placement (Step 2 Submission)
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeStep === 1) {
      handleNextToPayment();
      return;
    }

    if (cart.length === 0) {
      showToast('Your shopping cart is empty.');
      onNavigate('shop');
      return;
    }

    if (!email.trim()) {
      showToast('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedAddress = {
        name: `${firstName} ${lastName}`,
        street: `${address}${apartment ? `, ${apartment}` : ''}`,
        city,
        state: stateProv,
        zip: zipCode,
        country
      };

      const paymentMethodLabel = paymentMethod === 'card' 
        ? 'Credit / Debit Card' 
        : paymentMethod === 'bankPayment' 
        ? 'Bank Payment (Direct EFT)' 
        : paymentMethod === 'applepay' 
        ? 'Apple Pay / Google Pay' 
        : 'Pay on Delivery';

      // Call backend Medusa store API to create real order record (graceful offline fallback)
      let response: { type: 'order'; data: any } | null = null;
      try {
        const fresh = await sdk.carts.create({ region_id: 'reg_za' });
        const freshCart = fresh.cart;
        for (const c of cart) {
          await sdk.carts.lineItems.create(freshCart.id, {
            variant_id: `variant_${c.productId || c.id}`,
            quantity: c.quantity
          });
        }
        const completed = await sdk.carts.complete(freshCart.id);
        response = completed as any;
      } catch (err: any) {
        console.warn('Backend order sync skipped, using client order processing:', err);
        response = null;
      }

      const orderId = response?.data?.id
        ? String(response.data.id).replace(/^order_/, '').toUpperCase()
        : `LX-${Math.floor(10000 + Math.random() * 90000)}`;

      const newOrder = {
        id: orderId,
        date: new Date().toLocaleDateString('en-ZA', { month: 'long', day: 'numeric', year: 'numeric' }),
        total: `$${grandTotal.toFixed(2)}`,
        status: paymentMethod === 'bankPayment' ? 'Awaiting EFT Payment' : 'Processing',
        items: cart.map(c => ({
          id: c.id,
          name: c.name,
          qty: c.quantity,
          price: c.price,
          img: c.imageUrl,
          sellerId: c.sellerId || '849201',
          sellerName: c.sellerName,
          selectedOfferId: c.selectedOfferId,
          condition: c.condition
        })),
        shippingAddress: `${address}, ${apartment ? apartment + ', ' : ''}${city}, ${stateProv} ${zipCode}, ${country}`,
        deliveryNotes: deliveryInstructions,
        customerEmail: email,
        paymentMethod: paymentMethodLabel,
        steps: ['Ordered', 'Processed', 'Shipped', 'Delivered'],
        currentStep: 1
      };

      // Save to local storage for instant offline access
      try {
        const storageKey = currentUser ? `luxestore_orders_${currentUser.id}` : 'luxestore_orders_guest';
        const savedOrdersRaw = localStorage.getItem(storageKey);
        let existingOrders = savedOrdersRaw ? JSON.parse(savedOrdersRaw) : [];
        existingOrders = [newOrder, ...existingOrders];
        localStorage.setItem(storageKey, JSON.stringify(existingOrders));
      } catch (err) {
        console.error('Failed to save order to localStorage:', err);
      }

      // Trigger GA4 DataLayer 'purchase' event with schema parameters and deduplication
      trackPurchase({
        transaction_id: orderId,
        value: grandTotal,
        currency: 'ZAR',
        tax: taxAmount,
        shipping: shippingCost,
        coupon: appliedPromoName || undefined,
        items: cart.map(c => ({
          item_id: c.id,
          item_name: c.name,
          price: typeof c.price === 'number' ? c.price : parseFloat(String(c.price).replace(/[^0-9.]/g, '')) || 0,
          quantity: c.quantity,
          item_category: (c as any).category
        }))
      });

      setIsSubmitting(false);
      onClearCart();
      if (paymentMethod === 'bankPayment') {
        showToast(`Order #${orderId} created! Please make transfer using reference ${orderId}`);
      } else {
        showToast(`Order #${orderId} successfully placed! Thank you for your purchase.`);
      }

      onNavigate('order-tracking');
    } catch (err: any) {
      console.error('Checkout error:', err);
      showToast(err.message || 'Failed to process order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-28 sm:pb-20 pt-4 sm:pt-6">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('cart')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Cart
          </button>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <span className="text-slate-500 dark:text-slate-400 font-bold cursor-pointer" onClick={() => onNavigate('cart')}>Cart</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
            <span className="text-slate-900 dark:text-white font-extrabold">Checkout</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 text-hidden sm:inline" />
            <span className="hidden sm:inline">Confirmation</span>
          </div>
        </div>

        {/* Page Header */}
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Secure South Africa Checkout</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Complete your order with secure EFT Bank Transfer or Card checkout.</p>
        </div>

        {/* Empty Cart Redirect Notice */}
        {cart.length === 0 ? (
          <div className="card-base p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-base font-extrabold text-slate-800 dark:text-white">Your shopping cart is empty</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Add products to your cart before proceeding to checkout.</p>
            <button
              onClick={() => onNavigate('shop')}
              className={`px-6 py-3 rounded-xl text-white font-extrabold text-xs transition cursor-pointer shadow-md ${currentTheme.bg}`}
            >
              Explore Shop Catalog
            </button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* LEFT COLUMN: Steps Header & Step Contents (7 or 8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-5 sm:space-y-6">
              
              {/* STEPS INDICATOR CARD */}
              <div className="card-base p-3.5 sm:p-5">
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                  
                  {/* Step 1 Button */}
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className={`flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-2xl border text-left transition cursor-pointer ${
                      activeStep === 1
                        ? 'bg-slate-900 dark:bg-slate-700 text-white border-slate-900 dark:border-slate-600 shadow-md ring-2 ring-slate-900/15'
                        : 'bg-slate-50/80 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                      activeStep === 1 
                        ? 'bg-white text-slate-900' 
                        : activeStep === 2
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {activeStep === 2 ? <Check className="w-4 h-4 text-white" /> : '1'}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider ${
                        activeStep === 1 ? 'text-slate-300' : 'text-slate-400'
                      }`}>Step 1</p>
                      <p className="text-xs sm:text-sm font-extrabold truncate">Delivery Details</p>
                    </div>
                  </button>

                  {/* Step 2 Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!email.trim() || !address.trim()) {
                        showToast('Please complete delivery details before proceeding.');
                        return;
                      }
                      setActiveStep(2);
                    }}
                    className={`flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-2xl border text-left transition cursor-pointer ${
                      activeStep === 2
                        ? 'bg-slate-900 dark:bg-slate-700 text-white border-slate-900 dark:border-slate-600 shadow-md ring-2 ring-slate-900/15'
                        : 'bg-slate-50/80 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                      activeStep === 2 ? 'bg-white text-slate-900' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      2
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider ${
                        activeStep === 2 ? 'text-slate-300' : 'text-slate-400'
                      }`}>Step 2</p>
                      <p className="text-xs sm:text-sm font-extrabold truncate">Payment</p>
                    </div>
                  </button>

                </div>
              </div>

              {/* ================= STEP 1: DELIVERY DETAILS TAB ================= */}
              {activeStep === 1 && (
                <div className="space-y-5 sm:space-y-6">
                  
                  {/* 1. Contact Details */}
                  <div className="checkout-step-surface space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" /> Contact Details
                      </h3>
                      {!currentUser && onOpenAuthModal && (
                        <button
                          type="button"
                          onClick={onOpenAuthModal}
                          className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                        >
                          Sign In
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="sipho.dlamini@example.co.za"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          Phone Number (for Courier SMS) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+27 82 123 4567"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Shipping Address */}
                  <div className="checkout-step-surface space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                      <MapPin className="w-4 h-4 text-rose-500" /> South Africa Shipping Address
                    </h3>

                    <div className="space-y-3.5 sm:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                            First Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="e.g. 142 Jan Smuts Avenue"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                            Complex / Unit #
                          </label>
                          <input
                            type="text"
                            value={apartment}
                            onChange={(e) => setApartment(e.target.value)}
                            placeholder="Suite 12"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm sm:text-xs font-semibold text-slate-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                            City / Suburb *
                          </label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Rosebank, Johannesburg"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm sm:text-xs font-semibold text-slate-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                            Province *
                          </label>
                          <select
                            value={stateProv}
                            onChange={(e) => setStateProv(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm sm:text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
                          >
                            <option value="Gauteng">Gauteng</option>
                            <option value="Western Cape">Western Cape</option>
                            <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                            <option value="Eastern Cape">Eastern Cape</option>
                            <option value="Free State">Free State</option>
                            <option value="Mpumalanga">Mpumalanga</option>
                            <option value="Limpopo">Limpopo</option>
                            <option value="North West">North West</option>
                            <option value="Northern Cape">Northern Cape</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                            Postal Code *
                          </label>
                          <input
                            type="text"
                            required
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            placeholder="2196"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm sm:text-xs font-semibold text-slate-800 dark:text-white font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          Country *
                        </label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
                        >
                          <option value="South Africa">South Africa (RSA)</option>
                          <option value="Namibia">Namibia</option>
                          <option value="Botswana">Botswana</option>
                          <option value="Zimbabwe">Zimbabwe</option>
                          <option value="Mozambique">Mozambique</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United States">United States</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 3. Delivery Method */}
                  <div className="checkout-step-surface space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                      <Truck className="w-4 h-4 text-amber-500" /> Courier Delivery Method
                    </h3>

                    <div className="space-y-3">
                      <label
                        onClick={() => setShippingMethod('standard')}
                        className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition select-none ${
                          shippingMethod === 'standard'
                            ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 ring-1 ring-rose-200 dark:ring-rose-900'
                            : 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingMethod === 'standard'}
                            onChange={() => setShippingMethod('standard')}
                            className="accent-rose-600 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">Standard Door Courier</p>
                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Delivered nationwide in 3-5 business days</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white shrink-0 ml-2">
                          {subtotal >= freeShippingThreshold ? 'FREE' : 'R150.00'}
                        </span>
                      </label>

                      <label
                        onClick={() => setShippingMethod('express')}
                        className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition select-none ${
                          shippingMethod === 'express'
                            ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 ring-1 ring-rose-200 dark:ring-rose-900'
                            : 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingMethod === 'express'}
                            onChange={() => setShippingMethod('express')}
                            className="accent-rose-600 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">Express Priority Courier</p>
                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">1-2 business days with live SMS tracking</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white shrink-0 ml-2">R250.00</span>
                      </label>

                      <label
                        onClick={() => setShippingMethod('overnight')}
                        className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition select-none ${
                          shippingMethod === 'overnight'
                            ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 ring-1 ring-rose-200 dark:ring-rose-900'
                            : 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingMethod === 'overnight'}
                            onChange={() => setShippingMethod('overnight')}
                            className="accent-rose-600 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">Overnight Main Centre VIP</p>
                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Guaranteed next morning delivery to JHB/CPT/DBN</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white shrink-0 ml-2">R450.00</span>
                      </label>
                    </div>
                  </div>

                  {/* 4. Extra Info Card */}
                  <div className="checkout-step-surface space-y-3">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                      <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" /> Delivery Instructions
                    </h3>
                    <div>
                      <textarea
                        rows={3}
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        placeholder="e.g. Leave package at security estate gate, code #1234, call prior to delivery..."
                        className="w-full bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-blue-500 rounded-xl p-3 text-xs font-semibold text-slate-800 dark:text-white resize-none"
                      />
                      <p className="text-[11px] font-medium text-slate-400 mt-1">
                        Optional instructions for the courier or estate security.
                      </p>
                    </div>
                  </div>

                  {/* Step 1 Bottom Action */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleNextToPayment}
                      className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${currentTheme.bg}`}
                    >
                      <span>Proceed to Payment</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {/* ================= STEP 2: PAYMENT TAB ================= */}
              {activeStep === 2 && (
                <div className="space-y-5 sm:space-y-6">
                  
                  {/* Express Payment Quick Bar */}
                  <div className="checkout-step-surface space-y-3">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> Fast Checkout Methods
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('bankPayment');
                          showToast('Selected Direct Bank EFT Transfer.');
                        }}
                        className={`py-2.5 px-2.5 rounded-xl font-extrabold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer shadow-2xs ${
                          paymentMethod === 'bankPayment' ? 'bg-blue-700 text-white' : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5 text-blue-300" />
                        <span className="truncate">Bank EFT</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('card');
                          showToast('Selected Credit/Debit Card.');
                        }}
                        className={`py-2.5 px-2.5 rounded-xl font-extrabold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer shadow-2xs ${
                          paymentMethod === 'card' ? 'bg-blue-700 text-white' : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5 text-blue-300" />
                        <span className="truncate">Card</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('applepay');
                          showToast('Selected Apple / Google Pay.');
                        }}
                        className="py-2.5 px-2.5 rounded-xl bg-black hover:bg-slate-900 text-white font-extrabold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer shadow-2xs"
                      >
                        <span> / G Pay</span>
                      </button>
                    </div>
                  </div>

                  {/* Card 1: Payment Type */}
                  <div className="checkout-step-surface space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                      <CreditCard className="w-4 h-4 text-blue-600" /> Select Payment Method
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      
                      {/* Bank Payment Option (EFT) */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bankPayment')}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col items-start justify-between gap-3 ${
                          paymentMethod === 'bankPayment'
                            ? 'bg-blue-950 text-white border-blue-900 shadow-sm ring-2 ring-blue-900/30'
                            : 'bg-slate-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <Building2 className={`w-5 h-5 ${paymentMethod === 'bankPayment' ? 'text-blue-400' : 'text-slate-600 dark:text-slate-400'}`} />
                        <div>
                          <p className="text-xs font-extrabold">Bank Payment</p>
                          <p className={`text-[10px] ${paymentMethod === 'bankPayment' ? 'text-blue-300' : 'text-slate-500 dark:text-slate-400'}`}>Direct EFT Transfer</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col items-start justify-between gap-3 ${
                          paymentMethod === 'card'
                            ? 'bg-slate-900 dark:bg-slate-700 text-white border-slate-900 dark:border-slate-600 shadow-sm ring-2 ring-slate-900/10'
                            : 'bg-slate-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <div>
                          <p className="text-xs font-extrabold">Credit / Debit</p>
                          <p className={`text-[10px] ${paymentMethod === 'card' ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>Visa, Mastercard</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('applepay')}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col items-start justify-between gap-3 ${
                          paymentMethod === 'applepay'
                            ? 'bg-black text-white border-black shadow-sm ring-2 ring-black/20'
                            : 'bg-slate-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span className="text-sm font-black"> / G Pay</span>
                        <div>
                          <p className="text-xs font-extrabold">Mobile Pay</p>
                          <p className={`text-[10px] ${paymentMethod === 'applepay' ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>Biometric Wallet</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col items-start justify-between gap-3 ${
                          paymentMethod === 'cod'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-600/20'
                            : 'bg-slate-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <Truck className="w-5 h-5" />
                        <div>
                          <p className="text-xs font-extrabold">Pay on Arrival</p>
                          <p className={`text-[10px] ${paymentMethod === 'cod' ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>Cash or Card</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Payment Details */}
                  <div className="checkout-step-surface space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Payment Details & Instructions
                    </h3>

                    {/* Bank Payment Details Card */}
                    {paymentMethod === 'bankPayment' && (
                      <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 text-white rounded-2xl border border-blue-700/60 shadow-md space-y-4">
                        <div className="flex items-center justify-between border-b border-blue-800/60 pb-3">
                          <div className="flex items-center gap-2.5">
                            <Building2 className="w-5 h-5 text-blue-400 shrink-0" />
                            <div>
                              <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-200">Electronic Funds Transfer (EFT) Details</h4>
                              <p className="text-[11px] text-slate-400">Transfer payment directly to our South African bank account.</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black rounded-full uppercase shrink-0">
                            Verified SA Account
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Bank Name</span>
                            <span className="font-extrabold text-white text-xs">{bankDetails.bankName}</span>
                          </div>
                          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Account Holder</span>
                            <span className="font-extrabold text-white text-xs">{bankDetails.accountName}</span>
                          </div>
                          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">Account Number</span>
                              <span className="font-mono font-extrabold text-blue-300 text-sm">{bankDetails.accountNumber}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(bankDetails.accountNumber);
                                showToast('Account number copied to clipboard!');
                              }}
                              className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
                              title="Copy Account Number"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Branch Code</span>
                            <span className="font-mono font-extrabold text-white text-xs">{bankDetails.branchCode} ({bankDetails.accountType || 'Cheque'})</span>
                          </div>
                        </div>

                        <div className="p-3 bg-blue-900/40 border border-blue-700/50 rounded-xl text-xs space-y-1">
                          <p className="font-extrabold text-blue-200">EFT Payment Reference Rule:</p>
                          <p className="text-[11px] text-blue-300/90">{bankDetails.referenceInstructions || 'Please use your Order Number as payment reference when making your bank transfer.'}</p>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4532 •••• •••• 8888"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                              Expiration Date *
                            </label>
                            <input
                              type="text"
                              required
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                              Security Code (CVC) *
                            </label>
                            <input
                              type="password"
                              required
                              maxLength={4}
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="123"
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                            Name on Card *
                          </label>
                          <input
                            type="text"
                            required
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-white"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'applepay' && (
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                        <p className="font-extrabold">Apple Pay / Google Pay Biometric Authorization</p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">Double click side button or scan fingerprint/Face ID upon placing your order.</p>
                      </div>
                    )}

                    {paymentMethod === 'cod' && (
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
                        <p className="font-extrabold">Pay on Delivery Authorization</p>
                        <p className="text-[11px] text-emerald-800 dark:text-emerald-400">Payment will be collected by courier in cash or card tap upon delivery arrival.</p>
                      </div>
                    )}
                  </div>

                  {/* Step 2 Back Action */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Return to Delivery Details
                    </button>
                  </div>

                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Order Summary Card (4 or 5 cols) */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
              
              <div className="order-summary-surface space-y-5">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <span>Order Summary</span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
                </h3>

                {/* Items List */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-none">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 overflow-hidden shrink-0">
                        <SafeImage src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} placeholderType="product" fallbackTitle={item.name} />
                        <span className="absolute top-0 right-0 bg-slate-900 dark:bg-slate-600 text-white font-black text-[9px] w-4 h-4 rounded-bl-lg flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{item.name}</h4>
                        <p className="text-[11px] text-slate-400 font-medium">{formatCurrency(item.price)} each</p>
                        {item.sellerName && (
                          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold truncate">
                            Merchant: {item.sellerName} {item.condition && `(${item.condition})`}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white shrink-0">
                        R{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo Code Form */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. LUXE20)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-blue-500 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white uppercase placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-extrabold text-xs rounded-xl transition cursor-pointer border border-slate-700 dark:border-slate-600"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromoName && (
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Code "{appliedPromoName}" applied ({discountPercent * 100}% off)
                    </p>
                  )}
                </div>

                {/* Subtotal & Breakdown */}
                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900 dark:text-white">R{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Shipping ({shippingMethod})</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {shippingCost === 0 ? 'FREE' : `R${shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Estimated SA VAT (15%)</span>
                    <span className="font-bold text-slate-900 dark:text-white">R{taxAmount.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Promo Discount</span>
                      <span>-R{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm">
                    <span className="font-extrabold text-slate-900 dark:text-white">Grand Total</span>
                    <span className="font-black text-slate-900 dark:text-white text-base sm:text-lg">R{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit / Proceed Button */}
                {activeStep === 1 ? (
                  <button
                    type="button"
                    onClick={handleNextToPayment}
                    className={`w-full py-4 rounded-2xl text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${currentTheme.bg} ${currentTheme.shadow}`}
                  >
                    <span>Proceed to Payment</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-2xl text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${currentTheme.bg} ${currentTheme.shadow}`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating Order...</span>
                      </div>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Place Order • R{grandTotal.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                )}

                {/* Trust Badges */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Encrypted 256-bit SSL Protection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Courier Door Delivery with Instant SMS Updates</span>
                  </div>
                </div>

              </div>

            </div>

          </form>
        )}

      </div>

      {/* Mobile Sticky Action Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-3 sm:hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 z-30 shadow-xl flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grand Total</p>
            <p className="text-base font-black text-slate-900 dark:text-white">R{grandTotal.toFixed(2)}</p>
          </div>
          {activeStep === 1 ? (
            <button
              type="button"
              onClick={handleNextToPayment}
              className={`px-5 py-3 rounded-xl text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition active:scale-98 cursor-pointer flex items-center gap-1.5 ${currentTheme.bg}`}
            >
              <span>Next: Payment</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className={`px-5 py-3 rounded-xl text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition active:scale-98 cursor-pointer flex items-center gap-1.5 ${currentTheme.bg}`}
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Place Order</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
