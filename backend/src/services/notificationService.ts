import { prisma } from '../config/database.js';

export const notificationService = {
  async createNotification(data: { title: string; message: string; type?: string; link?: string }) {
    return prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type || 'INFO',
        link: data.link,
      },
    });
  },

  async getUnreadNotifications() {
    return prisma.notification.findMany({
      where: { read: false },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getAllNotifications(page = 1, limit = 20) {
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count(),
    ]);

    return {
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  },

  async markAllAsRead() {
    return prisma.notification.updateMany({
      where: { read: false },
      data: { read: true },
    });
  },
};
