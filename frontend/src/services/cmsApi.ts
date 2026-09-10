import { api } from './api';

export interface HeroSlide {
  id: string;
  image: string | null;
  imageAlt: string | null;
  titleLine1: string | null;
  titleLine2: string | null;
  titleLine3: string | null;
  eyebrowText: string | null;
  showEyebrow: boolean;
  description: string | null;
  primaryButtonText: string | null;
  primaryButtonUrl: string | null;
  showPrimaryCTA: boolean;
  secondaryButtonText: string | null;
  secondaryButtonUrl: string | null;
  showSecondaryCTA: boolean;
  active: boolean;
  ordering: number;
}

export interface Banner {
  id: string;
  title: string;
  description: string | null;
  image: string;
  discount: number | null;
  ctaText: string | null;
  ctaUrl: string | null;
  active: boolean;
  ordering: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string | null;
  image: string;
  discount: number;
  ctaText: string | null;
  ctaUrl: string | null;
  active: boolean;
  ordering: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  active: boolean;
  ordering: number;
}

export interface FooterContent {
  id: string;
  section: string;
  title: string;
  content: any;
  active: boolean;
  ordering: number;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  website: string | null;
  socialLinks: Record<string, string> | null;
  logo: string | null;
  favicon: string | null;
  themeSettings: any | null;
}

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  content: string;
  active: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  approved: boolean;
  createdAt: string;
  user: { id: string; name: string };
}

export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  minimumOrder: number | null;
  maximumDiscount: number | null;
  expiry: string | null;
  active: boolean;
  usageLimit: number | null;
  usageCount: number;
}

export const cmsApi = {
  getHeroSlides: (activeOnly = true) => api.get<HeroSlide[]>(`/hero-slides?active=${activeOnly}`),
  
  getHomepageSections: (activeOnly = true) => api.get<{ success: boolean; data: any[] }>(`/homepage-sections?active=${activeOnly}`),


  getBanners: (activeOnly = true) => api.get<Banner[]>(`/banners?active=${activeOnly}`),

  getOffers: (activeOnly = true) => api.get<Offer[]>(`/offers?active=${activeOnly}`),

  getServices: (activeOnly = true) => api.get<Service[]>(`/services?active=${activeOnly}`),

  getFooterContents: (activeOnly = true) => api.get<FooterContent[]>(`/footer?active=${activeOnly}`),

  getSiteSettings: () => api.get<SiteSettings>(`/settings`),

  getPages: (activeOnly = true) => api.get<PageContent[]>(`/pages?active=${activeOnly}`),

  getPage: (slug: string) => api.get<PageContent>(`/pages/${slug}`),

  getProductReviews: (productId: string, page = 1, limit = 10, approvedOnly = true) =>
    api.get<{ data: Review[]; pagination: any }>(`/products/${productId}/reviews?page=${page}&limit=${limit}&approved=${approvedOnly}`),

  submitReview: (productId: string, data: { rating: number; title: string; comment: string }) =>
    api.post<Review>(`/products/${productId}/reviews`, data),

  validateCoupon: (code: string, subtotal: number) =>
    api.post<{ coupon: Coupon; discount: number }>('/coupons/validate', { code, subtotal }),

  submitContact: (data: { name: string; email: string; phone?: string; project?: string; subject: string; message: string }) =>
    api.post('/contact', data),
};