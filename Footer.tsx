import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  Sparkles,
  MapPin,
  Phone,
  CheckCircle,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Footer: React.FC = () => {
  const { setActiveView, setCategoryFilter } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#070709] border-t border-[#dfb150]/20 text-zinc-300">
      {/* Trust Badges Strip */}
      <div className="border-b border-white/5 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#dfb150]/10 border border-[#dfb150]/20 text-[#dfb150]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-white font-semibold text-sm tracking-wide">
                Anti-Tarnish Guarantee
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Advanced micro electroplating and protective lacquer shield every piece from daily oxidisation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#dfb150]/10 border border-[#dfb150]/20 text-[#dfb150]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-white font-semibold text-sm tracking-wide">
                Free Express Delivery
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Complimentary courier shipping across India on all orders above ₹999 with real-time SMS tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#dfb150]/10 border border-[#dfb150]/20 text-[#dfb150]">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-white font-semibold text-sm tracking-wide">
                7-Day Easy Exchange
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Zero hassle returns and doorstep pickup if you need a different style or piece.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#dfb150]/10 border border-[#dfb150]/20 text-[#dfb150]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-white font-semibold text-sm tracking-wide">
                Skin-Safe & Hypoallergenic
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                100% nickel and lead-free alloy compositions crafted for sensitive skin and prolonged celebration wear.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#dfb150] to-[#9e7529] p-[1px] flex items-center justify-center">
              <span className="font-serif font-black text-xs text-black bg-[#dfb150] w-full h-full rounded-full flex items-center justify-center">
                JMK
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-white">
                JMKJEW
              </span>
              <span className="text-[10px] text-[#dfb150] tracking-wider uppercase">
                Elegance in Every Detail
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
            JMKJEW is a single-brand online fashion and artificial jewellery brand celebrating the timeless glamour of royal Indian heritage. From lightweight Kundan jhumkas to sparkling CZ evening sets and velvet organizers, we craft affordable luxury designed to turn heads.
          </p>
          <div className="pt-2 text-xs text-zinc-400 space-y-1.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#dfb150]" />
              <span>Studio: Zaveri Heritage Arcade, Mumbai, Maharashtra 400002</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#dfb150]" />
              <span>Customer Support: +91 98201 91600 (Mon-Sat, 10am - 7pm IST)</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#dfb150] mb-4">
            Categories
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li>
              <button
                onClick={() => setCategoryFilter('artificial-jhumka')}
                className="hover:text-amber-200 transition-colors"
              >
                Artificial Jhumka
              </button>
            </li>
            <li>
              <button
                onClick={() => setCategoryFilter('fashion-earrings')}
                className="hover:text-amber-200 transition-colors"
              >
                Fashion Earrings
              </button>
            </li>
            <li>
              <button
                onClick={() => setCategoryFilter('necklace-sets')}
                className="hover:text-amber-200 transition-colors"
              >
                Necklace Sets
              </button>
            </li>
            <li>
              <button
                onClick={() => setCategoryFilter('bridal-fashion')}
                className="hover:text-amber-200 transition-colors"
              >
                Bridal Fashion Jewellery
              </button>
            </li>
            <li>
              <button
                onClick={() => setCategoryFilter('jewellery-boxes')}
                className="hover:text-amber-200 transition-colors"
              >
                Jewellery Boxes
              </button>
            </li>
            <li>
              <button
                onClick={() => setCategoryFilter('designer-sets')}
                className="hover:text-amber-200 transition-colors"
              >
                Designer Jewellery Sets
              </button>
            </li>
            <li>
              <button
                onClick={() => setCategoryFilter('gift-collections')}
                className="hover:text-amber-200 transition-colors"
              >
                Gift Collections
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#dfb150] mb-4">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li>
              <button
                onClick={() => setActiveView('order-tracking')}
                className="hover:text-amber-200 transition-colors"
              >
                Track Order Delivery
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('3d-atelier')}
                className="hover:text-amber-200 transition-colors"
              >
                3D Product Viewer
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('about')}
                className="hover:text-amber-200 transition-colors"
              >
                About Our Brand
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('contact')}
                className="hover:text-amber-200 transition-colors"
              >
                Contact & Support
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('admin')}
                className="hover:text-amber-200 transition-colors text-[#dfb150]"
              >
                Admin Management Portal
              </button>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#dfb150] mb-2">
            The JMK Insider
          </h4>
          <p className="text-xs text-zinc-400 mb-3">
            Subscribe for festive style guides, new drops, and receive 10% off your first fashion jewellery order.
          </p>
          {subscribed ? (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Welcome! Use voucher <strong>JMKJEW10</strong> at checkout.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#141418] border border-[#dfb150]/30 text-white placeholder-zinc-500 focus:outline-none focus:border-[#dfb150]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black text-xs font-semibold tracking-wider uppercase hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get 10% Discount</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Legal & Badges */}
      <div className="border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} JMKJEW. All Rights Reserved. JMKJEW – Elegance in Every Detail.</p>
        <div className="flex items-center gap-4 text-zinc-400 text-[11px]">
          <span>Anti-Tarnish Polish</span>
          <span>•</span>
          <span>Skin-Safe & Hypoallergenic</span>
          <span>•</span>
          <span>Express Courier</span>
          <span>•</span>
          <span>Pan-India Delivery</span>
        </div>
      </div>
    </footer>
  );
};
