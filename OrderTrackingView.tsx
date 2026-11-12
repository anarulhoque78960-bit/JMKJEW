import React, { useState } from 'react';
import {
  Package,
  Truck,
  ShieldCheck,
  CheckCircle,
  Search,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus } from '../types';
import { formatINR } from '../utils/currency';

export const OrderTrackingView: React.FC = () => {
  const { orders, trackedOrder, setTrackedOrder, trackOrderById, setActiveView } = useShop();

  const [searchCode, setSearchCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const activeOrder: Order | null = trackedOrder || orders[0] || null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!searchCode.trim()) return;

    const found = trackOrderById(searchCode.trim());
    if (!found) {
      setErrorMessage(`No shipment found matching "${searchCode}". Try one of the sample orders below.`);
    }
  };

  const steps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'Confirmed', label: 'Order Confirmed', desc: 'Payment verified & order created' },
    { status: 'Handcraft Quality Check', label: 'Quality Check', desc: 'Stone setting & anti-tarnish finish inspection' },
    { status: 'Velvet Gift Packaging', label: 'Velvet Packaging', desc: 'Sealed in velvet box with care guide' },
    { status: 'Dispatched', label: 'In Transit', desc: 'Dispatched via express courier with live tracking' },
    { status: 'Delivered', label: 'Delivered', desc: 'Safely delivered at your doorstep' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmed': return 0;
      case 'Handcraft Quality Check': return 1;
      case 'Velvet Gift Packaging': return 2;
      case 'Dispatched': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = activeOrder ? getStepIndex(activeOrder.status) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#dfb150] font-semibold">
          Live Shipment Status
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
          Track Your Jewellery Order
        </h1>
        <p className="text-xs text-zinc-400">
          Real-time tracking for express courier deliveries across India
        </p>
      </div>

      {/* Lookup Bar */}
      <div className="p-6 rounded-3xl bg-[#121217] border border-[#dfb150]/20 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Enter Order # (e.g. JMK-89421) or Tracking Code..."
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-black border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#dfb150]"
            />
          </div>
          <button
            type="submit"
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all cursor-pointer shadow-lg shrink-0"
          >
            Track Order
          </button>
        </form>

        {errorMessage && (
          <p className="text-xs text-rose-400 mt-2.5 text-center">{errorMessage}</p>
        )}

        {/* Quick select from existing orders */}
        {orders.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2 flex-wrap text-xs">
            <span className="text-zinc-500 text-[11px]">Quick inspect your orders:</span>
            <div className="flex gap-2 flex-wrap">
              {orders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setTrackedOrder(o)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                    activeOrder?.id === o.id
                      ? 'bg-[#dfb150] text-black font-bold'
                      : 'bg-black/60 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {o.orderNumber} ({o.status})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Order Live Tracker */}
      {activeOrder ? (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0f0f13] border border-[#dfb150]/30 shadow-2xl space-y-8">
          {/* Header Strip */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#dfb150]/20 text-[#fbe8aa] border border-[#dfb150]/40">
                  Status: {activeOrder.status}
                </span>
                <span className="text-xs text-zinc-400">
                  Ordered on {new Date(activeOrder.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white mt-1">
                Order {activeOrder.orderNumber}
              </h2>
            </div>

            <div className="text-left md:text-right">
              <p className="text-xs text-zinc-400">Courier & AWB Number</p>
              <p className="font-mono text-xs text-emerald-400 font-bold">
                {activeOrder.carrier} • {activeOrder.trackingCode}
              </p>
              <p className="text-xs text-amber-200 mt-0.5">
                Estimated Delivery: {activeOrder.estimatedDelivery}
              </p>
            </div>
          </div>

          {/* Stepper Milestones */}
          <div className="relative">
            {/* Desktop Horizontal Milestone Bar */}
            <div className="hidden md:grid grid-cols-5 gap-2 relative z-10">
              {steps.map((s, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={s.status} className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#dfb150] text-black ring-4 ring-[#dfb150]/30 shadow-[0_0_15px_rgba(223,177,80,0.5)]'
                          : isPassed
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                          : 'bg-zinc-900 border border-white/10 text-zinc-600'
                      }`}
                    >
                      {isPassed && !isCurrent ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isCurrent ? 'text-amber-200' : isPassed ? 'text-white' : 'text-zinc-500'}`}>
                        {s.label}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Connecting Progress Line */}
            <div className="hidden md:block absolute top-5 left-10 right-10 h-0.5 bg-zinc-800 -z-0">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-[#dfb150] transition-all duration-700"
                style={{ width: `${(currentStepIdx / 4) * 100}%` }}
              />
            </div>

            {/* Mobile Vertical Stepper */}
            <div className="md:hidden space-y-4">
              {steps.map((s, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={s.status} className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-[#dfb150] text-black font-bold'
                          : isPassed
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {isPassed && !isCurrent ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs">{idx + 1}</span>}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isCurrent ? 'text-amber-200' : isPassed ? 'text-white' : 'text-zinc-500'}`}>
                        {s.label}
                      </p>
                      <p className="text-[11px] text-zinc-400">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipment Items & Details */}
          <div className="border-t border-white/10 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Items */}
            <div>
              <h4 className="font-serif text-sm font-bold text-white mb-3">
                Items in This Package
              </h4>
              <div className="space-y-3">
                {activeOrder.items.map((it) => (
                  <div key={it.productId} className="flex gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
                    <img
                      src={it.productImage}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover bg-black border border-white/10"
                    />
                    <div>
                      <p className="font-semibold text-white text-xs">{it.productName}</p>
                      <p className="text-[11px] text-[#dfb150]">
                        {it.plating} • Qty {it.quantity}
                      </p>
                      <p className="text-xs font-bold text-white mt-1">
                        {formatINR(it.price * it.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipient and Concierge Contact */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs space-y-1.5">
                <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Shipping Destination & Contact:
                </p>
                <p className="text-zinc-300">Recipient: {activeOrder.customerName}</p>
                <p className="text-zinc-300">Address: {activeOrder.shippingAddress.street}, {activeOrder.shippingAddress.city}</p>
                <p className="text-zinc-300">Payment: {activeOrder.paymentMethod} ({activeOrder.paymentStatus})</p>
                {activeOrder.giftMessage && (
                  <p className="text-amber-200 italic pt-1">
                    Gift Message: “{activeOrder.giftMessage}”
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-[#dfb150]/10 border border-[#dfb150]/20 text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-amber-200">Questions about your shipment?</p>
                  <p className="text-zinc-400 text-[11px]">Reach out to our customer care team anytime</p>
                </div>
                <button
                  onClick={() => setActiveView('contact')}
                  className="px-3 py-1.5 rounded-lg bg-[#dfb150] text-black text-xs font-semibold uppercase hover:bg-amber-300 transition-all shrink-0"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
