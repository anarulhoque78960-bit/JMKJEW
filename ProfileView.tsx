import React, { useState } from 'react';
import {
  User,
  Crown,
  Package,
  MapPin,
  Award,
  Sparkles,
  ChevronRight,
  Plus,
  CheckCircle,
  Star,
  MessageSquare,
  Eye,
  Trash2,
  ThumbsUp,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatINR } from '../utils/currency';

export const ProfileView: React.FC = () => {
  const {
    user,
    setUser,
    switchRole,
    orders,
    setTrackedOrder,
    setActiveView,
    reviews,
    deleteReview,
    products,
    viewProductDetails,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'reviews' | 'addresses' | 'rewards'>('orders');
  const [newAddressStreet, setNewAddressStreet] = useState('');
  const [newAddressCity, setNewAddressCity] = useState('');
  const [newAddressCountry, setNewAddressCountry] = useState('India');
  const [showAddAddress, setShowAddAddress] = useState(false);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressStreet || !newAddressCity) return;
    const newAddr = {
      id: `addr-${Date.now()}`,
      name: 'Secondary Residence',
      street: newAddressStreet,
      city: newAddressCity,
      state: 'Maharashtra',
      postalCode: '400050',
      country: newAddressCountry || 'India',
      isDefault: false,
    };
    setUser((prev) => ({
      ...prev,
      savedAddresses: [...prev.savedAddresses, newAddr],
    }));
    setShowAddAddress(false);
    setNewAddressStreet('');
    setNewAddressCity('');
  };

  const myReviews = reviews.filter(
    (r) =>
      r.author.toLowerCase() === user.name.toLowerCase() ||
      (r.email && r.email.toLowerCase() === user.email.toLowerCase()) ||
      r.author.toLowerCase().includes('radhika')
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121217] border border-[#dfb150]/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#dfb150] to-[#996e23] p-[2px] shadow-lg">
            <div className="w-full h-full rounded-full bg-[#0a0a0d] flex items-center justify-center text-[#dfb150]">
              <Crown className="w-8 h-8" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-white">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#dfb150]/20 text-[#fbe8aa] border border-[#dfb150]/40">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{user.email} • {user.phone}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#dfb150]" />
                <span>{user.loyaltyTier}</span>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-300">{user.loyaltyPoints} JMK Club Points</span>
            </div>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={switchRole}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-md cursor-pointer"
          >
            Switch to {user.role === 'customer' ? 'Admin Portal' : 'Customer Mode'}
          </button>
          <button
            onClick={() => setActiveView('admin')}
            className="px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold hover:border-[#dfb150] transition-all"
          >
            Admin Dashboard
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-8 overflow-x-auto pb-1">
        {[
          { id: 'orders', label: `My Orders (${orders.length})` },
          { id: 'reviews', label: `My Reviews (${myReviews.length})` },
          { id: 'addresses', label: `Saved Addresses (${user.savedAddresses.length})` },
          { id: 'rewards', label: 'Loyalty Rewards & Club' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 text-xs uppercase tracking-wider font-semibold transition-all border-b-2 shrink-0 ${
              activeTab === t.id
                ? 'border-[#dfb150] text-[#dfb150]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#0f0f13] border border-white/10 hover:border-[#dfb150]/30 transition-all flex flex-col md:flex-row justify-between gap-6 items-start md:items-center"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg font-bold text-white">
                    {ord.orderNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#dfb150]/20 text-[#fbe8aa]">
                    {ord.status}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {ord.items.map((it) => (
                    <img
                      key={it.productId}
                      src={it.productImage}
                      alt={it.productName}
                      className="w-12 h-12 rounded-lg object-cover bg-black border border-white/10"
                      title={it.productName}
                    />
                  ))}
                  <div>
                    <p className="text-xs text-zinc-300 font-medium">
                      {ord.items.map((it) => it.productName).join(', ')}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Tracking: {ord.trackingCode} ({ord.carrier})
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                <div className="text-right">
                  <span className="text-xs text-zinc-400 block">Total Amount</span>
                  <span className="text-base font-bold text-white">
                    {formatINR(ord.total)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setTrackedOrder(ord);
                    setActiveView('order-tracking');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#dfb150] text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>Track Courier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: MY REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Rewards Points Banner */}
          <div className="p-5 rounded-2xl bg-[#121217] border border-[#dfb150]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#dfb150]/15 text-[#dfb150] border border-[#dfb150]/30 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-white">
                  Customer Review Rewards
                </h4>
                <p className="text-xs text-zinc-300">
                  Each authenticated review awards <span className="text-amber-200 font-semibold">+100 JMK Club Loyalty Points</span>.
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-zinc-400 block">Review Points Earned</span>
              <span className="text-xl font-bold text-[#dfb150]">{myReviews.length * 100} Points</span>
            </div>
          </div>

          {myReviews.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#0f0f13] border border-white/5 space-y-4">
              <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto" />
              <h4 className="font-serif text-lg font-semibold text-white">No Reviews Posted Yet</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Share your styling experience with our artificial jhumkas, earrings, or necklace sets to earn reward points.
              </p>
              <button
                onClick={() => setActiveView('catalog')}
                className="px-5 py-2.5 rounded-xl bg-[#dfb150] text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all cursor-pointer"
              >
                Browse Jewellery Catalogue
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myReviews.map((rev) => {
                const prod = products.find((p) => p.id === rev.productId);
                return (
                  <div
                    key={rev.id}
                    className="p-6 rounded-2xl bg-[#0f0f13] border border-white/10 hover:border-[#dfb150]/30 transition-all space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        {prod?.images?.[0] ? (
                          <img
                            src={prod.images[0]}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover bg-black border border-white/10 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-[#dfb150] shrink-0">
                            <Sparkles className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-serif font-bold text-white text-sm">
                            {rev.productName || prod?.name || 'Handcrafted Fashion Jewellery'}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < rev.rating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-zinc-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-zinc-500 text-xs">•</span>
                            <span className="text-zinc-400 text-xs font-mono">{rev.date}</span>
                            {rev.tag && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#dfb150]/15 text-[#fbe8aa] border border-[#dfb150]/30">
                                {rev.tag}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {prod && (
                          <button
                            onClick={() => viewProductDetails(prod)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black border border-white/10 text-xs text-zinc-300 hover:text-white hover:border-[#dfb150] transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Piece</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Delete your review?')) {
                              deleteReview(rev.id);
                            }
                          }}
                          className="p-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 hover:bg-rose-900 hover:text-white transition-all"
                          title="Delete My Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div>
                      <h5 className="font-serif font-semibold text-white text-sm">
                        {rev.title}
                      </h5>
                      <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed font-light">
                        {rev.comment}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" /> Verified Purchase Published
                      </span>
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-[#dfb150]" />
                        <span>{rev.helpfulCount || 0} customers found this helpful</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className="p-5 rounded-2xl bg-[#0f0f13] border border-white/10 space-y-2 relative"
              >
                {addr.isDefault && (
                  <span className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] bg-[#dfb150]/20 text-[#fbe8aa] border border-[#dfb150]/30 font-semibold">
                    Default Address
                  </span>
                )}
                <h4 className="font-serif font-bold text-white text-sm">{addr.name}</h4>
                <p className="text-xs text-zinc-300">{addr.street}</p>
                <p className="text-xs text-zinc-400">
                  {addr.city}, {addr.state} {addr.postalCode}
                </p>
                <p className="text-xs text-zinc-400">{addr.country}</p>
              </div>
            ))}
          </div>

          {!showAddAddress ? (
            <button
              onClick={() => setShowAddAddress(true)}
              className="px-5 py-2.5 rounded-xl border border-dashed border-[#dfb150]/40 text-amber-200 text-xs font-semibold flex items-center gap-2 hover:bg-[#dfb150]/10 transition-all"
            >
              <Plus className="w-4 h-4 text-[#dfb150]" />
              <span>Add New Delivery Address</span>
            </button>
          ) : (
            <form onSubmit={handleAddAddress} className="p-6 rounded-2xl bg-[#121217] border border-[#dfb150]/30 max-w-lg space-y-3">
              <h4 className="font-serif font-bold text-white text-sm">Add Delivery Address</h4>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Street Address / Flat..."
                  value={newAddressStreet}
                  onChange={(e) => setNewAddressStreet(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-black border border-white/10 text-white focus:border-[#dfb150]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="City..."
                  value={newAddressCity}
                  onChange={(e) => setNewAddressCity(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-black border border-white/10 text-white focus:border-[#dfb150]"
                />
                <input
                  type="text"
                  placeholder="Country..."
                  value={newAddressCountry}
                  onChange={(e) => setNewAddressCountry(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-black border border-white/10 text-white focus:border-[#dfb150]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-4 py-2 rounded-xl bg-black text-xs text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#dfb150] text-black font-semibold text-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB CONTENT: REWARDS */}
      {activeTab === 'rewards' && (
        <div className="p-8 rounded-3xl bg-[#0f0f13] border border-[#dfb150]/20 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#dfb150] font-semibold">
                JMK Loyalty Club
              </span>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">
                Tier Status: {user.loyaltyTier}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400 block">Available Reward Points</span>
              <span className="text-3xl font-extrabold text-[#dfb150]">{user.loyaltyPoints}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-300">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
              <Award className="w-5 h-5 text-[#dfb150]" />
              <h4 className="font-bold text-white text-sm">Anti-Tarnish Care Support</h4>
              <p className="text-zinc-400">Complimentary polishing and inspection advice for your fashion pieces.</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
              <Sparkles className="w-5 h-5 text-[#dfb150]" />
              <h4 className="font-bold text-white text-sm">Festive Previews</h4>
              <p className="text-zinc-400">Early access to limited edition bridal suites and festival collections.</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
              <Crown className="w-5 h-5 text-[#dfb150]" />
              <h4 className="font-bold text-white text-sm">Dedicated Jewellery Stylist</h4>
              <p className="text-zinc-400">Personal styling on WhatsApp to match your attire with the perfect choker or jhumka.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
