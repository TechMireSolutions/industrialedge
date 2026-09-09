import { api } from './api';

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: string;
  _count: { orders: number };
}

export interface SalesReport {
  chartData: { date: string; total: number }[];
  totalRevenue: number;
  orderCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  price: number;
  oldPrice: number | null;
  sku: string;
  stock: number;
  badge: string | null;
  images: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  isTopSelling: boolean;
  isBestseller: boolean;
  active: boolean;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  active: boolean;
  _count?: { products: number };
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
  createdAt: string;
  updatedAt: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  active: boolean;
  ordering: number;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  active: boolean;
  ordering: number;
  createdAt: string;
  updatedAt: string;
}

export interface FooterContent {
  id: string;
  section: string;
  title: string;
  content: any;
  active: boolean;
  ordering: number;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  content: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
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
  updatedAt: string;
  user: { id: string; name: string };
  product?: { id: string; name: string; slug: string };
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  project: string | null;
  subject: string;
  message: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  user: { id: string; name: string; email: string } | null;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  billingAddress: any;
  shippingAddress: any;
  notes: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
  product: { id: string; name: string; slug: string; images: string[] };
}

export const adminApi = {
  // Products (Admin)
  getProducts: (params: { page?: number; limit?: number; search?: string; category?: string; active?: boolean } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    return api.get<{ data: Product[]; pagination: any }>(`/admin/products?${searchParams.toString()}`);
  },

  getProduct: (id: string) => api.get<Product>(`/admin/products/${id}`),

  createProduct: (data: any) => api.post<Product>('/admin/products', data),

  updateProduct: (id: string, data: any) => api.put<Product>(`/admin/products/${id}`, data),

  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),

  importProducts: (data: FormData) => api.post<{ successCount: number; failureCount: number; errors: any[] }>('/admin/products/import', data),

  // Categories (Admin)
  getCategories: (params: { page?: number; limit?: number; search?: string; active?: boolean } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    return api.get<{ data: Category[]; pagination: any }>(`/admin/categories?${searchParams.toString()}`);
  },

  getCategory: (id: string) => api.get<Category>(`/admin/categories/${id}`),

  createCategory: (data: any) => api.post<Category>('/admin/categories', data),

  updateCategory: (id: string, data: any) => api.put<Category>(`/admin/categories/${id}`, data),

  deleteCategory: (id: string) => api.delete(`/admin/categories/${id}`),

  // Tags (Admin)
  getTags: () => api.get<{ data: Tag[] }>(`/admin/tags`),

  getTag: (id: string) => api.get<{ data: Tag }>(`/admin/tags/${id}`),

  createTag: (data: any) => api.post<{ data: Tag }>('/admin/tags', data),

  updateTag: (id: string, data: any) => api.put<{ data: Tag }>(`/admin/tags/${id}`, data),

  deleteTag: (id: string) => api.delete(`/admin/tags/${id}`),

  // Collections (Admin)
  getCollections: (params: { search?: string; active?: boolean } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    return api.get<{ data: any[] }>(`/collections/admin?${searchParams.toString()}`);
  },

  getCollection: (id: string) => api.get<{ data: any }>(`/collections/admin/${id}`),

  createCollection: (data: any) => api.post<{ data: any }>('/collections/admin', data),

  updateCollection: (id: string, data: any) => api.put<{ data: any }>(`/collections/admin/${id}`, data),

  deleteCollection: (id: string) => api.delete(`/collections/admin/${id}`),

  assignCollectionProducts: (id: string, productIds: string[]) => api.post<{ data: any }>(`/collections/admin/${id}/products`, { productIds }),

  // Hero Slides
  getHeroSlides: (params: { activeOnly?: boolean } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.activeOnly !== undefined) searchParams.append('active', String(params.activeOnly));
    return api.get<HeroSlide[]>(`/admin/hero-slides?${searchParams.toString()}`);
  },

  getHeroSlide: (id: string) => api.get<HeroSlide>(`/admin/hero-slides/${id}`),

  createHeroSlide: (data: any) => api.post<HeroSlide>('/admin/hero-slides', data),

  updateHeroSlide: (id: string, data: any) => api.put<HeroSlide>(`/admin/hero-slides/${id}`, data),

  deleteHeroSlide: (id: string) => api.delete(`/admin/hero-slides/${id}`),

  reorderHeroSlides: (ids: string[]) => api.put('/admin/hero-slides/reorder', { ids }),

  // Banners
  getBanners: (params: { activeOnly?: boolean } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.activeOnly !== undefined) searchParams.append('active', String(params.activeOnly));
    return api.get<Banner[]>(`/admin/banners?${searchParams.toString()}`);
  },

  getBanner: (id: string) => api.get<Banner>(`/admin/banners/${id}`),

  createBanner: (data: any) => api.post<Banner>('/admin/banners', data),

  updateBanner: (id: string, data: any) => api.put<Banner>(`/admin/banners/${id}`, data),

  deleteBanner: (id: string) => api.delete(`/admin/banners/${id}`),

  // Offers
  getOffers: (params: { activeOnly?: boolean } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.activeOnly !== undefined) searchParams.append('active', String(params.activeOnly));
    return api.get<Offer[]>(`/admin/offers?${searchParams.toString()}`);
  },

  getOffer: (id: string) => api.get<Offer>(`/admin/offers/${id}`),

  createOffer: (data: any) => api.post<Offer>('/admin/offers', data),

  updateOffer: (id: string, data: any) => api.put<Offer>(`/admin/offers/${id}`, data),

  deleteOffer: (id: string) => api.delete(`/admin/offers/${id}`),

  // Services
  getServices: (params: { activeOnly?: boolean } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.activeOnly !== undefined) searchParams.append('active', String(params.activeOnly));
    return api.get<Service[]>(`/admin/services?${searchParams.toString()}`);
  },

  getService: (id: string) => api.get<Service>(`/admin/services/${id}`),

  createService: (data: any) => api.post<Service>('/admin/services', data),

  updateService: (id: string, data: any) => api.put<Service>(`/admin/services/${id}`, data),

  deleteService: (id: string) => api.delete(`/admin/services/${id}`),

  // Footer
  getFooter: (params: { activeOnly?: boolean } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.activeOnly !== undefined) searchParams.append('active', String(params.activeOnly));
    return api.get<FooterContent[]>(`/admin/footer?${searchParams.toString()}`);
  },

  getFooterSection: (section: string) => api.get<FooterContent>(`/admin/footer/${section}`),

  createFooter: (data: any) => api.post<FooterContent>('/admin/footer', data),

  updateFooter: (id: string, data: any) => api.put<FooterContent>(`/admin/footer/${id}`, data),

  deleteFooter: (id: string) => api.delete(`/admin/footer/${id}`),

  // Settings
  getSettings: () => api.get<SiteSettings>('/admin/settings'),

  updateSettings: (data: any) => api.put<SiteSettings>('/admin/settings', data),

  // Pages
  getPages: (params: { page?: number; limit?: number; active?: boolean; search?: string } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    return api.get<{ data: PageContent[]; pagination: any }>(`/admin/pages?${searchParams.toString()}`);
  },

  getPage: (slug: string) => api.get<PageContent>(`/admin/pages/${slug}`),

  createPage: (data: any) => api.post<PageContent>('/admin/pages', data),

  updatePage: (id: string, data: any) => api.put<PageContent>(`/admin/pages/${id}`, data),

  deletePage: (id: string) => api.delete(`/admin/pages/${id}`),

  // Coupons
  getCoupons: (params: { page?: number; limit?: number; search?: string; active?: boolean } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    return api.get<{ data: Coupon[]; pagination: any }>(`/admin/coupons?${searchParams.toString()}`);
  },

  getCoupon: (id: string) => api.get<Coupon>(`/admin/coupons/${id}`),

  createCoupon: (data: any) => api.post<Coupon>('/admin/coupons', data),

  updateCoupon: (id: string, data: any) => api.put<Coupon>(`/admin/coupons/${id}`, data),

  deleteCoupon: (id: string) => api.delete(`/admin/coupons/${id}`),

  validateCoupon: (code: string, subtotal: number) => api.post<{ coupon: Coupon; discount: number }>('/admin/coupons/validate', { code, subtotal }),

  // Reviews
  getReviews: (params: { page?: number; limit?: number; productId?: string; approved?: boolean } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    return api.get<{ data: Review[]; pagination: any }>(`/admin/reviews?${searchParams.toString()}`);
  },

  getReview: (id: string) => api.get<Review>(`/admin/reviews/${id}`),

  approveReview: (id: string) => api.put<Review>(`/admin/reviews/${id}/approve`),

  rejectReview: (id: string) => api.put<Review>(`/admin/reviews/${id}/reject`),

  deleteReview: (id: string) => api.delete(`/admin/reviews/${id}`),

  // Contact Submissions
  getContactSubmissions: (params: { page?: number; limit?: number; search?: string } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    return api.get<{ data: ContactSubmission[]; pagination: any }>(`/admin/contacts?${searchParams.toString()}`);
  },

  getContactSubmission: (id: string) => api.get<ContactSubmission>(`/admin/contacts/${id}`),

  deleteContactSubmission: (id: string) => api.delete(`/admin/contacts/${id}`),

  // Orders (Admin)
  getOrders: (params: { page?: number; limit?: number; status?: string; paymentStatus?: string; search?: string } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    return api.get<{ data: Order[]; pagination: any }>(`/admin/orders?${searchParams.toString()}`);
  },

  getOrder: (id: string) => api.get<Order>(`/admin/orders/${id}`),

  updateOrderStatus: (id: string, status: string) => api.put<Order>(`/admin/orders/${id}/status`, { status }),

  getRecentOrders: (limit = 10) => api.get<Order[]>(`/admin/orders/recent?limit=${limit}`),

  getLowStockProducts: (threshold = 10) => api.get<Product[]>(`/admin/products/low-stock?threshold=${threshold}`),

  getSalesReport: (days = 30) => api.get<SalesReport>(`/admin/reports/sales?days=${days}`),

  // Dashboard
  getDashboard: () => api.get<DashboardStats>('/admin/dashboard'),

  getUsers: (params: { page?: number; limit?: number; search?: string; role?: string } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    return api.get<{ data: AdminUser[]; pagination: any }>(`/admin/users?${searchParams.toString()}`);
  },

  getUser: (id: string) => api.get<any>(`/admin/users/${id}`),

  createUser: (data: any) => api.post('/admin/users', data),

  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),

  updateUserRole: (id: string, role: 'CUSTOMER' | 'ADMIN') => api.put(`/admin/users/${id}/role`, { role }),

  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  // Upload
  uploadImage: (fileOrFormData: File | FormData) => {
    let formData: FormData;

    if (fileOrFormData instanceof FormData) {
      formData = fileOrFormData;
    } else {
      formData = new FormData();
      // Try 'file' (most common) or 'image' depending on your backend multer configuration
      formData.append('image', fileOrFormData);
    }

    return api.post<{ url: string; filename: string; storagePath?: string }>(
      '/upload/image',
      formData
    );
  },

  uploadImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return api.post<{ urls: string[]; filenames: string[] }>(
      '/upload/images',
      formData
    );
  },

  // Media Library (Admin)
  getMediaAssets: (params: { page?: number; limit?: number; search?: string } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    return api.get<{ success: boolean; data: any[]; pagination?: any }>(`/media?${searchParams.toString()}`);
  },

  deleteMediaAsset: (id: string) => api.delete<{ success: boolean; message: string }>(`/media/${id}`),

  updateMediaAsset: (id: string, data: any) => api.put<{ success: boolean; data: any }>(`/media/${id}`, data),

  // Homepage Builder (Admin)
  getHomepageSections: (activeOnly = false) =>
    api.get<{ success: boolean; data: any[] }>(`/homepage-sections?active=${activeOnly}`),

  updateHomepageSections: (sections: any[]) =>
    api.put<{ success: boolean; message: string; data?: any[] }>('/homepage-sections', { sections }),

  // Menus / Navigation (Admin)
  getMenus: () =>
    api.get<{ success: boolean; data: any[] }>('/menus'),
  createMenu: (data: { name: string; slug: string; description?: string }) =>
    api.post<{ success: boolean; data: any }>('/menus', data),
  addMenuItem: (menuId: string, item: any) =>
    api.post<{ success: boolean; data: any }>(`/menus/${menuId}/items`, item),
  updateMenuItem: (itemId: string, item: any) =>
    api.put<{ success: boolean; data: any }>(`/menus/items/${itemId}`, item),
  deleteMenuItem: (itemId: string) =>
    api.delete<{ success: boolean; message: string }>(`/menus/items/${itemId}`),
  reorderMenuItems: (menuId: string, items: {id: string, order: number}[]) =>
    api.patch<{ success: boolean; message: string }>(`/menus/${menuId}/reorder`, { items }),

  // Partners (Admin)
  getPartners: (activeOnly = false) =>
    api.get<{ success: boolean; data: any[] }>(`/partners?active=${activeOnly}`),

  createPartner: (data: any) =>
    api.post<{ success: boolean; data: any }>('/partners', data),

  updatePartner: (id: string, data: any) =>
    api.put<{ success: boolean; data: any }>(`/partners/${id}`, data),

  deletePartner: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/partners/${id}`),
};