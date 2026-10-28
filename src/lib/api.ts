// Client API Service for Industrial Edge Frontend & Custom Admin Panel

export interface ProductItem {
  id: string;
  name: string;
  slug?: string;
  category: string;
  price: number;
  originalPrice?: number;
  status: "none" | "discount" | "new" | "hot" | "sale";
  stock: number;
  rating?: number;
  ratingCount?: number;
  image: string;
  images?: string[];
  description?: string;
  specs?: Record<string, string>;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isFeaturedTab?: boolean;
  createdAt?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  count?: number;
  description?: string;
}

export interface OrderItem {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip?: string;
    country?: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    qty: number;
    image: string;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface BannerSettings {
  hero: {
    brandTag: string;
    price: number;
    subtitle: string;
    titleLine1: string;
    titleLine2: string;
    image: string;
    backgroundImage: string;
    ctaLink: string;
    badge: string;
  };
  heroSideProducts: Array<{
    id: string;
    name: string;
    category: string;
    categoryLink: string;
    price: number;
    image: string;
    description: string;
  }>;
  gameConsoleBanner: {
    title: string;
    originalPrice: string;
    currentPrice: string;
    saleBadge: string;
    image: string;
    backgroundImage: string;
    ctaText: string;
    ctaLink: string;
  };
  dualPromoBanner: {
    badgeText: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    image1: string;
    image2: string;
  };
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  logo: string;
  supportPhone: string;
  supportEmail: string;
  address: string;
  workingHours: string;
  currency: string;
  currencyCode: string;
  freeShippingThreshold: number;
  taxRate: number;
  announcementBar: {
    enabled: boolean;
    text: string;
    linkText: string;
    linkUrl: string;
  };
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  copyrightText: string;
  aboutText: string;
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  value: number;
  minSpend?: number;
  maxUses?: number;
  usageCount: number;
  expiresAt: string;
  active: boolean;
}

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
}

export interface DashboardStats {
  metrics: {
    totalSales: number;
    totalOrders: number;
    pendingOrders: number;
    totalProducts: number;
    lowStockCount: number;
    outOfStockCount: number;
    unreadInquiries: number;
    totalCategories: number;
  };
  statusBreakdown: Array<{ label: string; count: number; color: string }>;
  salesTrend: Array<{ month: string; revenue: number; orders: number }>;
  lowStockItems: ProductItem[];
  recentOrders: OrderItem[];
}

