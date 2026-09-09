import { api } from './api';

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

export const categoryApi = {
  getAll: (activeOnly = true) => api.get<Category[]>(`/products/categories?active=${activeOnly}`),
  getById: (id: string) => api.get<Category>(`/products/categories/${id}`),
  getBySlug: (slug: string) => api.get<Category>(`/products/categories/slug/${slug}`),
};