export type ProductCategory = 
  | 'artificial-jhumka'
  | 'fashion-earrings'
  | 'necklace-sets'
  | 'bridal-fashion'
  | 'jewellery-boxes'
  | 'designer-sets'
  | 'gift-collections';

export type PlatingFinish = 
  | '18K Micro Gold Polish'
  | 'Rose Gold Polish'
  | 'Rhodium Silver Polish'
  | 'Antique Matte Gold'
  | 'Oxidised Silver';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  plating: PlatingFinish;
  weightGrams?: number;
  dimensions: string;
  gemstones: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  shortDesc: string;
  description: string;
  images: string[];
  model3dType: 'jhumka' | 'necklace' | 'earring' | 'box';
  antiTarnish: boolean;
  skinFriendly: boolean;
  specifications: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPlating: PlatingFinish;
  selectedSize?: string;
  giftWrap: boolean;
  giftMessage?: string;
}

export type OrderStatus = 
  | 'Confirmed' 
  | 'Handcraft Quality Check' 
  | 'Velvet Gift Packaging' 
  | 'Dispatched' 
  | 'Delivered';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  plating: PlatingFinish;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  trackingCode: string;
  carrier: string;
  estimatedDelivery: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  giftWrapCost: number;
  shippingCost: number;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending COD';
  giftMessage?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  loyaltyTier: 'Silver Member' | 'Luxe Insider' | 'Royal Elite';
  loyaltyPoints: number;
  savedAddresses: Array<{
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  author: string;
  email?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  tag?: string;
  helpfulCount?: number;
}

export interface FilterState {
  category: ProductCategory | 'all';
  minPrice: number;
  maxPrice: number;
  plating: PlatingFinish | 'all';
  gemstone: string | 'all';
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  inStockOnly: boolean;
  searchQuery: string;
}