// Request helper with intelligent URL handling (relative /api for seamless proxying)
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `/api${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || `API Error: ${res.statusText}`);
  }
  return json.data !== undefined ? json.data : json;
}

export const api = {
  // Products
  async getProducts(params?: { category?: string; search?: string; status?: string; featured?: string; limit?: number }): Promise<ProductItem[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);
    if (params?.featured) query.set("featured", params.featured);
    if (params?.limit) query.set("limit", params.limit.toString());
    const qStr = query.toString() ? `?${query.toString()}` : "";
    return fetchApi<ProductItem[]>(`/products${qStr}`);
  },

  async getProduct(id: string): Promise<ProductItem> {
    return fetchApi<ProductItem>(`/products/${id}`);
  },

  async createProduct(product: Partial<ProductItem>): Promise<ProductItem> {
    return fetchApi<ProductItem>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  },

  async updateProduct(id: string, product: Partial<ProductItem>): Promise<ProductItem> {
    return fetchApi<ProductItem>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
  },

  async deleteProduct(id: string): Promise<void> {
    return fetchApi<void>(`/products/${id}`, { method: "DELETE" });
  },

  async toggleProductStock(id: string): Promise<ProductItem> {
    return fetchApi<ProductItem>(`/products/${id}/stock`, {
      method: "PATCH",
      body: JSON.stringify({ toggleInStock: true }),
    });
  },

  // Categories
  async getCategories(): Promise<CategoryItem[]> {
    return fetchApi<CategoryItem[]>("/categories");
  },

  async createCategory(cat: { name: string; icon?: string; image?: string; description?: string }): Promise<CategoryItem> {
    return fetchApi<CategoryItem>("/categories", {
      method: "POST",
      body: JSON.stringify(cat),
    });
  },

  async updateCategory(id: string, cat: Partial<CategoryItem>): Promise<CategoryItem> {
    return fetchApi<CategoryItem>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(cat),
    });
  },

  async deleteCategory(id: string): Promise<void> {
    return fetchApi<void>(`/categories/${id}`, { method: "DELETE" });
  },

  // Orders
  async getOrders(status?: string, search?: string): Promise<OrderItem[]> {
    const q = new URLSearchParams();
    if (status && status !== "all") q.set("status", status);
    if (search) q.set("search", search);
    const qStr = q.toString() ? `?${q.toString()}` : "";
    return fetchApi<OrderItem[]>(`/orders${qStr}`);
  },

  async getOrder(id: string): Promise<OrderItem> {
    return fetchApi<OrderItem>(`/orders/${id}`);
  },

  async createOrder(orderData: Partial<OrderItem>): Promise<OrderItem> {
    return fetchApi<OrderItem>("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  async updateOrder(id: string, orderData: Partial<OrderItem>): Promise<OrderItem> {
    return fetchApi<OrderItem>(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(orderData),
    });
  },

  async deleteOrder(id: string): Promise<void> {
    return fetchApi<void>(`/orders/${id}`, { method: "DELETE" });
  },

  // Banners ("Start Dot to End Dot" Visual Customizer)
  async getBanners(): Promise<BannerSettings> {
    return fetchApi<BannerSettings>("/banners");
  },

  async updateBanners(banners: Partial<BannerSettings>): Promise<BannerSettings> {
    return fetchApi<BannerSettings>("/banners", {
      method: "PUT",
      body: JSON.stringify(banners),
    });
  },

  // Settings
  async getSettings(): Promise<StoreSettings> {
    return fetchApi<StoreSettings>("/settings");
  },

  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    return fetchApi<StoreSettings>("/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  // Coupons
  async getCoupons(): Promise<CouponItem[]> {
    return fetchApi<CouponItem[]>("/coupons");
  },

  async createCoupon(coupon: Partial<CouponItem>): Promise<CouponItem> {
    return fetchApi<CouponItem>("/coupons", {
      method: "POST",
      body: JSON.stringify(coupon),
    });
  },

  async updateCoupon(id: string, coupon: Partial<CouponItem>): Promise<CouponItem> {
    return fetchApi<CouponItem>(`/coupons/${id}`, {
      method: "PUT",
      body: JSON.stringify(coupon),
    });
  },

  async deleteCoupon(id: string): Promise<void> {
    return fetchApi<void>(`/coupons/${id}`, { method: "DELETE" });
  },

  async verifyCoupon(code: string, cartTotal: number): Promise<{ code: string; discountAmount: number }> {
    return fetchApi<{ code: string; discountAmount: number }>("/coupons/verify", {
      method: "POST",
      body: JSON.stringify({ code, cartTotal }),
    });
  },

  // Inquiries / Messages
  async getInquiries(): Promise<InquiryItem[]> {
    return fetchApi<InquiryItem[]>("/inquiries");
  },

  async submitInquiry(inquiry: { name: string; email: string; phone?: string; subject: string; message: string }): Promise<InquiryItem> {
    return fetchApi<InquiryItem>("/inquiries", {
      method: "POST",
      body: JSON.stringify(inquiry),
    });
  },

  async markInquiry(id: string, status: "read" | "unread" | "replied"): Promise<InquiryItem> {
    return fetchApi<InquiryItem>(`/inquiries/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async deleteInquiry(id: string): Promise<void> {
    return fetchApi<void>(`/inquiries/${id}`, { method: "DELETE" });
  },

  // Dashboard Stats
  async getStats(): Promise<DashboardStats> {
    return fetchApi<DashboardStats>("/stats");
  },

  // File Upload (Direct multipart/form-data to /api/upload)
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    if (!res.ok || !json.url) {
      throw new Error(json.message || "Upload failed");
    }
    return json.url;
  },

  // Admin Auth
  async adminLogin(email: string, password: string): Promise<{ token: string; user: { name: string; email: string; role: string } }> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Login failed");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("industrialedge_admin_token", json.token);
      localStorage.setItem("industrialedge_admin_user", JSON.stringify(json.user));
    }
    return json;
  },

  getStoredAdminUser() {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("industrialedge_admin_user");
    return raw ? JSON.parse(raw) : null;
  },

  adminLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("industrialedge_admin_token");
      localStorage.removeItem("industrialedge_admin_user");
    }
  },
};
