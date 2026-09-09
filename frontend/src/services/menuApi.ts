import { api } from './api';

export const menuApi = {
  // Public Menu Endpoints
  getActiveMenu: (slug: string) =>
    api.get<{ success: boolean; data: any }>(`/menus/${slug}/active`),
};
