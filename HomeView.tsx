import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Crown,
  CheckCircle,
  Gem,
  ChevronRight,
  Gift,
  Heart,
  Truck,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { JewelleryViewer3D } from '../components/3d/JewelleryViewer3D';
import { ProductCard } from '../components/products/ProductCard';
import { ProductCategory } from '../types';
import { formatINR } from '../utils/currency';

export const HomeView: React.FC = () => {
  const {
    products,
    setActiveView,
    setCategoryFilter,
    viewProductDetails,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'featured' | 'bestsellers' | 'new'>('featured');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'featured') return p.isFeatured;
    if (activeTab === 'bestsellers') return p.isBestseller;
    if (activeTab === 'new') return p.isNewArrival;
    return true;
  });

  const categories: {
    id: ProductCategory;
    title: string;
    subtitle: string;
    count: number;
    image: string;
  }[] = [
    {
      id: 'artificial-jhumka',
      title: 'Artificial Jhumka',
      subtitle: 'Chandbali, Temple Dome & Meenakari Bells',
      count: products.filter((p) => p.category === 'artificial-jhumka').length,
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'fashion-earrings',
      title: 'Fashion Earrings',
      subtitle: 'Austrian CZ Chandeliers, Drops & Oxidised Tribal',
      count: products.filter((p) => p.category === 'fashion-earrings').length,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'necklace-sets',
      title: 'Necklace Sets',
      subtitle: 'Jadau Kundan Chokers & Princess Collar Sets',
      count: products.filter((p) => p.category === 'necklace-sets').length,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'bridal-fashion',
      title: 'Bridal Fashion Jewellery',
      subtitle: 'Full Dulhan Suites with Rani Haar, Maang Tikka & Nath',
      count: products.filter((p) => p.category === 'bridal-fashion').length,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'jewellery-boxes',
      title: 'Jewellery Boxes',
      subtitle: 'Anti-Tarnish Velvet Trunks & Travel Cases',
      count: products.filter((p) => p.category === 'jewellery-boxes').length,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'designer-sets',
      title: 'Designer Jewellery Sets',
      subtitle: 'Runway Moissanite CZ & Pastel Enamel Collars',
      count: products.filter((p) => p.category === 'designer-sets').length,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'gift-collections',
      title: 'Gift Collections',
      subtitle: 'Curated Hampers & Bridesmaid Gift Boxes',
      count: products.filter((p) => p.category === 'gift-collections').length,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#dfb150]/20 bg-[#070709]">
        {/* Ambient Luxury Lighting & Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#dfb150]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-20 right-10 w-96 h-96 bg-[#9e7529]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Subtle Pattern Texture */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#dfb150_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center z-10 space-y-8">
          {/* Brand Tagline Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16161c] border border-[#dfb150]/30 shadow-lg text-xs tracking-widest uppercase text-amber-200">
            <Crown className="w-4 h-4 text-[#dfb150]" />
            <span>JMKJEW – Elegance in Every Detail</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Premium Fashion & <br />
              <span className="gold-gradient-text">Artificial Jewellery</span>
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Experience the royal splendor of heritage Kundan, Meenakari jhumkas, and Austrian CZ necklace sets without the heaviness. Anti-tarnish micro gold polish crafted for modern celebrations.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
            <button
              onClick={() => {
                setCategoryFilter('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black font-bold text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-[0_0_25px_rgba(223,177,80,0.4)] flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
            >
              <span>Explore All Collections</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setActiveView('3d-atelier');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#141419] border border-[#dfb150]/40 text-amber-200 font-semibold text-xs uppercase tracking-widest hover:bg-[#dfb150]/15 hover:border-[#dfb150] transition-all flex items-center justify-center gap-2.5 backdrop-blur-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#dfb150]" />
              <span>Interactive 3D Viewer</span>
            </button>
          </div>

          {/* Value Pillars */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 border-t border-white/10 w-full max-w-4xl text-left">
            <div>
              <p className="font-serif text-xl font-bold text-white">Micro Polish</p>
              <p className="text-xs text-zinc-400 mt-0.5">Anti-Tarnish E-Coating</p>
            </div>
            <div>
              <p className="font-serif text-xl font-bold text-white">Skin Safe</p>
              <p className="text-xs text-zinc-400 mt-0.5">100% Hypoallergenic</p>
            </div>
            <div>
              <p className="font-serif text-xl font-bold text-white">Free Express</p>
              <p className="text-xs text-zinc-400 mt-0.5">Delivery Above ₹999</p>
            </div>
            <div>
              <p className="font-serif text-xl font-bold text-white">7-Day Easy</p>
              <p className="text-xs text-zinc-400 mt-0.5">Doorstep Exchange</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE 3D SPOTLIGHT SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-gradient-to-br from-[#15151c] via-[#0f0f14] to-[#0a0a0d] border border-[#dfb150]/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dfb150]/10 border border-[#dfb150]/30 text-[#dfb150] text-[11px] font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Real-Time 3D Inspection</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-snug">
                Mughal Chandbali <br />
                <span className="gold-gradient-text">Kundan Jhumka</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                Inspect every hand-set Kundan stone, delicate filigree bell, and lustrous faux pearl drop in 360-degree high-definition 3D. Switch between 18K Micro Gold, Rose Gold, and Rhodium finishes.
              </p>

              <div className="space-y-2.5 text-xs text-zinc-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#dfb150]" />
                  <span>18K Micro Gold Electro-polish with Anti-Tarnish Seal</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#dfb150]" />
                  <span>Lightweight Comfort Engineering (Only 32g per pair)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#dfb150]" />
                  <span>Handcrafted Jadau Kundan & Faux Basra Pearls</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => {
                    const jhumka = products.find((p) => p.id === 'jmk-jhm-01');
                    if (jhumka) viewProductDetails(jhumka);
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg cursor-pointer"
                >
                  View Details & Buy ({formatINR(1899)})
                </button>
                <button
                  onClick={() => setActiveView('3d-atelier')}
                  className="px-5 py-3 rounded-xl bg-black/60 border border-white/10 text-zinc-200 text-xs font-semibold hover:border-[#dfb150] hover:text-white transition-all flex items-center gap-1.5"
                >
                  <span>3D Atelier</span>
                  <ChevronRight className="w-4 h-4 text-[#dfb150]" />
                </button>
              </div>
            </div>

            {/* Right 3D Canvas */}
            <div className="lg:col-span-7">
              <JewelleryViewer3D
                modelType="jhumka"
                productName="Mughal Chandbali Kundan Jhumka"
                initialFinish="microgold"
                height="460px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#dfb150] font-semibold">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Explore Our Jewellery Categories
            </h2>
          </div>
          <button
            onClick={() => setCategoryFilter('all')}
            className="text-xs uppercase tracking-wider text-[#dfb150] font-semibold hover:text-amber-200 flex items-center gap-1.5 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer luxury-card border border-[#dfb150]/20 hover:border-[#dfb150]/60 transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                <span className="text-[11px] uppercase tracking-widest text-[#dfb150] font-semibold">
                  {cat.count} Handcrafted Designs
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-amber-200 transition-colors mt-1">
                  {cat.title}
                </h3>
                <p className="text-xs text-zinc-300 line-clamp-1 mt-1 font-light">
                  {cat.subtitle}
                </p>

                <div className="mt-3 flex items-center gap-1 text-xs text-amber-300 font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS & TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#dfb150] font-semibold">
              Trending Pieces
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-white mt-1">
              Popular Fashion Jewellery
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-[#121217] p-1.5 rounded-xl border border-white/5">
            {[
              { id: 'featured', label: 'Featured Picks' },
              { id: 'bestsellers', label: 'Bestsellers' },
              { id: 'new', label: 'New Arrivals' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#dfb150] text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center pt-6">
          <button
            onClick={() => setCategoryFilter('all')}
            className="px-8 py-3.5 rounded-xl bg-[#141419] border border-[#dfb150]/40 text-amber-200 text-xs font-bold uppercase tracking-widest hover:bg-[#dfb150] hover:text-black transition-all shadow-lg"
          >
            Explore Complete {products.length} Piece Collection
          </button>
        </div>
      </section>

      {/* 5. BRAND PHILOSOPHY & ARTISAN CRAFT */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#121217] via-[#0d0d10] to-[#121217] border-y border-[#dfb150]/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dfb150]/15 border border-[#dfb150]/30 text-amber-300 text-xs uppercase tracking-widest font-semibold">
              <Award className="w-4 h-4 text-[#dfb150]" />
              <span>The JMKJEW Promise</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Royal Indian Aesthetics, <br />
              <span className="gold-gradient-text">Engineered for Comfort</span>
            </h2>

            <p className="text-zinc-300 text-sm leading-relaxed font-light">
              At JMKJEW, we believe fashion jewellery should look just as opulent as fine heirlooms without the overwhelming weight or astronomical price tags. Our artisans combine traditional Rajasthani Kundan and Meenakari craft with modern anti-tarnish protective lacquer and feather-light alloy casting.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <Gem className="w-5 h-5 text-[#dfb150] mb-2" />
                <h4 className="font-serif text-white font-semibold text-sm">Anti-Tarnish Polish</h4>
                <p className="text-[11px] text-zinc-400 mt-1">Multi-layer 18K micro gold and rhodium plating sealed against humidity and moisture.</p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <ShieldCheck className="w-5 h-5 text-[#dfb150] mb-2" />
                <h4 className="font-serif text-white font-semibold text-sm">Hypoallergenic Skin Safe</h4>
                <p className="text-[11px] text-zinc-400 mt-1">100% nickel and lead-free alloy compositions tested for sensitive ears and necks.</p>
              </div>
            </div>

            <div>
              <button
                onClick={() => setActiveView('about')}
                className="px-6 py-3 rounded-xl border border-[#dfb150]/50 text-[#dfb150] hover:bg-[#dfb150] hover:text-black font-semibold text-xs uppercase tracking-wider transition-all"
              >
                Learn More About Our Brand
              </button>
            </div>
          </div>

          {/* Right Visual Collage */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#dfb150]/30 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80"
              alt="Artisan fashion jewellery craftsmanship"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/70 border border-[#dfb150]/30 backdrop-blur-md">
              <p className="font-serif text-white font-bold text-sm">
                “Every bell of our artificial jhumkas is balanced to give maximum sparkle without tugging on sensitive earlobes.”
              </p>
              <p className="text-[11px] text-[#dfb150] mt-1 font-medium">
                — JMKJEW Design Studio, Mumbai
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONCIERGE & SUPPORT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#17161c] via-[#201c13] to-[#17161c] border border-[#dfb150]/35 text-center flex flex-col items-center space-y-4 shadow-2xl">
          <Crown className="w-8 h-8 text-[#dfb150]" />
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
            Styling Advice & Bulk Gifting Collections
          </h2>
          <p className="text-zinc-300 text-xs sm:text-sm max-w-xl font-light">
            Need help matching your bridal lehenga or looking for custom bridesmaid jewellery gift hampers? Our team is available on WhatsApp and phone.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setActiveView('contact')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg cursor-pointer"
            >
              Get In Touch
            </button>
            <button
              onClick={() => setActiveView('order-tracking')}
              className="px-6 py-3 rounded-xl bg-black/60 border border-white/20 text-zinc-300 hover:text-white text-xs font-semibold hover:border-[#dfb150] transition-all"
            >
              Track Order Delivery
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
