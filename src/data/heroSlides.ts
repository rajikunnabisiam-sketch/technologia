import { HeroSlide } from '@/types';

export const HERO_SLIDES: HeroSlide[] = [
  // -------------------------------------------------------------------------
  // SLIDE 1: DEDICATED INDIVIDUAL CAMPAIGN SLIDE (BIGGER, HIGH-IMPACT, NON-AI)
  // Discount News #1: The storewide upcoming Tech Mega Fest 2026 event
  // -------------------------------------------------------------------------
  {
    id: 'slide-campaign-megafest',
    isCampaignSlide: true,
    tag: 'UPCOMING SALE EVENT • TECH FEST 2026',
    badgeType: 'upcoming',
    title: 'Grand Gadget Carnival 2026',
    subtitle: 'Save up to ৳8,500 on authentic flagship audio, smartwatches & GaN chargers. Factory-sealed with official brand warranties.',
    highlight: 'Starts Friday • Voucher: MEGA2026 • Free Nationwide Express COD',
    campaignMeta: {
      eventTitle: 'Technologia Tech Mega Fest 2026',
      badgeText: 'UPCOMING MEGA SALE EVENT',
      startsAt: 'STARTS THIS FRIDAY • 12:00 AM',
      couponCode: 'MEGA2026',
      maxDiscountText: 'SAVE UP TO ৳8,500',
      perks: [
        '0% EMI up to 12 Months',
        'Nationwide Free COD',
        'Official Brand Warranty',
        '7-Day Defect Replacement'
      ]
    },
    productSlug: 'sony-wh-1000xm5-wireless-headphones',
    categorySlug: 'headphones',
    ctaText: 'Preview Festival Deals',
    imageUrl: '/images/products/sony-wh-1000xm5-black.webp',
    secondaryImageUrl: '/images/products/airpods-pro-pair.png',
    images: [
      '/images/products/sony-wh-1000xm5-black.webp',
      '/images/products/airpods-pro-pair.png',
      '/images/products/anker-prime-200w.jpg',
    ],
    accentBg: 'from-slate-50 via-white to-amber-50/40',
    textColor: 'text-slate-900',
    badgeBg: 'bg-slate-900 text-white',
    glowColor: 'bg-amber-400/20',
  },

  // -------------------------------------------------------------------------
  // SLIDE 2: INDIVIDUAL PRODUCT DISCOUNT SPOTLIGHT
  // Discount News #2: Genuine flagship discount on Sony WH-1000XM5
  // Clean, authentic pricing without spammy flame badges
  // -------------------------------------------------------------------------
  {
    id: 'slide-sony-xm5',
    isCampaignSlide: false,
    tag: 'FESTIVAL DISCOUNT SPOTLIGHT',
    badgeType: 'offer',
    title: 'Sony WH-1000XM5 Silence Master',
    subtitle: 'Industry-leading dual-processor ANC (QN1 + V1) with 8 microphones. Hi-Res Wireless LDAC and ultra-comfortable soft-fit synthetic leather earcups.',
    highlight: '৳5,500 Festival Discount • 30H Playtime • Dual-Chip ANC • LDAC Wireless Hi-Res',
    productSlug: 'sony-wh-1000xm5-wireless-headphones',
    categorySlug: 'headphones',
    ctaText: 'Claim Festival Deal',
    imageUrl: '/images/products/sony-wh-1000xm5-black.webp',
    secondaryImageUrl: '/images/products/sony-wh-1000xm5-angle.webp',
    images: [
      '/images/products/sony-wh-1000xm5-black.webp',
      '/images/products/sony-wh-1000xm5-angle.webp',
      '/images/products/sony-wh-1000xm5-case.jpg',
    ],
    accentBg: 'from-white via-slate-50 to-amber-50/50',
    textColor: 'text-amber-800',
    badgeBg: 'bg-amber-600 text-white',
    glowColor: 'bg-amber-400/25',
    price: 36500,
    originalPrice: 42000,
  },

  // -------------------------------------------------------------------------
  // SLIDE 3: NEW ARRIVAL - Soundcore R60i NC (Clean Product Feature)
  // -------------------------------------------------------------------------
  {
    id: 'slide-r60i',
    isCampaignSlide: false,
    tag: 'NEW ARRIVAL • 2026 AUDIO GADGET',
    badgeType: 'new',
    title: 'Anker Soundcore R60i NC',
    subtitle: 'Real-time adaptive Active Noise Cancellation adjusting every 0.007s up to -52dB. 11mm Titanium Drivers with LDAC Wireless Hi-Res Audio certification.',
    highlight: '-52dB Adaptive ANC • 50H Battery • LDAC Hi-Res • 18M Official Warranty',
    productSlug: 'anker-soundcore-r60i-nc-tws-earbuds',
    categorySlug: 'headphones',
    ctaText: 'Order Now (COD)',
    imageUrl: '/images/products/soundcore-r60i-main.jpg',
    secondaryImageUrl: '/images/products/soundcore-r60i-lifestyle.jpg',
    images: [
      '/images/products/soundcore-r60i-main.jpg',
      '/images/products/soundcore-r60i-nc.jpg',
      '/images/products/soundcore-r60i-lifestyle.jpg',
    ],
    accentBg: 'from-white via-slate-50 to-emerald-50/60',
    textColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-600 text-white',
    glowColor: 'bg-emerald-400/25',
    price: 3299,
    originalPrice: 3899,
  },

  // -------------------------------------------------------------------------
  // SLIDE 4: HARDWARE POWER - Anker Prime 200W (Clean Product Feature)
  // -------------------------------------------------------------------------
  {
    id: 'slide-anker-prime',
    isCampaignSlide: false,
    tag: 'HIGH-WATTAGE POWERHOUSE • 200W MULTI-PORT',
    badgeType: 'new',
    title: 'Anker Prime 200W Multi-Port',
    subtitle: 'Dual 100W simultaneous high-speed USB-C laptop charging. Real-time smart active OLED display showing port wattage and remaining capacity.',
    highlight: '20,000mAh • 200W Total Output • Smart OLED Display • Airline Approved',
    productSlug: 'anker-prime-20000mah-200w-power-bank',
    categorySlug: 'power-banks',
    ctaText: 'Explore Anker Prime',
    imageUrl: '/images/products/anker-prime-200w.jpg',
    secondaryImageUrl: '/images/products/anker-prime-screen.jpg',
    images: [
      '/images/products/anker-prime-200w.jpg',
      '/images/products/anker-prime-screen.jpg',
    ],
    accentBg: 'from-white via-slate-50 to-blue-50/60',
    textColor: 'text-blue-700',
    badgeBg: 'bg-blue-600 text-white',
    glowColor: 'bg-blue-400/25',
    price: 8500,
    originalPrice: 9500,
  },

  // -------------------------------------------------------------------------
  // SLIDE 5: RUGGED WEARABLE - Apple Watch Ultra Titanium (Clean Product Feature)
  // -------------------------------------------------------------------------
  {
    id: 'slide-watch-ultra',
    isCampaignSlide: false,
    tag: 'RUGGED TITANIUM FLAGSHIP',
    badgeType: 'upcoming',
    title: 'Apple Watch Ultra Titanium',
    subtitle: 'Aerospace-grade 49mm titanium case, precision dual-frequency GPS, up to 36 hours battery life, 100m water resistance, and customizable action button.',
    highlight: '49mm Titanium • Dual-Frequency GPS • 100m Water Resistant • 36H Battery',
    categorySlug: 'smart-watches',
    ctaText: 'Explore Smartwatches',
    imageUrl: '/images/products/apple-watch-ultra-gng.jpg',
    secondaryImageUrl: '/images/products/apple-watch-black.png',
    images: [
      '/images/products/apple-watch-ultra-gng.jpg',
      '/images/products/apple-watch-black.png',
    ],
    accentBg: 'from-white via-slate-50 to-orange-50/60',
    textColor: 'text-orange-800',
    badgeBg: 'bg-orange-600 text-white',
    glowColor: 'bg-orange-400/25',
    price: 89500,
    originalPrice: 98000,
  },
];
