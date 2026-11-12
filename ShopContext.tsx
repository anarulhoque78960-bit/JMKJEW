import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  User,
  FilterState,
  ProductCategory,
  PlatingFinish,
  Review,
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../data/products';

interface ShopContextType {
  // Navigation
  activeView: string;
  setActiveView: (view: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  viewProductDetails: (product: Product) => void;

  // Products & CRUD
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;

  // Reviews
  reviews: Review[];
  addReview: (reviewData: Omit<Review, 'id' | 'date'>) => { success: boolean; review: Review; message: string };
  deleteReview: (reviewId: string) => void;
  voteReviewHelpful: (reviewId: string) => void;
  getProductReviews: (productId: string) => Review[];
  getProductRatingStats: (productId: string) => {
    average: number;
    count: number;
    breakdown: Record<number, number>;
    percentBreakdown: Record<number, number>;
  };

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, plating?: PlatingFinish, size?: string) => void;
  removeFromCart: (productId: string, plating: PlatingFinish) => void;
  updateCartQuantity: (productId: string, plating: PlatingFinish, quantity: number) => void;
  toggleGiftWrap: (productId: string, plating: PlatingFinish) => void;
  setGiftMessage: (productId: string, plating: PlatingFinish, message: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;
  cartCount: number;
  couponCode: string;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders & Tracking
  orders: Order[];
  placeOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  trackedOrder: Order | null;
  setTrackedOrder: (order: Order | null) => void;
  trackOrderById: (orderNumber: string) => Order | null;

  // Authentication & Profile
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  switchRole: () => void;
  login: (email: string, role?: 'customer' | 'admin') => void;
  logout: () => void;

  // Filters & Search
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  setCategoryFilter: (category: ProductCategory | 'all') => void;
  setSearchQuery: (query: string) => void;
}

const DEFAULT_USER: User = {
  id: 'usr-889',
  name: 'Radhika Singhania',
  email: 'radhika.singhania@jmkjew.com',
  phone: '+91 98201 91600',
  role: 'customer',
  loyaltyTier: 'Royal Elite',
  loyaltyPoints: 1250,
  savedAddresses: [
    {
      id: 'addr-01',
      name: 'Primary Residence',
      street: 'Villa 18, Altamount Road, Cumballa Hill',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400026',
      country: 'India',
      isDefault: true,
    },
    {
      id: 'addr-02',
      name: 'New Delhi Studio',
      street: '7 Khan Market Residential Block',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110003',
      country: 'India',
      isDefault: false,
    },
  ],
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'JMK-89421',
    createdAt: '2025-02-16T10:30:00Z',
    status: 'Dispatched',
    trackingCode: 'BD-EXP-9928192',
    carrier: 'Blue Dart Express Courier',
    estimatedDelivery: '3 - 5 Days',
    items: [
      {
        productId: 'jmk-jhm-01',
        productName: 'Mughal Chandbali Kundan Jhumka',
        productImage: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80',
        price: 1899,
        quantity: 1,
        plating: '18K Micro Gold Polish',
      },
    ],
    subtotal: 1899,
    discount: 190,
    giftWrapCost: 149,
    shippingCost: 0,
    total: 1858,
    customerName: 'Radhika Singhania',
    customerEmail: 'radhika.singhania@jmkjew.com',
    customerPhone: '+91 98201 91600',
    shippingAddress: {
      street: 'Villa 18, Altamount Road, Cumballa Hill',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400026',
      country: 'India',
    },
    paymentMethod: 'UPI / NetBanking Instant (PhonePe / GPay)',
    paymentStatus: 'Paid',
    giftMessage: 'With love on your birthday! Enjoy the royal sparkle.',
  },
  {
    id: 'ord-1002',
    orderNumber: 'JMK-87103',
    createdAt: '2025-02-05T14:15:00Z',
    status: 'Delivered',
    trackingCode: 'DLV-STD-8711420',
    carrier: 'Delhivery Surface Express',
    estimatedDelivery: 'Delivered on Feb 09, 2025',
    items: [
      {
        productId: 'jmk-box-01',
        productName: 'Imperial Emerald Velvet Multi-Tier Jewellery Trunk',
        productImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
        price: 2499,
        quantity: 1,
        plating: '18K Micro Gold Polish',
      },
    ],
    subtotal: 2499,
    discount: 250,
    giftWrapCost: 0,
    shippingCost: 0,
    total: 2249,
    customerName: 'Radhika Singhania',
    customerEmail: 'radhika.singhania@jmkjew.com',
    customerPhone: '+91 98201 91600',
    shippingAddress: {
      street: 'Villa 18, Altamount Road, Cumballa Hill',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400026',
      country: 'India',
    },
    paymentMethod: 'Credit Card (Visa / Mastercard)',
    paymentStatus: 'Paid',
  },
];

