import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authApi = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  refresh: () => api.post<AuthResponse>('/auth/refresh'),

  getProfile: () => api.get<User>('/auth/me'),

  updateProfile: (data: { name?: string; phone?: string; currentPassword?: string; newPassword?: string }) =>
    api.put<User>('/auth/me', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/me/password', data),

  getAddresses: () => api.get<Address[]>('/addresses'),

  getAddress: (id: string) => api.get<Address>(`/addresses/${id}`),

  createAddress: (data: any) => api.post<Address>('/addresses', data),

  updateAddress: (id: string, data: any) => api.put<Address>(`/addresses/${id}`, data),

  deleteAddress: (id: string) => api.delete(`/addresses/${id}`),
};