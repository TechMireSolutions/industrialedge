import { api } from './api';

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
  tags?: { id: string; name: string; slug: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  new?: boolean;
  topSelling?: boolean;
  bestseller?: boolean;
  tag?: string;
}

export const productApi = {
  getAll: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    return api.get<PaginatedResponse<Product>>(`/products?${params.toString()}`);
  },

  getById: (id: string) => api.get<Product>(`/products/${id}`),

  getBySlug: (slug: string) => api.get<Product>(`/products/slug/${slug}`),

  getRelated: (id: string) => api.get<Product[]>(`/products/${id}/related`),

  getFeatured: (limit = 8) => api.get<Product[]>(`/products/featured?limit=${limit}`),

  getNewArrivals: (limit = 8) => api.get<Product[]>(`/products/new-arrivals?limit=${limit}`),

  getTopSelling: (limit = 8) => api.get<Product[]>(`/products/top-selling?limit=${limit}`),

  getBestsellers: (limit = 8) => api.get<Product[]>(`/products/bestsellers?limit=${limit}`),

  getTags: () => api.get<{ data: { id: string; name: string; slug: string; _count?: { products: number } }[] }>('/tags'),

  getProductReviews: (id: string, page = 1, limit = 10, approvedOnly = true) => 
    api.get<PaginatedResponse<any>>(`/products/${id}/reviews?page=${page}&limit=${limit}&approvedOnly=${approvedOnly}`),

  submitReview: (id: string, review: { rating: number; title: string; comment: string }) => 
    api.post<any>(`/products/${id}/reviews`, review),
};