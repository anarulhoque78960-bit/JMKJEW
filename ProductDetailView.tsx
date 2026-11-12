import React, { useState, useMemo } from 'react';
import {
  Heart,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
  Award,
  Layers,
  ThumbsUp,
  MessageSquare,
  Plus,
  X,
  Filter,
  Check,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { JewelleryViewer3D } from '../components/3d/JewelleryViewer3D';
import { ProductCard } from '../components/products/ProductCard';
import { PlatingFinish, Product, Review } from '../types';
import { formatINR } from '../utils/currency';

const REVIEW_TAG_OPTIONS = [
  'Anti-Tarnish Verified',
  'Lightweight Fit',
  'Wedding Favourite',
  'Festive Glamour',
  'Mirror Luster Polish',
  'Gift Worthy Box',
  'Everyday Luxury',
];

const RATING_LABELS: Record<number, string> = {
  1: 'Needs Improvement',
  2: 'Fair Craftsmanship',
  3: 'Good Quality & Value',
  4: 'Very Impressive Sparkle',
  5: 'Exceptional Polish & Royal Feel',
};

export const ProductDetailView: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    setActiveView,
    addToCart,
    isInWishlist,
    toggleWishlist,
    products,
    getProductReviews,
    getProductRatingStats,
    addReview,
    voteReviewHelpful,
    user,
  } = useShop();

  const product = selectedProduct || products[0];

  const [activeMediaTab, setActiveMediaTab] = useState<'photo' | '3d'>('3d');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedPlating, setSelectedPlating] = useState<PlatingFinish>(product.plating);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Reviews filtering, sorting & modal state
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'helpful'>('newest');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Review Form state
  const [reviewAuthor, setReviewAuthor] = useState(user.name || '');
  const [reviewEmail, setReviewEmail] = useState(user.email || '');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewTag, setReviewTag] = useState<string>('Anti-Tarnish Verified');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);
  const [votedReviews, setVotedReviews] = useState<Record<string, boolean>>({});

  const isWishlisted = isInWishlist(product.id);

  // Current product reviews from context
  const productReviews = getProductReviews(product.id);
  const ratingStats = getProductRatingStats(product.id);

  // Filtered & Sorted reviews
  const filteredAndSortedReviews = useMemo(() => {
    let list = [...productReviews];
    if (selectedStarFilter !== 'all') {
      list = list.filter((r) => Math.round(r.rating) === selectedStarFilter);
    }
    if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'helpful') {
      list.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
    } else {
      // newest
      list.sort((a, b) => (b.id > a.id ? 1 : -1));
    }
    return list;
  }, [productReviews, selectedStarFilter, sortBy]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedPlating);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  const handleHelpfulVote = (reviewId: string) => {
    if (votedReviews[reviewId]) return;
    voteReviewHelpful(reviewId);
    setVotedReviews((prev) => ({ ...prev, [reviewId]: true }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    const result = addReview({
      productId: product.id,
      productName: product.name,
      author: reviewAuthor.trim(),
      email: reviewEmail.trim(),
      rating: reviewRating,
      title: reviewTitle.trim() || 'Exquisite Fashion Jewellery Piece',
      comment: reviewComment.trim(),
      tag: reviewTag,
      verifiedPurchase: true,
      helpfulCount: 0,
    });

    setReviewSuccessMsg(result.message);
    setReviewTitle('');
    setReviewComment('');
    setTimeout(() => {
      setIsWriteModalOpen(false);
      setReviewSuccessMsg(null);
    }, 2500);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <button
          onClick={() => setActiveView('home')}
          className="hover:text-[#dfb150] transition-colors"
        >
          Home
        </button>
        <span>/</span>
        <button
          onClick={() => setActiveView('catalog')}
          className="hover:text-[#dfb150] transition-colors uppercase"
        >
          {product.category.replace('-', ' ')}
        </button>
        <span>/</span>
        <span className="text-white font-medium truncate">{product.name}</span>
      </div>

      {/* Main Product Stage: 3D/Photo Column + Specs Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Interactive 3D Viewer and Photo Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Media Switcher Tab (Photo vs 3D Interactive) */}
          <div className="flex items-center justify-between p-1.5 rounded-2xl bg-[#121217] border border-white/5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveMediaTab('3d')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeMediaTab === '3d'
                    ? 'bg-[#dfb150] text-black shadow-lg'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3D Interactive Inspection</span>
              </button>
              <button
                onClick={() => setActiveMediaTab('photo')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeMediaTab === 'photo'
                    ? 'bg-[#dfb150] text-black shadow-lg'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Photo Gallery ({product.images.length})</span>
              </button>
            </div>
            <span className="text-[11px] text-zinc-400 hidden sm:inline pr-2">
              {activeMediaTab === '3d' ? '360° Real-time WebGL' : 'High Resolution Zoom'}
            </span>
          </div>

          {/* Media Display Container */}
          {activeMediaTab === '3d' ? (
            <JewelleryViewer3D
              modelType={product.model3dType}
              productName={product.name}
              initialFinish="microgold"
              height="520px"
            />
          ) : (
            <div className="relative aspect-[4/3.8] rounded-2xl overflow-hidden bg-[#0d0d10] border border-white/10 group">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              {/* Prev / Next controls for photo gallery */}
              {product.images.length > 1 && (
                <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                    className="p-2 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md pointer-events-auto hover:bg-black transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="p-2 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md pointer-events-auto hover:bg-black transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Thumbnail Strip */}
          {activeMediaTab === 'photo' && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-[#dfb150] ring-2 ring-[#dfb150]/40'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees Strip beneath media */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#121217] border border-white/5 text-center text-xs text-zinc-300">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-[#dfb150]" />
              <span className="font-semibold text-white">Anti-Tarnish Polish</span>
              <span className="text-[10px] text-zinc-400">Protective E-Coating</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-white/5">
              <Truck className="w-5 h-5 text-[#dfb150]" />
              <span className="font-semibold text-white">Free Express Delivery</span>
              <span className="text-[10px] text-zinc-400">On Orders Above ₹999</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-5 h-5 text-[#dfb150]" />
              <span className="font-semibold text-white">7-Day Easy Exchange</span>
              <span className="text-[10px] text-zinc-400">Doorstep Pickup</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Specs, Customization, Add to Bag */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-[#dfb150]/15 text-[#fbe8aa] text-xs font-semibold uppercase tracking-wider border border-[#dfb150]/30">
                {product.plating} • {product.category.replace('-', ' ')}
              </span>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2.5 rounded-full border transition-all ${
                  isWishlisted
                    ? 'bg-rose-950/80 border-rose-500 text-rose-400'
                    : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400' : ''}`} />
              </button>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-white mt-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars & SKU */}
            <div className="flex items-center gap-3 mt-2.5">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(ratingStats.count > 0 ? ratingStats.average : product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-zinc-600'
                    }`}
                  />
                ))}
                <span className="text-xs text-white font-semibold ml-1">
                  {ratingStats.count > 0 ? ratingStats.average.toFixed(1) : product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-zinc-500">•</span>
              <button
                onClick={() => {
                  const el = document.getElementById('product-reviews-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs text-amber-200 hover:text-[#dfb150] underline cursor-pointer transition-colors"
              >
                {ratingStats.count} Verified Reviews
              </button>
              <span className="text-zinc-500">•</span>
              <span className="text-xs text-zinc-500">Item #{product.id}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-[#141419] border border-white/10 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-zinc-500 line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>
            {product.discountPercent && (
              <span className="px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-bold">
                Save {formatINR(product.originalPrice - product.price)} ({product.discountPercent}% Off)
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Plating Finish Customization */}
          <div>
            <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
              Choose Plating Finish: <span className="text-[#dfb150] font-bold">{selectedPlating}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  '18K Micro Gold Polish',
                  'Rose Gold Polish',
                  'Rhodium Silver Polish',
                  'Antique Matte Gold',
                  'Oxidised Silver',
                ] as PlatingFinish[]
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPlating(p)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                    selectedPlating === p
                      ? 'bg-[#dfb150]/20 border-[#dfb150] text-amber-200'
                      : 'bg-black/40 border-white/10 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Bag */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-white/10 rounded-xl bg-black/40 px-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-semibold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black font-extrabold text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-[0_0_20px_rgba(223,177,80,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag • {formatINR(product.price * quantity)}</span>
              </button>
            </div>

            {addedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>Added to your shopping bag!</span>
                </span>
                <button
                  onClick={() => setActiveView('checkout')}
                  className="underline font-bold text-white hover:text-amber-200"
                >
                  Checkout Now
                </button>
              </div>
            )}
          </div>

          {/* Free Shipping Alert */}
          <div className="p-3.5 rounded-xl bg-[#dfb150]/10 border border-[#dfb150]/20 text-xs text-amber-200 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#dfb150] shrink-0" />
            <span>Complimentary express delivery across India on orders above ₹999.</span>
          </div>

          {/* Technical Specifications Table */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="font-serif text-base font-bold text-white mb-3">
              Product Specifications & Quality
            </h4>
            <div className="rounded-xl border border-white/5 divide-y divide-white/5 text-xs">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="p-2.5 flex justify-between">
                  <span className="text-zinc-400">{key}</span>
                  <span className="font-medium text-white text-right">{value}</span>
                </div>
              ))}
              <div className="p-2.5 flex justify-between">
                <span className="text-zinc-400">Dimensions</span>
                <span className="font-medium text-white">{product.dimensions}</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-zinc-400">Anti-Tarnish Seal</span>
                <span className="font-medium text-emerald-400">Certified E-Coated</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-zinc-400">Skin Safety</span>
                <span className="font-medium text-emerald-400">100% Hypoallergenic</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Ratings Section */}
      <div className="border-t border-white/10 pt-12 space-y-8" id="product-reviews-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#dfb150]/20 text-[#fbe8aa] border border-[#dfb150]/40">
                Verified Feedback
              </span>
              <span className="text-xs text-zinc-400">Authentic Customer Experiences</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Customer Reviews & Ratings
            </h3>
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_0_20px_rgba(223,177,80,0.3)] cursor-pointer self-start sm:self-auto active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Review (+100 Points)</span>
          </button>
        </div>

        {/* Rating Breakdown & Summary Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#121217] border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Overall Score */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-8">
            <span className="text-5xl sm:text-6xl font-serif font-extrabold text-white tracking-tight">
              {ratingStats.count > 0 ? ratingStats.average.toFixed(1) : '5.0'}
            </span>
            <div className="flex items-center gap-1 my-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(ratingStats.count > 0 ? ratingStats.average : 5)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-zinc-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-zinc-400">
              Based on <span className="text-white font-semibold">{ratingStats.count}</span> verified
              customer review{ratingStats.count === 1 ? '' : 's'}
            </p>
            <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Genuine Buyer Authenticated</span>
            </div>
          </div>

          {/* Star Distribution Bars */}
          <div className="md:col-span-5 space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingStats.breakdown[star] || 0;
              const percent = ratingStats.percentBreakdown[star] || 0;
              const isSelected = selectedStarFilter === star;

              return (
                <button
                  key={star}
                  onClick={() => setSelectedStarFilter(isSelected ? 'all' : star)}
                  className={`w-full flex items-center gap-3 text-xs group transition-all p-1.5 rounded-lg ${
                    isSelected ? 'bg-white/10 ring-1 ring-[#dfb150]' : 'hover:bg-white/5'
                  }`}
                  title={`Filter by ${star} Star reviews`}
                >
                  <span className="w-12 text-left font-medium text-zinc-300 group-hover:text-amber-200 shrink-0 flex items-center gap-1">
                    <span>{star}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>

                  <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected
                          ? 'bg-amber-300'
                          : 'bg-gradient-to-r from-[#dfb150] to-[#fbe8aa]'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="w-10 text-right text-zinc-400 text-[11px] font-mono shrink-0">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Review Highlights & Rewards Box */}
          <div className="md:col-span-3 p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#dfb150]">
              <Sparkles className="w-4 h-4 text-[#dfb150]" />
              <span>Review & Earn Rewards</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed font-light">
              Add your verified product review to earn <strong className="text-amber-200">100 JMK Loyalty Points</strong> instantly. Redeem points on your next fashion jewellery order.
            </p>
            <div className="pt-1 flex flex-wrap gap-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-zinc-400">Anti-Tarnish</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-zinc-400">Lightweight</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-zinc-400">Wedding Fit</span>
            </div>
          </div>
        </div>

        {/* Filter and Sorting Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          {/* Star Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-zinc-400 font-medium flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-zinc-500" />
              <span>Filter:</span>
            </span>
            <button
              onClick={() => setSelectedStarFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                selectedStarFilter === 'all'
                  ? 'bg-[#dfb150] text-black shadow-md'
                  : 'bg-[#141419] border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              All Reviews ({productReviews.length})
            </button>
            {[5, 4, 3, 2, 1].map((s) => {
              const count = ratingStats.breakdown[s] || 0;
              if (count === 0 && selectedStarFilter !== s) return null;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedStarFilter(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all shrink-0 ${
                    selectedStarFilter === s
                      ? 'bg-[#dfb150] text-black shadow-md'
                      : 'bg-[#141419] border border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{s}★</span>
                  <span className="text-[10px] opacity-80">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <span className="text-zinc-400">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-[#141419] border border-white/10 text-white focus:outline-none focus:border-[#dfb150]"
            >
              <option value="newest">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        {filteredAndSortedReviews.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#121217] border border-white/5 space-y-4">
            <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto" />
            <h4 className="font-serif text-lg font-semibold text-white">No reviews found</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {selectedStarFilter !== 'all'
                ? `There are no ${selectedStarFilter}-star reviews yet for this product.`
                : 'Be the first to share your thoughts on this handcrafted fashion jewellery piece!'}
            </p>
            {selectedStarFilter !== 'all' ? (
              <button
                onClick={() => setSelectedStarFilter('all')}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs text-white hover:bg-white/20 transition-all"
              >
                Clear Rating Filter
              </button>
            ) : (
              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#dfb150] text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all"
              >
                Write First Review
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAndSortedReviews.map((rev) => {
              const isVoted = votedReviews[rev.id];
              return (
                <div
                  key={rev.id}
                  className="p-6 rounded-2xl bg-[#121217] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header with Star rating, Date and Tag */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-zinc-600'
                              }`}
                            />
                          ))}
                        </div>
                        {rev.tag && (
                          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#dfb150]/15 text-[#fbe8aa] border border-[#dfb150]/30">
                            {rev.tag}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-500 font-mono">{rev.date}</span>
                    </div>

                    {/* Headline and Body */}
                    <div>
                      <h4 className="font-serif text-base font-semibold text-white leading-snug">
                        {rev.title}
                      </h4>
                      <p className="text-xs text-zinc-300 leading-relaxed font-light mt-1.5">
                        {rev.comment}
                      </p>
                    </div>
                  </div>

                  {/* Footer: Author Info & Helpful Button */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#dfb150] to-[#996e23] flex items-center justify-center text-black font-bold text-xs">
                        {rev.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-white font-medium block text-xs">{rev.author}</span>
                        {rev.verifiedPurchase && (
                          <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
                            <CheckCircle className="w-3 h-3" /> Verified Buyer
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleHelpfulVote(rev.id)}
                      disabled={isVoted}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] transition-all ${
                        isVoted
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 cursor-default'
                          : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white hover:border-zinc-500 cursor-pointer'
                      }`}
                      title="Mark review as helpful"
                    >
                      <ThumbsUp className={`w-3 h-3 ${isVoted ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                      <span>{isVoted ? 'Helpful' : 'Helpful?'}</span>
                      <span className="font-mono font-semibold">({rev.helpfulCount || 0})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* WRITE A REVIEW MODAL DIALOG */}
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-[#121217] border border-[#dfb150]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
              {/* Close Button */}
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="absolute top-6 right-6 p-1.5 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#dfb150]/20 text-[#fbe8aa] border border-[#dfb150]/40">
                    JMK Club Loyalty
                  </span>
                  <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+100 Points Reward</span>
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mt-1">
                  Write a Customer Review
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  For: <span className="text-white font-medium">{product.name}</span>
                </p>
              </div>

              {reviewSuccessMsg ? (
                <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="font-serif text-base font-bold text-white">Review Published!</h4>
                  <p className="text-xs text-emerald-200">{reviewSuccessMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                  {/* Interactive Star Picker */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-center">
                    <label className="text-zinc-400 block font-semibold text-[11px] uppercase tracking-wider">
                      Overall Rating
                    </label>
                    <div className="flex items-center justify-center gap-2 py-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setReviewRating(s)}
                          className="p-1 focus:outline-none transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              s <= (hoverRating || reviewRating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-zinc-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-xs font-semibold text-amber-200">
                      {RATING_LABELS[hoverRating || reviewRating]}
                    </p>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 block mb-1 font-medium">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Shalini Mehra"
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#dfb150]"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1 font-medium">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. shalini@example.com"
                        value={reviewEmail}
                        onChange={(e) => setReviewEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#dfb150]"
                      />
                    </div>
                  </div>

                  {/* Highlight Tag Selection */}
                  <div>
                    <label className="text-zinc-400 block mb-1.5 font-medium">
                      Select Key Highlight Tag
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {REVIEW_TAG_OPTIONS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setReviewTag(tag)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            reviewTag === tag
                              ? 'bg-[#dfb150]/20 border-[#dfb150] text-[#fbe8aa]'
                              : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Headline */}
                  <div>
                    <label className="text-zinc-400 block mb-1 font-medium">
                      Review Headline / Summary
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Stunning Jadau polish, received countless compliments!"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#dfb150]"
                    />
                  </div>

                  {/* Review Comments */}
                  <div>
                    <label className="text-zinc-400 block mb-1 font-medium">
                      Detailed Review *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe how the jewellery felt (weight, luster, anti-tarnish finish, comfort during long wedding functions)..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#dfb150] leading-relaxed"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-between border-t border-white/10">
                    <span className="text-[11px] text-zinc-500">
                      Earn +100 Loyalty Points
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsWriteModalOpen(false)}
                        className="py-2.5 px-4 rounded-xl bg-black border border-white/10 text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black font-bold uppercase tracking-wider hover:opacity-95 transition-all shadow-lg cursor-pointer"
                      >
                        Publish Review
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-white/10 pt-12 space-y-6">
          <h3 className="font-serif text-2xl font-bold text-white">
            Matching Fashion Jewellery Pieces
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
