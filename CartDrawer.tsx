import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Gift,
  ShieldCheck,
  ArrowRight,
  Plus,
  Minus,
  Sparkles,
  Tag,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatINR } from '../../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    toggleGiftWrap,
    setGiftMessage,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActiveView,
  } = useShop();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100)
  );
  const remainingForFree = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const res = applyCoupon(inputCoupon);
    if (res.success) {
      setCouponSuccess(res.message);
      setInputCoupon('');
    } else {
      setCouponError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0a0a0d] border-l border-white/10 text-white flex flex-col shadow-2xl relative">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#101015]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#dfb150]/15 border border-[#dfb150]/40 flex items-center justify-center text-[#dfb150]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                  Shopping Bag
                </h3>
                <p className="text-xs text-zinc-400">
                  {cart.length === 0
                    ? 'Your bag is empty'
                    : `${cart.reduce((a, b) => a + b.quantity, 0)} handcrafted fashion pieces`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-[#14141c] px-5 py-3 border-b border-white/5">
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-zinc-300">
                {cartSubtotal >= freeShippingThreshold ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#dfb150]" /> You unlocked Free Express Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#dfb150]">{formatINR(remainingForFree)}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-zinc-400 text-[11px]">Free delivery above ₹999</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#c5973b] to-[#f5d77f] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#181820] border border-white/10 flex items-center justify-center text-zinc-500">
                  <ShoppingBag className="w-8 h-8 text-zinc-600" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-white">
                    Your Jewellery Bag is Empty
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                    Explore our curated collection of anti-tarnish jhumkas, choker sets, and fashion earrings.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    setActiveView('catalog');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#dfb150] text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#ebd085] transition-all"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedPlating}`}
                  className="p-3.5 rounded-xl bg-[#131317] border border-white/5 hover:border-[#dfb150]/30 transition-all flex flex-col gap-2.5"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-18 h-18 rounded-lg object-cover bg-black border border-white/10"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-serif text-sm font-semibold text-white truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-[11px] text-[#dfb150] font-medium">
                            {item.selectedPlating}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedPlating)}
                          className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-white">
                          {formatINR(item.product.price * item.quantity)}
                        </span>

                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-white/10 rounded-lg bg-black/40 overflow-hidden">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.selectedPlating,
                                item.quantity - 1
                              )
                            }
                            className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs text-white font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.selectedPlating,
                                item.quantity + 1
                              )
                            }
                            className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gift Wrap Option */}
                  <div className="border-t border-white/5 pt-2 flex flex-col gap-1.5">
                    <button
                      onClick={() => toggleGiftWrap(item.product.id, item.selectedPlating)}
                      className="flex items-center justify-between text-xs text-zinc-300 hover:text-white"
                    >
                      <span className="flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-[#dfb150]" />
                        <span>Luxury Velvet Keepsake Box & Ribbon</span>
                      </span>
                      <span className="text-amber-300 font-medium">
                        {item.giftWrap ? '+₹149 (Added)' : '+₹149'}
                      </span>
                    </button>

                    {item.giftWrap && (
                      <input
                        type="text"
                        placeholder="Personalized gift message on gold-foil card..."
                        value={item.giftMessage || ''}
                        onChange={(e) =>
                          setGiftMessage(item.product.id, item.selectedPlating, e.target.value)
                        }
                        className="w-full text-[11px] px-2.5 py-1.5 rounded-lg bg-black/60 border border-[#dfb150]/30 text-white placeholder-zinc-500 focus:outline-none focus:border-[#dfb150]"
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 bg-[#101015] border-t border-white/10 space-y-3.5">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Enter code (e.g. JMKJEW10)"
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#18181f] border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#dfb150]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-[#dfb150]/20 border border-[#dfb150]/40 text-amber-200 text-xs font-semibold hover:bg-[#dfb150] hover:text-black transition-all"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between px-2.5 py-1 rounded bg-[#dfb150]/10 border border-[#dfb150]/30 text-xs text-amber-200">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#dfb150]" />
                    <span>Voucher <strong>{appliedCoupon}</strong> applied</span>
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] text-zinc-400 hover:text-rose-400 underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-emerald-400">{couponSuccess}</p>}

              {/* Subtotal breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-300 border-t border-white/5 pt-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="font-semibold text-white">{formatINR(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Special Discount</span>
                    <span>-{formatINR(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-400">Express Courier Delivery</span>
                  <span className={cartShipping === 0 ? 'text-amber-300 font-semibold' : 'text-white'}>
                    {cartShipping === 0 ? 'Complimentary (Above ₹999)' : formatINR(cartShipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                  <span>Grand Total</span>
                  <span className="text-[#dfb150]">{formatINR(cartTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black font-bold text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-[0_0_20px_rgba(223,177,80,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] text-zinc-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#dfb150]" />
                <span>256-Bit Encrypted • Anti-Tarnish & Skin-Safe Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
