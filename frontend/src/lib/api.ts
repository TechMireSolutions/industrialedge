// Client API Service for Industrial Edge Frontend & Custom Admin Panel

export interface ProductItem {
  id: string;
  name: string;
  slug?: string;
  category: string;
  brand?: string;
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
    state?: string;
    zip?: string;
    country?: string;
  };
  shippingAddress?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
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
  couponCode?: string;
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
  flatShippingRate?: number;
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

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// Helper to resolve API URLs based on NEXT_PUBLIC_API_URL
export function getApiUrl(endpoint: string): string {
  if (endpoint.startsWith("http")) return endpoint;
  const base = process.env.NEXT_PUBLIC_API_URL || "/api";
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base.replace(/\/+$/, "")}${cleanEndpoint}`;
}

function getFallbackRelativeUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `/api${cleanEndpoint}`;
}

// Resilient fetch: tries primary API URL and falls back to Next.js embedded /api route on network error
async function resilientFetch(endpoint: string, init: RequestInit): Promise<Response> {
  const primaryUrl = getApiUrl(endpoint);
  try {
    return await fetch(primaryUrl, init);
  } catch (err) {
    // If primary URL is an external host (e.g. http://localhost:5000/api) that is offline,
    // seamlessly fall back to the Next.js embedded /api route in browser contexts.
    if (typeof window !== "undefined" && primaryUrl.startsWith("http")) {
      return await fetch(getFallbackRelativeUrl(endpoint), init);
    }
    throw err;
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  // Automatically attach Bearer token if present in browser storage
  if (typeof window !== "undefined" && !headers["Authorization"] && !headers["authorization"]) {
    const isAdminPath = window.location.pathname.startsWith("/admin");
    const token = isAdminPath
      ? localStorage.getItem("industrialedge_admin_token")
      : localStorage.getItem("industrialedge_customer_token") ||
        localStorage.getItem("industrialedge_admin_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await resilientFetch(endpoint, {
    ...options,
    headers,
    cache: "no-store",
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.startsWith("/admin") && path !== "/admin/login") {
        localStorage.removeItem("industrialedge_admin_token");
        localStorage.removeItem("industrialedge_admin_user");
        try {
          document.cookie = "industrialedge_admin_token=; path=/; max-age=0; SameSite=Lax";
        } catch {}
        window.location.replace("/admin/login");
      }
    }
    throw new Error(json.message || `API Error: ${res.statusText}`);
  }
  return json.data !== undefined ? json.data : json;
}

export const api = {
  // Health Check
  async getHealth(): Promise<{ status: string; service: string; database?: string; time: string }> {
    const res = await resilientFetch("/health", { cache: "no-store" });
    return res.json();
  },

  // Products
  async getProducts(params?: {
    category?: string;
    brand?: string;
    search?: string;
    status?: string;
    featured?: string;
    limit?: number;
  }): Promise<ProductItem[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.brand) query.set("brand", params.brand);
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);
    if (params?.featured) query.set("featured", params.featured);
    if (params?.limit) query.set("limit", params.limit.toString());
    const qStr = query.toString() ? `?${query.toString()}` : "";
    return fetchApi<ProductItem[]>(`/products${qStr}`);
  },

  async getProduct(id: string): Promise<ProductItem> {
    return fetchApi<ProductItem>(`/products/${encodeURIComponent(id)}`);
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
  async getOrders(status?: string, search?: string, email?: string): Promise<OrderItem[]> {
    const q = new URLSearchParams();
    if (status && status !== "all") q.set("status", status);
    if (search) q.set("search", search);
    if (email) q.set("email", email);
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

  async verifyCoupon(
    code: string,
    cartTotal: number
  ): Promise<{ code: string; discountType: "percentage" | "fixed"; value: number; discountAmount: number }> {
    return fetchApi<{ code: string; discountType: "percentage" | "fixed"; value: number; discountAmount: number }>(
      "/coupons/verify",
      {
        method: "POST",
        body: JSON.stringify({ code, cartTotal }),
      }
    );
  },

  // Inquiries / Messages
  async getInquiries(): Promise<InquiryItem[]> {
    return fetchApi<InquiryItem[]>("/inquiries");
  },

  async submitInquiry(inquiry: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<InquiryItem> {
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

  // File Upload (Direct multipart/form-data to /api/upload with fallback)
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const res = await resilientFetch("/upload", {
      method: "POST",
      body: formData,
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.url) {
      throw new Error(json.message || "Upload failed");
    }
    return json.url;
  },

  // Customer Auth
  async customerLogin(identifier: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const res = await resilientFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: identifier, username: identifier, password }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.message || "Invalid credentials");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("industrialedge_customer_token", json.token);
      localStorage.setItem("industrialedge_customer_user", JSON.stringify(json.user));
    }
    return json;
  },

  async customerRegister(data: { name: string; email: string; password: string }): Promise<{ token: string; user: AuthUser }> {
    const res = await resilientFetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.message || "Registration failed");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("industrialedge_customer_token", json.token);
      localStorage.setItem("industrialedge_customer_user", JSON.stringify(json.user));
    }
    return json;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return fetchApi<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async changePassword(payload: { email?: string; oldPassword: string; newPassword: string }): Promise<{ message: string }> {
    return fetchApi<{ message: string }>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Admin Auth
  async adminLogin(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const res = await resilientFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.message || "Login failed");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("industrialedge_admin_token", json.token);
      localStorage.setItem("industrialedge_admin_user", JSON.stringify(json.user));
      try {
        document.cookie = `industrialedge_admin_token=${json.token}; path=/; max-age=86400; SameSite=Lax`;
      } catch {}
    }
    return json;
  },

  getAdminToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("industrialedge_admin_token");
  },

  isAdminAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("industrialedge_admin_token");
    return Boolean(token && token.trim().length > 0);
  },

  getStoredAdminUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("industrialedge_admin_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  adminLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("industrialedge_admin_token");
      localStorage.removeItem("industrialedge_admin_user");
      try {
        document.cookie = "industrialedge_admin_token=; path=/; max-age=0; SameSite=Lax";
      } catch {}
    }
  },
};
