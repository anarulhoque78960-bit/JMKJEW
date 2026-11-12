import { Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/products/ProductCard';
import { formatINR } from '../utils/currency';

export const WishlistView: React.FC = () => {
  const { wishlist, products, setActiveView } = useShop();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const totalWishlistValue = wishlistedProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#dfb150]/20 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#dfb150] font-semibold">
            Saved Favourites
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white mt-1">
            Your Jewellery Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {wishlistedProducts.length} saved fashion jewellery piece{wishlistedProducts.length === 1 ? '' : 's'}
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <div className="text-left sm:text-right">
            <span className="text-xs text-zinc-400 block">Total Wishlist Value</span>
            <span className="font-serif text-2xl font-bold text-[#dfb150]">
              {formatINR(totalWishlistValue)}
            </span>
          </div>
        )}
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="p-16 rounded-3xl bg-[#0f0f13] border border-white/10 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-950/40 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">Your Wishlist is Empty</h3>
          <p className="text-xs text-zinc-400">
            Save your favourite Jhumkas, fashion earrings, necklace sets, and jewellery boxes to purchase at your convenience.
          </p>
          <button
            onClick={() => setActiveView('catalog')}
            className="px-6 py-3 rounded-xl bg-[#dfb150] text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-lg cursor-pointer"
          >
            Explore Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
