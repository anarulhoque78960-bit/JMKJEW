import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { ProductDetailView } from './views/ProductDetailView';
import { Atelier3DView } from './views/Atelier3DView';
import { CheckoutView } from './views/CheckoutView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { ProfileView } from './views/ProfileView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { WishlistView } from './views/WishlistView';
import { ShieldCheck, UserCheck, Layers, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView, setActiveView, user, switchRole } = useShop();
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const renderCurrentView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'catalog':
        return <CatalogView />;
      case 'product-detail':
        return <ProductDetailView />;
      case '3d-atelier':
        return <Atelier3DView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order-tracking':
        return <OrderTrackingView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminDashboardView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'wishlist':
        return <WishlistView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col justify-between selection:bg-[#dfb150]/30 selection:text-amber-100 font-sans">
      {/* Top Header */}
      <Header onOpenCart={() => setCartDrawerOpen(true)} />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onProceedToCheckout={() => {
          setCartDrawerOpen(false);
          setActiveView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating Demo Helper Switcher (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2">
        <button
          onClick={switchRole}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#121217]/95 border border-[#dfb150]/50 text-amber-200 text-xs font-semibold backdrop-blur-md shadow-2xl hover:bg-[#dfb150] hover:text-black transition-all cursor-pointer"
          title="Click to toggle between Customer View and Admin Dashboard"
        >
          <UserCheck className="w-4 h-4 text-[#dfb150]" />
          <span>Role: <strong className="uppercase">{user.role}</strong></span>
          <span className="text-[10px] opacity-75">(Click to Toggle)</span>
        </button>

        {user.role === 'admin' && activeView !== 'admin' && (
          <button
            onClick={() => setActiveView('admin')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-[#dfb150] to-[#f5d77f] text-black text-xs font-bold shadow-2xl hover:opacity-90 transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Admin Portal</span>
          </button>
        )}
      </div>

      {/* Luxury Brand Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
