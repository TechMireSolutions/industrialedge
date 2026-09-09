import { api } from './api';
import { Product } from './productApi';

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  active: boolean;
  _count?: { products: number };
  products?: { product: Product, displayOrder: number }[];
  createdAt: string;
  updatedAt: string;
}

export const collectionApi = {
  getAll: () => api.get<Collection[]>(`/collections`),
  getBySlug: (slug: string) => api.get<Collection>(`/collections/${slug}`),
};
