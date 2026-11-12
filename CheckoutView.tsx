import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CheckCircle,
  CreditCard,
  Lock,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Smartphone,
  MapPin,
  Gift,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';
import { formatINR } from '../utils/currency';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    appliedCoupon,
    placeOrder,
    setActiveView,
    setTrackedOrder,
    user,
  } = useShop();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [courierSpeed, setCourierSpeed] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');

  // Shipping Form State
  const defaultAddr = user.savedAddresses[0];
  const [fullName, setFullName] = useState(user.name || 'Radhika Singhania');
  const [phone, setPhone] = useState(user.phone || '+91 98201 91600');
  const [email, setEmail] = useState(user.email || 'radhika@jmkjew.com');
  const [street, setStreet] = useState(defaultAddr?.street || 'Villa 18, Altamount Road');
  const [city, setCity] = useState(defaultAddr?.city || 'Mumbai');
  const [stateName, setStateName] = useState(defaultAddr?.state || 'Maharashtra');
  const [postalCode, setPostalCode] = useState(defaultAddr?.postalCode || '400026');
  const [country] = useState('India');

  // Payment Form State
  const [upiId, setUpiId] = useState('radhika@oksbi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8842');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('•••');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const expressCourierFee = courierSpeed === 'express' ? 99 : 0;
  const baseShipping = cartSubtotal >= 999 || cartSubtotal === 0 ? 0 : 99;
  const finalShipping = baseShipping + expressCourierFee;
  const finalTotal = Math.max(0, cartSubtotal - cartDiscount + finalShipping);

  const handleCompleteOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const order = placeOrder({
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: {
          street,
          city,
          state: stateName,
          postalCode,
          country,
        },
        paymentMethod:
          paymentMethod === 'upi'
            ? `UPI Instant Transfer (${upiId})`
            : paymentMethod === 'card'
            ? 'Credit / Debit Card (Verified 3D Secure OTP)'
            : paymentMethod === 'netbanking'
            ? 'Net Banking Instant Transfer'
            : 'Cash on Delivery (Verified Handover)',
        carrier:
          courierSpeed === 'express'
            ? 'Blue Dart Priority Air Express'
            : 'Delhivery Surface Express',
        total: finalTotal,
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#dfb150', '#f6dd8d', '#ffffff', '#c5973b'],
        });
      } catch (e) {
        console.error(e);
      }

      setCompletedOrder(order);
      setTrackedOrder(order);
      setIsSubmitting(false);
    }, 1200);
  };

  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#dfb150] to-[#c5973b] p-[2px] mx-auto shadow-[0_0_30px_rgba(223,177,80,0.5)]">
          <div className="w-full h-full rounded-full bg-[#0a0a0d] flex items-center justify-center text-[#dfb150]">
            <CheckCircle className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#dfb150] font-bold">
            Order Confirmed Successfully
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Thank You, {completedOrder.customerName}
          </h1>
          <p className="text-zinc-300 text-sm max-w-lg mx-auto font-light leading-relaxed">
            Your jewellery order has been received. Our team will perform final quality inspection, wrap your pieces in signature velvet keepsake boxes, and dispatch via express courier.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-6 rounded-2xl bg-[#121217] border border-[#dfb150]/30 text-left space-y-4 max-w-xl mx-auto">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <p className="text-xs text-zinc-400">Order Number</p>
              <p className="font-serif text-lg font-bold text-amber-200">
                {completedOrder.orderNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-400">Tracking Code</p>
              <p className="font-mono text-xs font-semibold text-white">
                {completedOrder.trackingCode}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-zinc-400">Delivery To:</span>
              <p className="text-white font-medium mt-0.5">
                {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state}
              </p>
            </div>
            <div>
              <span className="text-zinc-400">Courier Partner:</span>
              <p className="text-white font-medium mt-0.5">{completedOrder.carrier}</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-3 flex justify-between items-center">
            <span className="text-xs text-zinc-400">Total Paid</span>
            <span className="text-lg font-bold text-[#dfb150]">
              {formatINR(completedOrder.total)}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => setActiveView('order-tracking')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg cursor-pointer"
          >
            Track Order Live
          </button>
          <button
            onClick={() => setActiveView('catalog')}
            className="px-6 py-3 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold hover:border-[#dfb150] transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-[#dfb150] mx-auto opacity-70" />
        <h2 className="font-serif text-2xl font-bold text-white">Your Bag is Empty</h2>
        <p className="text-xs text-zinc-400">Please select fashion jewellery pieces before checking out.</p>
        <button
          onClick={() => setActiveView('catalog')}
          className="px-6 py-3 rounded-xl bg-[#dfb150] text-black font-semibold text-xs uppercase tracking-wider"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#dfb150] font-semibold">
          Fast & Secure Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
          Complete Your Order
        </h1>
        <p className="text-xs text-zinc-400">
          Encrypted 256-bit checkout • Anti-Tarnish Guarantee • Express Delivery Across India
        </p>
      </div>

      {/* Checkout Stepper */}
      <div className="max-w-3xl mx-auto flex items-center justify-between border-b border-white/10 pb-4">
        {[
          { num: 1, label: 'Delivery Address' },
          { num: 2, label: 'Delivery Speed' },
          { num: 3, label: 'Payment Method' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num as any)}
            className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              step === s.num
                ? 'text-[#dfb150] border-b-2 border-[#dfb150] pb-2 -mb-4'
                : step > s.num
                ? 'text-zinc-300'
                : 'text-zinc-600'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === s.num
                  ? 'bg-[#dfb150] text-black font-bold'
                  : step > s.num
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {s.num}
            </span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Main Grid: Form on Left, Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Interactive Step Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: DELIVERY ADDRESS */}
          {step === 1 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#121217] border border-[#dfb150]/20 space-y-5 animate-in fade-in">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#dfb150]" />
                <span>Shipping Address in India</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-[#dfb150]"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                    Mobile Number (For Delivery SMS & OTP)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-[#dfb150]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                  Email Address (For Invoices & Order Tracking)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-[#dfb150]"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                  Street Address / House / Flat Number
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-[#dfb150]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5 font-medium">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-[#dfb150]"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5 font-medium">State</label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-[#dfb150]"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5 font-medium">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-[#dfb150]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Continue to Delivery Speed</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: COURIER SPEED & PACKAGING */}
          {step === 2 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#121217] border border-[#dfb150]/20 space-y-6 animate-in fade-in">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#dfb150]" />
                <span>Express Delivery Speed & Packaging</span>
              </h3>

              <div className="space-y-3">
                <div
                  onClick={() => setCourierSpeed('standard')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                    courierSpeed === 'standard'
                      ? 'bg-[#dfb150]/15 border-[#dfb150] shadow-md'
                      : 'bg-black/40 border-white/10'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-white text-sm">
                        Delhivery Surface Express
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 font-semibold border border-emerald-500/30">
                        {cartSubtotal >= 999 ? 'Complimentary' : '₹99'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Standard express courier delivery in 3 - 5 business days across India with SMS updates.
                    </p>
                  </div>
                  <span className="font-bold text-white text-sm">
                    {cartSubtotal >= 999 ? '₹0' : '₹99'}
                  </span>
                </div>

                <div
                  onClick={() => setCourierSpeed('express')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                    courierSpeed === 'express'
                      ? 'bg-[#dfb150]/15 border-[#dfb150] shadow-md'
                      : 'bg-black/40 border-white/10'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-white text-sm">
                        Blue Dart Priority Air Express
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 font-semibold border border-amber-500/30">
                        Priority Air
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Air courier dispatch with premium handling. Estimated delivery in 24 - 48 hours in metro cities.
                    </p>
                  </div>
                  <span className="font-bold text-white text-sm">
                    {cartSubtotal >= 999 ? '+₹99' : '+₹198'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-amber-200 font-semibold">
                  <Gift className="w-4 h-4 text-[#dfb150]" />
                  <span>JMK Signature Velvet Packaging</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Every order arrives in our protective jewellery box, anti-tarnish storage ziplock pouch, and microfiber cleaning cloth.
                </p>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-5 rounded-xl bg-black border border-white/10 text-xs text-zinc-300 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Continue to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 3 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#121217] border border-[#dfb150]/20 space-y-6 animate-in fade-in">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#dfb150]" />
                <span>Secure Payment Gateway (INR)</span>
              </h3>

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'upi', label: 'UPI Instant' },
                  { id: 'card', label: 'Credit / Debit Card' },
                  { id: 'netbanking', label: 'Net Banking' },
                  { id: 'cod', label: 'Cash on Delivery' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      paymentMethod === m.id
                        ? 'bg-[#dfb150] text-black font-bold border-[#dfb150]'
                        : 'bg-black/40 border-white/10 text-zinc-400'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* UPI Instant */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4 p-5 rounded-2xl bg-black/50 border border-white/10">
                  <div className="flex items-center gap-2 text-xs text-amber-200 font-semibold">
                    <Smartphone className="w-4 h-4 text-[#dfb150]" />
                    <span>Instant UPI Payment (GPay / PhonePe / Paytm / BHIM)</span>
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Enter your UPI VPA ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="mobile@upi or username@okhdfcbank"
                      className="w-full p-2.5 text-xs rounded-xl bg-black border border-white/10 text-white font-mono focus:border-[#dfb150]"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    A payment request for {formatINR(finalTotal)} will be sent to your UPI app with 256-bit bank grade encryption.
                  </p>
                </div>
              )}

              {/* Credit / Debit Cards */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 p-4 rounded-2xl bg-black/50 border border-white/10">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Card Number (RuPay / Visa / Mastercard)</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-black border border-white/10 text-white font-mono focus:border-[#dfb150]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg bg-black border border-white/10 text-white font-mono focus:border-[#dfb150]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">CVV</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg bg-black border border-white/10 text-white font-mono focus:border-[#dfb150]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="p-4 rounded-2xl bg-black text-xs space-y-2 border border-white/10 text-zinc-300">
                  <p className="font-bold text-amber-200">Supported Net Banking Gateways:</p>
                  <p>HDFC Bank • ICICI Bank • State Bank of India • Axis Bank • Kotak Mahindra Bank</p>
                  <p>Secure redirect via RBI approved payment gateway.</p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 rounded-2xl bg-black text-xs space-y-2 border border-white/10 text-zinc-300">
                  <p className="font-bold text-amber-200">Cash on Delivery Available:</p>
                  <p>Pay with cash or UPI QR code directly to the courier agent upon doorstep delivery.</p>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-5 rounded-xl bg-black border border-white/10 text-xs text-zinc-300 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCompleteOrder}
                  className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black font-extrabold text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-[0_0_25px_rgba(223,177,80,0.5)] flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? 'Processing Order...' : `Pay ${formatINR(finalTotal)}`}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0e0e12] border border-[#dfb150]/25 shadow-xl space-y-5 sticky top-28">
          <h3 className="font-serif text-lg font-bold text-white flex items-center justify-between border-b border-white/10 pb-3">
            <span>Order Summary</span>
            <span className="text-xs text-zinc-400 font-normal">{cart.length} item{cart.length === 1 ? '' : 's'}</span>
          </h3>

          {/* Items list */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={`${item.product.id}-${item.selectedPlating}`} className="flex gap-3 text-xs">
                <img
                  src={item.product.images[0]}
                  alt=""
                  className="w-14 h-14 rounded-lg object-cover bg-black border border-white/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{item.product.name}</p>
                  <p className="text-[11px] text-[#dfb150]">
                    {item.selectedPlating} • Qty {item.quantity}
                  </p>
                  {item.giftWrap && (
                    <span className="text-[10px] text-amber-200">
                      + Velvet Keepsake Gift Box (₹149)
                    </span>
                  )}
                </div>
                <span className="font-bold text-white">
                  {formatINR(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Calculation Breakdown */}
          <div className="space-y-2 text-xs border-t border-white/10 pt-3">
            <div className="flex justify-between text-zinc-300">
              <span>Subtotal</span>
              <span>{formatINR(cartSubtotal)}</span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Discount Voucher ({appliedCoupon})</span>
                <span>-{formatINR(cartDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-300">
              <span>Express Delivery</span>
              <span className={finalShipping === 0 ? 'text-amber-300 font-semibold' : 'text-white'}>
                {finalShipping === 0 ? 'Complimentary' : formatINR(finalShipping)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
              <span>Total Payable</span>
              <span className="text-[#dfb150]">{formatINR(finalTotal)}</span>
            </div>
          </div>

          <div className="text-[10px] text-zinc-500 space-y-1 pt-2 border-t border-white/5">
            <p className="flex items-center gap-1.5 text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#dfb150]" />
              <span>Anti-Tarnish Guarantee & 7-Day Easy Doorstep Exchange</span>
            </p>
            <p>100% skin-safe, nickel-free & lead-free tested artificial jewellery.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
