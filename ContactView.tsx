import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  CheckCircle,
  Calendar,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [salonLocation, setSalonLocation] = useState('Mumbai Studio & Flagship Showroom');
  const [bookingDate, setBookingDate] = useState('2025-03-01');
  const [interestType, setInterestType] = useState('Bridal Fashion Suites & Jhumkas');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) return;
    setIsBooked(true);
  };

  const studios = [
    {
      city: 'Mumbai Studio & Experience Centre',
      address: 'Zaveri Heritage Arcade, Ground Floor, Kalbadevi, Mumbai 400002',
      phone: '+91 22 6123 9900',
      hours: 'Mon – Sat: 10:30 AM – 7:30 PM IST',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    },
    {
      city: 'Delhi Bridal Styling Lounge',
      address: 'D-32 South Extension Part 2, New Delhi 110049',
      phone: '+91 11 4102 7700',
      hours: 'Tue – Sun: 11:00 AM – 8:00 PM IST',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    },
    {
      city: 'Bengaluru Design Studio',
      address: 'Indiranagar 100ft Road, Stage 2, Bengaluru 560038',
      phone: '+91 80 4912 3300',
      hours: 'Mon – Sat: 11:00 AM – 7:30 PM IST',
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#dfb150]/15 border border-[#dfb150]/30 text-amber-300 text-xs uppercase tracking-widest font-semibold">
          <Sparkles className="w-4 h-4 text-[#dfb150]" />
          <span>JMKJEW Customer Care & Styling</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
          Get in Touch With Us
        </h1>
        <p className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed">
          Need styling assistance for your wedding ensemble, bulk bridesmaid gifting packages, or have questions about our anti-tarnish guarantee? We are here to help.
        </p>
      </div>

      {/* Main Form & Concierge Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Interactive Booking Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-[#121217] border border-[#dfb150]/30 shadow-2xl space-y-6">
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#dfb150]" />
            <span>Book a Bridal Styling Consultation</span>
          </h2>

          {isBooked ? (
            <div className="p-8 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-center space-y-4 animate-in fade-in">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-white">
                Consultation Request Received!
              </h3>
              <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{clientName}</strong>. Our senior jewellery stylist will connect with you on <strong>{clientPhone}</strong> to confirm your slot at <strong>{salonLocation}</strong> for <strong>{bookingDate}</strong>.
              </p>
              <p className="text-[11px] text-zinc-400">
                A confirmation summary has also been dispatched to {clientEmail}.
              </p>
              <button
                onClick={() => setIsBooked(false)}
                className="px-5 py-2 rounded-xl bg-[#dfb150] text-black text-xs font-bold uppercase tracking-wider mt-2"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1.5 font-medium">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Shalini Agarwal"
                    className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-[#dfb150]"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1.5 font-medium">Mobile Phone (WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+91 98201 00000"
                    className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-[#dfb150]"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1.5 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-[#dfb150]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1.5 font-medium">Preferred Mode / Location</label>
                  <select
                    value={salonLocation}
                    onChange={(e) => setSalonLocation(e.target.value)}
                    className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-[#dfb150] cursor-pointer"
                  >
                    <option>Mumbai Studio & Flagship Showroom</option>
                    <option>Delhi Bridal Styling Lounge</option>
                    <option>Bengaluru Design Studio</option>
                    <option>WhatsApp Video Call Consultation (Pan-India)</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1.5 font-medium">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-[#dfb150]"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1.5 font-medium">Category of Interest</label>
                <select
                  value={interestType}
                  onChange={(e) => setInterestType(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-[#dfb150] cursor-pointer"
                >
                  <option>Bridal Fashion Suites & Jhumkas</option>
                  <option>Artificial Jhumka Collection</option>
                  <option>Austrian CZ Necklace & Earring Sets</option>
                  <option>Bridesmaid Favour Gift Boxes</option>
                  <option>Jewellery Organizers & Velvet Trunks</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1.5 font-medium">Outfit Colors or Notes (Optional)</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share details regarding outfit colors (e.g. pastel pink lehenga, emerald saree), wedding date, or custom requirement..."
                  className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-[#dfb150]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#dfb150] via-[#f5d77f] to-[#c5973b] text-black font-extrabold text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-[0_0_20px_rgba(223,177,80,0.4)] cursor-pointer"
              >
                Confirm Consultation Request
              </button>
            </form>
          )}
        </div>

        {/* Right: Direct Assistance & WhatsApp Callout */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0f0f13] border border-[#dfb150]/20 space-y-4">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#dfb150]" />
              <span>Customer Helpline & WhatsApp</span>
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Have an urgent delivery enquiry or need order status assistance? Reach our customer care team:
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-[10px]">Customer Care Helpline</p>
                  <p className="font-bold text-white">+91 22 6123 9900</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">10am – 7pm IST</span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-[10px]">WhatsApp Support</p>
                  <p className="font-bold text-[#dfb150]">+91 98201 91600</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 font-semibold">
                  Fast Replies
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-[10px]">Email Enquiries</p>
                  <p className="font-bold text-white">support@jmkjew.com</p>
                </div>
                <span className="text-[10px] text-zinc-400">Within 4 Hours</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#141419] border border-white/5 space-y-3">
            <ShieldCheck className="w-6 h-6 text-[#dfb150]" />
            <h4 className="font-serif font-bold text-white text-sm">7-Day Easy Doorstep Exchange</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              If a necklace or jhumka does not match your festive attire, we arrange a reverse courier pickup right from your home with zero hassle.
            </p>
          </div>
        </div>
      </div>

      {/* Showroom & Experience Studios Grid */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-white text-center">
          Our Experience Studios & Showrooms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studios.map((s) => (
            <div
              key={s.city}
              className="rounded-3xl luxury-card overflow-hidden border border-[#dfb150]/20 flex flex-col justify-between"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={s.image}
                  alt={s.city}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-3 left-4 font-serif text-lg font-bold text-white">
                  {s.city}
                </span>
              </div>
              <div className="p-5 space-y-2.5 text-xs text-zinc-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#dfb150] shrink-0 mt-0.5" />
                  <span>{s.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#dfb150] shrink-0" />
                  <span>{s.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-400">
                  <Clock className="w-4 h-4 text-[#dfb150] shrink-0 mt-0.5" />
                  <span>{s.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
