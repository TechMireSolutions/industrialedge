import { api } from './api';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
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
  user?: { id: string; name: string; email: string };
}

export interface PaginatedOrders {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CheckoutData {
  billingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
    email: string;
  };
  shippingAddress?: {
    firstName: string;
    lastName: string;
    company?: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: 'CASH_ON_DELIVERY';
  notes?: string;
  couponCode?: string;
  cartId: string;
}

export const orderApi = {
  createFromCart: (data: CheckoutData) => api.post<Order>('/orders', data),

  getOrder: (id: string) => api.get<Order>(`/orders/${id}`),

  getUserOrders: (page = 1, limit = 10) =>
    api.get<PaginatedOrders>(`/orders?page=${page}&limit=${limit}`),

  getAllOrders: (params: { page?: number; limit?: number; status?: string; paymentStatus?: string; search?: string } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    return api.get<PaginatedOrders>(`/orders/admin?${searchParams.toString()}`);
  },

  updateOrderStatus: (id: string, status: string) => api.put<Order>(`/orders/admin/${id}/status`, { status }),

  validateCoupon: (code: string, subtotal: number) =>
    api.post<{ coupon: any; discount: number }>('/coupons/validate', { code, subtotal }),
};