export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  isFlagship6: boolean;
  iconName: 'Headphones' | 'BatteryCharging' | 'Zap' | 'Watch' | 'Home' | 'Sparkles';
  subcategories: string[];
  accentColor: string;
  itemCount: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: string; // matches Category.id
  categoryLabel: string;
  brand: string;
  price: number; // strictly numeric for sorting
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  warranty: string; // mandatory e.g., "18 Months Official Warranty"
  replacementPolicy: string; // mandatory e.g., "7-Day Instant Defect Replacement"
  authenticityGuarantee: string; // mandatory e.g., "100% Original & Serial Verified"
  specs: string[];
  description: string;
  features: string[];
  image: string;
  images?: string[];
  badge?: 'Bestseller' | 'New Launch' | 'Top Rated' | 'Hot Deal';
  isFeatured?: boolean;
  isNewLaunch?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'COD' | 'ADVANCE';

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  city?: string;
  notes?: string;
  advanceTxnId?: string;
}

export interface Order {
  orderId: string;
  createdAt: string;
  customer: CustomerDetails;
  paymentMethod: PaymentMethod;
  items: {
    productId: string;
    title: string;
    brand: string;
    quantity: number;
    unitPrice: number;
    image: string;
  }[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  status: 'Order Placed' | 'Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  estimatedDelivery: string;
}

export interface HeroSlide {
  id: string;
  tag: string;
  badgeType: 'new' | 'offer' | 'upcoming';
  title: string;
  subtitle: string;
  highlight: string;
  productSlug?: string;
  categorySlug: string;
  ctaText: string;
  imageUrl: string;
  secondaryImageUrl?: string;
  images?: string[];
  accentBg: string;
  textColor: string;
  badgeBg?: string;
  glowColor?: string;
  price?: number;
  originalPrice?: number;
  isCampaignSlide?: boolean;
  campaignMeta?: {
    eventTitle: string;
    badgeText: string;
    startsAt: string;
    couponCode: string;
    maxDiscountText: string;
    perks: string[];
  };
  eventOffer?: {
    badge: string;
    title: string;
    startsIn?: string;
  };
}

export interface Review {
  id: string;
  author: string;
  location: string;
  verified: boolean;
  rating: number;
  date: string;
  productTitle: string;
  category: string;
  comment: string;
  photoUrl?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Warranty & Authenticity' | 'Ordering & Delivery' | 'Payment & COD' | 'Replacement & Refunds';
}

