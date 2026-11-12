import React from 'react';
import {
  Crown,
  Award,
  ShieldCheck,
  Gem,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AboutView: React.FC = () => {
  const { setActiveView } = useShop();

  const timeline = [
    {
      year: '2012',
      title: 'The Design Studio',
      desc: 'Founded in Mumbai with a singular mission: recreating the grandeur of royal Indian heritage jewellery as accessible, lightweight fashion art.',
    },
    {
      year: '2018',
      title: 'Anti-Tarnish Innovation',
      desc: 'Pioneered durable multi-layer 18K micro gold electroplating and clear e-coating that protects artificial pieces against oxidation and humidity.',
    },
    {
      year: '2021',
      title: 'Bridal Fashion Revolution',
      desc: 'Launched couture artificial bridal suites, allowing destination brides to enjoy grand heirloom photography without locker stress.',
    },
    {
      year: '2025',
      title: '3D Virtual Atelier',
      desc: 'Introduced real-time 3D product previews and complimentary pan-India express delivery for fashion jewellery connoisseurs.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-20">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#dfb150]/15 border border-[#dfb150]/30 text-amber-300 text-xs uppercase tracking-widest font-semibold">
          <Crown className="w-4 h-4 text-[#dfb150]" />
          <span>About JMKJEW</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white leading-tight">
          Elegance in Every Detail <br />
          <span className="gold-gradient-text">Premium Fashion Jewellery</span>
        </h1>
        <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed">
          JMKJEW is a dedicated fashion and artificial jewellery brand devoted to celebrating the majestic allure of Indian heritage. We handcraft pieces that bring out the queen in every woman.
        </p>
      </div>

      {/* Main Philosophy & Imagery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#dfb150] font-semibold">
            Single-Brand Dedication
          </span>
          <h2 className="font-serif text-3xl font-extrabold text-white">
            Why the Jhumka Remains Our Signature Piece
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
            Originating in ancient architectural temple domes, the Jhumka is a celebration of movement, grace, and rhythm. At JMKJEW, each artificial jhumka bell is precision-crafted with lightweight brass alloys, hand-set Kundan stones, and smooth pearl clusters so you can dance through sangeet and wedding nights without painful ear pulling.
          </p>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
            Our pieces feature advanced anti-tarnish micro plating (18K micro gold, rose gold, and rhodium polish) sealed with protective lacquer. 100% skin-friendly, lead-free, and nickel-tested for sensitive skin.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#121217] border border-white/5">
              <p className="font-serif text-2xl font-bold text-amber-200">100% Skin Safe</p>
              <p className="text-xs text-zinc-400 mt-1">Nickel and lead-free hypoallergenic alloy comfort</p>
            </div>
            <div className="p-4 rounded-xl bg-[#121217] border border-white/5">
              <p className="font-serif text-2xl font-bold text-amber-200">Anti-Tarnish</p>
              <p className="text-xs text-zinc-400 mt-1">Protective e-coating for long-lasting radiant shine</p>
            </div>
          </div>
        </div>

        <div className="relative aspect-[4/4.5] rounded-3xl overflow-hidden border border-[#dfb150]/30 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=80"
            alt="JMKJEW fashion jewellery craftsmanship"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/70 border border-[#dfb150]/30 backdrop-blur-md">
            <p className="font-serif text-sm font-bold text-white">
              “True elegance is wearing royal designs with effortless, carefree joy.”
            </p>
            <p className="text-[11px] text-[#dfb150] mt-1 font-semibold">
              — JMKJEW Brand Philosophy
            </p>
          </div>
        </div>
      </div>

      {/* Historical Milestones */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#0f0f13] border border-[#dfb150]/20 space-y-10">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#dfb150] font-semibold">
            Our Journey
          </span>
          <h2 className="font-serif text-3xl font-extrabold text-white mt-1">
            Redefining Modern Fashion Jewellery
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {timeline.map((item) => (
            <div key={item.year} className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2 relative">
              <span className="text-2xl font-serif font-black text-[#dfb150]">{item.year}</span>
              <h3 className="font-serif font-bold text-white text-sm">{item.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-white">Discover the Collection</h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setActiveView('catalog')}
            className="px-6 py-3 rounded-xl bg-[#dfb150] text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-lg"
          >
            Explore Catalogue
          </button>
          <button
            onClick={() => setActiveView('contact')}
            className="px-6 py-3 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold hover:border-[#dfb150] transition-all"
          >
            Contact Customer Care
          </button>
        </div>
      </div>
    </div>
  );
};