const INITIAL_FILTERS: FilterState = {
  category: 'all',
  minPrice: 0,
  maxPrice: 10000,
  plating: 'all',
  gemstone: 'all',
  sortBy: 'featured',
  inStockOnly: false,
  searchQuery: '',
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Products state (using v4 key to ensure fresh fashion jewellery catalog)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('jmk_fashion_products_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].price < 20000) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('jmk_fashion_products_v4', JSON.stringify(products));
  }, [products]);

  // Reviews state (persistent in localStorage)
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('jmk_fashion_reviews_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('jmk_fashion_reviews_v1', JSON.stringify(reviews));
  }, [reviews]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('jmk_fashion_cart_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].product.price < 20000) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedPlating: '18K Micro Gold Polish',
        giftWrap: true,
        giftMessage: 'Happy Celebration, enjoy this handmade piece!',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('jmk_fashion_cart_v4', JSON.stringify(cart));
  }, [cart]);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('jmk_fashion_wishlist_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ['jmk-jhm-02', 'jmk-nck-01'];
  });

  useEffect(() => {
    localStorage.setItem('jmk_fashion_wishlist_v4', JSON.stringify(wishlist));
  }, [wishlist]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('jmk_fashion_orders_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].total < 50000) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('jmk_fashion_orders_v4', JSON.stringify(orders));
  }, [orders]);

  const [trackedOrder, setTrackedOrder] = useState<Order | null>(orders[0] || null);

  // User
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('jmk_fashion_user_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    localStorage.setItem('jmk_fashion_user_v4', JSON.stringify(user));
  }, [user]);

  // Coupons
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('JMKJEW10');

  // Filters
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Helper actions
  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `jmk-custom-${Date.now()}`;
    const product: Product = { ...newProd, id };
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct((prev) => (prev ? { ...prev, ...updatedFields } : null));
    }
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const resetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    setReviews(INITIAL_REVIEWS);
    localStorage.removeItem('jmk_fashion_products_v4');
    localStorage.removeItem('jmk_fashion_reviews_v1');
  };

  // Review management & dynamic rating calculation
  const getProductReviews = (productId: string): Review[] => {
    return reviews.filter((r) => r.productId === productId);
  };

  const getProductRatingStats = (productId: string) => {
    const prodReviews = reviews.filter((r) => r.productId === productId);
    const count = prodReviews.length;
    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const percentBreakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (count === 0) {
      return { average: 5.0, count: 0, breakdown, percentBreakdown };
    }

    let sum = 0;
    prodReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      breakdown[star] = (breakdown[star] || 0) + 1;
      sum += r.rating;
    });

    const average = Number((sum / count).toFixed(2));
    for (let s = 1; s <= 5; s++) {
      percentBreakdown[s] = Math.round(((breakdown[s] || 0) / count) * 100);
    }

    return { average, count, breakdown, percentBreakdown };
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const targetProduct = products.find((p) => p.id === reviewData.productId);
    const productName = reviewData.productName || targetProduct?.name || 'Handcrafted Jewellery';

    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      productName,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: reviewData.helpfulCount || 0,
    };

    const updatedReviews = [newRev, ...reviews];
    setReviews(updatedReviews);

    // Recalculate average rating & review count for the product
    const prodReviews = updatedReviews.filter((r) => r.productId === reviewData.productId);
    const newAverage = Number(
      (prodReviews.reduce((acc, r) => acc + r.rating, 0) / prodReviews.length).toFixed(2)
    );
    const newReviewCount = prodReviews.length;

    updateProduct(reviewData.productId, {
      rating: newAverage,
      reviewCount: newReviewCount,
    });

    // Credit user with 100 JMK Club loyalty points for reviewing
    setUser((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + 100,
    }));

    return {
      success: true,
      review: newRev,
      message: 'Thank you! Your product review has been published and 100 JMK Club Points have been credited.',
    };
  };

  const deleteReview = (reviewId: string) => {
    const revToDelete = reviews.find((r) => r.id === reviewId);
    const updatedReviews = reviews.filter((r) => r.id !== reviewId);
    setReviews(updatedReviews);

    if (revToDelete) {
      const prodReviews = updatedReviews.filter((r) => r.productId === revToDelete.productId);
      const newAverage =
        prodReviews.length > 0
          ? Number((prodReviews.reduce((acc, r) => acc + r.rating, 0) / prodReviews.length).toFixed(2))
          : 5.0;
      updateProduct(revToDelete.productId, {
        rating: newAverage,
        reviewCount: prodReviews.length,
      });
    }
  };

  const voteReviewHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
    );
  };

  // Cart operations
  const addToCart = (
    product: Product,
    quantity = 1,
    plating: PlatingFinish = product.plating,
    size?: string
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedPlating === plating
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        if (size) copy[existingIndex].selectedSize = size;
        return copy;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedPlating: plating,
          selectedSize: size,
          giftWrap: false,
        },
      ];
    });
  };

  const removeFromCart = (productId: string, plating: PlatingFinish) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedPlating === plating)
      )
    );
  };

  const updateCartQuantity = (
    productId: string,
    plating: PlatingFinish,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, plating);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedPlating === plating
          ? { ...item, quantity }
          : item
      )
    );
  };

  const toggleGiftWrap = (productId: string, plating: PlatingFinish) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedPlating === plating
          ? { ...item, giftWrap: !item.giftWrap }
          : item
      )
    );
  };

  const setGiftMessage = (
    productId: string,
    plating: PlatingFinish,
    message: string
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedPlating === plating
          ? { ...item, giftMessage: message }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Cart calculations in INR
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Luxury Velvet Gift Packaging: ₹149 per wrapped item
  const giftWrapTotal = cart.reduce(
    (acc, item) => acc + (item.giftWrap ? 149 : 0),
    0
  );

  let cartDiscount = 0;
  if (appliedCoupon === 'JMKJEW10') {
    cartDiscount = Math.round(cartSubtotal * 0.1);
  } else if (appliedCoupon === 'FASHION15') {
    cartDiscount = Math.round(cartSubtotal * 0.15);
  } else if (appliedCoupon === 'ELEGANCE500') {
    cartDiscount = cartSubtotal >= 1999 ? 500 : 0;
  }

  // Free shipping for orders above ₹999, otherwise ₹99 express delivery
  const cartShipping = cartSubtotal >= 999 || cartSubtotal === 0 ? 0 : 99;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + giftWrapTotal + cartShipping);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'JMKJEW10' || clean === 'FASHION15' || clean === 'ELEGANCE500') {
      setAppliedCoupon(clean);
      return { success: true, message: `Voucher ${clean} applied successfully!` };
    }
    return { success: false, message: 'Invalid voucher code. Try JMKJEW10 or FASHION15' };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const placeOrder = (orderData: Partial<Order>): Order => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `JMK-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      trackingCode: `BD-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      carrier: 'Blue Dart Express Courier',
      estimatedDelivery: '3 - 5 Business Days',
      items: cart.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        productImage: i.product.images[0],
        price: i.product.price,
        quantity: i.quantity,
        plating: i.selectedPlating,
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      giftWrapCost: giftWrapTotal,
      shippingCost: cartShipping,
      total: cartTotal,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
      shippingAddress: user.savedAddresses[0] || {
        street: 'Villa 18, Altamount Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400026',
        country: 'India',
      },
      paymentMethod: 'UPI / NetBanking Instant',
      paymentStatus: 'Paid',
      ...orderData,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setTrackedOrder(newOrder);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    if (trackedOrder && trackedOrder.id === orderId) {
      setTrackedOrder((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const trackOrderById = (orderNumber: string): Order | null => {
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase() ||
        o.trackingCode.toLowerCase() === orderNumber.trim().toLowerCase()
    );
    if (found) {
      setTrackedOrder(found);
      return found;
    }
    return null;
  };

  // Auth & Roles
  const switchRole = () => {
    setUser((prev) => ({
      ...prev,
      role: prev.role === 'customer' ? 'admin' : 'customer',
    }));
  };

  const login = (email: string, role: 'customer' | 'admin' = 'customer') => {
    setUser({
      ...DEFAULT_USER,
      email,
      role,
      name: email.split('@')[0].toUpperCase(),
    });
  };

  const logout = () => {
    setUser({
      ...DEFAULT_USER,
      name: 'Guest Shopper',
      email: 'shopper@jmkjew.com',
      role: 'customer',
    });
  };

  // Filters
  const resetFilters = () => setFilters(INITIAL_FILTERS);

  const setCategoryFilter = (category: ProductCategory | 'all') => {
    setFilters((prev) => ({ ...prev, category }));
    setActiveView('catalog');
  };

  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
    if (activeView !== 'catalog') {
      setActiveView('catalog');
    }
  };

  return (
    <ShopContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedProduct,
        setSelectedProduct,
        viewProductDetails,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
        reviews,
        addReview,
        deleteReview,
        voteReviewHelpful,
        getProductReviews,
        getProductRatingStats,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleGiftWrap,
        setGiftMessage,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTotal,
        cartCount,
        couponCode,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        placeOrder,
        updateOrderStatus,
        trackedOrder,
        setTrackedOrder,
        trackOrderById,
        user,
        setUser,
        switchRole,
        login,
        logout,
        filters,
        setFilters,
        resetFilters,
        setCategoryFilter,
        setSearchQuery,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
