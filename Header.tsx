import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  ShieldCheck,
  Menu,
  X,
  Package,
  Layers,
  Sparkles,
  Award,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCategory } from '../../types';

export const Header: React.FC<{ onOpenCart: () => void }> = ({ onOpenCart }) => {
  const {
    activeView,
    setActiveView,
    cartCount,
    wishlist,
    user,
    switchRole,
    setCategoryFilter,
    setSearchQuery,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setSearchOpen(false);
    }
  };

  const navCategories: { label: string; cat: ProductCategory | 'all' }[] = [
    { label: 'All Collections', cat: 'all' },
    { label: 'Artificial Jhumka', cat: 'artificial-jhumka' },
    { label: 'Fashion Earrings', cat: 'fashion-earrings' },
    { label: 'Necklace Sets', cat: 'necklace-sets' },
    { label: 'Bridal Fashion', cat: 'bridal-fashion' },
    { label: 'Jewellery Boxes', cat: 'jewellery-boxes' },
    { label: 'Designer Sets', cat: 'designer-sets' },
    { label: 'Gift Collections', cat: 'gift-collections' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0d]/95 backdrop-blur-md border-b border-[#dfb150]/20 transition-all">
      {/* Top Luxury Announcement Ticker */}
      <div className="bg-gradient-to-r from-[#171612] via-[#241e12] to-[#171612] border-b border-[#dfb150]/20 py-1.5 px-4 text-center text-[11px] tracking-widest text-[#f5df9a] uppercase flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-2 text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#dfb150]" />
          <span>Anti-Tarnish E-Coating • Skin-Friendly & Nickel-Free</span>
        </div>
        <div className="mx-auto flex items-center gap-2 font-medium">
          <Sparkles className="w-3 h-3 text-[#dfb150]" />
          <span>Free Express Delivery Across India Above ₹999</span>
          <span className="hidden sm:inline opacity-60">|</span>
          <span className="hidden sm:inline text-amber-200">
            Use Voucher <strong className="text-white tracking-wider underline">JMKJEW10</strong> for 10% Off
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-3 text-zinc-400">
          <button
            onClick={switchRole}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 border border-[#dfb150]/40 text-[#dfb150] hover:bg-[#dfb150] hover:text-black transition-all text-[10px] font-semibold cursor-pointer"
            title="Click to toggle between Customer View and Admin Mode"
          >
            <span>Role:</span>
            <span className="uppercase">{user.role}</span>
            <span className="underline opacity-80">(Switch)</span>
          </button>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-[#dfb150] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Brand Monogram & Title */}
        <div
          onClick={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cursor-pointer flex items-center gap-3 group select-none"
        >
          {/* Stylized Gold Crest Emblem */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#dfb150] via-[#eed286] to-[#a17628] p-[1.5px] shadow-lg group-hover:shadow-[0_0_18px_rgba(223,177,80,0.35)] transition-all">
            <div className="w-full h-full rounded-full bg-[#0a0a0d] flex items-center justify-center border border-[#dfb150]/40">
              <span className="font-serif font-black text-sm tracking-tighter gold-gradient-text">
                JMK
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-[0.22em] text-white group-hover:text-amber-200 transition-colors">
              JMKJEW
            </span>
            <span className="text-[9px] uppercase tracking-[0.28em] text-[#dfb150] font-medium -mt-1">
              Elegance in Every Detail
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6">
          <button
            onClick={() => setActiveView('home')}
            className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#dfb150] ${
              activeView === 'home' ? 'text-[#dfb150] font-semibold border-b border-[#dfb150] pb-0.5' : 'text-zinc-300'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCategoryFilter('all')}
            className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#dfb150] ${
              activeView === 'catalog' ? 'text-[#dfb150] font-semibold border-b border-[#dfb150] pb-0.5' : 'text-zinc-300'
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => setCategoryFilter('artificial-jhumka')}
            className="text-xs uppercase tracking-widest font-medium text-zinc-300 hover:text-[#dfb150] transition-colors"
          >
            Jhumkas
          </button>
          <button
            onClick={() => setCategoryFilter('necklace-sets')}
            className="text-xs uppercase tracking-widest font-medium text-zinc-300 hover:text-[#dfb150] transition-colors"
          >
            Necklaces
          </button>
          <button
            onClick={() => setCategoryFilter('bridal-fashion')}
            className="text-xs uppercase tracking-widest font-medium text-zinc-300 hover:text-[#dfb150] transition-colors"
          >
            Bridal
          </button>
          <button
            onClick={() => setCategoryFilter('jewellery-boxes')}
            className="text-xs uppercase tracking-widest font-medium text-zinc-300 hover:text-[#dfb150] transition-colors"
          >
            Boxes
          </button>
          <button
            onClick={() => setActiveView('3d-atelier')}
            className={`flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full border transition-all ${
              activeView === '3d-atelier'
                ? 'bg-[#dfb150] text-black border-[#dfb150]'
                : 'bg-[#dfb150]/10 text-amber-300 border-[#dfb150]/30 hover:bg-[#dfb150]/20'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#dfb150]" />
            <span>3D Viewer</span>
          </button>
          <button
            onClick={() => setActiveView('about')}
            className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#dfb150] ${
              activeView === 'about' ? 'text-[#dfb150] font-semibold' : 'text-zinc-300'
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => setActiveView('contact')}
            className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#dfb150] ${
              activeView === 'contact' ? 'text-[#dfb150] font-semibold' : 'text-zinc-300'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-zinc-300 hover:text-[#dfb150] transition-colors rounded-lg hover:bg-white/5"
            aria-label="Search collection"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => setActiveView('wishlist')}
            className="relative p-2 text-zinc-300 hover:text-[#dfb150] transition-colors rounded-lg hover:bg-white/5"
            aria-label="View wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#dfb150] text-black text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* User Account / Admin Switch */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="p-2 text-zinc-300 hover:text-[#dfb150] transition-colors rounded-lg hover:bg-white/5 flex items-center gap-1"
              aria-label="Account menu"
            >
              <UserIcon className="w-5 h-5" />
              <span className="hidden md:inline text-xs text-zinc-400 font-medium">
                {user.role === 'admin' ? 'Admin' : user.name.split(' ')[0]}
              </span>
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl bg-[#141418] border border-[#dfb150]/30 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-white/5">
                  <p className="text-xs text-zinc-400">Signed in as</p>
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#dfb150]/20 text-[#fbe8aa] border border-[#dfb150]/40 uppercase">
                      {user.role}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Club: {user.loyaltyTier}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => setActiveView('profile')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-200 hover:bg-[#dfb150]/15 hover:text-white flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-[#dfb150]" />
                    <span>My Profile & Rewards</span>
                  </button>
                  <button
                    onClick={() => setActiveView('order-tracking')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-200 hover:bg-[#dfb150]/15 hover:text-white flex items-center gap-2"
                  >
                    <Package className="w-4 h-4 text-[#dfb150]" />
                    <span>Track Order Delivery</span>
                  </button>
                  <button
                    onClick={() => setActiveView('admin')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-200 hover:bg-[#dfb150]/15 hover:text-white flex items-center gap-2 border-t border-white/5"
                  >
                    <Layers className="w-4 h-4 text-[#dfb150]" />
                    <span>Admin Dashboard & Inventory</span>
                  </button>
                  <button
                    onClick={switchRole}
                    className="w-full text-left px-4 py-2 text-xs text-amber-300 hover:bg-[#dfb150]/20 flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-[#dfb150]" />
                    <span>Switch to {user.role === 'customer' ? 'Admin Mode' : 'Customer Mode'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Bag Trigger */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black font-semibold text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(223,177,80,0.35)] hover:shadow-[0_0_22px_rgba(223,177,80,0.5)] transition-all cursor-pointer active:scale-95"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="w-5 h-5 rounded-full bg-black text-[#fbe8aa] text-[11px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Expanded Search Bar Banner */}
      {searchOpen && (
        <div className="bg-[#101015] border-t border-b border-[#dfb150]/20 px-4 py-3 animate-in fade-in">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
            <Search className="w-5 h-5 text-[#dfb150]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search artificial jhumkas, kundan chokers, CZ earrings, bridal sets, jewellery boxes..."
              className="w-full bg-transparent border-none text-white placeholder-zinc-500 focus:outline-none text-sm"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#dfb150] text-black text-xs font-semibold uppercase tracking-wider hover:bg-[#edd283] transition-all"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d0d12] border-b border-[#dfb150]/20 px-4 pt-3 pb-6 space-y-4">
          <div className="flex flex-col space-y-2">
            {navCategories.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setCategoryFilter(item.cat);
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg text-sm font-medium text-zinc-300 hover:bg-[#dfb150]/10 hover:text-amber-200"
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-white/10 pt-2 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setActiveView('3d-atelier');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg text-sm font-semibold text-amber-300 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#dfb150]" />
                <span>3D Product Viewer</span>
              </button>
              <button
                onClick={() => {
                  setActiveView('order-tracking');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg text-sm font-medium text-zinc-300"
              >
                Track Order Delivery
              </button>
              <button
                onClick={() => {
                  setActiveView('admin');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg text-sm font-medium text-[#dfb150]"
              >
                Admin Dashboard & Inventory
              </button>
              <button
                onClick={() => {
                  switchRole();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg text-xs font-semibold text-amber-400 bg-amber-950/40 border border-amber-500/30"
              >
                Current Role: {user.role.toUpperCase()} (Click to toggle)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
