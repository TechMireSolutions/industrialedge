import { api } from './api';

export const notificationApi = {
  getUnread: () => api.get('/notifications/unread'),
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
};
