import React from 'react';
import { Heart, Sparkles, ShoppingBag, Eye, Star, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { formatINR } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { viewProductDetails, addToCart, isInWishlist, toggleWishlist } = useShop();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group relative rounded-2xl luxury-card overflow-hidden transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Top Media Container */}
      <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-[#0d0d10] cursor-pointer" onClick={() => viewProductDetails(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
          loading="lazy"
        />

        {/* Subtle Dark Vignette & Gold Sheen on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestseller && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#dfb150] text-black text-[10px] font-bold uppercase tracking-wider shadow-md">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-0.5 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-wider shadow-md">
              New Arrival
            </span>
          )}
          {product.discountPercent && (
            <span className="px-2 py-0.5 rounded-full bg-rose-900/90 border border-rose-500/40 text-rose-200 text-[10px] font-semibold">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-rose-950/80 border border-rose-500/60 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
              : 'bg-black/50 border border-white/10 text-white/80 hover:text-white hover:bg-black/70'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400' : ''}`} />
        </button>

        {/* 3D Inspect Badge */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 border border-[#dfb150]/40 backdrop-blur-md text-[10px] text-amber-200">
          <Sparkles className="w-3 h-3 text-[#dfb150]" />
          <span>3D View Available</span>
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickView) onQuickView(product);
              else viewProductDetails(product);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-black/85 border border-[#dfb150]/50 text-white text-xs font-semibold backdrop-blur-md hover:bg-black transition-all flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#dfb150]" />
            <span>Inspect</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1, product.plating);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-lg"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Plating & Anti-Tarnish Tag */}
          <div className="flex items-center justify-between gap-2 text-[11px] mb-1.5">
            <span className="text-[#dfb150] font-semibold tracking-wide truncate">
              {product.plating}
            </span>
            <div className="flex items-center gap-1 text-zinc-400 shrink-0">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Anti-Tarnish</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => viewProductDetails(product)}
            className="font-serif text-base sm:text-lg font-bold text-white hover:text-amber-200 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
            {product.shortDesc}
          </p>
        </div>

        {/* Rating and Price Footer */}
        <div className="border-t border-white/5 pt-3 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-zinc-500 line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] text-zinc-300 font-medium">
                {product.rating}
              </span>
              <span className="text-[10px] text-zinc-500">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          {/* Direct Buy / View Button */}
          <button
            onClick={() => viewProductDetails(product)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-[#dfb150]/30 hover:border-[#dfb150] text-[#dfb150] hover:bg-[#dfb150]/10 text-xs font-medium transition-all"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
