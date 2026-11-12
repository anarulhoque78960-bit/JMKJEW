import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Search,
  RotateCcw,
  Sparkles,
  Check,
  X,
  ChevronDown,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/products/ProductCard';
import { ProductCategory, PlatingFinish } from '../types';
import { formatINR } from '../utils/currency';

export const CatalogView: React.FC = () => {
  const {
    products,
    filters,
    setFilters,
    resetFilters,
    setCategoryFilter,
    setSearchQuery,
  } = useShop();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Collections' },
    { id: 'artificial-jhumka', label: 'Artificial Jhumka' },
    { id: 'fashion-earrings', label: 'Fashion Earrings' },
    { id: 'necklace-sets', label: 'Necklace Sets' },
    { id: 'bridal-fashion', label: 'Bridal Fashion' },
    { id: 'jewellery-boxes', label: 'Jewellery Boxes' },
    { id: 'designer-sets', label: 'Designer Sets' },
    { id: 'gift-collections', label: 'Gift Collections' },
  ];

  const platings: (PlatingFinish | 'all')[] = [
    'all',
    '18K Micro Gold Polish',
    'Rose Gold Polish',
    'Rhodium Silver Polish',
    'Antique Matte Gold',
    'Oxidised Silver',
  ];

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category
      if (filters.category !== 'all' && p.category !== filters.category) return false;
      // Price
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      // Plating
      if (filters.plating !== 'all' && p.plating !== filters.plating) return false;
      // In stock
      if (filters.inStockOnly && p.stock <= 0) return false;
      // Search
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchDesc = p.shortDesc.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
        const matchCategory = p.category.toLowerCase().includes(query);
        const matchGemstones = p.gemstones.some((g) => g.toLowerCase().includes(query));
        if (!matchName && !matchDesc && !matchCategory && !matchGemstones) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, filters]);

  const activeFilterCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.plating !== 'all' ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.maxPrice < 10000 ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#dfb150]/20 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#dfb150] font-semibold">
            JMKJEW – Elegance in Every Detail
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Fashion & Artificial Jewellery Catalog
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Explore authentic Indian fashion jewellery with anti-tarnish micro gold polish, Kundan detailing, and hypoallergenic comfort.
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141419] border border-[#dfb150]/30 text-amber-200 text-xs font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#dfb150]" />
            <span>Filters ({activeFilterCount})</span>
          </button>

          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as any,
                }))
              }
              aria-label="Sort products"
              className="appearance-none px-4 py-2 pr-9 rounded-xl bg-[#121217] border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-[#dfb150] cursor-pointer"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div
          className={`${
            mobileFilterOpen ? 'block' : 'hidden'
          } md:block md:col-span-1 space-y-6 bg-[#0f0f13] md:bg-transparent p-5 md:p-0 rounded-2xl border md:border-none border-white/10`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#dfb150]" />
              <span>Filters</span>
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#dfb150] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Search in Catalog */}
          <div>
            <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
              Search Pieces
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Kundan, jhumka, pearl..."
                value={filters.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#141419] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#dfb150]"
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
              Categories
            </label>
            <div className="space-y-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                    filters.category === c.id
                      ? 'bg-[#dfb150] text-black font-bold shadow-md'
                      : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <span>{c.label}</span>
                  <span className={`text-[10px] ${filters.category === c.id ? 'text-black' : 'text-zinc-500'}`}>
                    {c.id === 'all'
                      ? products.length
                      : products.filter((p) => p.category === c.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Plating & Finish Filter */}
          <div>
            <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
              Plating & Polish
            </label>
            <div className="space-y-1">
              {platings.map((p) => (
                <button
                  key={p}
                  onClick={() => setFilters((prev) => ({ ...prev, plating: p }))}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                    filters.plating === p
                      ? 'bg-[#dfb150]/20 border border-[#dfb150]/50 text-amber-200'
                      : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <span>{p === 'all' ? 'All Plating Finishes' : p}</span>
                  {filters.plating === p && <Check className="w-3.5 h-3.5 text-[#dfb150]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-zinc-400 uppercase tracking-wider font-semibold">Max Budget</span>
              <span className="text-amber-300 font-bold">{formatINR(filters.maxPrice)}</span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="250"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
              }
              aria-label="Filter maximum price"
              className="w-full accent-[#dfb150] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>₹500</span>
              <span>₹5,000</span>
              <span>₹10,000</span>
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="border-t border-white/5 pt-3">
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
                }
                className="rounded accent-[#dfb150] w-4 h-4 cursor-pointer"
              />
              <span>In-Stock Ready to Ship Only</span>
            </label>
          </div>
        </div>

        {/* Product Cards Grid (3 columns on desktop) */}
        <div className="md:col-span-3 space-y-6">
          {/* Active Filter Badges */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-zinc-400">Active:</span>
              {filters.category !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#dfb150]/15 text-[#fbe8aa] text-xs border border-[#dfb150]/30">
                  <span>Category: {filters.category}</span>
                  <button onClick={() => setCategoryFilter('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {filters.plating !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#dfb150]/15 text-[#fbe8aa] text-xs border border-[#dfb150]/30">
                  <span>Plating: {filters.plating}</span>
                  <button onClick={() => setFilters((p) => ({ ...p, plating: 'all' }))}><X className="w-3 h-3" /></button>
                </span>
              )}
              {filters.searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#dfb150]/15 text-[#fbe8aa] text-xs border border-[#dfb150]/30">
                  <span>Query: "{filters.searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="p-16 rounded-3xl bg-[#0f0f13] border border-white/10 text-center space-y-4">
              <Sparkles className="w-10 h-10 text-[#dfb150] mx-auto opacity-60" />
              <h3 className="font-serif text-2xl font-bold text-white">No creations match your filter</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Try widening your price range or clearing the category and plating polish filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-[#dfb150] text-black font-semibold text-xs uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
