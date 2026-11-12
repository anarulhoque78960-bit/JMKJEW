import React, { useState } from 'react';
import {
  Layers,
  Package,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  Eye,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Star,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, ProductCategory, PlatingFinish, OrderStatus } from '../types';
import { formatINR } from '../utils/currency';

export const AdminDashboardView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    orders,
    updateOrderStatus,
    setActiveView,
    viewProductDetails,
    reviews,
    deleteReview,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'reviews' | 'analytics'>('inventory');
  const [searchProduct, setSearchProduct] = useState('');
  const [searchReview, setSearchReview] = useState('');
  const [reviewStarFilter, setReviewStarFilter] = useState<number | 'all'>('all');

  // Add/Edit Product Modal State
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('artificial-jhumka');
  const [formPrice, setFormPrice] = useState<number>(1899);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(2899);
  const [formPlating, setFormPlating] = useState<PlatingFinish>('18K Micro Gold Polish');
  const [formWeight, setFormWeight] = useState<number>(28);
  const [formStock, setFormStock] = useState<number>(20);
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [form3dType, setForm3dType] = useState<'jhumka' | 'necklace' | 'earring' | 'box'>('jhumka');

  // KPI Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalInventoryUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const openAddModal = () => {
    setModalMode('add');
    setEditingId(null);
    setFormName('');
    setFormCategory('artificial-jhumka');
    setFormPrice(1899);
    setFormOriginalPrice(2899);
    setFormPlating('18K Micro Gold Polish');
    setFormWeight(28);
    setFormStock(20);
    setFormShortDesc('Handcrafted artificial jewellery piece with anti-tarnish micro polish.');
    setFormDescription('Artisan crafted with precision Jadau Kundan and skin-friendly alloy.');
    setFormImageUrl('https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80');
    setForm3dType('jhumka');
  };

  const openEditModal = (product: Product) => {
    setModalMode('edit');
    setEditingId(product.id);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(product.price);
    setFormOriginalPrice(product.originalPrice);
    setFormPlating(product.plating);
    setFormWeight(product.weightGrams || 25);
    setFormStock(product.stock);
    setFormShortDesc(product.shortDesc);
    setFormDescription(product.description);
    setFormImageUrl(product.images[0]);
    setForm3dType(product.model3dType);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    if (modalMode === 'add') {
      addProduct({
        name: formName,
        slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formCategory,
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice),
        discountPercent: Math.round(((formOriginalPrice - formPrice) / formOriginalPrice) * 100),
        plating: formPlating,
        weightGrams: Number(formWeight),
        dimensions: 'Handcrafted custom dimensions',
        gemstones: ['Handcut Kundan', 'Austrian CZ'],
        stock: Number(formStock),
        rating: 5.0,
        reviewCount: 1,
        isFeatured: true,
        shortDesc: formShortDesc,
        description: formDescription,
        images: [formImageUrl],
        model3dType: form3dType,
        antiTarnish: true,
        skinFriendly: true,
        specifications: {
          'Base Metal': 'Jewellery Brass Alloy',
          'Plating': formPlating,
          'Anti-Tarnish': 'E-Coated Lacquer Protected',
          'Skin Safety': 'Hypoallergenic & Lead Free',
        },
      });
    } else if (modalMode === 'edit' && editingId) {
      updateProduct(editingId, {
        name: formName,
        category: formCategory,
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice),
        plating: formPlating,
        weightGrams: Number(formWeight),
        stock: Number(formStock),
        shortDesc: formShortDesc,
        description: formDescription,
        images: [formImageUrl],
        model3dType: form3dType,
      });
    }

    setModalMode(null);
  };

  const filteredProducts = products.filter((p) => {
    if (!searchProduct) return true;
    const q = searchProduct.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#dfb150]/20 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#dfb150]/20 text-[#fbe8aa] border border-[#dfb150]/40">
              Admin Portal
            </span>
            <span className="text-xs text-zinc-400">JMKJEW Store Management</span>
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-white mt-1">
            Jewellery Operations Dashboard
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetProducts}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black border border-white/10 text-xs text-zinc-400 hover:text-white hover:border-zinc-500 transition-all"
            title="Reset to default fashion catalogue"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Products</span>
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_0_20px_rgba(223,177,80,0.35)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Jewellery</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#121217] border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span>Gross Sales Revenue</span>
            <DollarSign className="w-4 h-4 text-[#dfb150]" />
          </div>
          <p className="font-serif text-2xl font-bold text-white">{formatINR(totalRevenue)}</p>
          <p className="text-[11px] text-emerald-400 font-medium">Orders Processed: {orders.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#121217] border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span>Inventory Volume</span>
            <Package className="w-4 h-4 text-[#dfb150]" />
          </div>
          <p className="font-serif text-2xl font-bold text-white">{totalInventoryUnits} Units</p>
          <p className="text-[11px] text-zinc-400">Across {products.length} Designs</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#121217] border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span>Inventory Valuation</span>
            <TrendingUp className="w-4 h-4 text-[#dfb150]" />
          </div>
          <p className="font-serif text-2xl font-bold text-amber-200">
            {formatINR(totalInventoryValue)}
          </p>
          <p className="text-[11px] text-zinc-400">Fashion Jewellery Stock</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#121217] border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span>Order Dispatch Rate</span>
            <ShieldCheck className="w-4 h-4 text-[#dfb150]" />
          </div>
          <p className="font-serif text-2xl font-bold text-white">99.4%</p>
          <p className="text-[11px] text-emerald-400">Express Delivery Active</p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-white/10 gap-6 text-xs uppercase tracking-widest font-semibold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 transition-colors shrink-0 ${
            activeTab === 'inventory'
              ? 'text-[#dfb150] border-b-2 border-[#dfb150]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Product Catalogue ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors shrink-0 ${
            activeTab === 'orders'
              ? 'text-[#dfb150] border-b-2 border-[#dfb150]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Orders & Fulfillment ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 transition-colors shrink-0 flex items-center gap-1.5 ${
            activeTab === 'reviews'
              ? 'text-[#dfb150] border-b-2 border-[#dfb150]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span>Customer Reviews ({reviews.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 transition-colors shrink-0 ${
            activeTab === 'analytics'
              ? 'text-[#dfb150] border-b-2 border-[#dfb150]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Sales Analytics
        </button>
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by name, ID or category..."
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#121217] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#dfb150]"
              />
            </div>
            <p className="text-xs text-zinc-400">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0e0e12]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141419] border-b border-white/10 text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Plating Polish</th>
                  <th className="p-4">Price (INR)</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover bg-black border border-white/10 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-white truncate max-w-xs">{p.name}</p>
                        <p className="text-[10px] text-zinc-500">ID: {p.id}</p>
                      </div>
                    </td>
                    <td className="p-4 capitalize text-zinc-300">{p.category.replace('-', ' ')}</td>
                    <td className="p-4">
                      <p className="font-semibold text-[#dfb150]">{p.plating}</p>
                      <p className="text-[10px] text-zinc-400">Anti-Tarnish</p>
                    </td>
                    <td className="p-4 font-bold text-white">{formatINR(p.price)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateProduct(p.id, { stock: Math.max(0, p.stock - 1) })}
                          className="w-6 h-6 rounded bg-black border border-white/10 text-white flex items-center justify-center hover:border-zinc-500"
                        >
                          -
                        </button>
                        <span className={`font-semibold ${p.stock < 5 ? 'text-rose-400' : 'text-white'}`}>
                          {p.stock}
                        </span>
                        <button
                          onClick={() => updateProduct(p.id, { stock: p.stock + 1 })}
                          className="w-6 h-6 rounded bg-black border border-white/10 text-white flex items-center justify-center hover:border-zinc-500"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => viewProductDetails(p)}
                        className="p-1.5 rounded-lg bg-black/60 text-zinc-400 hover:text-white border border-white/10"
                        title="View Live Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg bg-[#dfb150]/15 text-amber-300 hover:bg-[#dfb150] hover:text-black transition-all border border-[#dfb150]/30"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900 hover:text-white transition-all border border-rose-500/30"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0e0e12]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141419] border-b border-white/10 text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Order Details</th>
                  <th className="p-4">Customer & City</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status & Timeline</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <p className="font-mono font-bold text-amber-200">{order.orderNumber}</p>
                      <p className="text-[10px] text-zinc-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-white">{order.customerName}</p>
                      <p className="text-[10px] text-zinc-400">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                    </td>
                    <td className="p-4 text-zinc-300">
                      {order.items.map((i) => i.productName).join(', ')}
                    </td>
                    <td className="p-4 font-bold text-white">{formatINR(order.total)}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#dfb150]/15 text-[#fbe8aa] border border-[#dfb150]/30">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="p-1.5 rounded-lg bg-black border border-white/10 text-white text-xs focus:border-[#dfb150]"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Handcraft Quality Check">Quality Check</option>
                        <option value="Velvet Gift Packaging">Velvet Packaging</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Reviews KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#121217] border border-white/5 space-y-1">
              <div className="flex justify-between items-center text-xs text-zinc-400">
                <span>Total Customer Reviews</span>
                <MessageSquare className="w-4 h-4 text-[#dfb150]" />
              </div>
              <p className="font-serif text-2xl font-bold text-white">{reviews.length}</p>
              <p className="text-[11px] text-emerald-400 font-medium">100% Genuine Buyers</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121217] border border-white/5 space-y-1">
              <div className="flex justify-between items-center text-xs text-zinc-400">
                <span>Catalogue Average Rating</span>
                <Star className="w-4 h-4 text-[#dfb150]" />
              </div>
              <p className="font-serif text-2xl font-bold text-amber-200">
                {reviews.length > 0
                  ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(2)
                  : '5.00'}{' '}
                / 5.0
              </p>
              <p className="text-[11px] text-zinc-400">Across All Fashion Collections</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121217] border border-white/5 space-y-1">
              <div className="flex justify-between items-center text-xs text-zinc-400">
                <span>5-Star Praise Share</span>
                <Sparkles className="w-4 h-4 text-[#dfb150]" />
              </div>
              <p className="font-serif text-2xl font-bold text-white">
                {reviews.length > 0
                  ? Math.round(
                      (reviews.filter((r) => Math.round(r.rating) === 5).length / reviews.length) * 100
                    )
                  : 100}
                %
              </p>
              <p className="text-[11px] text-zinc-400">Top-Tier Customer Delight</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121217] border border-white/5 space-y-1">
              <div className="flex justify-between items-center text-xs text-zinc-400">
                <span>Helpful Endorsements</span>
                <ThumbsUp className="w-4 h-4 text-[#dfb150]" />
              </div>
              <p className="font-serif text-2xl font-bold text-white">
                {reviews.reduce((acc, r) => acc + (r.helpfulCount || 0), 0)} Upvotes
              </p>
              <p className="text-[11px] text-emerald-400">Community Validated</p>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reviews by customer, product, comment..."
                value={searchReview}
                onChange={(e) => setSearchReview(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#121217] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#dfb150]"
              />
            </div>

            {/* Star Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 self-start sm:self-auto">
              <span className="text-xs text-zinc-400 font-medium mr-1">Star Filter:</span>
              <button
                onClick={() => setReviewStarFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  reviewStarFilter === 'all'
                    ? 'bg-[#dfb150] text-black shadow-md'
                    : 'bg-[#121217] border border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                All ({reviews.length})
              </button>
              {[5, 4, 3, 2, 1].map((s) => (
                <button
                  key={s}
                  onClick={() => setReviewStarFilter(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                    reviewStarFilter === s
                      ? 'bg-[#dfb150] text-black shadow-md'
                      : 'bg-[#121217] border border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{s}★</span>
                  <span className="text-[10px] opacity-80">
                    ({reviews.filter((r) => Math.round(r.rating) === s).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Reviews Table */}
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0e0e12]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141419] border-b border-white/10 text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Jewellery Item</th>
                  <th className="p-4">Reviewer</th>
                  <th className="p-4">Rating & Tag</th>
                  <th className="p-4">Feedback Content</th>
                  <th className="p-4">Date & Helpful</th>
                  <th className="p-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reviews
                  .filter((r) => {
                    if (reviewStarFilter !== 'all' && Math.round(r.rating) !== reviewStarFilter) {
                      return false;
                    }
                    if (!searchReview) return true;
                    const q = searchReview.toLowerCase();
                    return (
                      r.author.toLowerCase().includes(q) ||
                      (r.productName && r.productName.toLowerCase().includes(q)) ||
                      r.comment.toLowerCase().includes(q) ||
                      (r.title && r.title.toLowerCase().includes(q)) ||
                      (r.tag && r.tag.toLowerCase().includes(q))
                    );
                  })
                  .map((rev) => {
                    const prod = products.find((p) => p.id === rev.productId);
                    return (
                      <tr key={rev.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {prod?.images?.[0] ? (
                              <img
                                src={prod.images[0]}
                                alt=""
                                className="w-12 h-12 rounded-lg object-cover bg-black border border-white/10 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0 text-[#dfb150]">
                                <Sparkles className="w-4 h-4" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-white truncate max-w-xs">
                                {rev.productName || prod?.name || rev.productId}
                              </p>
                              <p className="text-[10px] text-zinc-500 font-mono">ID: {rev.productId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-white">{rev.author}</p>
                          <p className="text-[10px] text-zinc-400">{rev.email || 'customer@jmkjew.com'}</p>
                          {rev.verifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 mt-0.5">
                              <CheckCircle className="w-3 h-3" /> Verified Buyer
                            </span>
                          )}
                        </td>
                        <td className="p-4">
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
                            <span className="text-white font-bold ml-1">{rev.rating}</span>
                          </div>
                          {rev.tag && (
                            <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#dfb150]/20 text-[#fbe8aa] border border-[#dfb150]/30">
                              {rev.tag}
                            </span>
                          )}
                        </td>
                        <td className="p-4 max-w-sm">
                          <p className="font-serif font-bold text-white truncate">{rev.title}</p>
                          <p className="text-zinc-300 text-[11px] line-clamp-2 mt-0.5 leading-relaxed font-light">
                            {rev.comment}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="text-zinc-400 font-mono text-[11px]">{rev.date}</p>
                          <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                            <ThumbsUp className="w-3 h-3" /> {rev.helpfulCount || 0} helpful
                          </p>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {prod && (
                            <button
                              onClick={() => viewProductDetails(prod)}
                              className="p-1.5 rounded-lg bg-black/60 text-zinc-400 hover:text-white border border-white/10"
                              title="View Product Page"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(`Delete review by ${rev.author}?`)) {
                                deleteReview(rev.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900 hover:text-white transition-all border border-rose-500/30"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SALES ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#121217] border border-white/10 space-y-4">
            <h4 className="font-serif text-lg font-bold text-white">Top Performing Categories</h4>
            <div className="space-y-3">
              {[
                { name: 'Artificial Jhumka', pct: 38, sales: '₹4,85,000' },
                { name: 'Necklace Sets', pct: 28, sales: '₹3,56,000' },
                { name: 'Fashion Earrings', pct: 18, sales: '₹2,28,000' },
                { name: 'Bridal Fashion Jewellery', pct: 16, sales: '₹2,05,000' },
              ].map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white font-medium">{c.name}</span>
                    <span className="text-[#dfb150] font-bold">{c.sales}</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-[#c5973b] to-[#f5d77f] h-full rounded-full"
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#121217] border border-white/10 space-y-4">
            <h4 className="font-serif text-lg font-bold text-white">Quality & Logistics Health</h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center">
                <span>Average Order Processing Time</span>
                <span className="font-bold text-white">4.2 Hours</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center">
                <span>Anti-Tarnish QA Pass Rate</span>
                <span className="font-bold text-emerald-400">100% Verified</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center">
                <span>Express Courier On-Time Delivery</span>
                <span className="font-bold text-emerald-400">99.1%</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center">
                <span>Customer Satisfaction Index</span>
                <span className="font-bold text-amber-300">4.94 / 5.0</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#121217] border border-[#dfb150]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-serif text-xl font-bold text-white">
                {modalMode === 'add' ? 'Add New Fashion Jewellery Piece' : 'Edit Product Details'}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="text-zinc-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white focus:border-[#dfb150]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white focus:border-[#dfb150]"
                  >
                    <option value="artificial-jhumka">Artificial Jhumka</option>
                    <option value="fashion-earrings">Fashion Earrings</option>
                    <option value="necklace-sets">Necklace Sets</option>
                    <option value="bridal-fashion">Bridal Fashion Jewellery</option>
                    <option value="jewellery-boxes">Jewellery Boxes</option>
                    <option value="designer-sets">Designer Jewellery Sets</option>
                    <option value="gift-collections">Gift Collections</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Plating & Polish</label>
                  <select
                    value={formPlating}
                    onChange={(e) => setFormPlating(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white focus:border-[#dfb150]"
                  >
                    <option value="18K Micro Gold Polish">18K Micro Gold Polish</option>
                    <option value="Rose Gold Polish">Rose Gold Polish</option>
                    <option value="Rhodium Silver Polish">Rhodium Silver Polish</option>
                    <option value="Antique Matte Gold">Antique Matte Gold</option>
                    <option value="Oxidised Silver">Oxidised Silver</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Selling Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white focus:border-[#dfb150]"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Original Price (INR)</label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white focus:border-[#dfb150]"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white focus:border-[#dfb150]"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">3D Viewer Model Preset</label>
                <select
                  value={form3dType}
                  onChange={(e) => setForm3dType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white focus:border-[#dfb150]"
                >
                  <option value="jhumka">3D Jhumka Dome</option>
                  <option value="necklace">3D Choker Collar</option>
                  <option value="earring">3D Chandelier Dangler</option>
                  <option value="box">3D Velvet Trunk</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">High-Res Image URL</label>
                <input
                  type="url"
                  required
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white focus:border-[#dfb150]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white focus:border-[#dfb150]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white focus:border-[#dfb150]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="py-2.5 px-5 rounded-xl bg-black border border-white/10 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-[#dfb150] text-black font-bold uppercase tracking-wider hover:bg-amber-300 transition-all cursor-pointer shadow-lg"
                >
                  {modalMode === 'add' ? 'Create Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
