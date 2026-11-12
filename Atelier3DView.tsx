import React, { useState } from 'react';
import {
  Sparkles,
  Crown,
  ShoppingBag,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { JewelleryViewer3D } from '../components/3d/JewelleryViewer3D';
import { formatINR } from '../utils/currency';
import { PlatingFinish } from '../types';

export const Atelier3DView: React.FC = () => {
  const { products, addToCart, setActiveView } = useShop();

  const [selectedPiece, setSelectedPiece] = useState<'jhumka' | 'necklace' | 'ring' | 'box'>('jhumka');
  const [addedNotice, setAddedNotice] = useState(false);

  const modelOptions: {
    id: 'jhumka' | 'necklace' | 'ring' | 'box';
    name: string;
    desc: string;
    price: number;
    plating: PlatingFinish;
    linkedProduct: any;
  }[] = [
    {
      id: 'jhumka',
      name: 'Mughal Chandbali Kundan Jhumka',
      desc: 'Tiered umbrella bell with handcut Kundan, floral stud disc, and seed pearl cascade',
      price: 1899,
      plating: '18K Micro Gold Polish',
      linkedProduct: products.find((p) => p.category === 'artificial-jhumka') || products[0],
    },
    {
      id: 'necklace',
      name: 'Maharani Jadau Kundan Choker',
      desc: 'Regal curved collar torque with faceted kundan stones & emerald drop beads',
      price: 3499,
      plating: '18K Micro Gold Polish',
      linkedProduct: products.find((p) => p.category === 'necklace-sets') || products[3] || products[0],
    },
    {
      id: 'ring',
      name: 'Aurora Austrian CZ Chandelier Drop',
      desc: 'Waterfall chandelier earrings with brilliant-cut Austrian CZ and rhodium polish',
      price: 1599,
      plating: 'Rhodium Silver Polish',
      linkedProduct: products.find((p) => p.category === 'fashion-earrings') || products[1] || products[0],
    },
    {
      id: 'box',
      name: 'Imperial Emerald Velvet Multi-Tier Trunk',
      desc: 'Plush velvet organiser with gold-tone brass lock, ring rolls & necklace hooks',
      price: 2499,
      plating: '18K Micro Gold Polish',
      linkedProduct: products.find((p) => p.category === 'jewellery-boxes') || products[5] || products[0],
    },
  ];

  const currentConfig = modelOptions.find((m) => m.id === selectedPiece)!;

  const handleOrderCustomConfig = () => {
    addToCart(currentConfig.linkedProduct, 1, currentConfig.plating);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dfb150]/15 border border-[#dfb150]/30 text-amber-300 text-xs uppercase tracking-widest font-semibold">
          <Sparkles className="w-4 h-4 text-[#dfb150]" />
          <span>Interactive 3D Virtual Atelier</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
          The 3D Product Viewer
        </h1>
        <p className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed">
          Manipulate, rotate, and inspect our signature artificial and fashion jewellery in real-time photorealistic 3D. Experiment with 18K Micro Gold, Rose Gold, and Rhodium finishes directly in the viewport.
        </p>
      </div>

      {/* Model Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
        {modelOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelectedPiece(opt.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              selectedPiece === opt.id
                ? 'bg-[#181820] border-[#dfb150] ring-1 ring-[#dfb150]/50 shadow-xl'
                : 'bg-[#101014] border-white/10 text-zinc-400 hover:border-zinc-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#dfb150]">
                {opt.id}
              </span>
              <span className="text-xs font-bold text-white">
                {formatINR(opt.price)}
              </span>
            </div>
            <h4 className="font-serif font-bold text-sm text-white mt-1 truncate">
              {opt.name}
            </h4>
            <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5 font-light">
              {opt.desc}
            </p>
          </button>
        ))}
      </div>

      {/* 3D Main Stage */}
      <div className="relative rounded-3xl overflow-hidden border border-[#dfb150]/30 shadow-2xl bg-[#08080a]">
        <JewelleryViewer3D
          modelType={selectedPiece}
          productName={currentConfig.name}
          initialFinish="microgold"
          height="620px"
        />
      </div>

      {/* Bottom Action Bar */}
      <div className="p-6 rounded-3xl bg-[#121217] border border-[#dfb150]/25 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#dfb150]/15 border border-[#dfb150]/30 flex items-center justify-center text-[#dfb150]">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white">
              {currentConfig.name}
            </h3>
            <p className="text-xs text-zinc-400">
              Anti-Tarnish Polish • Skin-Safe & Hypoallergenic • Signature Velvet Packaging
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-right hidden sm:block pr-2">
            <span className="text-xs text-zinc-400 block">Online Price</span>
            <span className="text-2xl font-black text-white">
              {formatINR(currentConfig.price)}
            </span>
          </div>

          <button
            onClick={handleOrderCustomConfig}
            className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black font-extrabold text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-[0_0_20px_rgba(223,177,80,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Bag</span>
          </button>

          <button
            onClick={() => setActiveView('catalog')}
            className="px-4 py-3.5 rounded-xl bg-black/60 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold hover:border-[#dfb150] transition-all flex items-center gap-1.5"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 text-[#dfb150]" />
          </button>
        </div>
      </div>

      {addedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between max-w-xl mx-auto shadow-2xl animate-in fade-in">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{currentConfig.name} added to your shopping bag!</span>
          </span>
          <button
            onClick={() => setActiveView('checkout')}
            className="underline font-bold text-white hover:text-amber-200"
          >
            Go to Checkout
          </button>
        </div>
      )}
    </div>
  );
};
